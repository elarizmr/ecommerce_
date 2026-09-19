"use client";
import { CATEGORIES, slugify } from "@/app/lib/categories";
import { useState } from "react";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  type Product,
  type ColorVariant,
} from "./useProducts";

const ALL_SIZES = ["XS", "S", "M", "L", "XL"];

// Cloudinary məlumatları
const CLOUD_NAME = "pjjvvrbv";
const UPLOAD_PRESET = "olar_preset";

const emptyForm = {
  name: "",
  price: "",
  section: "men" as "men" | "women" | "accessories",
  subcategory: "",
  description: "",
  image: [] as string[],
  stock: "",
  sizes: [] as string[],
  colors: [] as ColorVariant[],
  information: "",
  modelInfo: "",
  materialInfo: "",
  shippingReturns: "",
  points: "",
  lastChance: false,
};

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Şəkil yüklənmədi");
    return data.secure_url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      points: Number(form.points) || 0,
      image: form.image.filter((img) => img.trim() !== ""),
      colors: form.colors
        .filter((c) => c.name.trim() !== "")
        .map((c) => ({ ...c, images: c.images.filter((i) => i.trim() !== "") })),
    };

    try {
      if (editingId) {
        await updateProduct.mutateAsync({ id: editingId, payload });
        setEditingId(null);
      } else {
        await createProduct.mutateAsync(payload);
      }
      setForm(emptyForm);
    } catch (err) {
      alert("Əməliyyat uğursuz oldu");
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Silinsin?")) return;
    try {
      await deleteProduct.mutateAsync(id);
    } catch (err) {
      alert("Silinmə uğursuz oldu");
      console.error(err);
    }
  }

  function handleEdit(p: Product) {
    setEditingId(p._id);
    
    // Bazadan gələn subcategory-ni CATEGORIES siyahısındakı orijinal adla uyğunlaşdırırıq
    const currentSection = p.section || "men";
    const matchedCategory = CATEGORIES[currentSection]?.find(
      (c) => c.toLowerCase() === (p.subcategory || "").toLowerCase() || slugify(c) === (p.subcategory || "").toLowerCase()
    ) || p.subcategory || "";

    setForm({
      name: p.name,
      price: String(p.price),
      section: currentSection,
      subcategory: matchedCategory,
      description: p.description || "",
      image: Array.isArray(p.image) ? p.image : p.image ? [p.image] : [],
      stock: String(p.stock ?? ""),
      sizes: p.sizes || [],
      colors: p.colors?.length ? p.colors : [],
      information: p.information || "",
      modelInfo: p.modelInfo || "",
      materialInfo: p.materialInfo || "",
      shippingReturns: p.shippingReturns || "",
      points: String(p.points ?? ""),
      lastChance: !!p.lastChance,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function toggleSize(size: string) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  }

  function addColor() {
    setForm({ ...form, colors: [...form.colors, { name: "", images: [""] }] });
  }
  function removeColor(index: number) {
    setForm({ ...form, colors: form.colors.filter((_, i) => i !== index) });
  }
  function updateColorName(index: number, value: string) {
    const next = [...form.colors];
    next[index] = { ...next[index], name: value };
    setForm({ ...form, colors: next });
  }

  async function handleColorImageFile(colorIndex: number, imgIndex: number, file: File) {
    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      const next = [...form.colors];
      const imgs = [...next[colorIndex].images];
      imgs[imgIndex] = url;
      next[colorIndex] = { ...next[colorIndex], images: imgs };
      setForm({ ...form, colors: next });
    } catch (err) {
      alert("Şəkil yüklənərkən xəta baş verdi!");
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  function addColorImage(index: number) {
    const next = [...form.colors];
    next[index] = { ...next[index], images: [...next[index].images, ""] };
    setForm({ ...form, colors: next });
  }

  function removeColorImage(colorIndex: number, imgIndex: number) {
    const next = [...form.colors];
    next[colorIndex] = {
      ...next[colorIndex],
      images: next[colorIndex].images.filter((_, i) => i !== imgIndex),
    };
    setForm({ ...form, colors: next });
  }

  const inputClass =
    "border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 w-full";

  const submitting = createProduct.isPending || updateProduct.isPending;

  if (isLoading) {
    return <p className="p-6 text-sm text-neutral-500">Yüklənir...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Məhsullar</h1>

      {uploading && (
        <div className="mb-4 text-sm text-blue-600 font-medium">
          Şəkil buluda yüklənir, zəhmət olmasa gözləyin...
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mb-8">
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Məhsulun Adı</label>
          <input
            className={inputClass}
            placeholder="Ad"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        {/* Bölmə */}
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Bölmə</label>
          <select
            className={inputClass}
            value={form.section}
            onChange={(e) =>
              setForm({
                ...form,
                section: e.target.value as "men" | "women" | "accessories",
                subcategory: "",
              })
            }
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        {/* Kateqoriya */}
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Kateqoriya</label>
          <select
            className={inputClass}
            value={form.subcategory}
            onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
            required
          >
            <option value="">Seç...</option>
            {CATEGORIES[form.section].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-neutral-500 block mb-1">Qiymət (AZN)</label>
          <input
            className={inputClass}
            placeholder="Qiymət"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-xs text-neutral-500 block mb-1">Stok Miqdarı</label>
          <input
            className={inputClass}
            placeholder="Stok"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>

        {/* Əsas Şəkillər (Maksimum 6 ədəd) */}
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Əsas Şəkillər (Maksimum 6 ədəd)</label>
          <div className="flex flex-col gap-2">
            {form.image.map((imgUrl, imgIndex) => (
              <div key={imgIndex} className="flex items-center gap-2 border border-neutral-200 p-2 rounded-lg">
                <input
                  type="file"
                  accept="image/*"
                  className={inputClass}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        setUploading(true);
                        const url = await uploadToCloudinary(file);
                        const nextImages = [...form.image];
                        nextImages[imgIndex] = url;
                        setForm({ ...form, image: nextImages });
                      } catch (err) {
                        alert("Şəkil yüklənmədi");
                      } finally {
                        setUploading(false);
                      }
                    }
                  }}
                />
                {imgUrl && (
                  <img src={imgUrl} alt="Preview" className="w-10 h-10 object-cover rounded-md flex-shrink-0" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    const nextImages = form.image.filter((_, i) => i !== imgIndex);
                    setForm({ ...form, image: nextImages });
                  }}
                  className="text-red-600 text-xs px-2 py-1"
                >
                  Sil
                </button>
              </div>
            ))}

            {form.image.length < 6 && (
              <button
                type="button"
                onClick={() => {
                  if (form.image.length < 6) {
                    setForm({ ...form, image: [...form.image, ""] });
                  }
                }}
                className="text-xs text-blue-600 self-start mt-1 font-medium"
              >
                + Şəkil əlavə et ({form.image.length}/6)
              </button>
            )}
          </div>
        </div>

        {/* Bonus Xal */}
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Bonus xal (points)</label>
          <input
            className={inputClass}
            placeholder="Bonus xal"
            type="number"
            value={form.points}
            onChange={(e) => setForm({ ...form, points: e.target.value })}
          />
        </div>

        {/* Last Chance */}
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.lastChance}
            onChange={(e) => setForm({ ...form, lastChance: e.target.checked })}
            className="w-4 h-4"
          />
          Last Chance bölməsində göstər
        </label>

        {/* Qısa Açıqlama */}
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Qısa açıqlama</label>
          <textarea
            className={inputClass}
            placeholder="Qısa açıqlama"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Information */}
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Information</label>
          <textarea
            className={inputClass}
            placeholder="Information bölməsi"
            value={form.information}
            onChange={(e) => setForm({ ...form, information: e.target.value })}
          />
        </div>

        {/* Model Info */}
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Model info</label>
          <textarea
            className={inputClass}
            placeholder="Model info"
            value={form.modelInfo}
            onChange={(e) => setForm({ ...form, modelInfo: e.target.value })}
          />
        </div>

        {/* Material Info */}
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Material info</label>
          <textarea
            className={inputClass}
            placeholder="Material info"
            value={form.materialInfo}
            onChange={(e) => setForm({ ...form, materialInfo: e.target.value })}
          />
        </div>

        {/* Shipping & Returns */}
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Shipping & Returns</label>
          <textarea
            className={inputClass}
            placeholder="Shipping & Returns"
            value={form.shippingReturns}
            onChange={(e) => setForm({ ...form, shippingReturns: e.target.value })}
          />
        </div>

        {/* Ölçülər */}
        <div>
          <label className="text-sm font-medium block mb-2">Ölçülər</label>
          <div className="flex gap-2 flex-wrap">
            {ALL_SIZES.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1 rounded-md text-sm border ${
                  form.sizes.includes(size)
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-800 border-neutral-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Rənglər və Şəkillər */}
        <div>
          <label className="text-sm font-medium block mb-2">Rənglər və Şəkillər</label>
          <div className="flex flex-col gap-4">
            {form.colors.map((c, ci) => (
              <div key={ci} className="border border-neutral-200 rounded-lg p-3">
                <div className="flex gap-2 mb-2">
                  <input
                    className={inputClass}
                    placeholder="Rəng adı (məs: Chocolate Plum)"
                    value={c.name}
                    onChange={(e) => updateColorName(ci, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(ci)}
                    className="text-red-600 text-xs px-2"
                  >
                    Sil
                  </button>
                </div>

                <div className="flex flex-col gap-2 pl-3 border-l border-neutral-200">
                  {c.images.map((img, ii) => (
                    <div key={ii} className="flex flex-col gap-1 mb-2">
                      <input
                        type="file"
                        accept="image/*"
                        className={inputClass}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleColorImageFile(ci, ii, file);
                        }}
                      />
                      {img && (
                        <div className="flex items-center gap-2">
                          <img src={img} alt="Color preview" className="w-10 h-10 object-cover rounded" />
                          <span className="text-xs text-neutral-400 truncate max-w-[200px]">{img}</span>
                        </div>
                      )}
                      {c.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeColorImage(ci, ii)}
                          className="text-red-600 text-xs self-start"
                        >
                          Şəkli sil
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addColorImage(ci)}
                    className="text-xs text-blue-600 self-start mt-1"
                  >
                    + Şəkil əlavə et
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addColor}
            className="text-xs text-blue-600 mt-2 font-medium"
          >
            + Rəng əlavə et
          </button>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            disabled={uploading || submitting}
            className="bg-neutral-900 text-white rounded-lg px-4 py-2 text-sm hover:opacity-85 disabled:opacity-50"
          >
            {submitting ? "Göndərilir..." : editingId ? "Yenilə" : "Əlavə et"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-neutral-300 text-neutral-800 rounded-lg px-4 py-2 text-sm hover:opacity-85"
            >
              İmtina et
            </button>
          )}
        </div>
      </form>

      {/* Cədvəl */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] bg-white border border-neutral-200 rounded-lg overflow-hidden text-sm">
          <thead className="bg-neutral-100">
            <tr>
              <th className="text-left p-3">Ad</th>
              <th className="text-left p-3">Kateqoriya</th>
              <th className="text-left p-3">Qiymət</th>
              <th className="text-left p-3">Stok</th>
              <th className="text-left p-3">Bonus Xal</th>
              <th className="text-left p-3">Ölçülər</th>
              <th className="text-left p-3">Rənglər</th>
              <th className="text-left p-3">Last Chance</th>
              <th className="text-left p-3">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-neutral-200">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-xs text-neutral-500">
                  {p.section} / {p.subcategory}
                </td>
                <td className="p-3">{p.price} AZN</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.points ?? 0} xal</td>
                <td className="p-3">{p.sizes?.join(", ")}</td>
                <td className="p-3">{p.colors?.map((c) => c.name).join(", ")}</td>
                <td className="p-3">{p.lastChance ? "Bəli" : "—"}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:opacity-85"
                  >
                    Redaktə
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    disabled={deleteProduct.isPending}
                    className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:opacity-85 disabled:opacity-50"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}