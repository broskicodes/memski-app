// export const config = {
//   bodyParser: false
// };

function extractMessages(conversation: any) {
  const messages: { role: string, content: string }[] = [];

  const traverse = (nodeId: string) => {
    const node = conversation.mapping[nodeId];
    if (node.message) {
        messages.push({
            role: node.message.author.role,
            content: node.message.content.content_type === "text" 
                ? node.message.content.parts.join("\n")
                : "",
        });
    }
    node.parent && traverse(node.parent);
  };

  traverse(conversation.current_node);
  return {
    timestamp: conversation.update_time,
    messages: messages.filter((message: any) => message.content !== "").reverse()
  }
}

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const fileText = await file.text();

  const convos = JSON.parse(fileText);
//   console.log(JSON.stringify(convos[0], null, 2));

  const messages = convos.map((convo: any) => extractMessages(convo));
  const sortedMessages = messages.sort((a: any, b: any) => b.timestamp - a.timestamp);
//   console.log(extractMessages(convos[1]));


  return new Response(JSON.stringify(sortedMessages), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};  