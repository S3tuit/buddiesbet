"use server";

import { Bet } from "@prisma/client";
import { z } from "zod";
import { isPasswordCorrect } from "./bet";
import { cookies } from "next/headers";

export type EnterPasswordState = {
  errors?: {
    password?: string[];
  };
  message?: string;
  success: boolean;
};

const enterPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(16, { message: "Password can't be longer than 6 characters" }),
});

export async function enterPasswordFromForm(
  prevState: EnterPasswordState,
  formData: FormData,
  betId: Bet["id"]
): Promise<EnterPasswordState> {
  const validatedFields = enterPasswordSchema.safeParse({
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const encryptedPassword = await isPasswordCorrect(
    betId,
    validatedFields.data.password
  );
  if (encryptedPassword) {
    (await cookies()).set({
      name: `bet_access_${betId}`,
      value: encryptedPassword,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: `/bet/${betId}`, // only send on this route
    });

    return {
      success: true,
    };
  } else {
    return {
      success: false,
      errors: {
        password: ["Incorrect password"],
      },
    };
  }
}
