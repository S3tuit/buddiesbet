// components/InputField.tsx
import FieldErrors from "@/app/ui/FieldErrors";
import { useState } from "react";

interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  error?: string[] | undefined;
  margin?: string;
}

export default function InputField({
  id,
  name,
  label,
  type = "text",
  placeholder,
  error,
  margin = "mt-6",
}: InputFieldProps) {
  const [fieldValue, setFieldValue] = useState("");
  return (
    <div className={margin}>
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
        />
      </div>
      <FieldErrors errors={{ [name]: error || [] }} field={name} />
    </div>
  );
}
