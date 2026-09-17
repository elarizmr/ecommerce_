"use client";
import { useEffect, useState } from "react";

const ALL_SIZES = ["XS", "S", "M", "L", "XL"];

type ColorVariant = {
  name: string;
  images: string[]; // bu rəngə aid şəkil URL-ləri
};

type Product = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string; // əsas/kart şəkli
  stock: number;
  sizes: string[];
  colors: ColorVariant[];
  information?: string;
  modelInfo?: string;
  materialInfo?: string;
  shippingReturns?: string;
  points?: number;
};

const emptyForm = {
  name: "",
  price: "",
  description: "",
  image: "",
  stock: "",
  sizes: [] as string[],
  colors: [] as ColorVariant[],
  information: "",
  modelInfo: "",
  materialInfo: "",
  shippingReturns: "",
  points: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadProducts() {
    const res = await fetch("/api/admin/products");
    setProducts(await res.json());
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      points: Number(form.points) || 0,
      colors: form.colors
        .filter((c) => c.name.trim() !== "")
        .map((c) => ({ ...c, images: c.images.filter((i) => i.trim() !== "") })),
    };

    if (editingId) {
      await fetch(`/api/admin/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm(emptyForm);
    setEditingId(null);
    loadProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Silinsin?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  function handleEdit(p: Product) {
    setEditingId(p._id);
    setForm({
      name: p.name,
      price: String(p.price),
      description: p.description || "",
      image: p.image || "",
      stock: String(p.stock ?? ""),
      sizes: p.sizes || [],
      colors: p.colors?.length ? p.colors : [],
      information: p.information || "",
      modelInfo: p.modelInfo || "",
      materialInfo: p.materialInfo || "",
      shippingReturns: p.shippingReturns || "",
      points: String(p.points ?? ""),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  // --- ölçülər ---
  function toggleSize(size: string) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  }

  // --- rənglər ---
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
  function addColorImage(index: number) {
    const next = [...form.colors];
    next[index] = { ...next[index], images: [...next[index].images, ""] };
    setForm({ ...form, colors: next });
  }
  function updateColorImage(colorIndex: number, imgIndex: number, value: string) {
    const next = [...form.colors];
    const imgs = [...next[colorIndex].images];
    imgs[imgIndex] = value;
    next[colorIndex] = { ...next[colorIndex], images: imgs };
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

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Məhsullar</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mb-8">
        <input
          className={inputClass}
          placeholder="Ad"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className={inputClass}
          placeholder="Qiymət"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          className={inputClass}
          placeholder="Stok"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <input
          className={inputClass}
          placeholder="Əsas/kart şəkli URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <input
          className={inputClass}
          placeholder="Bonus xal (points)"
          type="number"
          value={form.points}
          onChange={(e) => setForm({ ...form, points: e.target.value })}
        />
        <textarea
          className={inputClass}
          placeholder="Qısa açıqlama"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <textarea
          className={inputClass}
          placeholder="Information bölməsi"
          value={form.information}
          onChange={(e) => setForm({ ...form, information: e.target.value })}
        />
        <textarea
          className={inputClass}
          placeholder="Model info"
          value={form.modelInfo}
          onChange={(e) => setForm({ ...form, modelInfo: e.target.value })}
        />
        <textarea
          className={inputClass}
          placeholder="Material info"
          value={form.materialInfo}
          onChange={(e) => setForm({ ...form, materialInfo: e.target.value })}
        />
        <textarea
          className={inputClass}
          placeholder="Shipping & Returns"
          value={form.shippingReturns}
          onChange={(e) => setForm({ ...form, shippingReturns: e.target.value })}
        />

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

        {/* Rənglər */}
        <div>
          <label className="text-sm font-medium block mb-2">Rənglər</label>
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
                    <div key={ii} className="flex gap-2">
                      <input
                        className={inputClass}
                        placeholder={`Şəkil URL ${ii + 1}`}
                        value={img}
                        onChange={(e) => updateColorImage(ci, ii, e.target.value)}
                      />
                      {c.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeColorImage(ci, ii)}
                          className="text-red-600 text-xs px-2"
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addColorImage(ci)}
                    className="text-xs text-blue-600 self-start"
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
            className="text-xs text-blue-600 mt-2"
          >
            + Rəng əlavə et
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-neutral-900 text-white rounded-lg px-4 py-2 text-sm hover:opacity-85"
          >
            {editingId ? "Yenilə" : "Əlavə et"}
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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] bg-white border border-neutral-200 rounded-lg overflow-hidden text-sm">
          <thead className="bg-neutral-100">
            <tr>
              <th className="text-left p-3">Ad</th>
              <th className="text-left p-3">Qiymət</th>
              <th className="text-left p-3">Stok</th>
              <th className="text-left p-3">Ölçülər</th>
              <th className="text-left p-3">Rənglər</th>
              <th className="text-left p-3">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-neutral-200">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.price} AZN</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.sizes?.join(", ")}</td>
                <td className="p-3">{p.colors?.map((c) => c.name).join(", ")}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:opacity-85"
                  >
                    Redaktə
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:opacity-85"
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