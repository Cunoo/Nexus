import React, { useRef, useState } from "react";
import ParaphraserPanel from "./paraphraser/Paraphraser";
import Translator from "./translator/Translator";
import Header from "./Header";
import ChatBotWindow from "./ChatBotWindow/ChatBotWindow";
import Draggable from 'react-draggable';

const Dashboard: React.FC = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("de");
  const [paraphraseText, setParaphraseText] = useState("");

// Create refs to prevent "not mounted on DragStart" error
  const translatorRef = useRef(null);
  const paraphraserRef = useRef(null);
  const chatRef = useRef(null);
  

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen relative overflow-hidden">
      <Header />

      {/* Main canvas area */}
      <main className="relative w-full h-[calc(100vh-140px)] p-6">
        
        {/* 1. TRANSLATOR PANEL */}
        <Draggable handle=".chat-drag-handle" nodeRef={translatorRef} bounds="parent">
          <div ref={translatorRef} className="absolute top-6 left-6 z-10">
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
          </div>
        </Draggable>

        {/* 2. PARAPHRASER PANEL */}
        <Draggable handle=".chat-drag-handle" nodeRef={paraphraserRef} bounds="parent">
          <div ref={paraphraserRef} className="absolute top-6 left-[650px] z-20">
            <ParaphraserPanel
              text={text}
              setText={setText}
              paraphraseText={paraphraseText}
              setParaphraseText={setParaphraseText} 
            />
          </div>
        </Draggable>

        {/* 3. CHATBOT WINDOW */}
        {/* Chatbot window with an outer border */}
        <Draggable handle=".chat-drag-handle" nodeRef={chatRef} bounds="parent">
          <div ref={chatRef} className="absolute bottom-6 right-6 w-[380px] z-50 shadow-2xl rounded-xl overflow-hidden">
            {/* A container that wraps the ChatBotWindow and contains a blue bar */}
            <ChatBotWindow />
          </div>
        </Draggable>

      </main>

      <footer className="text-center py-4 text-gray-500 border-t bg-white relative z-30">
        © 2026 Nexus – AI tool
      </footer>
    </div>
  );
};

export default Dashboard;