"use client";

import { useEffect, useMemo, useState } from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";

const STORAGE_KEY = "pm_products";
const THEME_STORAGE_KEY = "pm_theme";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem(STORAGE_KEY);
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch {
        setProducts([]);
      }
    }

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    } else if (savedTheme === "light") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
  }, [isDarkMode, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products, isHydrated]);

  useEffect(() => {
    if (!message) return;
    const timeoutId = setTimeout(() => setMessage(""), 2200);
    return () => clearTimeout(timeoutId);
  }, [message]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const query = searchTerm.toLowerCase();
    return products.filter((product) => {
      const text = `${product.name} ${product.description}`.toLowerCase();
      return text.includes(query);
    });
  }, [products, searchTerm]);

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProduct.id
            ? { ...product, ...productData, id: editingProduct.id }
            : product,
        ),
      );
      setEditingProduct(null);
      setMessage("Product updated");
      return;
    }

    const newProduct = {
      ...productData,
      id: Date.now(),
    };

    setProducts((prevProducts) => [newProduct, ...prevProducts]);
    setMessage("Product added");
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId),
    );

    if (editingProduct?.id === productId) {
      setEditingProduct(null);
    }

    setMessage("Product deleted");
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-emerald-50 px-4 py-8 transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur transition-colors dark:bg-slate-900/80 dark:shadow-slate-900/40 md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 md:text-4xl">
                Product Management
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Add, edit, search, and manage your products using local storage.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="self-start rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {isDarkMode ? "Light mode" : "Dark mode"}
            </button>
          </div>

          {message && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              {message}
            </div>
          )}

          <div className="mt-6">
            <ProductForm
              key={editingProduct?.id ?? "new"}
              onSave={handleSaveProduct}
              editingProduct={editingProduct}
              onCancelEdit={handleCancelEdit}
            />
          </div>
        </section>

        <section className="rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur transition-colors dark:bg-slate-900/80 dark:shadow-slate-900/40 md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              Products
            </h2>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name or description"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-700 outline-none ring-sky-300 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:ring-sky-400 sm:max-w-xs"
            />
          </div>

          <div className="mt-6">
            <ProductList
              products={filteredProducts}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
