import type { TFanSpeed } from "@/lib/types";

// Device constants shared by the UI and the API route.

/** In order, so a step up or down is one index along. */
export const FAN_SPEEDS: TFanSpeed[] = ["low", "medium", "high"];

/**
 * The range each numbered level is kept within, by the controls and by the API alike.
 * A light that is on is never below 5%, so dimming all the way down still leaves the
 * room lit rather than silently off; a speaker that is on is never muted.
 */
export const LEVEL_LIMITS = {
  brightness: { min: 5, max: 100 },
  volume: { min: 1, max: 100 },
  position: { min: 0, max: 100 },
  target: { min: 50, max: 90 },
} as const;

export type TLimits = { min: number; max: number };

export const TEMP_UNIT = "°F";

/** Long enough for any sentence someone would type to a home. */
export const MAX_COMMAND_LENGTH = 500;
