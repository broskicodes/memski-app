"use client"

import { Textarea } from "@/components/ui/textarea";
import { useCallback, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant",
  content: string
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");

  const supabase = useMemo(() => {
    // console.log(Cookie.)
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }, []);


  const sendMessage = useCallback(async () => {
    const res = await fetch(
      // `https://corsproxy.io/?${encodeURIComponent(`https://app.wordware.ai/api/prompt/${process.env.NEXT_PUBLIC_WORDWARE_PROMPT_ID}`)}`, 
      `https://app.wordware.ai/api/prompt/${process.env.NEXT_PUBLIC_WORDWARE_PROMPT_ID}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_WORDWARE_API_KEY!}`,
        },
        body: JSON.stringify({
          inputs: {
            query: query,
            messages: messages
          }
        })
      }
    );

    setMessages((prev) => (
      [
        ...prev, 
        { role: "user", content: query }]
    ));
    setQuery("");
  }, [supabase, query, messages]);

  return (
    <div>
      <div>
        <div>
          {messages.map((msg, i) => (
            <div key={i}>
              <span>{msg.role}: </span>
              <span>{msg.content}</span>
            </div>
          ))}
        </div>
        <div>
          <Textarea value={query} onChange={({ target: { value }}) => setQuery(value) } />
            <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}
