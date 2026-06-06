# Uploading Property Images

This applies to the **"Imej Utama"** (main photo) and **"Galeri"** (gallery) fields when adding or editing a project in Sanity Studio.

## Short version

Just upload your photos as they are — straight from your phone or camera, at full quality. You don't need to resize or compress anything yourself. The website takes care of that automatically.

## How images are delivered to visitors

The site never shows visitors the exact file you uploaded. Every image URL goes through **Sanity's image CDN** with resize parameters attached — for example `?w=640&auto=format` for a listing thumbnail, `?w=1600&auto=format` for the gallery's main carousel, `?w=2000&auto=format` for the full-screen lightbox view. The CDN resizes your original to the requested width on the fly and uses `auto=format` to deliver it as **WebP or AVIF** (modern, much smaller formats) to any browser that supports them, falling back to JPEG otherwise.

The first visitor to load a given page triggers that resize/reformat once; the result is then **cached at Sanity's edge** and served instantly to everyone after. So none of this depends on the size or format of what you originally uploaded — the CDN always produces an appropriately small, modern-format copy for each spot on the site. A higher-quality original simply gives the CDN more to work with, producing a better-looking resized copy — not a bigger download for visitors.

## A few practical tips

- **Use normal photo formats** — JPEG or PNG straight from a phone or camera works great. Avoid **SVG** (a vector format meant for logos/icons — the CDN doesn't resize it) and **animated GIFs** (the transform pipeline doesn't handle animation reliably).
- **Don't pre-compress or downscale photos yourself** — the CDN transform already optimises everything for delivery. Compressing beforehand only throws away quality the CDN could have preserved; it won't make the site any faster.
- **Avoid extremely large raw files** (e.g. 50 MB+ camera RAW/HEIC originals) — they slow down uploads in Studio and use up dataset storage, with no benefit since the largest size ever requested from the CDN on this site is `w=2000`.

## Gallery requirement

Each project's gallery still needs **at least 4 photos**.
