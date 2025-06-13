"use client";

import { useState, useCallback } from "react";
import { CreateBetState } from "@/app/db/entities/bet/createBet";
import FieldErrors from "../FieldErrors";

interface SetPasswordFormProps {
  hidden: boolean;
  errors: CreateBetState["errors"];
}

export default function SetPasswordForm({
  hidden,
  errors,
}: SetPasswordFormProps) {
  const [password, setPassword] = useState("");

  const handleGenerate = useCallback(() => {
    const PASSWORD_LRNGTH = 8;
    // Generetare strong password
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specials = "!@#$%^&*()_+[]{}|;:,.<>?";
    const all = upper + lower + numbers + specials;
    let pw = "";
    // ensure at least one of each required type
    pw += upper[Math.floor(Math.random() * upper.length)];
    pw += lower[Math.floor(Math.random() * lower.length)];
    pw += numbers[Math.floor(Math.random() * numbers.length)];
    pw += specials[Math.floor(Math.random() * specials.length)];
    for (let i = 4; i < PASSWORD_LRNGTH; i++) {
      pw += all[Math.floor(Math.random() * all.length)];
    }
    const randomPassword = pw
      .split("")
      .sort(() => 0.5 - Math.random()) // shuffle
      .join("");
    setPassword(randomPassword);
  }, [setPassword]);

  return (
    <div hidden={hidden}>
      <h3 className="text-lg font-semibold text-white">Choose a Password</h3>
      <p className="text-gray-400 text-sm">
        Only those with the password can join.
      </p>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-white"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a password"
          className="block w-full px-3 py-2 rounded-md border border-gray-600 bg-black-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="text-gray-400 text-sm mt-4">
        <p>Password rules (simple stuff):</p>
        <ul className="list-disc list-inside">
          <li>6 to 16 characters</li>
          <li>At least one uppercase & one lowercase</li>
        </ul>
      </div>

      <div className="mt-6">
        <FieldErrors errors={errors} field="password" />
      </div>

      <div className="flex gap-4 mt-4">
        <button
          type="button"
          onClick={handleGenerate}
          className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          🔁 Generate a strong one
        </button>
      </div>
    </div>
  );
}
