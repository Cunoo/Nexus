import React, { useCallback, useEffect, useState } from "react";
import LargeTextInput from "../../components/largeTextInput/LargeTextInput";
import Select from "../../components/select/Select";
import Button from "../../components/submitButton/SubmitButton";
import ParaphraseService from "../../api/paraphrase/ParaphraseService";
import SubmitButton from "../../components/submitButton/SubmitButton";
// src/components/Translate_and_paraphrase/translator_paraphrase.tsx
interface ParaphraserPanelProps {

    text: string;
    setText: (value: string) => void;
    paraphraseText: string;
}
const ParaphraserPanel: React.FC<ParaphraserPanelProps> = ({
    text,
    setText,
    paraphraseText,
}) => {
    const handleParaphrase = async (textInput:string, number_of_sequencies: number) => {
        if (!textInput.trim() || !number_of_sequencies) return;
        try {
          //const res = await ParaphraseService.sendTextToParaphrase(textInput, lang, number_of_sequencies)
          //setParaphraseText(res.output_texts.join("\n"));
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="space-y-6 w-full col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4 flex flex-col justify-between">
            <div>
            <h2 className="text-xl font-bold mb-4">Paraphraser</h2>
            <LargeTextInput value="Enter your text here..."></LargeTextInput>
            <LargeTextInput value={paraphraseText || "Your paraphrased text will appear here..."}></LargeTextInput>
            </div>
            <SubmitButton 
            type="button" 
            onClick={() => handleParaphrase(text, 3)}
            >
            Paraphrase Text
            </SubmitButton>
        </div>
        </div>
    );
};

export default ParaphraserPanel;