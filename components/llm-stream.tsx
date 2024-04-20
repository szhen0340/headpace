import { StreamingTextURL } from "nextjs-openai";

export default function ChatBox() {
  return (
    <StreamingTextURL
      url="/api/llm"
      fade={600}
      throttle={100}
      data={{ prompt: "I need to schedule an event that lasts 30 minutes." }}
    />
  );
}
