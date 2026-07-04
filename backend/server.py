from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Kolli Hills Fresh Cafe API")
api_router = APIRouter(prefix="/api")


# ---------- Legacy demo model (kept for compat) ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


# ---------- Category ----------
class CategoryBase(BaseModel):
    name: str
    slug: str
    tag: str = ""
    image: str = ""
    order: int = 0
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    tag: Optional[str] = None
    image: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class Category(CategoryBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Product ----------
class ProductVariant(BaseModel):
    label: str
    price: Optional[float] = None  # None => "price on pickup"


class ProductBase(BaseModel):
    name: str
    slug: str
    category_slug: str
    description: str = ""
    note: str = ""
    image: str = ""
    price: Optional[float] = None  # base/starting price; None => "price on pickup"
    variants: List[ProductVariant] = []
    rating: float = 5.0
    is_best_seller: bool = False
    is_available: bool = True
    order: int = 0


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    category_slug: Optional[str] = None
    description: Optional[str] = None
    note: Optional[str] = None
    image: Optional[str] = None
    price: Optional[float] = None
    variants: Optional[List[ProductVariant]] = None
    rating: Optional[float] = None
    is_best_seller: Optional[bool] = None
    is_available: Optional[bool] = None
    order: Optional[int] = None


class Product(ProductBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Helpers ----------
def _serialize_dates(doc: dict) -> dict:
    for k in ("created_at", "updated_at", "timestamp"):
        v = doc.get(k)
        if isinstance(v, datetime):
            doc[k] = v.isoformat()
    return doc


def _deserialize_dates(doc: dict) -> dict:
    for k in ("created_at", "updated_at", "timestamp"):
        v = doc.get(k)
        if isinstance(v, str):
            try:
                doc[k] = datetime.fromisoformat(v)
            except ValueError:
                pass
    return doc


# ---------- Routes: root & legacy ----------
@api_router.get("/")
async def root():
    return {"message": "Kolli Hills Fresh Cafe API", "status": "ok"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(payload: StatusCheckCreate):
    obj = StatusCheck(**payload.model_dump())
    doc = _serialize_dates(obj.model_dump())
    await db.status_checks.insert_one(doc)
    return obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    rows = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    return [_deserialize_dates(r) for r in rows]


# ---------- Routes: Categories ----------
@api_router.get("/categories", response_model=List[Category])
async def list_categories(active_only: bool = True):
    q = {"is_active": True} if active_only else {}
    rows = await db.categories.find(q, {"_id": 0}).sort("order", 1).to_list(500)
    return [_deserialize_dates(r) for r in rows]


@api_router.get("/categories/{slug}", response_model=Category)
async def get_category(slug: str):
    doc = await db.categories.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Category not found")
    return _deserialize_dates(doc)


@api_router.post("/categories", response_model=Category, status_code=201)
async def create_category(payload: CategoryCreate):
    existing = await db.categories.find_one({"slug": payload.slug}, {"_id": 0})
    if existing:
        raise HTTPException(409, "Category slug already exists")
    obj = Category(**payload.model_dump())
    await db.categories.insert_one(_serialize_dates(obj.model_dump()))
    return obj


@api_router.patch("/categories/{slug}", response_model=Category)
async def update_category(slug: str, payload: CategoryUpdate):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(400, "No fields to update")
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    res = await db.categories.find_one_and_update(
        {"slug": slug}, {"$set": updates}, projection={"_id": 0}, return_document=True
    )
    if not res:
        raise HTTPException(404, "Category not found")
    return _deserialize_dates(res)


@api_router.delete("/categories/{slug}", status_code=204)
async def delete_category(slug: str):
    res = await db.categories.delete_one({"slug": slug})
    if res.deleted_count == 0:
        raise HTTPException(404, "Category not found")
    return None


# ---------- Routes: Products ----------
@api_router.get("/products", response_model=List[Product])
async def list_products(
    category: Optional[str] = Query(None, description="Filter by category slug"),
    best_seller: Optional[bool] = None,
    available_only: bool = True,
    limit: int = 200,
):
    q: dict = {}
    if category:
        q["category_slug"] = category
    if best_seller is not None:
        q["is_best_seller"] = best_seller
    if available_only:
        q["is_available"] = True
    rows = await db.products.find(q, {"_id": 0}).sort("order", 1).to_list(limit)
    return [_deserialize_dates(r) for r in rows]


@api_router.get("/products/{slug}", response_model=Product)
async def get_product(slug: str):
    doc = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Product not found")
    return _deserialize_dates(doc)


@api_router.post("/products", response_model=Product, status_code=201)
async def create_product(payload: ProductCreate):
    existing = await db.products.find_one({"slug": payload.slug}, {"_id": 0})
    if existing:
        raise HTTPException(409, "Product slug already exists")
    obj = Product(**payload.model_dump())
    await db.products.insert_one(_serialize_dates(obj.model_dump()))
    return obj


@api_router.patch("/products/{slug}", response_model=Product)
async def update_product(slug: str, payload: ProductUpdate):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(400, "No fields to update")
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    res = await db.products.find_one_and_update(
        {"slug": slug}, {"$set": updates}, projection={"_id": 0}, return_document=True
    )
    if not res:
        raise HTTPException(404, "Product not found")
    return _deserialize_dates(res)


@api_router.delete("/products/{slug}", status_code=204)
async def delete_product(slug: str):
    res = await db.products.delete_one({"slug": slug})
    if res.deleted_count == 0:
        raise HTTPException(404, "Product not found")
    return None


# ---------- Order ----------
class OrderItem(BaseModel):
    slug: str
    name: str
    variant_label: str
    unit_price: Optional[float] = None
    qty: int


class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    notes: str = ""
    items: List[OrderItem]


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str
    customer_name: str
    customer_phone: str
    notes: str = ""
    items: List[OrderItem]
    subtotal: float = 0
    has_pickup_pricing: bool = False
    status: str = "received"  # received | confirmed | ready | collected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.post("/orders", response_model=Order, status_code=201)
async def create_order(payload: OrderCreate):
    if not payload.items:
        raise HTTPException(400, "Order must have items")
    subtotal = sum((i.unit_price or 0) * i.qty for i in payload.items)
    has_pickup = any(i.unit_price is None for i in payload.items)
    from random import randint
    order_num = f"KHFC-{datetime.now(timezone.utc).strftime('%y%m%d')}-{randint(1000,9999)}"
    obj = Order(
        order_number=order_num,
        customer_name=payload.customer_name,
        customer_phone=payload.customer_phone,
        notes=payload.notes,
        items=payload.items,
        subtotal=subtotal,
        has_pickup_pricing=has_pickup,
    )
    doc = _serialize_dates(obj.model_dump())
    await db.orders.insert_one(doc)
    return obj


@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    doc = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Order not found")
    return _deserialize_dates(doc)


# ---------- Seed data ----------
SEED_CATEGORIES = [
    {"name": "Tea", "slug": "tea", "tag": "Hand-picked leaves", "order": 1,
     "image": "https://images.unsplash.com/photo-1570784332176-fdd73da66f03?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY3VwfGVufDB8fHx8MTc4MzEzODU3OHww&ixlib=rb-4.1.0&q=85"},
    {"name": "Coffee", "slug": "coffee", "tag": "Estate roasted", "order": 2,
     "image": "https://images.unsplash.com/photo-1593443320739-77f74939d0da?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY29mZmVlJTIwbGF0dGUlMjBhcnR8ZW58MHx8fHwxNzgzMTM4NTc4fDA&ixlib=rb-4.1.0&q=85"},
    {"name": "Fresh Juice", "slug": "fresh-juice", "tag": "Cold pressed", "order": 3,
     "image": "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwanVpY2UlMjBnbGFzc3xlbnwwfHx8fDE3ODMxMzg1Nzh8MA&ixlib=rb-4.1.0&q=85"},
    {"name": "Milkshakes", "slug": "milkshakes", "tag": "Slow-blended", "order": 4,
     "image": "https://images.unsplash.com/photo-1619158403521-ed9795026d47?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwxfHxtaWxrc2hha2UlMjBnbGFzc3xlbnwwfHx8fDE3ODMxMzg1Nzd8MA&ixlib=rb-4.1.0&q=85"},
    {"name": "Soft Drinks", "slug": "soft-drinks", "tag": "Ice-cold classics", "order": 5,
     "image": "https://images.unsplash.com/photo-1681369738257-88cbf9fc2843?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwZHJpbmtzJTIwYm90dGxlc3xlbnwwfHx8fDE3ODMxMzg1Nzh8MA&ixlib=rb-4.1.0&q=85"},
    {"name": "Ice Cream", "slug": "ice-cream", "tag": "Made with love", "order": 6,
     "image": "https://images.pexels.com/photos/7761650/pexels-photo-7761650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
    {"name": "Sandwiches", "slug": "sandwiches", "tag": "Freshly grilled", "order": 7,
     "image": "https://images.unsplash.com/photo-1553909489-cd47e0907980?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwc2FuZHdpY2h8ZW58MHx8fHwxNzgzMTM4NTc4fDA&ixlib=rb-4.1.0&q=85"},
    {"name": "Snacks", "slug": "snacks", "tag": "Traveller's favourites", "order": 8,
     "image": "https://images.unsplash.com/photo-1585341840941-98553e474d84?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxjYWZlJTIwc25hY2tzfGVufDB8fHx8MTc4MzEzODU3OHww&ixlib=rb-4.1.0&q=85"},
    {"name": "Bakery", "slug": "bakery", "tag": "Baked daily", "order": 9,
     "image": "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwYmFrZXJ5JTIwcGFzdHJpZXN8ZW58MHx8fHwxNzgzMTM4NTc4fDA&ixlib=rb-4.1.0&q=85"},
    {"name": "Biscuits", "slug": "biscuits", "tag": "Crunchy classics", "order": 10,
     "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwxfHxiaXNjdWl0cyUyMGNvb2tpZXN8ZW58MHx8fHwxNzgzMTM4NTc4fDA&ixlib=rb-4.1.0&q=85"},
    {"name": "Chocolates", "slug": "chocolates", "tag": "Melt-in-mouth", "order": 11,
     "image": "https://images.unsplash.com/photo-1734692928513-351516b38869?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2hvY29sYXRlc3xlbnwwfHx8fDE3ODMxMzg1ODZ8MA&ixlib=rb-4.1.0&q=85"},
    {"name": "Dry Fruits", "slug": "dry-fruits", "tag": "Hand-graded", "order": 12,
     "image": "https://images.unsplash.com/photo-1600189020840-e9918c25269d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwxfHxkcnklMjBmcnVpdHMlMjBudXRzfGVufDB8fHx8MTc4MzEzODU4Nnww&ixlib=rb-4.1.0&q=85"},
    {"name": "Honey", "slug": "honey", "tag": "Wild, from the hills", "order": 13,
     "image": "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwxfHxwdXJlJTIwaG9uZXklMjBqYXJ8ZW58MHx8fHwxNzgzMTM4NTg2fDA&ixlib=rb-4.1.0&q=85"},
    {"name": "Spices", "slug": "spices", "tag": "Sun-dried, hill-grown", "order": 14,
     "image": "https://images.unsplash.com/photo-1668885309844-5bb50f7c2e61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzcGljZXMlMjBtYXJrZXR8ZW58MHx8fHwxNzgzMTM4NTg2fDA&ixlib=rb-4.1.0&q=85"},
    {"name": "Kolli Hills Specials", "slug": "kolli-hills-specials", "tag": "Only from the hills", "order": 15,
     "image": "https://images.unsplash.com/photo-1567726843492-df0484bb0b05?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBwbGFudGF0aW9uJTIwbWlzdHxlbnwwfHx8fDE3ODMxMzg1OTN8MA&ixlib=rb-4.1.0&q=85"},
]


SEED_PRODUCTS = [
    {
        "slug": "hill-filter-coffee", "name": "Hill Filter Coffee", "category_slug": "coffee",
        "price": 60.0, "rating": 4.9, "is_best_seller": True, "order": 1,
        "variants": [
            {"label": "Small", "price": 40.0},
            {"label": "Regular", "price": 60.0},
            {"label": "Large", "price": 80.0},
        ],
        "note": "Slow-brewed decoction with hill-farmed beans.",
        "description": "A traditional South-Indian filter coffee, made from beans sourced from the estates around Kolli Hills. Rich, aromatic, and unforgettable.",
        "image": "https://images.unsplash.com/photo-1593443320739-77f74939d0da?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY29mZmVlJTIwbGF0dGUlMjBhcnR8ZW58MHx8fHwxNzgzMTM4NTc4fDA&ixlib=rb-4.1.0&q=85",
    },
    {
        "slug": "grilled-garden-sandwich", "name": "Grilled Garden Sandwich", "category_slug": "sandwiches",
        "price": 90.0, "rating": 4.8, "is_best_seller": True, "order": 2,
        "variants": [
            {"label": "Veg", "price": 90.0},
            {"label": "Cheese", "price": 120.0},
            {"label": "Paneer", "price": 140.0},
        ],
        "note": "Toasted on iron with fresh mountain produce.",
        "description": "A generous grilled sandwich stuffed with garden vegetables, roasted on an iron press.",
        "image": "https://images.unsplash.com/photo-1553909489-cd47e0907980?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwc2FuZHdpY2h8ZW58MHx8fHwxNzgzMTM4NTc4fDA&ixlib=rb-4.1.0&q=85",
    },
    {
        "slug": "chocolate-milkshake", "name": "Chocolate Milkshake", "category_slug": "milkshakes",
        "price": 120.0, "rating": 4.9, "is_best_seller": True, "order": 3,
        "variants": [
            {"label": "250 ml", "price": 90.0},
            {"label": "500 ml", "price": 120.0},
        ],
        "note": "Slow-blended with cocoa & full-cream milk.",
        "description": "Ice-cold chocolate milkshake made with premium cocoa and full-cream milk. Blended slow for a thick, creamy pour.",
        "image": "https://images.unsplash.com/photo-1619158403521-ed9795026d47?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwxfHxtaWxrc2hha2UlMjBnbGFzc3xlbnwwfHx8fDE3ODMxMzg1Nzd8MA&ixlib=rb-4.1.0&q=85",
    },
    {
        "slug": "wild-hill-honey", "name": "Wild Hill Honey", "category_slug": "kolli-hills-specials",
        "price": None, "rating": 5.0, "is_best_seller": True, "order": 4,
        "variants": [
            {"label": "250 g", "price": None},
            {"label": "500 g", "price": None},
            {"label": "1 kg", "price": None},
        ],
        "note": "Raw honey harvested from the Kolli forests.",
        "description": "Unfiltered, raw, wild honey harvested straight from the Kolli Hills forests.",
        "image": "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwxfHxwdXJlJTIwaG9uZXklMjBqYXJ8ZW58MHx8fHwxNzgzMTM4NTg2fDA&ixlib=rb-4.1.0&q=85",
    },
    {
        "slug": "estate-chocolate-bar", "name": "Estate Chocolate Bar", "category_slug": "chocolates",
        "price": 180.0, "rating": 4.7, "is_best_seller": True, "order": 5,
        "variants": [
            {"label": "Dark 70%", "price": 180.0},
            {"label": "Milk", "price": 160.0},
            {"label": "Nutty", "price": 220.0},
        ],
        "note": "Bean-to-bar from South Indian cocoa estates.",
        "description": "Handcrafted, bean-to-bar chocolate from small South Indian cocoa estates.",
        "image": "https://images.unsplash.com/photo-1734692928513-351516b38869?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2hvY29sYXRlc3xlbnwwfHx8fDE3ODMxMzg1ODZ8MA&ixlib=rb-4.1.0&q=85",
    },
    {
        "slug": "travellers-dry-fruit-mix", "name": "Traveller's Dry Fruit Mix", "category_slug": "dry-fruits",
        "price": None, "rating": 4.8, "is_best_seller": True, "order": 6,
        "variants": [
            {"label": "100 g", "price": None},
            {"label": "250 g", "price": None},
            {"label": "500 g", "price": None},
        ],
        "note": "Hand-picked almonds, cashews, and raisins.",
        "description": "Traveller-grade dry fruit mix — almonds, cashews, and plump raisins. Perfect for the road.",
        "image": "https://images.unsplash.com/photo-1600189020840-e9918c25269d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwxfHxkcnklMjBmcnVpdHMlMjBudXRzfGVufDB8fHx8MTc4MzEzODU4Nnww&ixlib=rb-4.1.0&q=85",
    },
    # Additional non-best-seller items so Menu isn't empty
    {"slug": "masala-chai", "name": "Kolli Masala Chai", "category_slug": "tea", "price": 30.0, "rating": 4.7, "order": 10,
     "variants": [{"label": "Small", "price": 25.0}, {"label": "Regular", "price": 30.0}],
     "note": "Boiled with fresh ginger and cardamom.",
     "image": "https://images.unsplash.com/photo-1570784332176-fdd73da66f03?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY3VwfGVufDB8fHx8MTc4MzEzODU3OHww&ixlib=rb-4.1.0&q=85"},
    {"slug": "cold-pressed-orange", "name": "Cold-Pressed Orange", "category_slug": "fresh-juice", "price": 90.0, "rating": 4.8, "order": 11,
     "variants": [{"label": "250 ml", "price": 90.0}, {"label": "500 ml", "price": 150.0}],
     "note": "Pressed to order. Never from concentrate.",
     "image": "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwanVpY2UlMjBnbGFzc3xlbnwwfHx8fDE3ODMxMzg1Nzh8MA&ixlib=rb-4.1.0&q=85"},
    {"slug": "hill-spice-blend", "name": "Hill Spice Blend", "category_slug": "spices", "price": None, "rating": 4.9, "order": 12,
     "variants": [{"label": "100 g", "price": None}, {"label": "250 g", "price": None}],
     "note": "Sun-dried spices milled fresh in-house.",
     "image": "https://images.unsplash.com/photo-1668885309844-5bb50f7c2e61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzcGljZXMlMjBtYXJrZXR8ZW58MHx8fHwxNzgzMTM4NTg2fDA&ixlib=rb-4.1.0&q=85"},
]


async def seed_if_empty():
    """Idempotent seed: only inserts when a collection is empty."""
    try:
        # Indexes
        await db.categories.create_index("slug", unique=True)
        await db.products.create_index("slug", unique=True)
        await db.products.create_index("category_slug")
        await db.products.create_index("is_best_seller")

        cat_count = await db.categories.count_documents({})
        if cat_count == 0:
            docs = []
            for c in SEED_CATEGORIES:
                obj = Category(**c)
                docs.append(_serialize_dates(obj.model_dump()))
            await db.categories.insert_many(docs)
            logger.info("Seeded %d categories", len(docs))

        prod_count = await db.products.count_documents({})
        if prod_count == 0:
            docs = []
            for p in SEED_PRODUCTS:
                obj = Product(**p)
                docs.append(_serialize_dates(obj.model_dump()))
            await db.products.insert_many(docs)
            logger.info("Seeded %d products", len(docs))
    except Exception as e:  # noqa: BLE001
        logger.exception("Seeding failed: %s", e)


# ---------- App bootstrap ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def on_startup():
    await seed_if_empty()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
