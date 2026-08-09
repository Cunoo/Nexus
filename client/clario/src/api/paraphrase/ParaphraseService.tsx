import { api } from "../api"; // Upravte cestu k vášmu 'api' súboru podľa potreby

export interface ParaphraseRequest {
    text: string;
    tone?: string;
  language?: string;
}

export interface ParaphraseResponse {
    originalText: string;
    paraphrasedText: string;
    tone: string;
    language: string;
}

class ParaphraseService {
    async sendTextToParaphrase(
        text: string, 
        tone: string = "standard", 
        language: string = "auto"
    ): Promise<ParaphraseResponse> {
    try {
        const payload: ParaphraseRequest = {
            text,
            tone,
            language,
        };

      // Použitie vlastnej 'api' inštancie namiesto priameho axios
        const response = await api.post<ParaphraseResponse>("/user/api/paraphrase", payload);
        
        return response.data;
        } catch (error) {
        console.error("Paraphrase error:", error);
        throw error;
        }
    }
}

export default new ParaphraseService();