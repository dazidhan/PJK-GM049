"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Trash2, Bot, User, MapPin, Star, ExternalLink, Sparkles, BarChart3 } from "lucide-react";
import { fetchRecommendations, DestinationItem } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  destinations?: DestinationItem[];
  timestamp: Date;
}

const QUICK_SUGGESTIONS = [
  "🏔️ Tempat camping dengan pemandangan gunung di Jawa Barat",
  "🏖️ Pantai eksotis yang masih sepi dan asri",
  "🌿 Wisata alam keluarga yang sejuk dekat Bandung",
  "🚵 Aktivitas seru rafting dan hiking untuk pemula",
  "🍜 Kuliner dan restoran tradisional Sunda autentik",
  "🌊 Surfing dan olahraga air di pesisir Selatan",
  "🌸 Taman bunga dan kebun teh yang instagramable",
  "🏯 Wisata budaya dan sejarah bersejarah di Jabar",
];

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "ai",
  content: `Halo! 👋 Saya **Jabarulin**, asisten wisata cerdas untuk Jawa Barat.\n\nCeritakan keinginan wisatamu dan saya akan merekomendasikan destinasi terbaik yang sesuai preferensimu — lengkap dengan rating, alamat, dan link Google Maps! 🗺️\n\nContoh: *"tempat camping dengan sunrise indah dan akses mudah"*`,
  timestamp: new Date(),
};

interface ChatBotProps {
  initialQuery?: string;
}

export default function ChatBot({ initialQuery }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastProcessedQuery = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle initial query from Hero search or Category click
  useEffect(() => {
    if (initialQuery && initialQuery !== lastProcessedQuery.current) {
      lastProcessedQuery.current = initialQuery;
      // Strip the __key suffix if present (used to force re-trigger)
      const cleanQuery = initialQuery.replace(/__key\d+$/, "");
      sendMessage(cleanQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const sendMessage = async (text?: string) => {
    const query = (text ?? input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const data = await fetchRecommendations(query, 5);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.reply,
        destinations: data.raw_data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content:
          "⚠️ Maaf, terjadi gangguan koneksi ke server. Pastikan backend berjalan di port 5000 dan coba lagi.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    lastProcessedQuery.current = null;
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const renderContent = (text: string) => {
    // Simple markdown-like rendering for bold
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <section id="chatbot" className="chatbot-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <Bot size={13} /> AI Assistant
          </div>
          <h2 className="section-title">
            Chat dengan{" "}
            <span className="gradient-text">Jabarulin AI</span>
          </h2>
          <p className="section-subtitle">
            Gunakan bahasa natural untuk mencari destinasi wisata impianmu di Jawa Barat
          </p>
        </div>

        <div className="chat-window">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-avatar">🤖</div>
            <div className="chat-header-info">
              <h3>Jabarulin AI</h3>
              <p>Asisten Wisata Cerdas Jawa Barat</p>
            </div>
            <div className="chat-status">
              <span className="chat-status-dot" />
              Online
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages" id="chat-messages-container">
            {messages.length === 1 && !loading && (
              <div className="chat-empty">
                <div className="chat-empty-icon">🗺️</div>
                <h3>Apa destinasi impianmu?</h3>
                <p>Mulai dengan klik salah satu saran di bawah atau tulis sendiri</p>
                <div className="quick-suggestions">
                  {QUICK_SUGGESTIONS.slice(0, 6).map((s) => (
                    <button
                      key={s}
                      className="quick-chip"
                      id={`quick-chip-${s.slice(0, 10).replace(/\s/g, "-")}`}
                      onClick={() => sendMessage(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(messages.length > 1 || loading) && messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-group ${msg.role === "user" ? "user" : ""}`}
              >
                <div className={`message-avatar ${msg.role === "ai" ? "ai-avatar" : "user-avatar"}`}>
                  {msg.role === "ai" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="message-content">
                  <div className={`message-bubble ${msg.role}`}>
                    {renderContent(msg.content)}
                  </div>

                  {/* Destination Cards */}
                  {msg.destinations && msg.destinations.length > 0 && (
                    <div className="chat-destinations">
                      {msg.destinations.map((dest, i) => (
                        <DestinationCard key={i} dest={dest} />
                      ))}
                    </div>
                  )}

                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="typing-indicator">
                <div className="message-avatar ai-avatar">
                  <Bot size={16} />
                </div>
                <div className="typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <div className="chat-input-row">
              <div className="chat-input-wrapper">
                <textarea
                  ref={inputRef}
                  id="chat-text-input"
                  className="chat-input"
                  rows={1}
                  placeholder="Ceritakan wisata impianmu... (Enter untuk kirim)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
              </div>
              <button
                id="chat-send-btn"
                className="chat-send-btn"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                aria-label="Kirim pesan"
              >
                {loading ? (
                  <div className="spinner" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            <div className="chat-input-footer">
              <span className="chat-input-hint">
                <Sparkles size={11} style={{ display: "inline", marginRight: 3 }} />
                AI memahami bahasa Indonesia natural
              </span>
              <button className="chat-clear-btn" onClick={clearChat} id="chat-clear-btn">
                <Trash2 size={12} /> Bersihkan Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Inline Destination Card ─── */
function DestinationCard({ dest }: { dest: DestinationItem }) {
  const stars = dest.rating ? Math.round(dest.rating) : 0;

  return (
    <div className="chat-dest-card">
      <div className="chat-dest-header">
        <span className="chat-dest-name">{dest.name}</span>
        {dest.rating && (
          <span className="chat-dest-rating">
            <Star size={10} fill="white" /> {dest.rating.toFixed(1)}
          </span>
        )}
      </div>

      <span className="chat-dest-category">{dest.category}</span>

      {dest.address && (
        <div className="chat-dest-address">
          <MapPin size={11} style={{ flexShrink: 0, marginTop: 2, color: "var(--blue-400)" }} />
          {dest.address}
        </div>
      )}

      {dest.total_reviews != null && (
        <div className="chat-dest-reviews">
          {stars > 0 && "★".repeat(stars)}{" "}
          {dest.total_reviews.toLocaleString("id-ID")} ulasan
        </div>
      )}

      <div className="chat-dest-actions">
        {dest.google_maps_url ? (
          <a
            href={dest.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="chat-dest-maps-btn"
            id={`maps-btn-${dest.name.replace(/\s/g, "-")}`}
          >
            <MapPin size={12} /> Google Maps
            <ExternalLink size={10} />
          </a>
        ) : dest.website ? (
          <a
            href={dest.website}
            target="_blank"
            rel="noopener noreferrer"
            className="chat-dest-maps-btn"
          >
            <ExternalLink size={12} /> Website
          </a>
        ) : (
          <span className="chat-dest-maps-btn" style={{ opacity: 0.5, cursor: "default" }}>
            <MapPin size={12} /> Tidak ada link
          </span>
        )}

        <span className="chat-dest-score">
          <BarChart3 size={11} />
          {(dest.final_score * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}
