# Product Management App

A modern product management dashboard built with Next.js, React, and Tailwind CSS. It lets you create, edit, search, and delete products entirely in the browser, with data persisted in local storage.

## Overview

This project is a single-page product manager designed for quick catalog entry and local demos. It includes a custom image uploader, live product cards, search, edit/delete actions, and a dark mode toggle.

Because the app stores data locally in the browser, it does not require a backend or database.

## Features

- Add new products with name, price, description, and image.
- Upload product images from your device instead of pasting a URL.
- Preview uploaded images before saving.
- Edit existing products.
- Delete products.
- Persist data in localStorage.

## Bonus features

- Search products by name or description.
- Toggle between light mode and dark mode.
- Responsive layout for desktop and mobile.

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS v4
- Browser localStorage for persistence

## Project Structure

- app/page.jsx - main application page and state management
- app/components/ProductForm.jsx - create and edit form with image upload
- app/components/ProductList.jsx - product grid and empty state
- app/components/ProductCard.jsx - individual product card
- app/globals.css - global styles and theme variables

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - build the app for production
- `npm run start` - start the production server
- `npm run lint` - run ESLint

## How It Works

### Product data

Products are stored in localStorage under the `pm_products` key. Refreshing the page keeps your saved items, as long as the browser data remains intact.

### Image upload

The image field uses a file picker and converts the selected image into a data URL in the browser. That means uploaded images are previewed immediately and stored with the product without needing a backend file service.

### Dark mode

The theme toggle stores the selected mode in localStorage under the `pm_theme` key. If no preference is saved, the app falls back to the system color scheme.

## Usage

1. Enter a product name and price.
2. Add an optional description.
3. Upload an image from your device.
4. Click Add Product.
5. Use the search bar to filter products.
6. Click Edit to update an item or Delete to remove it.

## Notes

- Uploaded images are stored as base64 data URLs, so very large images can increase browser storage usage.
- This project is intended for local use and demos, not for long-term production storage.

## Deployment

You can deploy this app to any platform that supports Next.js, including Vercel.

Live deployment: [https://product-management-page-omega.vercel.app](https://product-management-page-omega.vercel.app)

Build the project first:

```bash
npm run build
```

Then start the production server:

```bash
npm run start
```