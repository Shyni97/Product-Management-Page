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
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Product Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Wireless Mouse"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none ring-sky-300 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:ring-sky-400"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-rose-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Price <span className="text-rose-500">*</span>
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="99.99"
          min="0"
          step="0.01"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none ring-sky-300 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:ring-sky-400"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-rose-600">{errors.price}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Short description of your product"
          rows={3}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none ring-sky-300 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:ring-sky-400"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Product Image
        </label>
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
            className="group mt-1 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-300 bg-gradient-to-b from-sky-50 to-white px-6 py-8 text-center transition hover:border-sky-400 hover:from-sky-100 dark:border-sky-700 dark:from-slate-800 dark:to-slate-900 dark:hover:border-sky-600 dark:hover:from-slate-700"
          >
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm ring-1 ring-sky-100 dark:bg-slate-700 dark:text-slate-100 dark:ring-slate-600">
              +
            </span>
            <span className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Upload product image
            </span>
            <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              PNG, JPG, WEBP up to 10MB
            </span>
          </button>
        ) : (
          <div className="mt-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.imageUrl}
                alt="Selected product preview"
                className="h-24 w-24 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Image ready</p>
                <p className="truncate text-sm text-slate-600 dark:text-slate-300">
                  {imageName || "Existing product image"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="rounded-lg bg-sky-100 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:hover:bg-sky-900/70"
                  >
                    Change image
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="rounded-lg bg-rose-100 px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/70"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {errors.imageUrl && (
          <p className="mt-1 text-sm text-rose-600">{errors.imageUrl}</p>
        )}
      </div>

      <div className="md:col-span-2 flex flex-wrap gap-3 pt-1">
        <button
          type="submit"
          className={`rounded-xl px-5 py-2.5 font-medium text-white shadow transition ${
            editingProduct
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {editingProduct ? "Update Product" : "Add Product"}
        </button>

        {editingProduct && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl bg-slate-200 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
