import React, { useState } from "react";
import ParaphraserPanel from "./paraphraser/Paraphraser";
import Translator from "./translator/Translator";
import Header from "./Header";

const Dashboard: React.FC = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("de");
  const [paraphraseText, setParaphraseText] = useState("");

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto py-12 px-6 space-y-8">
        <Translator
          text={text}
          setText={setText}
          translatedText={translatedText}
          setTranslatedText={setTranslatedText}
          sourceLang={sourceLang}
          setSourceLang={setSourceLang}
          targetLang={targetLang}
          setTargetLang={setTargetLang}
          paraphraseText={paraphraseText}
        />

        <ParaphraserPanel
          text={text}
          setText={setText}
          paraphraseText={paraphraseText}
          //setParaphraseText={setParaphraseText}
        />
      </main>

      <footer className="text-center py-6 text-gray-500 border-t mt-10">
        © 2026 Nexus – AI tool
      </footer>
    </div>
  );
};

export default Dashboard;