    import React, { useState, useRef, useEffect } from "react";
    import LargeTextInput from "../../components/largeTextInput/LargeTextInput"; // Uprav cestu k súboru podľa potreby
    import SubmitButton from "../../components/submitButton/SubmitButton";     // Uprav cestu k súboru podľa potreby

    type Message = {
        id: string;
        sender: "user" | "bot";
        text: string;
    };

    const ChatBotWindow: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", sender: "bot", text: "Hello! How can I help you today?" },
    ]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Automatic scrolling to the latest post
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        // Add a message from a user
        const userMessage: Message = {
            id: Date.now().toString(),
            sender: "user",
            text: inputText,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText("");

        // Simulate a bot's response
        setTimeout(() => {
        const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: "Thank you for your message! This is an automatic response.",
        };
        setMessages((prev) => [...prev, botMessage]);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Submit using Enter (Shift + Enter creates a new line)
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[500px] w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        {/* Chat Header */}
        <div className="bg-blue-600 text-white p-4 font-semibold text-lg flex items-center justify-between">
            <span>Chat Assistant</span>
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full"></span>
        </div>

        {/* Message List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg) => (
            <div
                key={msg.id}
                className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
            >
                <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none"
                }`}
                >
                {msg.text}
                </div>
            </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Zone with Your Components */}
        <div className="p-3 bg-white border-t border-gray-200 flex flex-col gap-2" onKeyDown={handleKeyDown}>
            <LargeTextInput
            value={inputText}
            onChange={setInputText}
            placeholder="Write a message..."
            className="!p-2.5 text-sm rounded-lg"
            />
            <div className="flex justify-end">
            <SubmitButton onClick={handleSend} disabled={!inputText.trim()}>
                Send
            </SubmitButton>
            </div>
        </div>
        </div>
    );
    };

    export default ChatBotWindow;