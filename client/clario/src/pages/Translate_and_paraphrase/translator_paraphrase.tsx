import React, { useCallback, useEffect, useState } from "react";
import LargeTextInput from "../../components/largeTextInput/LargeTextInput";
import Select from "../../components/select/Select";
import Button from "../../components/submitButton/SubmitButton";

// src/components/Translate_and_paraphrase/translator_paraphrase.tsx
interface TranslatorParaphraserPanelProps {
  text: string;
  setText: (value: string) => void;
  translatedText: string;
  srcLang: string;
  setSrcLang: (value: string) => void;
  dscLang: string;
  setDscLang: (value: string) => void;
  paraphraseText: string;
  languages: { value: string; label: string }[];
  onParaphrase: (textInput: string, lang: string, num: number) => Promise<void>;
}

// 2. Použijeme props v komponente
const TranslatorParaphraserPanel: React.FC<TranslatorParaphraserPanelProps> = ({
  text,
  setText,
  translatedText,
  srcLang,
  setSrcLang,
  dscLang,
  setDscLang,
  paraphraseText,
  languages,
  onParaphrase
}) => {

  return (
    <div className="space-y-6 w-full col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ĽAVÁ STRANA - Zadávanie textu a preklad */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex gap-4">
          <Select 
            value={srcLang} 
            onChange={setSrcLang} 
            options={languages} 
            label="From"
          />
          <Select 
            value={dscLang} 
            onChange={setDscLang} 
            options={languages} 
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

      {/* PRAVÁ STRANA - Parafrázovanie */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4">Paraphraser</h2>
          <div className="p-4 bg-gray-50 rounded border min-h-[150px] whitespace-pre-wrap">
            {paraphraseText || "Your paraphrased text will appear here..."}
          </div>
        </div>

        {/* Tlačidlo na spustenie parafrázovania s pevným počtom sekvencií (napr. 3) */}
        <Button 
          type="button" 
          onClick={() => onParaphrase(text, srcLang, 3)}
        >
          Paraphrase Text
        </Button>
      </div>
    </div>
  );
};

export default TranslatorParaphraserPanel;