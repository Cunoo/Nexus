import React from "react";

type InputFieldProps = {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value:string) => void;
  required?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
}) => {
  return (
    <div>
      <label
      htmlFor={id}
    className="absolute left-3 top-2.5 text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-blue-500 peer-focus:text-xs"

      ></label>

      <input
        type={type}
        id={id}
        value={value}
        onChange={ (e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg
           focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
           placeholder-gray-400"
      />

    </div>
  );
};

export default InputField;
