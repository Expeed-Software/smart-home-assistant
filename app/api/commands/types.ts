/** The questions asked about each request. */
export type TQuestionKey = "scope" | "targetRoom" | "targetDeviceType" | "targetDevice" | "change";

/** How wide a request reaches. */
export type TScope = "one_device" | "whole_room" | "type_in_room" | "type_everywhere" | "unclear";

/** What should happen to the devices a request reaches. */
export type TChange =
  | "turn_on"
  | "turn_off"
  | "increase"
  | "decrease"
  | "set_low"
  | "set_high"
  | "lock"
  | "unlock"
  | "open"
  | "close"
  | "none";

/**
 * One option of a question. Its label is how the decisions show it; its criteria say
 * when the model should choose it.
 */
export type TOption = { label: string; criteria: string };
