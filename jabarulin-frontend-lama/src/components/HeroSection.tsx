"use client";
import { useState } from "react";
import { Search, MapPin, Star, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

const SUGGESTIONS = [
  "🏔️ Camping dengan sunrise indah",
  "🏖️ Pantai eksotis dekat Bandung",
  "🌿 Wisata keluarga sejuk",
  "🚵 Petualangan rafting & hiking",
  "🍜 Kuliner khas Sunda legendaris",
  "🌸 Taman bunga instagramable",
];

const PREVIEW_DESTINATIONS = [
  { image: "/kawah putih.jpg", name: "Kawah Putih", rating: 4.7, address: "Ciwidey, Bandung" },
  { image: "/pantai pangandaran.jpg", name: "Pantai Pangandaran", rating: 4.6, address: "Pangandaran" },
  { image: "/gunung papandayan.jpg", name: "Gunung Papandayan", rating: 4.8, address: "Garut" },
];

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (q?: string) => {
    const searchQuery = q ?? query;
    if (!searchQuery.trim()) return;
    onSearch(searchQuery);
    document.getElementById("chatbot")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="hero">
      {/* Background Orbs */}
      <div className="hero-orbs">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>

      <div className="hero-inner">
        {/* Left — Content */}
        <div>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            🤖 Powered by IndoBERT + Gemini AI
          </div>

          <h1 className="hero-title">
            Temukan Wisata{" "}
            <span className="gradient-text">Terbaik</span>
            <br />
            di Jawa Barat
          </h1>

          <p className="hero-subtitle">
            Ceritakan keinginan wisatamu dalam bahasa natural dan biarkan AI kami
            merekomendasikan destinasi sempurna untukmu — lengkap dengan info lalu lintas
            dan navigasi Google Maps.
          </p>

          {/* Search Box */}
          <div className="hero-search">
            <div className="hero-search-box">
              <span style={{ padding: "0 0.5rem 0 1.25rem", display: "flex", alignItems: "center", color: "var(--blue-400)" }}>
                <Search size={18} />
              </span>
              <input
                id="hero-search-input"
                className="hero-search-input"
                type="text"
                placeholder="Contoh: wisata keluarga sejuk dekat Bandung..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                id="hero-search-btn"
                className="hero-search-btn"
                onClick={() => handleSearch()}
              >
                <Sparkles size={16} />
                Tanya AI
              </button>
            </div>

            {/* Suggestion Chips */}
            <div className="hero-suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="hero-suggestion-chip"
                  onClick={() => handleSearch(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">10K+</span>
              <span className="hero-stat-label">Destinasi Wisata</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">4.8★</span>
              <span className="hero-stat-label">Rating Rata-rata</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">98%</span>
              <span className="hero-stat-label">Akurasi AI</span>
            </div>
          </div>
        </div>

        {/* Right — Chat Preview */}
        <div className="hero-visual">
          <div className="hero-chat-preview">
            {/* Chat Header */}
            <div className="hero-chat-header">
              <div className="hero-chat-header-avatar">🤖</div>
              <div className="hero-chat-header-info">
                <h4>Jabarulin AI</h4>
                <span>Asisten Wisata Jawa Barat</span>
              </div>
              <div className="hero-chat-header-status" />
            </div>

            {/* Chat Body */}
            <div className="hero-chat-body">
              <div className="hero-bubble hero-bubble-user">
                Pengen camping sambil lihat sunrise yang bagus, akses mudah 🏕️
              </div>

              <div className="hero-bubble hero-bubble-ai">
                ✨ Siap! Berikut destinasi camping dengan sunrise terbaik di Jawa Barat
                yang cocok buat kamu:
              </div>

              {PREVIEW_DESTINATIONS.map((d, i) => (
                <div key={i} className="hero-dest-mini">
                  <img src={d.image} alt={d.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                  <div className="hero-dest-mini-info">
                    <strong>{d.name}</strong>
                    <span>
                      <MapPin size={10} style={{ display: "inline" }} /> {d.address}
                    </span>
                  </div>
                  <span className="hero-dest-mini-rating">
                    <Star size={10} style={{ display: "inline", fill: "white" }} /> {d.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating badge */}
          <div style={{
            position: "absolute",
            bottom: -16,
            right: -16,
            background: "white",
            borderRadius: "var(--radius-lg)",
            padding: "12px 16px",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--blue-100)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.82rem",
            fontWeight: 600,
            color: "var(--slate-700)",
          }}>
            <span style={{ fontSize: "1.2rem" }}>🧠</span>
            IndoBERT + TF-IDF
          </div>
        </div>
      </div>
    </section>
  );
}
