import type { Metadata } from "next";
import ChatScreen from "@/components/chat/chat-screen";

export const metadata: Metadata = {
  title: "Ask the assistant",
  description: "Ask questions about Aka Cornelius's projects, skills and experience.",
};

export default function AskPage() {
  return <ChatScreen />;
}
