import { addEmail } from "@/db";

export const POST = async (req: Request) => {
    const { email } = await req.json();

    const result = await addEmail(email);

    if (result.success) {
        return new Response("Succes")
    } else {
        return new Response(result.error!, { status: 500 })
    }
}