"use client";
import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ChatBot from "@/components/ChatBot";
import PopularDestinations from "@/components/PopularDestinations";
import CategoryFilter from "@/components/CategoryFilter";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  // Shared state: query yang dikirim dari Hero / Category ke ChatBot
  const [chatQuery, setChatQuery] = useState<string | undefined>(undefined);
  const queryKeyRef = useRef(0);

  const triggerChat = (query: string) => {
    // Increment key to force re-trigger even if same query
    queryKeyRef.current += 1;
    setChatQuery(`${query}__key${queryKeyRef.current}`);
    setTimeout(() => {
      document.getElementById("chatbot")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDestinationClick = (name: string) => {
    triggerChat(`Ceritakan tentang ${name} dan rekomendasikan tempat serupa di Jawa Barat`);
  };

  return (
    <div className="page-wrapper">
      <Navbar onChatClick={() => document.getElementById("chatbot")?.scrollIntoView({ behavior: "smooth" })} />

      <main>
        <HeroSection onSearch={triggerChat} />
        <ChatBot initialQuery={chatQuery} />
        <PopularDestinations onDestinationClick={handleDestinationClick} />
        <CategoryFilter onCategoryClick={triggerChat} />
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
}
