import React, { useEffect } from "react";
import LargeTextInput from "../../components/largeTextInput/LargeTextInput";
import Select from "../../components/select/Select";
import TranslationService from "../../api/translation/TranslationService";

interface TranslatorProps {
  text: string;
  setText: (value: string) => void;
  translatedText: string;
  setTranslatedText: (value: string) => void;
  sourceLang: string;
  setSourceLang: (value: string) => void;
  targetLang: string;
  setTargetLang: (value: string) => void;
  paraphraseText?: string;
}

const LANGUAGES_LIST = [
  { value: "en", label: "English" },
  { value: "sk", label: "Slovak" },
  { value: "cs", label: "Czech" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pl", label: "Polish" },
];

const Translator: React.FC<TranslatorProps> = ({
  text,
  setText,
  translatedText,
  setTranslatedText,
  sourceLang,
  setSourceLang,
  targetLang,
  setTargetLang,
}) => {  
  useEffect(() => {
    if (!text.trim() || !sourceLang || !targetLang) {
      setTranslatedText("");
      return;
    }

    const translate = async () => {
      try {
        const res = await TranslationService.sendText(text, sourceLang, targetLang);
        setTranslatedText(res.translatedText || "");
      } catch (err) {
        console.error("Translation failed:", err);
      }
    };

    const handler = setTimeout(() => {
      translate();
    }, 700);

    return () => clearTimeout(handler);
  }, [text, sourceLang, targetLang, setTranslatedText]);

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md space-y-4">
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="min-w-0">
          <Select 
            value={sourceLang} 
            onChange={setSourceLang} 
            options={LANGUAGES_LIST} 
            label="From"
          />
        </div>
        <div className="min-w-0">
          <Select 
            value={targetLang} 
            onChange={setTargetLang} 
            options={LANGUAGES_LIST} 
            label="To"
          />
        </div>
      </div>
      
      <LargeTextInput
        placeholder="Type here to translate..."
        value={text}
        onChange={setText}
      />
      
      <div className="mt-4 p-4 bg-gray-50 rounded border min-h-[100px]">
        <h3 className="font-bold text-sm text-gray-500 mb-1">Translation:</h3>
        <p>{translatedText || "Translation will appear here..."}</p>
      </div>
    </div>
  );
};

export default Translator;