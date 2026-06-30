import React, { useCallback, useEffect, useState } from "react";
import LargeTextInput from "../components/largeTextInput/LargeTextInput";
import debounce from "lodash.debounce";
import TranslationService from "../api/translation/TranslationService";
import Select from "../components/select/Select";
import Button from "../components/submitButton/SubmitButton";
import ParaphraseService from "../api/paraphrase/ParaphraseService";
import TranslatorParaphraserPanel from "./Translate_and_paraphrase/translator_paraphrase";
const Home: React.FC = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [srcLang, setSrcLang] = useState("en");
  const [dscLang, setDscLang] = useState("de");
  const [paraphraseText, setParaphraseText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const languages = [
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
      setTranslatedText(res.translated_text || "");
    } catch (err) {
      console.log(err);
      setTranslatedText("");
    }
  };

  useEffect(() => {
    if (!text.trim() || !srcLang || !dscLang) return;
    const handler = setTimeout(() => {
      translate(text, srcLang, dscLang);
    }, 700);

    return () => clearTimeout(handler);
  }, [text, srcLang, dscLang]);

  const handleChange = (value: string) => {
    setText(value);
  };
  const handleSrcLang = (value: string) => {
    setSrcLang(value);
  };
  const handleDescLang = (value: string) => {
    setDscLang(value);
  };
  const handleParaphrase = async (textInput:string, lang:string, number_of_sequencies: number) => {
    if (!textInput.trim() || !lang || !number_of_sequencies) return;
    try {
      const res = await ParaphraseService.sendTextToParaphrase(textInput, lang, number_of_sequencies)
      setParaphraseText(res.output_texts.join("\n"));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <header className={`bg-white shadow-md py-4 px-8 flex justify-between items-center`}> 
        <h1 className={`text-blue-600 text-2xl font-extrabold`}>LinguoAI</h1>
      </header>
      <main className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
       <TranslatorParaphraserPanel/>
      </main>
      {/*Footer */}
      <footer className="text-center py-6 text-gray-500 border-t mt-10">
        © 2025 LinguoAI – AI tool
      </footer>
      <button>Test</button>
    </div>
    </>
  );
};

export default Home;
