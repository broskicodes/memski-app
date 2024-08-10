"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NdJsonStream, OutputType, StreamToIterable } from "../utils/stream";
import posthog from "posthog-js";
import ReactMarkdown from 'react-markdown'
import { Label } from "./ui/label";

interface Message {
  role: "user" | "assistant",
  content: string
}

export function Chat() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  // const [stage, setStage] = useState("");

  const [username, setUsername] = useState("");
  const [tempUn, setTempUn] = useState("");

  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // const msgRef = useRef<HTMLDivElement>(null);
  // const formRef = useRef<HTMLFormElement>(null);

  const supabase = useMemo(() => {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }, []);

  const parseConversation = useCallback(async () => {
    const formData = new FormData();

    if (file) {
      formData.append("file", file);
      const res = await fetch(
        `/api/parse-conversation`,
        {
          method: "POST",
          body: formData
        }
      );

      const messages = await res.json();
      setConversations(messages);
    }
  }, [file]);

  const getMemories = useCallback(async () => {
    setLoading(true);
  
    const res = await fetch(
      `/api/wordware/memories`,
      {
        method: "POST",
        body: JSON.stringify({ conversations, user_id: username })
      }
    );

    if (res.status !== 200) {
      // setError("Something went wrong, please try again");
      return;
    }

    const response = await res.text();
    console.log(response);

    setLoading(false);
  }, [conversations]);

  const sendMessage = useCallback(async () => {
    setLoading(true);
    posthog.capture("message_sent");

    const newQuery = query;
    setQuery("");

    const oldMessages = messages;
    setMessages([...oldMessages, { role: "user", content: newQuery }])

    const res = await fetch(
      `/api/wordware/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: username,
          query: query,
          messages: JSON.stringify(oldMessages),
        })
      }
    );

    if (res.status !== 200) {
      // setError("Something went wrong, please try again");
      return;
    }

    const stream = NdJsonStream.decode(res.body!);

    let response: string = "";
    let lastGeneration: string = "";

    for await (const chunk of StreamToIterable(stream)) {
      if (chunk.type === "chunk") {
        const value = chunk.value as OutputType;

        if (value.type === "generation") {
          if (value.state === "start") {
            console.log("\nNEW GENERATION -", value.label);
            lastGeneration = value.label;
          } else {
            console.log("\nEND GENERATION -", value.label);
          }
        } else if (value.type === "chunk") {
          if (lastGeneration === "response") {
            response += value.value;
            setMessages([
              ...oldMessages, 
              { role: "user", content: newQuery },
              { role: "assistant", content: response }
            ]);
          }
        } else if (value.type === "outputs") {
          // response = value.values.response;
          // console.log(value.values.response);
        }
      }
    }

    // const response = await res.text();

    setLoading(false);
  }, [supabase, query, messages]);

  const confirmUsername = useCallback(() => {
    posthog.identify(tempUn, {
      id: tempUn,
      username: tempUn,
    });

    setUsername(tempUn);
    localStorage.setItem("username", tempUn);
  }, [tempUn])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    // const container = scrollRef.current;
    // if (container) {
    //   container.scrollTop = container.scrollHeight;
    // }
  }, [messages, scrollRef]);

  useEffect(() => {
    if (conversations.length > 0) {
      console.log("getting memories");
      getMemories();
    }
  }, [conversations]);

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
    const un = localStorage.getItem("username");

    setUsername(un ?? "");
    setLoading(false);

    if (un) {
      posthog.identify(un, {
        id: un,
        username: un,
      });
    }
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      if (!loading && (username === "" || !file)) {
        triggerRef.current?.click();
      }
    };

    const inputElement = inputRef.current;
    if (!inputElement) return;

    inputElement.addEventListener('focus', handleFocus);

    // Clean up the event listener on component unmount
    return () => {
      inputElement.removeEventListener('focus', handleFocus);
    };
  }, [loading, username, triggerRef, inputRef]);

  return (
    <div className="h-full grid grid-rows-12 py-2">
      <Dialog>
        <DialogTrigger ref={triggerRef} className="hidden" />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Memski Demo</DialogTitle>
            <DialogDescription>{"See how Memski saves details and uses them to enhance prompts."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); confirmUsername() }} className="flex flex-col space-y-2">
            <Label>Enter a unique user name</Label>
            <div className="flex flex-col space-y-2">
              <Input placeholder="Username" value={tempUn} onChange={({ target: { value }}) => setTempUn(value)} />
              <Label>Upload a conversation file</Label>
              <Input type="file" accept="application/json" onChange={({ target: { files }}) => {
                if (files && files.length > 0) {
                  const file = files[0];
                  setFile(file);
                }
              }} />
              <DialogClose className="w-full">
                <Button type="submit" className="w-full" onClick={() => { if (username !== "") parseConversation(); }}>Confirm</Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <div className="h-full row-span-11  w-full pb-2">
        <ScrollArea className="h-full w-full sm:w-[728px] sm:mx-auto px-2">
          <div className="flex flex-col w-full space-y-3 h-full text-left" >
            {messages.length === 0 && <div className="h-full text-2xl sm:text-4xl font-bold mx-auto mt-4">Test its memory!</div>}
            {messages.map((msg, i) => (
              <div key={i} className={`${msg.role === "user" ? "self-end bg-gray-300/50 rounded-3xl px-3 py-2 max-w-xs sm:max-w-md" : "self-start"}`}>
                {msg.role === "assistant" && (
                  <ReactMarkdown>
                    {`__Memski:__ ${msg.content}`}
                  </ReactMarkdown>
                )}
                {msg.role === "user" && <span>{msg.content}</span>}
              </div>
            ))}
            <div ref={scrollRef} className="hidden" />
          </div>
        </ScrollArea>
      </div>
      <div className="w-full">
        <form className="w-full sm:w-[728px] mx-auto flex flex-row space-x-2 px-2" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
          <Input ref={inputRef} placeholder="Say something" value={query} onChange={({ target: { value }}) => setQuery(value) } />
          <Button type="submit" disabled={loading}>Send</Button>
        </form>
      </div>
    </div>
  );
}
