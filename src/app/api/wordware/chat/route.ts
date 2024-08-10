import { WORDWARE_CHAT_PROMPT_ID } from "@/utils/constants";

export const runtime = "edge";

export const POST = async (req: Request) => {
  const { query, messages, userId } = await req.json();

  const res = await fetch(
    `https://app.wordware.ai/api/prompt/${WORDWARE_CHAT_PROMPT_ID}/run`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.WORDWARE_API_KEY!}`,
      },
      body: JSON.stringify({
        inputs: {
          user_id: userId,
          prompt: query,
          convo: messages
        }
      })
    }
  );

  return res;
}