"use client"

import { Textarea } from "@/components/ui/textarea";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant",
  content: string
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  const supabase = useMemo(() => {
    // console.log(Cookie.)
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }, []);


  const sendMessage = useCallback(async () => {
    setLoading(true);

    const newQuery = query;
    setQuery("");

    const oldMessages = messages;
    setMessages([...oldMessages, { role: "user", content: newQuery }])

    const res = await fetch(
      `/api/wordware`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: query,
          messages: JSON.stringify(oldMessages)
        })
      }
    );

    const response = await res.text();

    setMessages([
      ...oldMessages, 
      { role: "user", content: newQuery },
      { role: "assistant", content: response }
    ]);
    setLoading(false);
  }, [supabase, query, messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages])

  return (
    <div>
      <div className="h-screen w-full sm:w-[728px] mx-auto flex flex-col justify-between py-4 space-y-2">
        <ScrollArea className="h-full">
          <div className="flex flex-col w-full space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`${msg.role === "user" ? "self-end bg-gray-300/50 rounded-3xl px-3 py-2 max-w-lg" : "self-start"}`}>
                {msg.role === "assistant" && <span className="font-semibold text-lg">memski: </span>}
                <span>{msg.content}</span>
              </div>
            ))}
          </div>
          <div ref={scrollRef} className="hidden" />
        </ScrollArea>
        <form className="flex flex-row space-x-2" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
          <Input value={query} onChange={({ target: { value }}) => setQuery(value) } />
          <Button type="submit" disabled={loading}>Send</Button>
        </form>
      </div>
    </div>
  );
}
