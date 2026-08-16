import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import LargeTextInput from "../../components/largeTextInput/LargeTextInput";
import SubmitButton from "../../components/submitButton/SubmitButton";
import { chatApiService } from "../../api/chat/ChatWindowService";
import { useTranslation } from "react-i18next";

type Message = {
    id: string;
    sender: "user" | "ASSISTANT";
    text: string;
};

interface ChatBotWindowProps {
    initialConversationId?: number | null;
    onConversationCreated?: (newId: number) => void;
}

const ChatBotWindow: React.FC<ChatBotWindowProps> = ({ 
    initialConversationId = null,
    onConversationCreated 
}) => {
    const [conversationId, setConversationId] = useState<number | null>(initialConversationId);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {t} = useTranslation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        setConversationId(initialConversationId);
    }, [initialConversationId]);

    // Load message history after selecting a conversation
    useEffect(() => {
        const loadHistory = async () => {
            if (!conversationId) {
                setMessages([
                    { id: "welcome", sender: "ASSISTANT", text: t("chatbot.firstMessage") }
                ]);
                return;
            }

            try {
                setIsLoading(true);
                const history = await chatApiService.getConversationMessages(conversationId);
                const formattedMessages: Message[] = history.map((msg) => ({
                    id: msg.id.toString(),
                    sender: msg.sender,
                    text: msg.text,
                }));
                setMessages(formattedMessages);
            } catch (error) {
                console.error("Failed to load chat history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadHistory();
    }, [conversationId]);

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const userText = inputText;
        setInputText("");
        setIsLoading(true);

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: "user",
            text: userText,
        };

        const botMessageId = (Date.now() + 1).toString();
        const initialBotMessage: Message = {
            id: botMessageId,
            sender: "ASSISTANT",
            text: "",
        };

        setMessages((prev) => [...prev, userMessage, initialBotMessage]);

        try {
            // Call stream API with both chunk receiver and primary error handler callback
            const newConvId = await chatApiService.streamChatMessage(
                conversationId,
                userText,
                (chunk) => {
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === botMessageId
                                ? { ...msg, text: msg.text + chunk }
                                : msg
                        )
                    );
                },
                (errorMessage) => {
                    // Scenario 1: Handled live via service error callback (connection drops / mid-stream failures)
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === botMessageId
                                ? { ...msg, text: errorMessage }
                                : msg
                        )
                    );
                }
            );

            if (!conversationId && newConvId) {
                setConversationId(newConvId);
                if (onConversationCreated) {
                    onConversationCreated(newConvId);
                }
            }
        } catch (error) {
            // Scenario 2: Double safety net for any unexpected unhandled errors outside the stream
            console.error("Error streaming response (UI fallback):", error);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === botMessageId
                        ? { ...msg, text: "The response could not be completed. Would you like to try again?" }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {/* Chat Header */}
                <div className="chat-drag-handle bg-blue-600 text-white p-4 font-semibold text-lg flex items-center justify-between cursor-move select-none">
                    <span>{t("chatbot.title")}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${isLoading ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`}></span>
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
                            className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                                msg.sender === "user"
                                    ? "bg-blue-600 text-white rounded-br-none whitespace-pre-wrap"
                                    : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none overflow-hidden"
                            }`}
                        >
                            {msg.sender === "ASSISTANT" ? (
                                <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown>
                                        {msg.text || (isLoading ? "..." : "")}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                msg.text
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Zone */}
            <div className="p-3 bg-white border-t border-gray-200 flex flex-col gap-2" onKeyDown={handleKeyDown}>
                <LargeTextInput
                    value={inputText}
                    onChange={setInputText}
                    placeholder={t("chatbot.placeholder")}
                    className="!p-2.5 text-sm rounded-lg"
                />
                <div className="flex justify-end">
                    <SubmitButton onClick={handleSend} disabled={!inputText.trim() || isLoading}>
                        {t("chatbot.sendButton")}
                    </SubmitButton>
                </div>
            </div>
        </div>
    );
};

export default ChatBotWindow;