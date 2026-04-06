"use client";

import { useRef, useState } from "react";

const initialFormState = {
  name: "",
  price: "",
  description: "",
  imageUrl: "",
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });

export default function ProductForm({ onSave, editingProduct, onCancelEdit }) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState(() => {
    if (!editingProduct) return initialFormState;

    return {
      name: editingProduct.name || "",
      price: String(editingProduct.price ?? ""),
      description: editingProduct.description || "",
      imageUrl: editingProduct.imageUrl || "",
    };
  });
  const [errors, setErrors] = useState({});
  const [imageName, setImageName] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, imageUrl: "Please choose an image file" }));
      return;
    }

    try {
      const imageDataUrl = await readFileAsDataUrl(file);
      setFormData((prev) => ({ ...prev, imageUrl: imageDataUrl }));
      setImageName(file.name);
      setErrors((prev) => ({ ...prev, imageUrl: "" }));
    } catch {
      setErrors((prev) => ({
        ...prev,
        imageUrl: "Unable to process this image. Try another file.",
      }));
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    setImageName("");
    setErrors((prev) => ({ ...prev, imageUrl: "" }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Product name is required";
    }

    if (!formData.price.trim()) {
      nextErrors.price = "Price is required";
    } else if (Number(formData.price) < 0) {
      nextErrors.price = "Price cannot be negative";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    onSave({
      name: formData.name.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim(),
    });

    if (!editingProduct) {
      setFormData(initialFormState);
      setImageName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="grid md:grid-cols-[280px_1fr]">
        <div className="border-b border-slate-200 p-6 md:border-b-0 md:border-r dark:border-slate-700">
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">
            Product Image
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
            PNG, JPG, WEBP up to 10MB
          </p>

          <input
            ref={fileInputRef}
            id="product-image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {!formData.imageUrl ? (
            <button
              type="button"
              onClick={openFilePicker}
              className="mt-6 flex h-[280px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center transition hover:border-indigo-400 hover:bg-indigo-50/20 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-indigo-400"
            >
              <span className="text-3xl text-slate-400 dark:text-slate-500">☁</span>
              <span className="mt-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-base font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                +
              </span>
              <span className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Upload product image
              </span>
              <span className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                Max file size 5MB
              </span>
            </button>
          ) : (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-600 dark:bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.imageUrl}
                alt="Selected product preview"
                className="h-44 w-full rounded-lg object-cover"
              />
              <p className="mt-3 truncate text-xs text-slate-500 dark:text-slate-400">
                {imageName || "Existing product image"}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                >
                  Change image
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="rounded-md bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {errors.imageUrl && (
            <p className="mt-2 text-sm text-rose-600">{errors.imageUrl}</p>
          )}
        </div>

        <div className="p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Wireless Mouse"
                className="w-full rounded-lg border border-transparent bg-slate-200/80 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-rose-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="99.99"
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-transparent bg-slate-200/80 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-rose-600">{errors.price}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description of your product"
                rows={5}
                className="w-full rounded-lg border border-transparent bg-slate-200/80 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-100 px-6 py-5 dark:border-slate-700 dark:bg-slate-900/90">
        <div />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>

          {editingProduct && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
