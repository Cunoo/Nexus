import React, { useState } from "react";
import LargeTextInput from "../../components/largeTextInput/LargeTextInput";
import Select from "../../components/select/Select";
import SubmitButton from "../../components/submitButton/SubmitButton";
import ParaphraseService from "../../api/paraphrase/ParaphraseService";

interface ParaphraserPanelProps {
    text: string;
    setText: (value: string) => void;
    paraphraseText: string;
    setParaphraseText: (value: string) => void;
}

const TONE_OPTIONS = [
    { value: "standard", label: "Standard" },
    { value: "formal", label: "Formal" },
    { value: "casual", label: "Casual" },
    { value: "academic", label: "Academic" },
    { value: "fluent", label: "Fluent" },
];

const ParaphraserPanel: React.FC<ParaphraserPanelProps> = ({
    text,
    setText,
    paraphraseText,
    setParaphraseText,
}) => {
    const [tone, setTone] = useState("standard");
    const [isLoading, setIsLoading] = useState(false);

    const handleParaphrase = async () => {
        if (!text.trim()) return;

        setIsLoading(true);
        try {
        // Volanie API služby vygenerovanej pre náš backend
        const res = await ParaphraseService.sendTextToParaphrase(text, tone, "auto");
        setParaphraseText(res.paraphrasedText);
        } catch (err) {
        console.error("Paraphrase failed:", err);
        } finally {
        setIsLoading(false);
        }
    };

    return (
            /* Odstránený overflow, pridaná väčšia šírka a výška */
            <div className="w-full h-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
                
                {/* Modrá hlavička cez celú šírku pre drag & drop */}
                <div className="chat-drag-handle bg-blue-600 text-white p-4 font-semibold text-lg flex items-center justify-between cursor-move select-none w-full">
                    <span>Paraphraser</span>
                    <span className="text-xs opacity-75">✥ Drag</span>
                </div>

                {/* Obsah panelu bez skrolovania */}
                <div className="p-6 space-y-4 flex flex-col justify-between flex-1">
                    <div className="space-y-4">
                        <div className="w-48">
                            <Select
                                value={tone}
                                onChange={setTone}
                                options={TONE_OPTIONS}
                                label="Tone"
                            />
                        </div>

                        {/* Vstupný text */}
                        <LargeTextInput
                            value={text}
                            onChange={setText}
                            placeholder="Enter your text here..."
                        />

                        {/* Výstupný parafrazovaný text */}
                        <div className="p-4 bg-gray-50 rounded border min-h-[120px]">
                            <h3 className="font-bold text-sm text-gray-500 mb-1">
                                Paraphrased Output:
                            </h3>
                            {isLoading ? (
                                <p className="text-gray-400 italic">Rewriting text...</p>
                            ) : (
                                <p className="whitespace-pre-wrap">
                                    {paraphraseText || "Your paraphrased text will appear here..."}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-2">
                        <SubmitButton
                            type="button"
                            onClick={handleParaphrase}
                            disabled={isLoading || !text.trim()}
                        >
                            {isLoading ? "Paraphrasing..." : "Paraphrase Text"}
                        </SubmitButton>
                    </div>
                </div>
            </div>
        );
    };

export default ParaphraserPanel;