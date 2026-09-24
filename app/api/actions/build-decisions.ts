import type { TChoice, TDecision } from "@/lib/types";
import type { TAnswers, TOptions, TQuestions } from "./build-questions";
import { QUESTION_INSTRUCTIONS } from "./constants";
import type { TOption, TQuestionKey } from "./types";

/** How many of the choices the model weighed are shown under each decision. */
const MAX_CHOICES_SHOWN = 6;

/** The top probabilities, highest first, by their labels. */
function choicesFrom(
  probabilities: Record<string, number>,
  labelOf: (option: string) => string,
): TChoice[] {
  return Object.entries(probabilities)
    .map(([option, probability]) => ({ label: labelOf(option), probability }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, MAX_CHOICES_SHOWN);
}

/**
 * One decision per question, in the order they were asked: the question's instructions,
 * the choice made, how sure the model was, and the choices it weighed.
 */
export function buildDecisions(
  questions: TQuestions,
  answers: TAnswers,
  options: TOptions,
): TDecision[] {
  return (Object.keys(questions) as TQuestionKey[]).map((key) => {
    const answer = answers[key];
    // An option's label; a key the question never offered shows as itself.
    const labelOf = (option: string) =>
      (options[key] as Record<string, TOption>)[option]?.label ?? option;
    return {
      question: QUESTION_INSTRUCTIONS[key],
      choice: labelOf(answer.choice),
      confidence: answer.confidence,
      choices: choicesFrom(answer.probabilities, labelOf),
    };
  });
}
