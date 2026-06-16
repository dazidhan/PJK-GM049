"use client";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { name: "Wisata Alam", categoryName: "Wisata Alam", count: "2.4K destinasi", emoji: "🏔️" },
  { name: "Pantai", categoryName: "Pantai", count: "850 destinasi", emoji: "🏖️" },
  { name: "Camping", categoryName: "Camping", count: "460 destinasi", emoji: "🏕️" },
  { name: "Keluarga", categoryName: "Keluarga", count: "1.2K destinasi", emoji: "👨‍👩‍👧" },
  { name: "Adventure", categoryName: "Adventure", count: "420 destinasi", emoji: "🚵" },
  { name: "Fotografi", categoryName: "Fotografi", count: "390 destinasi", emoji: "📸" },
  { name: "Healing", categoryName: "Healing", count: "510 destinasi", emoji: "💆" },
  { name: "Lainnya", categoryName: "Lainnya", count: "1.1K destinasi", emoji: "🏨" },
];

export default function CategoryFilter() {
  const router = useRouter();

  const handleClick = (categoryName: string) => {
    router.push(`/chat?cat=${encodeURIComponent(categoryName)}`);
  };

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
              onClick={() => handleClick(cat.categoryName)}
            >
              <div className="category-emoji">{cat.emoji}</div>
              <div className="category-name">{cat.name}</div>
              <div className="category-count">{cat.count}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
