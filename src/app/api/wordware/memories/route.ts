import { WORDWARE_MEMORIES_PROMPT_ID } from "@/utils/constants";

export const runtime = "edge";

export async function POST(req: Request) {
    const { conversations, user_id } = await req.json();

    const chatMessages = conversations.slice(0, 10).map((conversation: any) => conversation.messages).flat();

    const res = await fetch(
        `https://app.wordware.ai/api/prompt/${WORDWARE_MEMORIES_PROMPT_ID}/run`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.WORDWARE_API_KEY!}`,
          },
          body: JSON.stringify({
            inputs: {
              chat_messages: chatMessages,
              user_id: user_id
            }
          })
        }
      );

    return res;
}