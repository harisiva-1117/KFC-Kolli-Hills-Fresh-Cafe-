import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, ImagePlus, Loader2, Upload, X, ArrowUp, ArrowDown,
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api, resolveImageUrl } from "@/lib/api";
import { ADMIN_CATEGORIES } from "@/constants/testIds";

const slugify = (v) =>
  v.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

const EMPTY = { name: "", slug: "", tag: "", image: "", order: 0, is_active: true };

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cs, ps] = await Promise.all([
        api.adminListCategories(),
        api.adminListProducts(),
      ]);
      setCategories(cs || []);
      const counts = {};
      (ps || []).forEach((p) => {
        counts[p.category_slug] = (counts[p.category_slug] || 0) + 1;
      });
      setProductCounts(counts);
    } catch (e) {
      toast.error("Failed to load categories", { description: e.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    const nextOrder = categories.reduce((m, c) => Math.max(m, c.order || 0), 0) + 1;
    setEditing({ ...EMPTY, order: nextOrder, _isNew: true });
  };

  const openEdit = (c) => {
    setEditing({
      _isNew: false,
      _originalSlug: c.slug,
      name: c.name,
      slug: c.slug,
      tag: c.tag || "",
      image: c.image || "",
      order: c.order || 0,
      is_active: !!c.is_active,
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

    const payload = {
      name: editing.name.trim(),
      slug,
      tag: editing.tag.trim(),
      image: editing.image.trim(),
      order: Number(editing.order) || 0,
      is_active: !!editing.is_active,
    };

    setSaving(true);
    try {
      if (editing._isNew) {
        await api.adminCreateCategory(payload);
        toast.success("Category created");
      } else {
        await api.adminUpdateCategory(editing._originalSlug, payload);
        toast.success("Category updated");
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error("Save failed", { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (c) => {
    try {
      await api.adminUpdateCategory(c.slug, { is_active: !c.is_active });
      load();
    } catch (e) {
      toast.error("Update failed", { description: e.message });
    }
  };

  const move = async (c, direction) => {
    const idx = categories.findIndex((x) => x.slug === c.slug);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= categories.length) return;
    const other = categories[swapIdx];
    try {
      await Promise.all([
        api.adminUpdateCategory(c.slug, { order: other.order }),
        api.adminUpdateCategory(other.slug, { order: c.order }),
      ]);
      load();
    } catch (e) {
      toast.error("Reorder failed", { description: e.message });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.adminDeleteCategory(confirmDelete.slug);
      toast.success(`${confirmDelete.name} deleted`);
      setConfirmDelete(null);
      load();
    } catch (e) {
      toast.error("Cannot delete category", { description: e.message });
      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#4A2E15]">— Menu structure</p>
          <h2 className="font-display text-2xl text-[#1E3F20] mt-1">Categories</h2>
        </div>
        <Button
          onClick={openNew}
          data-testid={ADMIN_CATEGORIES.newButton}
          className="rounded-none bg-[#1E3F20] hover:bg-[#152C16] text-white h-10"
        >
          <Plus className="w-4 h-4 mr-2" /> New category
        </Button>
      </div>

      <div className="border border-[#E8E2D9] bg-white">
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-[#1E3F20]" /></div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-[#5C5C5C]">No categories yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[#E8E2D9]">
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15] w-24">Order</TableHead>
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Image</TableHead>
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Name</TableHead>
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Products</TableHead>
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Active</TableHead>
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c, i) => (
                <TableRow key={c.slug} data-testid={`${ADMIN_CATEGORIES.row}-${c.slug}`} className="border-b border-[#E8E2D9] align-middle">
                  <TableCell className="py-3">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost" size="sm" onClick={() => move(c, "up")}
                        disabled={i === 0}
                        className="rounded-none h-7 w-7 p-0 hover:bg-[#EDF3EE]"
                        aria-label="Move up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <span className="font-display text-lg text-[#1E3F20] w-6 text-center">{c.order}</span>
                      <Button
                        variant="ghost" size="sm" onClick={() => move(c, "down")}
                        disabled={i === categories.length - 1}
                        className="rounded-none h-7 w-7 p-0 hover:bg-[#EDF3EE]"
                        aria-label="Move down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    {c.image ? (
                      <img src={resolveImageUrl(c.image)} alt={c.name} className="w-14 h-14 object-cover border border-[#E8E2D9]" />
                    ) : (
                      <div className="w-14 h-14 bg-[#F0EBE3] flex items-center justify-center">
                        <ImagePlus className="w-4 h-4 text-[#B8B0A2]" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <p className="text-sm text-[#1F1F1F]">{c.name}</p>
                    <p className="text-[10px] tracking-widest uppercase text-[#5C5C5C]">{c.slug}</p>
                    {c.tag && <p className="text-xs text-[#4A2E15] italic mt-1">{c.tag}</p>}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className="rounded-none border-[#1E3F20] text-[#1E3F20]">
                      {productCounts[c.slug] || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <Switch
                      checked={c.is_active}
                      onCheckedChange={() => toggleActive(c)}
                      data-testid={`${ADMIN_CATEGORIES.activeSwitch}-${c.slug}`}
                    />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => openEdit(c)}
                        data-testid={`${ADMIN_CATEGORIES.editButton}-${c.slug}`}
                        className="rounded-none h-8 text-[#1E3F20] hover:bg-[#EDF3EE]"
                      >
                        <Pencil className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => setConfirmDelete(c)}
                        data-testid={`${ADMIN_CATEGORIES.deleteButton}-${c.slug}`}
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
          data-testid={ADMIN_CATEGORIES.form}
          className="rounded-none border-[#E8E2D9] max-w-xl"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-[#1E3F20]">
              {editing?._isNew ? "New category" : "Edit category"}
            </DialogTitle>
            <DialogDescription className="text-[#5C5C5C]">
              Categories organise the menu. Toggle Active to hide from customers.
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
                    <Upload className="w-3 h-3" /> {uploading ? "Uploading…" : "Upload"}
                    <input
                      type="file" accept="image/*" className="hidden"
                      data-testid={ADMIN_CATEGORIES.imageUpload}
                      onChange={(e) => handleUpload(e.target.files?.[0])}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              <div>
                <Label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Name</Label>
                <Input
                  data-testid={ADMIN_CATEGORIES.nameInput}
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
                  placeholder="Coffee"
                />
              </div>

              <div>
                <Label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Slug</Label>
                <Input
                  data-testid={ADMIN_CATEGORIES.slugInput}
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                  className="h-10 mt-2 rounded-none border-[#1E3F20] focus-visible:ring-0"
                  placeholder="coffee"
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Tagline</Label>
                <Input
                  data-testid={ADMIN_CATEGORIES.tagInput}
                  value={editing.tag}
                  onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                  className="h-10 mt-2 rounded-none border-[#1E3F20] focus-visible:ring-0"
                  placeholder="Estate roasted"
                />
              </div>

              <div>
                <Label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">Display order</Label>
                <Input
                  data-testid={ADMIN_CATEGORIES.orderInput}
                  type="number" step="1"
                  value={editing.order}
                  onChange={(e) => setEditing({ ...editing, order: e.target.value })}
                  className="h-10 mt-2 rounded-none border-[#1E3F20] focus-visible:ring-0"
                />
              </div>

              <div className="flex items-center gap-3 pt-8">
                <Switch
                  checked={editing.is_active}
                  onCheckedChange={(v) => setEditing({ ...editing, is_active: v })}
                />
                <span className="text-[11px] tracking-widest uppercase text-[#4A2E15]">Active</span>
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
              data-testid={ADMIN_CATEGORIES.saveButton}
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
              Delete category?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {productCounts[confirmDelete?.slug]
                ? `This category contains ${productCounts[confirmDelete?.slug]} product${productCounts[confirmDelete?.slug] === 1 ? "" : "s"}. Move or delete them first.`
                : `This will permanently remove "${confirmDelete?.name}" from the menu structure.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none border-[#1E3F20] text-[#1E3F20]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-testid="admin-category-delete-confirm"
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
