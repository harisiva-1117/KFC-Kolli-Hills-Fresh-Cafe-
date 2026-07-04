import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ImagePlus, Loader2, Upload, X } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { api, resolveImageUrl } from "@/lib/api";
import { ADMIN_PRODUCTS } from "@/constants/testIds";

const slugify = (v) =>
  v.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

const EMPTY = {
  slug: "", name: "", category_slug: "", description: "", note: "", image: "",
  price: "", variants: "", rating: 5, is_best_seller: false, is_available: true, order: 0,
};

const parseVariants = (text) => {
  // Accept "Label: 90, Label2: 120" or "Label:, Regular: 30"
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [label, price] = chunk.split(":").map((x) => (x ?? "").trim());
      const p = price === "" || price == null ? null : Number(price);
      return { label: label || "Regular", price: Number.isFinite(p) ? p : null };
    });
};

const variantsToText = (vars) =>
  (vars || [])
    .map((v) => `${v.label}: ${v.price == null ? "" : v.price}`)
    .join(", ");

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | {...form}
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ps, cs] = await Promise.all([api.adminListProducts(), api.adminListCategories()]);
      setProducts(ps || []);
      setCategories(cs || []);
    } catch (e) {
      toast.error("Failed to load products", { description: e.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    if (!term) return products;
    return products.filter((p) =>
      [p.name, p.slug, p.category_slug].some((x) => (x || "").toLowerCase().includes(term))
    );
  }, [q, products]);

  const openNew = () => {
    setEditing({
      ...EMPTY,
      _isNew: true,
      category_slug: categories[0]?.slug || "",
    });
  };

  const openEdit = (p) => {
    setEditing({
      _isNew: false,
      _originalSlug: p.slug,
      slug: p.slug,
      name: p.name,
      category_slug: p.category_slug,
      description: p.description || "",
      note: p.note || "",
      image: p.image || "",
      price: p.price == null ? "" : String(p.price),
      variants: variantsToText(p.variants),
      rating: p.rating,
      is_best_seller: !!p.is_best_seller,
      is_available: !!p.is_available,
      order: p.order || 0,
    });
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.adminUploadImage(file);
      setEditing((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded");
    } catch (e) {
      toast.error("Upload failed", { description: e.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editing.name.trim()) return toast.error("Name is required");
    const slug = editing.slug.trim() || slugify(editing.name);
    if (!slug) return toast.error("Slug is required");
    if (!editing.category_slug) return toast.error("Category is required");

    const payload = {
      name: editing.name.trim(),
      slug,
      category_slug: editing.category_slug,
      description: editing.description.trim(),
      note: editing.note.trim(),
      image: editing.image.trim(),
      price: editing.price === "" ? null : Number(editing.price),
      variants: parseVariants(editing.variants),
      rating: Number(editing.rating) || 5,
      is_best_seller: !!editing.is_best_seller,
      is_available: !!editing.is_available,
      order: Number(editing.order) || 0,
    };

    setSaving(true);
    try {
      if (editing._isNew) {
        await api.adminCreateProduct(payload);
        toast.success("Product created");
      } else {
        // Slug change → still PATCH by original slug
        await api.adminUpdateProduct(editing._originalSlug, payload);
        toast.success("Product updated");
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error("Save failed", { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.adminDeleteProduct(confirmDelete.slug);
      toast.success(`${confirmDelete.name} deleted`);
      setConfirmDelete(null);
      load();
    } catch (e) {
      toast.error("Delete failed", { description: e.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#4A2E15]">— Catalogue</p>
          <h2 className="font-display text-2xl text-[#1E3F20] mt-1">Products</h2>
        </div>
        <div className="flex gap-3">
          <Input
            data-testid="admin-products-search"
            placeholder="Search products…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-10 w-[220px] rounded-none border-[#1E3F20] focus-visible:ring-0"
          />
          <Button
            onClick={openNew}
            data-testid={ADMIN_PRODUCTS.newButton}
            className="rounded-none bg-[#1E3F20] hover:bg-[#152C16] text-white h-10"
          >
            <Plus className="w-4 h-4 mr-2" /> New product
          </Button>
        </div>
      </div>

      <div className="border border-[#E8E2D9] bg-white">
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-[#1E3F20]" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-[#5C5C5C]">No products found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[#E8E2D9]">
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Image</TableHead>
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Product</TableHead>
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Category</TableHead>
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Price</TableHead>
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Flags</TableHead>
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.slug} data-testid={`${ADMIN_PRODUCTS.row}-${p.slug}`} className="border-b border-[#E8E2D9] align-middle">
                  <TableCell className="py-3">
                    {p.image ? (
                      <img src={resolveImageUrl(p.image)} alt={p.name} className="w-14 h-14 object-cover border border-[#E8E2D9]" />
                    ) : (
                      <div className="w-14 h-14 bg-[#F0EBE3] flex items-center justify-center">
                        <ImagePlus className="w-4 h-4 text-[#B8B0A2]" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <p className="text-sm text-[#1F1F1F]">{p.name}</p>
                    <p className="text-[10px] tracking-widest uppercase text-[#5C5C5C]">{p.slug}</p>
                  </TableCell>
                  <TableCell className="py-3 text-sm text-[#4A2E15]">{p.category_slug}</TableCell>
                  <TableCell className="py-3">
                    {p.price == null ? (
                      <span className="text-xs text-[#B4451D]">On pickup</span>
                    ) : (
                      <span className="font-display text-base text-[#1E3F20]">₹{p.price}</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex gap-1 flex-wrap">
                      {p.is_best_seller && <Badge className="rounded-none bg-[#D4AF37] text-[#1F1F1F] text-[10px] uppercase tracking-widest">Best</Badge>}
                      {!p.is_available && <Badge className="rounded-none bg-[#B4451D] text-white text-[10px] uppercase tracking-widest">Hidden</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => openEdit(p)}
                        data-testid={`${ADMIN_PRODUCTS.editButton}-${p.slug}`}
                        className="rounded-none h-8 text-[#1E3F20] hover:bg-[#EDF3EE]"
                      >
                        <Pencil className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => setConfirmDelete(p)}
                        data-testid={`${ADMIN_PRODUCTS.deleteButton}-${p.slug}`}
                        className="rounded-none h-8 text-[#B4451D] hover:bg-[#FDECEC]"
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent
          data-testid={ADMIN_PRODUCTS.form}
          className="rounded-none border-[#E8E2D9] max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-[#1E3F20]">
              {editing?._isNew ? "New product" : "Edit product"}
            </DialogTitle>
            <DialogDescription className="text-[#5C5C5C]">
              Fill product details. Leave the base price empty to display &ldquo;Price on pickup&rdquo;.
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="sm:col-span-2">
                <Label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Image</Label>
                <div className="mt-2 flex items-center gap-4">
                  {editing.image ? (
                    <div className="relative">
                      <img src={resolveImageUrl(editing.image)} alt="preview" className="w-20 h-20 object-cover border border-[#E8E2D9]" />
                      <button
                        type="button"
                        onClick={() => setEditing({ ...editing, image: "" })}
                        className="absolute -top-2 -right-2 bg-white border border-[#E8E2D9] rounded-full p-1"
                        aria-label="Clear image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-[#F0EBE3] flex items-center justify-center border border-[#E8E2D9]">
                      <ImagePlus className="w-5 h-5 text-[#B8B0A2]" />
                    </div>
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-2 border border-[#1E3F20] text-[#1E3F20] px-4 py-2 text-xs tracking-widest uppercase hover:bg-[#1E3F20] hover:text-white transition-colors">
                    <Upload className="w-3 h-3" /> {uploading ? "Uploading…" : "Upload image"}
                    <input
                      type="file" accept="image/*" className="hidden"
                      data-testid={ADMIN_PRODUCTS.imageUpload}
                      onChange={(e) => handleUpload(e.target.files?.[0])}
                      disabled={uploading}
                    />
                  </label>
                  <Input
                    value={editing.image}
                    onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                    placeholder="or paste image URL"
                    className="h-10 flex-1 rounded-none border-[#1E3F20] focus-visible:ring-0"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Name</Label>
                <Input
                  data-testid={ADMIN_PRODUCTS.nameInput}
                  value={editing.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setEditing((prev) => ({
                      ...prev,
                      name,
                      slug: prev._isNew && !prev.slug ? slugify(name) : prev.slug,
                    }));
                  }}
                  className="h-10 mt-2 rounded-none border-[#1E3F20] focus-visible:ring-0"
                  placeholder="Hill Filter Coffee"
                />
              </div>

              <div>
                <Label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Slug</Label>
                <Input
                  data-testid={ADMIN_PRODUCTS.slugInput}
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                  className="h-10 mt-2 rounded-none border-[#1E3F20] focus-visible:ring-0"
                  placeholder="hill-filter-coffee"
                />
              </div>

              <div>
                <Label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Category</Label>
                <Select
                  value={editing.category_slug}
                  onValueChange={(v) => setEditing({ ...editing, category_slug: v })}
                >
                  <SelectTrigger
                    data-testid={ADMIN_PRODUCTS.categorySelect}
                    className="h-10 mt-2 rounded-none border-[#1E3F20] focus:ring-0 focus:ring-offset-0"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {categories.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">
                  Base price (₹) · blank = pickup pricing
                </Label>
                <Input
                  data-testid={ADMIN_PRODUCTS.priceInput}
                  type="number" step="1" min="0"
                  value={editing.price}
                  onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                  className="h-10 mt-2 rounded-none border-[#1E3F20] focus-visible:ring-0"
                  placeholder="90"
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">
                  Variants (comma-separated · <em>Label: price</em>, leave price empty for pickup)
                </Label>
                <Input
                  data-testid={ADMIN_PRODUCTS.variantsInput}
                  value={editing.variants}
                  onChange={(e) => setEditing({ ...editing, variants: e.target.value })}
                  className="h-10 mt-2 rounded-none border-[#1E3F20] focus-visible:ring-0"
                  placeholder="Small: 40, Regular: 60, Large: 80"
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">
                  Short note (menu tile)
                </Label>
                <Input
                  data-testid={ADMIN_PRODUCTS.noteInput}
                  value={editing.note}
                  onChange={(e) => setEditing({ ...editing, note: e.target.value })}
                  className="h-10 mt-2 rounded-none border-[#1E3F20] focus-visible:ring-0"
                  placeholder="Slow-brewed decoction with hill-farmed beans."
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Description</Label>
                <Textarea
                  data-testid={ADMIN_PRODUCTS.descriptionInput}
                  rows={3}
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="mt-2 rounded-none border-[#1E3F20] focus-visible:ring-0"
                />
              </div>

              <div>
                <Label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Sort order</Label>
                <Input
                  data-testid={ADMIN_PRODUCTS.orderInput}
                  type="number" step="1"
                  value={editing.order}
                  onChange={(e) => setEditing({ ...editing, order: e.target.value })}
                  className="h-10 mt-2 rounded-none border-[#1E3F20] focus-visible:ring-0"
                />
              </div>

              <div>
                <Label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Rating</Label>
                <Input
                  type="number" step="0.1" min="0" max="5"
                  value={editing.rating}
                  onChange={(e) => setEditing({ ...editing, rating: e.target.value })}
                  className="h-10 mt-2 rounded-none border-[#1E3F20] focus-visible:ring-0"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <Switch
                  checked={editing.is_best_seller}
                  onCheckedChange={(v) => setEditing({ ...editing, is_best_seller: v })}
                  data-testid={ADMIN_PRODUCTS.bestSellerSwitch}
                />
                <span className="text-[11px] tracking-widest uppercase text-[#4A2E15]">Best seller</span>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <Switch
                  checked={editing.is_available}
                  onCheckedChange={(v) => setEditing({ ...editing, is_available: v })}
                  data-testid={ADMIN_PRODUCTS.availableSwitch}
                />
                <span className="text-[11px] tracking-widest uppercase text-[#4A2E15]">Available to customers</span>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline" onClick={() => setEditing(null)}
              className="rounded-none border-[#1E3F20] text-[#1E3F20] hover:bg-[#EDF3EE]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              data-testid={ADMIN_PRODUCTS.saveButton}
              className="rounded-none bg-[#1E3F20] hover:bg-[#152C16] text-white min-w-[120px]"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!confirmDelete} onOpenChange={(v) => !v && setConfirmDelete(null)}>
        <AlertDialogContent className="rounded-none border-[#E8E2D9]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl text-[#1E3F20]">
              Delete product?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-[#1F1F1F]">{confirmDelete?.name}</span>{" "}
              from the menu. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none border-[#1E3F20] text-[#1E3F20]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-testid="admin-product-delete-confirm"
              className="rounded-none bg-[#B4451D] hover:bg-[#8f3717] text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
