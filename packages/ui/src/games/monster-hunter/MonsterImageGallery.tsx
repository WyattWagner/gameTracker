import { useState } from "react";
import type { MonsterImage } from "@game-tracker/shared";

export function MonsterImageGallery({
  heroUrl,
  images,
  alt,
}: {
  heroUrl: string | null;
  images: MonsterImage[];
  alt: string;
}) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const hero = heroUrl ?? images.find((i) => i.imageType === "render")?.imageUrl ?? images[0]?.imageUrl;
  const thumbs = images.filter((i) => i.imageUrl !== hero);

  if (!hero && thumbs.length === 0) return null;

  return (
    <section className="space-y-3" aria-label="Monster image gallery">
      {hero && (
        <button
          type="button"
          className="block w-full overflow-hidden rounded-lg border border-rust/40 focus:outline-none focus:ring-2 focus:ring-moss"
          onClick={() => setLightbox(hero)}
          aria-label={`View large ${alt} render`}
        >
          <img
            src={hero}
            alt={`${alt} render`}
            className="h-48 w-full object-cover md:h-64"
            loading="lazy"
          />
        </button>
      )}
      {thumbs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {thumbs.map((img) => (
            <button
              key={img.id}
              type="button"
              className="overflow-hidden rounded border border-rust/40 focus:outline-none focus:ring-2 focus:ring-moss"
              onClick={() => setLightbox(img.imageUrl)}
              aria-label={`View ${img.imageType} image`}
            >
              <img
                src={img.imageUrl}
                alt={`${alt} ${img.imageType}`}
                className="h-16 w-16 object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onClick={() => setLightbox(null)}
          onKeyDown={(e) => e.key === "Escape" && setLightbox(null)}
        >
          <img
            src={lightbox}
            alt={alt}
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
