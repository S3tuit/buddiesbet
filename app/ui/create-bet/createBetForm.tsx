"use client";

import {
  CreateBetState,
  createBetFromForm,
} from "@/app/db/entities/bet/createBet";
import { useState, useActionState, useCallback, useEffect } from "react";
import NerdOptionCreateBet from "@/app/ui/create-bet/nerdOptionsCreateBet";
import Form from "next/form";
import FormError from "@/app/ui/FormError";
import CtaButton from "@/app/ui/create-bet/CtaButton";
import SetPasswordForm from "./setPasswordForm";
import CreateBetFirstStep from "./CreateBetFirstStep";
import { OutcomeInputForm } from "@/app/db/entities/bet/createBet";

type CreateBetFormProps = {
  onSuccessCreateBet: (betId: number) => void;
};

type CreateBetSteps = "basic" | "password";

export default function CreateBetForm({
  onSuccessCreateBet,
}: CreateBetFormProps) {
  const [createBetState, createBetFormAction] = useActionState(
    (state: CreateBetState, formData: FormData) =>
      createBetFromForm(state, formData, outcomes, isPrivate),
    { success: false } as CreateBetState
  );
  const [outcomes, setOutcomes] = useState<OutcomeInputForm[]>([
    { name: "" },
    { name: "" },
  ]);

  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [isCreatorOdds, setIsCreatorOdds] = useState<boolean>(false);

  const [betSteps, setBetSteps] = useState<CreateBetSteps>("basic");

  const onBackPassword = useCallback(() => {
    setBetSteps("basic");
  }, [setBetSteps]);

  const setStepPassword = useCallback(() => {
    setBetSteps("password");
  }, [setBetSteps]);

  const { success, errors } = createBetState;

  useEffect(() => {
    if (!success && errors) {
      if (
        errors.name ||
        errors.description ||
        errors.outcomes ||
        errors.betDeadline ||
        errors.outcomeDeadline
      ) {
        setBetSteps("basic");
      } else if (errors.password) {
        setBetSteps("password");
      }
    } else if (success && createBetState.data?.id) {
      onSuccessCreateBet(createBetState.data?.id);
    }
  }, [createBetState]);

  return (
    <Form action={createBetFormAction}>
      <CreateBetFirstStep
        setOutcomes={setOutcomes}
        outcomes={outcomes}
        errors={errors}
        hidden={betSteps !== "basic"}
      />

      <NerdOptionCreateBet
        setIsPrivate={setIsPrivate}
        isPrivate={isPrivate}
        setIsCreatorOdds={setIsCreatorOdds}
        isCreatorOdds={isCreatorOdds}
        hidden={betSteps !== "basic"}
      />

      <SetPasswordForm hidden={betSteps !== "password"} errors={errors} />

      {/* BUTTTONS */}
      <div className="mt-6">
        <FormError message={!success ? createBetState.message : undefined} />
        <span className="block w-full rounded-md shadow-sm">
          {/* BASIC - CHOOSE PASSWORD */}
          {betSteps === "basic" && isPrivate && (
            <CtaButton
              label="Choose Password"
              isSubmit={false}
              onClicked={setStepPassword}
            />
          )}
          {/* BASIC - SUBMIT */}
          {betSteps === "basic" && !isPrivate && !isCreatorOdds && (
            <CtaButton label="Create Your Bet" isSubmit={true} />
          )}

          {/* PASSWORD - SUBMIT */}
          {betSteps === "password" && !isCreatorOdds && (
            <CtaButton
              label="Create Your Bet"
              isSubmit={true}
              showGoBack={true}
              onGoBack={onBackPassword}
            />
          )}
        </span>
      </div>
    </Form>
  );
}
