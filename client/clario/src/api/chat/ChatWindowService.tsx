import { api } from '../api';

export type Conversation = {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
};

export type ChatMessageDto = {
    id: number;
    sender: "user" | "ASSISTANT";
    text: string;
    createdAt: string;
};

class ChatApiService {
    // 1. Fetch all user conversations (for Sidebar)
    async getUserConversations(): Promise<Conversation[]> {
        const response = await api.get<Conversation[]>('/user/api/chat/conversations');
        return response.data;
    }

    // 2. Fetch message history for selected conversation
    async getConversationMessages(conversationId: number): Promise<ChatMessageDto[]> {
        const response = await api.get<ChatMessageDto[]>(`/user/api/chat/conversations/${conversationId}/messages`);
        return response.data;
    }

    // 3. SSE Streaming response via Fetch API with robust error handling and fallback support
    async streamChatMessage(
        conversationId: number | null,
        message: string,
        onChunk: (chunk: string) => void,
        onError?: (errorMessage: string) => void
    ): Promise<number | null> {
        const token = localStorage.getItem('token');
        const baseURL = api.defaults.baseURL || '';

        let response: Response;
        
        try {
            response = await fetch(`${baseURL}/user/api/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    conversationId: conversationId,
                    message: message
                })
            });
        } catch (networkError) {
            // Scenario A: Handle network failure during initial connection
            console.error("Network request failed:", networkError);
            if (onError) onError("Nepodarilo sa dokončiť odpoveď. Skúsiť znova?");
            throw networkError;
        }

        if (!response.ok) {
            if (response.status === 401) {
                console.warn("Token expired or invalid. Redirecting to login...");
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            const errorMsg = `HTTP error! status: ${response.status}`;
            if (onError) onError("Nepodarilo sa dokončiť odpoveď. Skúsiť znova?");
            throw new Error(errorMsg);
        }

        // Extract new conversationId from response header (if a new conversation was created)
        const newConvHeader = response.headers.get('X-Conversation-Id');
        const newConversationId = newConvHeader ? parseInt(newConvHeader, 10) : null;

        if (!response.body) return newConversationId;

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');

                // Set aside the incomplete row at the end for the next iteration
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('data:')) {
                        const jsonStr = trimmedLine.substring(5).trim();
                        if (jsonStr) {
                            try {
                                const parsed = JSON.parse(jsonStr);
                                if (parsed.content !== undefined && parsed.content !== null) {
                                    onChunk(parsed.content);
                                }
                            } catch (e) {
                                // Fallback in case a raw string is received instead of JSON
                                onChunk(jsonStr);
                            }
                        }
                    }
                }
            }

            // Handle any remaining data in the buffer after the stream ends
            if (buffer.trim().startsWith('data:')) {
                const jsonStr = buffer.trim().substring(5).trim();
                if (jsonStr) {
                    try {
                        const parsed = JSON.parse(jsonStr);
                        if (parsed.content !== undefined && parsed.content !== null) {
                            onChunk(parsed.content);
                        }
                    } catch (e) {
                        onChunk(jsonStr);
                    }
                }
            }
        } catch (streamError) {
            // Scenario B: Handle mid-stream read failures (e.g., interrupted internet connection)
            console.error("Error reading stream chunks:", streamError);
            if (onError) onError("The response could not be completed. Would you like to try again?");
            throw streamError;
        }

        return newConversationId;
    }
}

export const chatApiService = new ChatApiService();