import React, {useState} from 'react';
import TextareaAutosize from 'react-textarea-autosize';

type LargeTextInputProps = {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

const LargeTextInput: React.FC<LargeTextInputProps> = ({
    value,
    onChange,
    placeholder,
    disabled = false,
    className = "",
    }) => (
    <TextareaAutosize
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none ${className}`} 
        minRows={3}
        maxRows={10}
    />
);


export default LargeTextInput;