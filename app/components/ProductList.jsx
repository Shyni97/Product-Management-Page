"use client";

import { useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 3;

const formatPrice = (price) => `$${Number(price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const getSku = (product) => {
  if (product.sku && product.sku.trim()) return product.sku;
  const suffix = String(product.id || "0000").slice(-6);
  return `PR-${suffix}`;
};

const truncateDescription = (description) => {
  if (!description) return "No description provided.";
  if (description.length <= 55) return description;
  return `${description.slice(0, 55)}...`;
};

export default function ProductList({ products, onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(start, start + ITEMS_PER_PAGE);
  }, [products, currentPage]);

  const visiblePages = useMemo(() => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 1, currentPage, currentPage + 1];
  }, [currentPage, totalPages]);

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
        No products found. Add your first product to get started.
      </div>
    );
  }

  const endEntry = Math.min(currentPage * ITEMS_PER_PAGE, products.length);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Recent Products</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Filter products"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="7" y1="12" x2="17" y2="12" />
              <line x1="10" y1="18" x2="14" y2="18" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="More actions"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="12" cy="19" r="1.8" />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr>
              <th className="px-2 text-left text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Image</th>
              <th className="px-2 text-left text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Name</th>
              <th className="px-2 text-left text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Price</th>
              <th className="px-2 text-left text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Description</th>
              <th className="px-2 text-left text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedProducts.map((product) => (
              <tr key={product.id} className="rounded-xl bg-slate-50/60 dark:bg-slate-800/40">
                <td className="w-24 px-2 py-2">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-200 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                      N/A
                    </div>
                  )}
                </td>
                <td className="px-2 py-2">
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{product.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">SKU: {getSku(product)}</p>
                </td>
                <td className="px-2 py-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {formatPrice(product.price)}
                </td>
                <td className="max-w-[320px] px-2 py-2 text-base text-slate-600 dark:text-slate-300">
                  {truncateDescription(product.description)}
                </td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="rounded-md p-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                      aria-label={`Edit ${product.name}`}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zm17.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.96 1.96 3.75 3.75 2.13-1.79z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product.id)}
                      className="rounded-md p-2 text-slate-600 transition hover:bg-slate-200 hover:text-rose-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-rose-400"
                      aria-label={`Delete ${product.name}`}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 7h12l-1 14H7L6 7zm3-3h6l1 2H8l1-2z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {endEntry} of {products.length.toLocaleString()} entries
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:enabled:hover:bg-slate-800"
          >
            Previous
          </button>
          {visiblePages.map((page) => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 rounded-md text-sm font-semibold transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:enabled:hover:bg-slate-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
