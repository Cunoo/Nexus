import React, { useEffect, useState } from "react";
import ParaphraserPanel from "./paraphraser/Paraphraser";
import Translator from "./translator/Translator";
import Header from "./Header";
import ChatBotWindow from "./ChatBotWindow/ChatBotWindow";
import { Rnd } from "react-rnd";
import { useTranslation } from "react-i18next";

/**
 * Default layout configuration for all dashboard panels.
 * Serves as the initial state and fallback when no saved user preferences exist.
 * 
 * Properties:
 * - x: Distance from the left edge of the container (px)
 * - y: Distance from the top edge of the container (px)
 * - width: Panel width (px)
 * - height: Panel height (px)
 */
const INITIAL_LAYOUT = {
  // Top-left panel: Translator
  translator: { x: 24, y: 24, width: 600, height: 480 },

  // Top-right panel: Paraphraser
  paraphraser: { x: 650, y: 24, width: 600, height: 480 },

  // Bottom-right panel: Chatbot
  chat: { x: 650, y: 520, width: 380, height: 450 },
};

const Dashboard: React.FC = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("de");
  const [paraphraseText, setParaphraseText] = useState("");
  const [translatedTextToParaphraser, setTranslatedTextToParaphraser] = useState(translatedText);
  
  const { t } = useTranslation();


  // Initializing panel states using default layout constants
  const [translatorState, setTranslatorState] = useState(INITIAL_LAYOUT.translator);
  const [paraphraserState, setParaphraserState] = useState(INITIAL_LAYOUT.paraphraser);
  const [chatState, setChatState] = useState(INITIAL_LAYOUT.chat);

  useEffect(() => {
    setTranslatedTextToParaphraser(translatedText);
  }, [translatedText]);


  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen relative overflow-hidden">
      <Header />

      {/* Main canvas area - serves as the strict parent boundary for all draggable/resizable panels */}
      <main className="relative w-full h-[calc(100vh-140px)] p-6 overflow-hidden">
        
        {/* 1. TRANSLATOR PANEL */}
        <Rnd
          bounds="parent"
          dragHandleClassName="chat-drag-handle"
          size={{ width: translatorState.width, height: translatorState.height }}
          position={{ x: translatorState.x, y: translatorState.y }}
          minWidth={350}
          minHeight={300}
          onDragStop={(e, d) => {
            setTranslatorState((prev) => ({ ...prev, x: d.x, y: d.y }));
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setTranslatorState({
              width: parseInt(ref.style.width, 10),
              height: parseInt(ref.style.height, 10),
              ...position,
            });
          }}
          className="z-10"
        >
          <div className="w-full h-full">
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
        </Rnd>

        {/* 2. PARAPHRASER PANEL */}
        <Rnd
          bounds="parent"
          dragHandleClassName="chat-drag-handle"
          size={{ width: paraphraserState.width, height: paraphraserState.height }}
          position={{ x: paraphraserState.x, y: paraphraserState.y }}
          minWidth={350}
          minHeight={300}
          onDragStop={(e, d) => {
            setParaphraserState((prev) => ({ ...prev, x: d.x, y: d.y }));
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setParaphraserState({
              width: parseInt(ref.style.width, 10),
              height: parseInt(ref.style.height, 10),
              ...position,
            });
          }}
          className="z-20"
        >
          <div className="w-full h-full">
            <ParaphraserPanel
              text={translatedTextToParaphraser}
              setText={setTranslatedTextToParaphraser}
              paraphraseText={paraphraseText}
              setParaphraseText={setParaphraseText} 
            />
          </div>
        </Rnd>

        {/* 3. CHATBOT WINDOW */}
        <Rnd
          bounds="parent"
          dragHandleClassName="chat-drag-handle"
          size={{ width: chatState.width, height: chatState.height }}
          position={{ x: chatState.x, y: chatState.y }}
          minWidth={300}
          minHeight={350}
          onDragStop={(e, d) => {
            setChatState((prev) => ({ ...prev, x: d.x, y: d.y }));
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setChatState({
              width: parseInt(ref.style.width, 10),
              height: parseInt(ref.style.height, 10),
              ...position,
            });
          }}
          className="z-30"
        >
          <div className="w-full h-full">
            <ChatBotWindow />
          </div>
        </Rnd>

      </main>

      <footer className="text-center py-4 text-gray-500 border-t bg-white relative z-30">
        {t("footer.copyright", { year: new Date().getFullYear() })}
      </footer>
    </div>
  );
};

export default Dashboard;