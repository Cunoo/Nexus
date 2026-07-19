import React, { useCallback, useEffect, useState } from "react";
import LargeTextInput from "../../components/largeTextInput/LargeTextInput";
import Select from "../../components/select/Select";
import Button from "../../components/submitButton/SubmitButton";
import TranslationService from "../../api/translation/TranslationService";

// src/components/Translate_and_paraphrase/translator_paraphrase.tsx
interface TranslatorProps {
  text: string;
  setText: (value: string) => void;
  translatedText: string;
  srcLang: string;
  setSrcLang: (value: string) => void;
  dscLang: string;
  setDscLang: (value: string) => void;
  paraphraseText: string;
}

const Translator: React.FC<TranslatorProps> = ({
  text,
  setText,
  translatedText,
  srcLang,
  setSrcLang,
  dscLang,
  setDscLang,
}) => {  
    // const [text, setText] = useState("");
    // const [translatedText, setTranslatedText] = useState("");
    // const [srcLang, setSrcLang] = useState("en");
    // const [dscLang, setDscLang] = useState("de");
    
    const LANGUAGES_LIST = [
        { value: "en", label: "English" },
        { value: "sk", label: "Slovak" },
        { value: "cs", label: "Czech" },
        { value: "fr", label: "French" },
        { value: "de", label: "German" },
    ];
    const translate = async (value: string, src: string, dst: string) => {
        if (!value.trim() || !src || !dst) return;
        try {
          const res = await TranslationService.sendText(value, src, dst);
          //setTranslatedText(res.translated_text || "");
        } catch (err) {
          console.log(err);
          //setTranslatedText("");
        }
      };
      const handleChange = (value: string) => {
        setText(value);
      };
      const handleSrcLang = (value: string) => {
        setSrcLang(value);
      };
      const handleDescLang = (value: string) => {
        setDscLang(value);
      };
    
      useEffect(() => {
        if (!text.trim() || !srcLang || !dscLang) return;
        const handler = setTimeout(() => {
          translate(text, srcLang, dscLang);
        }, 700);
    
        return () => clearTimeout(handler);
      }, [text, srcLang, dscLang]);

  return (
    <div className="space-y-6 w-full col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex gap-4">
          <Select 
            value={srcLang} 
            onChange={setSrcLang} 
            options={LANGUAGES_LIST} 
            label="From"
          />
          <Select 
            value={dscLang} 
            onChange={setDscLang} 
            options={LANGUAGES_LIST} 
            label="To"
          />
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
    </div>
  );
};

export default Translator;