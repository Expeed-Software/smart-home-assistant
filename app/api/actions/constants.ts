import type { TDeviceType } from "@/lib/types";
import type { TChange, TOption, TQuestionKey, TScope } from "./types";

// The questions and their options. Only the API route uses these; the device
// constants the UI shares live in lib/constants.ts.

// --- Questions -----------------------------------------------------------------

/** Each question's instructions: what it asks the model, and how the decisions name it. */
export const QUESTION_INSTRUCTIONS: Record<TQuestionKey, string> = {
  scope: "What is the scope of the request?",
  targetRoom: "Which room is this request about?",
  targetDeviceType: "Which kind of device is this request about?",
  targetDevice: "Which single device is the request aimed at?",
  change: "What change is the request referring to?",
};

// --- Answer keys ---------------------------------------------------------------
// The questions answer with room ids, device types and device ids, plus these
// sentinels for "all" and "none".

export const ALL_ROOMS = "all_rooms";
export const NO_ROOM = "no_room";
export const ALL_TYPES = "all_types";
export const NO_TYPE = "no_type";
export const NO_DEVICE = "no_device";

// --- Options -------------------------------------------------------------------
// Each option's key is its answer; see TOption in ./types.ts.

/** The rooms question's "all" and "none" options, offered beside the rooms. */
export const ROOM_SENTINEL_OPTIONS: Record<typeof ALL_ROOMS | typeof NO_ROOM, TOption> = {
  [ALL_ROOMS]: {
    label: "Every room",
    criteria:
      "The request covers the whole home rather than one room, or names a kind of device " +
      "with no room attached. Examples: turn off all the lights, lock up the house, " +
      "close every blind.",
  },
  [NO_ROOM]: {
    label: "No room here",
    criteria:
      "The request points at a place that no room above corresponds to, or is not about a " +
      "room at all. Examples: dim the garage when there is no garage, or hello.",
  },
};

/** The device type question's "all" and "none" options, offered beside the kinds. */
export const DEVICE_TYPE_SENTINEL_OPTIONS: Record<typeof ALL_TYPES | typeof NO_TYPE, TOption> = {
  [ALL_TYPES]: {
    label: "Any kind",
    criteria:
      "Every kind of device at once, because the request is about a room as a whole or " +
      "the home as a whole. Examples: turn everything off in here, goodnight house.",
  },
  [NO_TYPE]: {
    label: "No kind here",
    criteria: "No kind of device in this home fits the request.",
  },
};

/** The single-device question's "none" option, offered beside the devices. */
export const DEVICE_SENTINEL_OPTIONS: Record<typeof NO_DEVICE, TOption> = {
  [NO_DEVICE]: {
    label: "No single device",
    criteria:
      "No single device above is the obvious target - the request names none of them, names " +
      "several at once, is aimed at a group rather than one device, or names something that " +
      "matches two devices equally well with nothing to tell them apart.",
  },
};

/** How wide a request reaches. */
export const SCOPE_OPTIONS: Record<TScope, TOption> = {
  one_device: {
    label: "One specific device",
    criteria:
      "Exactly one device is meant. The request names a device, or names something that " +
      "matches only one device in this home. Examples: turn off the ceiling light, lock " +
      "the front door, the fan in the office.",
  },
  whole_room: {
    label: "Every device in one room",
    criteria:
      "Every device in one room, whatever its kind, because the request implies no " +
      "particular kind. The request names one room and asks for something that applies " +
      "to all of it at once. Examples: turn everything off in the bedroom, shut down the " +
      "kitchen, goodnight living room.",
  },
  type_in_room: {
    label: "One kind of device in one room",
    criteria:
      "Every device of one kind, inside one room. The request names one room, and either " +
      "names a kind of device or asks for something only one kind of device does - " +
      "brightness is lights, temperature is the thermostat, opening and closing is " +
      "blinds, a breeze is the fan, volume is the speaker. Examples: dim the lights in the bedroom, turn off all " +
      "the fans in the living room, open the kitchen blinds, it is too warm in the living " +
      "room, make the living room brighter.",
  },
  type_everywhere: {
    label: "One kind of device across the home",
    criteria:
      "Every device of one kind, in every room of the home. The request names or implies " +
      "a kind of device and either says all, every, everywhere or the house, or names no " +
      "room at all. Examples: turn off all the lights, lock every door, close the blinds, " +
      "it is too cold in here with no room named.",
  },
  unclear: {
    label: "No clear target",
    criteria:
      "No target can be picked out. The request names nothing that appears in this home, " +
      "names several unrelated targets at once, or is not about this home. Examples: do " +
      "the thing, hello, turn on the oven when there is no oven.",
  },
};

/** The kinds of device. */
export const DEVICE_TYPE_OPTIONS: Record<TDeviceType, TOption> = {
  light: {
    label: "Lights",
    criteria:
      "Lamps, ceiling lights, bulbs - anything whose job is illumination. Words like " +
      "light, lamp, bulb, brighten, dim, darker, too dark in here.",
  },
  fan: {
    label: "Fans",
    criteria:
      "Ceiling and standing fans. Words like fan, airflow, breeze, faster, slower, circulate.",
  },
  thermostat: {
    label: "Thermostats",
    criteria:
      "Heating and cooling set points. Words like thermostat, heat, heating, AC, air " +
      "conditioning, temperature, warmer, cooler, degrees, too cold in here.",
  },
  lock: {
    label: "Locks",
    criteria: "Door locks and bolts. Words like lock, unlock, bolt, latch, secure the door.",
  },
  blind: {
    label: "Blinds",
    criteria:
      "Blinds, shades, curtains and shutters. Words like blind, shade, curtain, raise, " +
      "lower, open or close the blinds, let some light in.",
  },
  speaker: {
    label: "Speakers",
    criteria:
      "Speakers and TV sound. Words like speaker, TV, sound, music, volume, louder, " +
      "quieter, turn it up, too loud.",
  },
};

/** What should happen to the devices a request reaches. */
export const CHANGE_OPTIONS: Record<TChange, TOption> = {
  turn_on: {
    label: "Turn on",
    criteria:
      "Switch the devices on, or put them into their active state, without saying how " +
      "far. Examples: turn on the lights, switch the fan on, start the heating.",
  },
  turn_off: {
    label: "Turn off",
    criteria:
      "Switch the devices off. Examples: turn off the lights, kill the fan, everything " +
      "off in here.",
  },
  increase: {
    label: "Turn up a step",
    criteria:
      "Move the setting up by some amount while leaving the device on: brighter, faster, " +
      "warmer, further open, louder. Examples: brighter, turn the fan up, a couple of " +
      "degrees warmer, it is too dark in here, turn the TV up.",
  },
  decrease: {
    label: "Turn down a step",
    criteria:
      "Move the setting down by some amount, without necessarily switching anything off: " +
      "dimmer, slower, cooler, further closed, quieter. Examples: dim the lights, turn it " +
      "down, two degrees cooler, the TV is too loud.",
  },
  set_low: {
    label: "Set to the lowest",
    criteria:
      "Go straight to the lowest useful setting rather than a step down: as dim as it " +
      "goes, slowest speed, coolest set point, fully closed, quietest. Examples: dim them all the " +
      "way, lowest setting, as low as it goes.",
  },
  set_high: {
    label: "Set to the highest",
    criteria:
      "Go straight to the highest setting rather than a step up: full brightness, fastest " +
      "speed, warmest set point, fully open, full volume. Examples: full brightness, max, crank it up, " +
      "all the way open.",
  },
  lock: {
    label: "Lock",
    criteria: "Secure a lock. Examples: lock the front door, lock up.",
  },
  unlock: {
    label: "Unlock",
    criteria: "Release a lock. Examples: unlock the back door, let them in.",
  },
  open: {
    label: "Open",
    criteria:
      "Open a blind, shade or curtain. Examples: open the blinds, raise the shades, let " +
      "some light in.",
  },
  close: {
    label: "Close",
    criteria:
      "Close a blind, shade or curtain. Examples: close the curtains, shut the blinds, " +
      "lower the shades.",
  },
  none: {
    label: "No change",
    criteria:
      "The request asks for no change at all, or asks for something none of the commands " +
      "above describes.",
  },
};


