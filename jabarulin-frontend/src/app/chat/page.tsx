"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ChatBot from "@/components/ChatBot";
import CategoryFilter from "@/components/CategoryFilter";

function ChatPageInner() {
  const searchParams = useSearchParams();
  // Baca query dari URL, misal: /chat?q=camping+sunrise&cat=Camping
  const initialQuery = searchParams.get("q") ?? undefined;
  const initialCategory = searchParams.get("cat") ?? undefined;

  return (
    <>
      <ChatBot initialQuery={initialQuery} initialCategory={initialCategory} />
      <CategoryFilter />
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center" }}>Memuat...</div>}>
      <ChatPageInner />
    </Suspense>
  );
}
