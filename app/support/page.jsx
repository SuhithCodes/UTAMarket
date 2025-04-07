"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  User,
  HeadphonesIcon,
  Clock,
  MessageSquare,
  Phone,
  Mail,
} from "lucide-react";

// Mock chat messages for demonstration
const initialMessages = [
  {
    id: 1,
    type: "system",
    content: "Welcome to UTA Market Support! How can we help you today?",
    timestamp: "10:00 AM",
  },
  {
    id: 2,
    type: "agent",
    name: "Sarah",
    content:
      "Hi there! I'm Sarah, your support agent. I'll be happy to assist you with any questions about our products or services.",
    timestamp: "10:01 AM",
  },
];

export default function SupportPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentMessage = {
        id: messages.length + 2,
        type: "agent",
        name: "Sarah",
        content:
          "Thank you for your message. I'm checking on that for you now.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, agentMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-[#0064B1] text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-4">Live Support</h1>
            <p className="text-lg opacity-90">
              Chat with our support team in real-time
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0064B1] p-2 rounded-full">
                      <HeadphonesIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold">UTA Market Support</h2>
                      <p className="text-sm text-zinc-600">
                        Typically replies in a few minutes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <ScrollArea className="h-[500px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.type === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex gap-3 max-w-[80%] ${
                            message.type === "user" ? "flex-row-reverse" : ""
                          }`}
                        >
                          {message.type === "agent" && (
                            <div className="flex-shrink-0 w-8 h-8 bg-[#0064B1] rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          )}
                          <div>
                            {message.type === "agent" && (
                              <p className="text-sm text-zinc-600 mb-1">
                                {message.name}
                              </p>
                            )}
                            <div
                              className={`rounded-lg p-3 ${
                                message.type === "user"
                                  ? "bg-[#0064B1] text-white"
                                  : message.type === "system"
                                  ? "bg-gray-100 text-zinc-600"
                                  : "bg-gray-100"
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className="text-xs mt-1 opacity-70">
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex items-center gap-2 text-zinc-600">
                        <div className="w-8 h-8 bg-[#0064B1] rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="bg-gray-100 rounded-lg px-4 py-2">
                          Sarah is typing...
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-grow"
                    />
                    <Button type="submit" className="bg-[#0064B1]">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="space-y-6">
              {/* Operating Hours */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-5 w-5 text-[#0064B1]" />
                  <h2 className="font-semibold">Operating Hours</h2>
                </div>
                <div className="space-y-2 text-zinc-600">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                  <p className="text-sm mt-4">
                    All times are in Central Time (CT)
                  </p>
                </div>
              </div>

              {/* Alternative Contact */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="h-5 w-5 text-[#0064B1]" />
                  <h2 className="font-semibold">Other Ways to Reach Us</h2>
                </div>
                <div className="space-y-4">
                  <a
                    href="tel:+18175550123"
                    className="flex items-center gap-3 text-zinc-600 hover:text-[#0064B1]"
                  >
                    <Phone className="h-5 w-5" />
                    <span>(817) 555-0123</span>
                  </a>
                  <a
                    href="mailto:support@utamarket.com"
                    className="flex items-center gap-3 text-zinc-600 hover:text-[#0064B1]"
                  >
                    <Mail className="h-5 w-5" />
                    <span>support@utamarket.com</span>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-semibold mb-4">Quick Links</h2>
                <div className="space-y-2">
                  <a
                    href="/faq"
                    className="block text-zinc-600 hover:text-[#0064B1]"
                  >
                    Frequently Asked Questions
                  </a>
                  <a
                    href="/orders"
                    className="block text-zinc-600 hover:text-[#0064B1]"
                  >
                    Track Your Order
                  </a>
                  <a
                    href="/returns"
                    className="block text-zinc-600 hover:text-[#0064B1]"
                  >
                    Returns & Exchanges
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
