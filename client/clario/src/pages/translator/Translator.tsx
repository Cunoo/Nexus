import React, { useEffect } from "react";
import LargeTextInput from "../../components/largeTextInput/LargeTextInput";
import Select from "../../components/select/Select";
import TranslationService from "../../api/translation/TranslationService";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();


  
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
        <div className="w-full h-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
          {/* Modrá hlavička cez celú šírku pre drag & drop */}
          <div className="chat-drag-handle bg-blue-600 text-white p-4 font-semibold text-lg flex items-center justify-between cursor-move select-none w-full">
            <span>{t("translator.title")}</span>
            <span className="text-xs opacity-75">{t("panels.dragHandle")}</span>
          </div>

          <div className="p-6 space-y-4 flex flex-col justify-between flex-1">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="min-w-0">
                <Select 
                  value={sourceLang} 
                  onChange={setSourceLang} 
                  options={LANGUAGES_LIST} 
                  label={t("translator.from")}
                />
              </div>
              <div className="min-w-0">
                <Select 
                  value={targetLang} 
                  onChange={setTargetLang} 
                  options={LANGUAGES_LIST} 
                  label={t("translator.to")}
                />
              </div>
            </div>
            
            <LargeTextInput
              placeholder={t("translator.textInputPlaceholder")}
              value={text}
              onChange={setText}
            />
            
            <div className="mt-4 p-4 bg-gray-50 rounded border min-h-[100px]">
              <h3 className="font-bold text-sm text-gray-500 mb-1">{t("translator.translatedText")}</h3>
              <p>{translatedText || t("translator.textOutputPlaceholder")}</p>
            </div>
          </div>
        </div>
      );
    };

export default Translator;