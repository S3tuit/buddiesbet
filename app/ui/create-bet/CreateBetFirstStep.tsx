import FieldErrors from "../FieldErrors";
import InputField from "./InputField";
import {
  CreateBetState,
  OutcomeInputForm,
} from "@/app/db/entities/bet/createBet";

type CreateBetFirstStepProps = {
  setOutcomes: (outcomes: OutcomeInputForm[]) => void;
  outcomes: OutcomeInputForm[];
  errors: CreateBetState["errors"];
  hidden: boolean;
};

export default function CreateBetFirstStep({
  setOutcomes,
  outcomes,
  errors,
  hidden,
}: CreateBetFirstStepProps) {
  const handleOutcomeChange = (index: number, value: string) => {
    const updated = outcomes.map((outcome, idx) => {
      if (index === idx) {
        return { ...outcome, name: value };
      }
      return outcome;
    });
    setOutcomes(updated);
  };

  const addOutcome = () => {
    if (outcomes.length < 10) {
      setOutcomes([...outcomes, { name: "" }]);
    }
  };

  const removeOutcome = (index: number) => {
    if (outcomes.length > 2) {
      setOutcomes(outcomes.filter((_, i) => i !== index));
    }
  };

  return (
    <div hidden={hidden}>
      <InputField
        id="name"
        name="name"
        label="Name your bet"
        placeholder="will Romeo kiss Juliet tonight?"
        error={errors?.name}
        margin=""
      />

      <InputField
        id="description"
        name="description"
        label="What’s the bet about?"
        placeholder="a short description…"
        error={errors?.description}
      />

      <div className="mt-6">
        <label className="block text-sm font-medium text-white">
          Choose the Possible Outcomes
        </label>
        <label className="block text-sm font-small text-gray-400">
          (At least 2, max 10. Add an “Other” option to predict the
          unpredictable.)
        </label>
        <div className="space-y-2 mt-2">
          {outcomes.map((value, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                name="outcomes"
                type="text"
                placeholder={`Outcome ${index + 1}`}
                value={value.name}
                onChange={(e) => handleOutcomeChange(index, e.target.value)}
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {outcomes.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOutcome(index)}
                  className="text-red-400 hover:text-red-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <FieldErrors errors={errors} field="outcomes" />
        </div>
        <button
          type="button"
          onClick={addOutcome}
          disabled={outcomes.length >= 10}
          className="mt-2 text-sm text-blue-400 hover:underline disabled:text-gray-500"
        >
          + Add outcome
        </button>
      </div>

      <InputField
        id="betDeadline"
        name="betDeadline"
        label="When do bets close?"
        placeholder=""
        type="datetime-local"
        error={errors?.betDeadline}
      />

      <InputField
        id="outcomeDeadline"
        name="outcomeDeadline"
        label="Deadline for choosing for the winning outcome:"
        placeholder=""
        type="datetime-local"
        error={errors?.outcomeDeadline}
      />
    </div>
  );
}
