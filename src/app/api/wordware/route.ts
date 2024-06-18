export const runtime = "edge";

export const POST = async (req: Request) => {
  const { query, messages } = await req.json();

  const res = await fetch(
    `https://app.wordware.ai/api/prompt/${process.env.NEXT_PUBLIC_WORDWARE_PROMPT_ID}/run`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.WORDWARE_API_KEY!}`,
      },
      body: JSON.stringify({
        inputs: {
          user_id: "braeden",
          query: query,
          messages: messages
        }
      })
    }
  );

  if (!res.body) {
    return new Response("Request failed", { status: 500 });
  }

  const reader = res.body.getReader();

  const decoder = new TextDecoder();
  let buffer: string[] = [];
  let response: string = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value);

      for (let i = 0, len = chunk.length; i < len; ++i) {
        const isChunkSeparator = chunk[i] === "\n";

        // Keep buffering unless we've hit the end of a data chunk
        if (!isChunkSeparator) {
          buffer.push(chunk[i]);
          continue;
        }

        const line = buffer.join("").trimEnd();

        // This is the chunk
        const content = JSON.parse(line);
        const value = content.value;

        // Here we print the streamed generations
        if (value.type === "generation") {
          if (value.state === "start") {
            console.log("\nNEW GENERATION -", value.label);
          } else {
            console.log("\nEND GENERATION -", value.label);
          }
        } else if (value.type === "chunk") {
          // console.log(value.value ?? "")
        } else if (value.type === "outputs") {
          response = value.values.response;
          console.log(value.values.response);
        }


        buffer = [];
      }
    }
  } finally {
    reader.releaseLock();
  }

  // console.log(await res.json())


  return new Response(response)
}