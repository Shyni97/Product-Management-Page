"use client";

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <article className="rounded-xl bg-white p-4 shadow-md ring-1 ring-slate-200 transition hover:shadow-lg dark:bg-slate-800 dark:ring-slate-700 dark:hover:shadow-slate-900/30">
      {product.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.imageUrl}
          alt={product.name}
          className="mb-3 h-44 w-full rounded-lg object-cover"
        />
      ) : (
        <div className="mb-3 flex h-44 w-full items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500 dark:bg-slate-700 dark:text-slate-300">
          No Image
        </div>
      )}

      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{product.name}</h3>
      <p className="mt-1 text-base font-medium text-slate-700 dark:text-slate-200">
        ${Number(product.price).toFixed(2)}
      </p>
      <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
        {product.description || "No description provided."}
      </p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onEdit(product)}
          className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
