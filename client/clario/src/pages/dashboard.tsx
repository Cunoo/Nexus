import React, { useCallback, useEffect, useState } from "react";
import LargeTextInput from "../components/largeTextInput/LargeTextInput";
import debounce from "lodash.debounce";
import Button from "../components/submitButton/SubmitButton";
import ParaphraserPanel from "./paraphraser/Paraphraser";
import Translator from "./translator/Translator";
import Header from "./Header";

const Dashboard: React.FC = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [srcLang, setSrcLang] = useState("en");
  const [dscLang, setDscLang] = useState("de");
  const [paraphraseText, setParaphraseText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  return (
  <div className="bg-gray-50 text-gray-800 min-h-screen">
    <Header></Header>
    
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
