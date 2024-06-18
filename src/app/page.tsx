"use client"

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

  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const supabase = useMemo(() => {
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
  }, [messages]);

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowSize.height && formRef.current) {
      const formHeight = formRef.current.offsetHeight;
      console.log(formHeight, windowSize.height)
      if (msgRef.current) {
        msgRef.current.style.height = `${windowSize.height - formHeight - 26}px`;
      }
    }
  }, [windowSize, formRef, msgRef]);

  return (
    <div className="h-full">
      <div ref={msgRef} className="h-full w-full sm:w-[728px] mx-auto flex flex-col justify-between pt-4 pb-2 px-1 space-y-2">
        <ScrollArea className="h-full">
          <div className="flex flex-col w-full space-y-2 h-full">
            {messages.map((msg, i) => (
              <div key={i} className={`${msg.role === "user" ? "self-end bg-gray-300/50 rounded-3xl px-3 py-2 max-w-lg" : "self-start"}`}>
                {msg.role === "assistant" && <span className="font-semibold text-lg">Memski: </span>}
                <span>{msg.content}</span>
              </div>
            ))}
            {messages.length === 0 && <div className="h-full text-4xl font-bold m-auto">Say Hello to Memski!</div>}
          </div>
          <div ref={scrollRef} className="hidden" />
        </ScrollArea>
        <form ref={formRef} className="w-full sm:w-[728px] fixed bottom-2 flex flex-row space-x-2" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
          <Input placeholder="Say something" value={query} onChange={({ target: { value }}) => setQuery(value) } />
          <Button type="submit" disabled={loading}>Send</Button>
        </form>
      </div>
    </div>
  );
}
