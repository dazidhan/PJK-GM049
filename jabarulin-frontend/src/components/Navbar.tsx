"use client";
import { useState, useEffect } from "react";
import { MapPin, Sparkles } from "lucide-react";

interface NavbarProps {
  onChatClick: () => void;
}

export default function Navbar({ onChatClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => scrollToSection("hero")}>
          <div className="navbar-logo-icon">
            <MapPin size={18} />
          </div>
          <span className="navbar-logo-text">
            JabarUlin <span>AI</span>
          </span>
        </div>

        {/* Links */}
        <ul className="navbar-links">
          <li>
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection("hero"); }}>
              Beranda
            </a>
          </li>
          <li>
            <a href="#chatbot" onClick={(e) => { e.preventDefault(); scrollToSection("chatbot"); }}>
              AI Chat
            </a>
          </li>
          <li>
            <a href="#destinations" onClick={(e) => { e.preventDefault(); scrollToSection("destinations"); }}>
              Destinasi
            </a>
          </li>
          <li>
            <a href="#categories" onClick={(e) => { e.preventDefault(); scrollToSection("categories"); }}>
              Kategori
            </a>
          </li>
          <li>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}>
              Fitur
            </a>
          </li>
          <li>
            <button className="navbar-cta" id="nav-try-ai-btn" onClick={onChatClick}
              style={{ border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Sparkles size={14} /> Coba AI Sekarang
              </span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
