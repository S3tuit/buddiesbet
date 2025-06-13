"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputField from "../../create-bet/InputField";
import CtaButton from "../../create-bet/CtaButton";
import {
  enterPasswordFromForm,
  EnterPasswordState,
} from "@/app/db/entities/bet/password";
import Form from "next/form";

export default function PasswordForm({ betId }: { betId: number }) {
  const [enterPwdState, enterPwdFormAction] = useActionState(
    (state: EnterPasswordState, formData: FormData) =>
      enterPasswordFromForm(state, formData, betId),
    { success: false } as EnterPasswordState
  );
  const { success, errors } = enterPwdState;

  useEffect(() => {
    if (success) {
      const router = useRouter();
      router.replace(`/bet/${betId}`);
    }
  });

  return (
    <div className="min-h-screen bg-black-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-black-700 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form action={enterPwdFormAction}>
            <InputField
              id="password"
              name="password"
              label="This bet is private. Enter the password:"
              placeholder="password..."
              type="text"
              error={errors?.password}
            />

            <div className="mt-6">
              <CtaButton label="Submit" isSubmit={true} />
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
