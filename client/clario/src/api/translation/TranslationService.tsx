import { api } from "../api"; // Adjust relative path to match where your custom axios instance is located

interface TranslationRequest {
  sourceLang: string;
  targetLang: string;
  text: string;
}

export interface TranslationResponse {
  id: number | null;
  sourceLang: string | null;
  targetLang: string;
  originalText: string | null;
  translatedText: string;
  cached: boolean;
  modelUsed: string | null;
  latencyMs: number | null;
  isFavorite: boolean;
  createdAt: string;
}

class TranslationService {
  async sendText(text: string, sourceLang: string, targetLang: string): Promise<TranslationResponse> {
    try {
      const payload: TranslationRequest = {
        sourceLang,
        targetLang,
        text,
      };

      // Uses custom `api` instance - automatically attaches JWT header from interceptor
      const response = await api.post<TranslationResponse>("/user/api/translation", payload);
      
      return response.data;
    } catch (error) {
      console.error("Translation error:", error);
      throw error;
    }
  }
}

export default new TranslationService();