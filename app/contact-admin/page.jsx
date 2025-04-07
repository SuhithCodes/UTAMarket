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
  ShieldCheck,
  Clock,
  MessageSquare,
  Phone,
  Mail,
  Search,
  Circle,
} from "lucide-react";

// Mock user conversations for demonstration
const mockUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@mavs.uta.edu",
    lastMessage: "I need help with my order #1234",
    timestamp: "10:30 AM",
    unread: true,
    status: "active",
  },
  {
    id: 2,
    name: "Emily Johnson",
    email: "emily.j@mavs.uta.edu",
    lastMessage: "When will my refund be processed?",
    timestamp: "9:45 AM",
    unread: false,
    status: "active",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "m.brown@mavs.uta.edu",
    lastMessage: "Thanks for your help!",
    timestamp: "Yesterday",
    unread: false,
    status: "resolved",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "s.wilson@mavs.uta.edu",
    lastMessage: "I have a question about shipping",
    timestamp: "Yesterday",
    unread: true,
    status: "pending",
  },
];

// Initial messages for the selected chat
const initialMessages = [
  {
    id: 1,
    type: "system",
    content: "Chat started with admin support.",
    timestamp: "10:00 AM",
  },
];

export default function ContactAdminPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    // In a real app, we would fetch the chat history for this user
    setMessages(initialMessages);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const userMessage = {
      id: messages.length + 1,
      type: "admin",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, userMessage]);
    setNewMessage("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "resolved":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-[#0064B1] text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-4">Admin Support Dashboard</h1>
            <p className="text-lg opacity-90">
              Manage and respond to user inquiries
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 h-[700px]">
              {/* Users Sidebar */}
              <div className="col-span-4 border-r">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search users..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <ScrollArea className="h-[calc(700px-73px)]">
                  <div className="space-y-1">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${
                          selectedUser?.id === user.id ? "bg-gray-50" : ""
                        }`}
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#0064B1] rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold truncate">
                                {user.name}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {user.timestamp}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {user.email}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-sm text-gray-500 truncate">
                                {user.lastMessage}
                              </p>
                              <div className="flex items-center">
                                <Circle
                                  className={`h-2 w-2 ${getStatusColor(
                                    user.status
                                  )}`}
                                  fill="currentColor"
                                />
                                {user.unread && (
                                  <div className="ml-2 bg-[#0064B1] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    1
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Chat Area */}
              <div className="col-span-8">
                {selectedUser ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0064B1] rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h2 className="font-semibold">{selectedUser.name}</h2>
                          <p className="text-sm text-zinc-600">
                            {selectedUser.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <ScrollArea className="h-[calc(700px-170px)] p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.type === "user"
                                ? "justify-start"
                                : "justify-end"
                            }`}
                          >
                            <div
                              className={`flex gap-3 max-w-[80%] ${
                                message.type === "user"
                                  ? ""
                                  : "flex-row-reverse"
                              }`}
                            >
                              {message.type === "user" && (
                                <div className="flex-shrink-0 w-8 h-8 bg-[#0064B1] rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-white" />
                                </div>
                              )}
                              <div
                                className={`rounded-lg p-3 ${
                                  message.type === "admin"
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
                        ))}
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
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                      <p>Select a conversation to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
