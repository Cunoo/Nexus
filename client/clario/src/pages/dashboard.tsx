import React, { useCallback, useEffect, useState } from "react";
import LargeTextInput from "../components/largeTextInput/LargeTextInput";
import debounce from "lodash.debounce";
import Select from "../components/select/Select";
import Button from "../components/submitButton/SubmitButton";
import ParaphraseService from "../api/paraphrase/ParaphraseService";
import Translator from "./Translator/Translator";
import ParaphraserPanel from "./paraphraser/Paraphraser";

const Dashboard: React.FC = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [srcLang, setSrcLang] = useState("en");
  const [dscLang, setDscLang] = useState("de");
  const [paraphraseText, setParaphraseText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

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
  <div className="bg-gray-50 text-gray-800 min-h-screen">
    <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center"> 
      <h1 className="text-blue-600 text-2xl font-extrabold">Nexus AI</h1>
      <Button>Home</Button>
      <Button>About</Button>
      <Button>Contact</Button>
      <Button> My Profile</Button>
    </header>
    
    <main className="max-w-7xl mx-auto py-12 px-6">
      <Translator
        text={text}
        setText={setText}
        translatedText={translatedText}
        srcLang={srcLang}
        setSrcLang={setSrcLang}
        dscLang={dscLang}
        setDscLang={setDscLang}
        paraphraseText={paraphraseText}
      />
      <br></br>
      <ParaphraserPanel
        text={text}
        setText={setText}
        paraphraseText={paraphraseText}
      />
    </main>

    <footer className="text-center py-6 text-gray-500 border-t mt-10">
      © 2026 Nexus – AI tool
    </footer>
  </div>
);
};

export default Dashboard;
