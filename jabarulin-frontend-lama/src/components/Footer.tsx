"use client";
import { MapPin } from "lucide-react";

export default function Footer() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand */}
        <div>
          <div className="footer-brand-logo">
            <div className="footer-logo-icon">
              <MapPin size={16} color="white" />
            </div>
            <span className="footer-logo-text">JabarUlin AI</span>
          </div>
          <p className="footer-desc">
            Platform wisata cerdas berbasis Artificial Intelligence untuk membantu wisatawan
            menemukan destinasi terbaik di Jawa Barat.
          </p>
          <div className="footer-tech-badges">
            <span className="footer-badge">IndoBERT</span>
            <span className="footer-badge">Gemini 2.5</span>
            <span className="footer-badge">FastAPI</span>
            <span className="footer-badge">Next.js</span>
            <span className="footer-badge">TF-IDF</span>
          </div>
        </div>

        {/* Navigasi */}
        <div>
          <h4 className="footer-col-title">Navigasi</h4>
          <ul className="footer-links">
            <li><a href="#" onClick={() => scrollTo("hero")}>Beranda</a></li>
            <li><a href="#" onClick={() => scrollTo("chatbot")}>AI Chat</a></li>
            <li><a href="#" onClick={() => scrollTo("destinations")}>Destinasi Populer</a></li>
            <li><a href="#" onClick={() => scrollTo("categories")}>Kategori Wisata</a></li>
            <li><a href="#" onClick={() => scrollTo("features")}>Fitur Unggulan</a></li>
          </ul>
        </div>

        {/* Destinasi */}
        <div>
          <h4 className="footer-col-title">Destinasi</h4>
          <ul className="footer-links">
            <li><a href="#">Bandung & Sekitarnya</a></li>
            <li><a href="#">Pantai Selatan Jabar</a></li>
            <li><a href="#">Garut & Cianjur</a></li>
            <li><a href="#">Bogor & Puncak</a></li>
            <li><a href="#">Cirebon & Pesisir</a></li>
          </ul>
        </div>

        {/* Tentang */}
        <div>
          <h4 className="footer-col-title">Tentang</h4>
          <ul className="footer-links">
            <li><a href="#">Tentang JabarUlin</a></li>
            <li><a href="#">Teknologi AI</a></li>
            <li><a href="#">API Documentation</a></li>
            <li><a href="#">Kebijakan Privasi</a></li>
            <li><a href="#">Hubungi Kami</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>
          © 2025 JabarUlin AI. Dibuat untuk wisatawan Jawa Barat.
        </p>
      </div>
    </footer>
  );
}
