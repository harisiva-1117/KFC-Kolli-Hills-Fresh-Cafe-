"""Backend API tests for KFC Kolli Hills Fresh Cafe — Phase 4 admin."""
import io
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/") or \
    open("/app/frontend/.env").read().split("REACT_APP_BACKEND_URL=")[1].splitlines()[0].strip()
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@kollihills.cafe"
ADMIN_PASSWORD = "KolliHills@2026"


# ---------- fixtures ----------
@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["user"]["role"] == "admin"
    assert data["user"]["email"] == ADMIN_EMAIL
    assert isinstance(data["access_token"], str) and len(data["access_token"]) > 0
    return data["access_token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------- Health ----------
def test_root():
    r = requests.get(f"{API}/", timeout=10)
    assert r.status_code == 200


# ---------- Auth ----------
def test_login_wrong_password():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=10)
    assert r.status_code == 401


def test_me_without_token():
    r = requests.get(f"{API}/auth/me", timeout=10)
    assert r.status_code == 401


def test_me_with_token(auth_headers):
    r = requests.get(f"{API}/auth/me", headers=auth_headers, timeout=10)
    assert r.status_code == 200
    d = r.json()
    assert d["role"] == "admin"
    assert d["email"] == ADMIN_EMAIL


# ---------- Public reads (no auth) ----------
def test_public_categories():
    r = requests.get(f"{API}/categories", timeout=10)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_public_products():
    r = requests.get(f"{API}/products", timeout=10)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


# ---------- Auth required on mutations ----------
def test_create_category_requires_auth():
    r = requests.post(f"{API}/categories", json={"name": "X", "slug": "x"}, timeout=10)
    assert r.status_code == 401


def test_create_product_requires_auth():
    r = requests.post(f"{API}/products", json={"name": "X", "slug": "x", "category_slug": "tea"}, timeout=10)
    assert r.status_code == 401


# ---------- Product CRUD ----------
class TestProductCRUD:
    slug = f"test-prod-{uuid.uuid4().hex[:8]}"

    def test_create(self, auth_headers):
        payload = {"name": "TEST Product", "slug": self.slug, "category_slug": "tea",
                   "price": 55.0, "note": "test note"}
        r = requests.post(f"{API}/products", json=payload, headers=auth_headers, timeout=10)
        assert r.status_code == 201, r.text
        d = r.json()
        assert d["slug"] == self.slug
        assert d["price"] == 55.0

    def test_get(self):
        r = requests.get(f"{API}/products/{self.slug}", timeout=10)
        assert r.status_code == 200
        assert r.json()["name"] == "TEST Product"

    def test_duplicate_slug_conflict(self, auth_headers):
        payload = {"name": "dup", "slug": self.slug, "category_slug": "tea"}
        r = requests.post(f"{API}/products", json=payload, headers=auth_headers, timeout=10)
        assert r.status_code == 409

    def test_patch(self, auth_headers):
        r = requests.patch(f"{API}/products/{self.slug}", json={"name": "TEST Updated"},
                           headers=auth_headers, timeout=10)
        assert r.status_code == 200
        assert r.json()["name"] == "TEST Updated"
        # verify persistence via GET
        r2 = requests.get(f"{API}/products/{self.slug}", timeout=10)
        assert r2.json()["name"] == "TEST Updated"

    def test_delete(self, auth_headers):
        r = requests.delete(f"{API}/products/{self.slug}", headers=auth_headers, timeout=10)
        assert r.status_code == 204
        r2 = requests.get(f"{API}/products/{self.slug}", timeout=10)
        assert r2.status_code == 404


# ---------- Category CRUD & delete guard ----------
class TestCategoryCRUD:
    slug = f"test-cat-{uuid.uuid4().hex[:8]}"

    def test_create(self, auth_headers):
        r = requests.post(f"{API}/categories",
                          json={"name": "TEST Cat", "slug": self.slug, "order": 99},
                          headers=auth_headers, timeout=10)
        assert r.status_code == 201, r.text

    def test_patch(self, auth_headers):
        r = requests.patch(f"{API}/categories/{self.slug}", json={"tag": "new-tag"},
                           headers=auth_headers, timeout=10)
        assert r.status_code == 200
        assert r.json()["tag"] == "new-tag"

    def test_delete_empty(self, auth_headers):
        r = requests.delete(f"{API}/categories/{self.slug}", headers=auth_headers, timeout=10)
        assert r.status_code == 204

    def test_delete_nonempty_blocked(self, auth_headers):
        # 'coffee' has seed product 'hill-filter-coffee'
        r = requests.delete(f"{API}/categories/coffee", headers=auth_headers, timeout=10)
        assert r.status_code == 409
        detail = r.json().get("detail", "").lower()
        assert "contains" in detail


# ---------- Image upload ----------
def _tiny_png_bytes():
    # 1x1 transparent PNG
    import base64
    return base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    )


def test_upload_png_and_serve(auth_headers):
    files = {"file": ("test.png", io.BytesIO(_tiny_png_bytes()), "image/png")}
    r = requests.post(f"{API}/admin/upload", headers=auth_headers, files=files, timeout=15)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["url"].startswith("/api/uploads/")
    # Fetch via public URL
    r2 = requests.get(f"{BASE_URL}{d['url']}", timeout=10)
    assert r2.status_code == 200
    assert len(r2.content) > 0


def test_upload_rejects_txt(auth_headers):
    files = {"file": ("bad.txt", io.BytesIO(b"hello"), "text/plain")}
    r = requests.post(f"{API}/admin/upload", headers=auth_headers, files=files, timeout=10)
    assert r.status_code == 400


def test_upload_requires_auth():
    files = {"file": ("x.png", io.BytesIO(_tiny_png_bytes()), "image/png")}
    r = requests.post(f"{API}/admin/upload", files=files, timeout=10)
    assert r.status_code == 401


# ---------- Orders ----------
class TestOrders:
    order_id = None

    def test_place_order_public(self):
        payload = {
            "customer_name": "TEST Customer",
            "customer_phone": "9999999999",
            "notes": "test",
            "items": [{"slug": "masala-chai", "name": "Kolli Masala Chai",
                       "variant_label": "Regular", "unit_price": 30.0, "qty": 2}],
        }
        r = requests.post(f"{API}/orders", json=payload, timeout=10)
        assert r.status_code == 201, r.text
        d = r.json()
        assert d["status"] == "received"
        assert d["subtotal"] == 60.0
        TestOrders.order_id = d["id"]

    def test_admin_list_orders_requires_auth(self):
        r = requests.get(f"{API}/admin/orders", timeout=10)
        assert r.status_code == 401

    def test_admin_list_orders(self, auth_headers):
        r = requests.get(f"{API}/admin/orders", headers=auth_headers, timeout=10)
        assert r.status_code == 200
        ids = [o["id"] for o in r.json()]
        assert TestOrders.order_id in ids

    def test_status_transitions(self, auth_headers):
        for st in ["confirmed", "ready", "collected"]:
            r = requests.patch(f"{API}/admin/orders/{TestOrders.order_id}",
                               json={"status": st}, headers=auth_headers, timeout=10)
            assert r.status_code == 200, r.text
            assert r.json()["status"] == st

    def test_invalid_status(self, auth_headers):
        r = requests.patch(f"{API}/admin/orders/{TestOrders.order_id}",
                           json={"status": "bogus"}, headers=auth_headers, timeout=10)
        assert r.status_code == 400

    def test_stats(self, auth_headers):
        r = requests.get(f"{API}/admin/orders/stats", headers=auth_headers, timeout=10)
        assert r.status_code == 200
        d = r.json()
        assert "total" in d and "by_status" in d and "revenue" in d
        assert d["total"] >= 1
