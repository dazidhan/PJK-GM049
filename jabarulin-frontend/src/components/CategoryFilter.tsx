"use client";

interface CategoryFilterProps {
  onCategoryClick: (query: string) => void;
}

const CATEGORIES = [
  { name: "Alam & Pegunungan", query: "wisata alam pegunungan hiking di Jawa Barat", count: "2.4K destinasi" },
  { name: "Pantai & Laut", query: "wisata pantai laut snorkeling di Jawa Barat", count: "850 destinasi" },
  { name: "Kuliner Sunda", query: "kuliner makanan khas sunda tradisional enak", count: "3.1K tempat" },
  { name: "Petualangan", query: "wisata petualangan rafting off-road extreme", count: "420 destinasi" },
  { name: "Taman & Agrowisata", query: "taman bunga kebun teh agrowisata instagramable", count: "680 destinasi" },
  { name: "Budaya & Sejarah", query: "wisata budaya sejarah museum situs bersejarah", count: "390 destinasi" },
  { name: "Relaksasi & Spa", query: "wisata relaksasi spa healing resort ketenangan", count: "510 destinasi" },
  { name: "Wisata Keluarga", query: "wisata keluarga anak ramah wahana seru", count: "1.2K destinasi" },
];

export default function CategoryFilter({ onCategoryClick }: CategoryFilterProps) {
  return (
    <section id="categories" className="category-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">🏷️ Kategori</div>
          <h2 className="section-title">
            Jelajahi Berdasarkan <span className="gradient-text">Minatmu</span>
          </h2>
          <p className="section-subtitle">
            Pilih kategori wisata favoritmu dan AI akan langsung merekomendasikan destinasi terbaik
          </p>
        </div>

        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="category-card"
              id={`cat-${cat.name.replace(/\s/g, "-")}`}
              onClick={() => {
                onCategoryClick(cat.query);
                document.getElementById("chatbot")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="category-name">{cat.name}</div>
              <div className="category-count">{cat.count}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
