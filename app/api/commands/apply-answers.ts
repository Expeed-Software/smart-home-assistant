import { FAN_SPEEDS, LEVEL_LIMITS, type TLimits } from "@/lib/constants";
import type { TDevice, THome } from "@/lib/types";
import { ALL_TYPES } from "./constants";
import type { TAnswers } from "./build-questions";
import type { TChange } from "./types";

/**
 * Applies the change the answers ask for to the devices they reach, and returns the
 * devices it actually changed, with their new status.
 */
export function applyAnswers(answers: TAnswers, home: THome): TDevice[] {
  const targets = targetsOf(answers, home.devices);
  const change = answers.change.choice;
  // A change can leave a device where it was - "turn on" a light that is already on -
  // so compare the statuses, not the objects.
  return targets
    .map((device) => changeDevice(device, change))
    .filter((next, i) => JSON.stringify(next.status) !== JSON.stringify(targets[i].status));
}

/**
 * The devices the answers point at, routed on the scope. The SDK types each answer
 * from its question, so a choice is one of the option keys it offered; a "none"
 * answer (`no_device`, `no_room`, `no_type`) or `all_rooms` points at no device.
 */
function targetsOf(answers: TAnswers, devices: TDevice[]): TDevice[] {
  const room = answers.targetRoom.choice;
  const type = answers.targetDeviceType.choice;
  const ofType = (device: TDevice) => type === ALL_TYPES || device.type === type;

  switch (answers.scope.choice) {
    case "one_device": {
      const device = devices.find((d) => d.id === answers.targetDevice.choice);
      return device ? [device] : [];
    }
    case "whole_room":
      return devices.filter((d) => d.roomId === room);
    case "type_in_room":
      return devices.filter((d) => d.roomId === room && ofType(d));
    case "type_everywhere":
      return devices.filter(ofType);
    case "unclear":
      return [];
  }
}

// --- Changing a device ---------------------------------------------------------

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// One step up or down, in percentage points or degrees. 15 points, so "the TV is too
// loud" is not a mute; a fan moves one speed.
const POINTS = 15;
const DEGREES = 3;

/**
 * The device after the change. A change that means nothing for it - "lock" on a
 * light, "turn off" on a blind - leaves it as it is.
 */
function changeDevice(device: TDevice, change: TChange): TDevice {
  switch (device.type) {
    case "lock":
      if (change === "lock") return { ...device, status: { locked: true } };
      if (change === "unlock") return { ...device, status: { locked: false } };
      return device;

    case "blind": {
      const position = nextPosition(device.status.position, change, POINTS);
      return position === null ? device : { ...device, status: { position } };
    }

    case "light": {
      const { on, brightness } = device.status;
      const next = nextSwitched(on, brightness, change, POINTS, LEVEL_LIMITS.brightness);
      return next ? { ...device, status: { on: next.on, brightness: next.level } } : device;
    }

    case "speaker": {
      const { on, volume } = device.status;
      const next = nextSwitched(on, volume, change, POINTS, LEVEL_LIMITS.volume);
      return next ? { ...device, status: { on: next.on, volume: next.level } } : device;
    }

    case "thermostat": {
      const { on, target } = device.status;
      const next = nextSwitched(on, target, change, DEGREES, LEVEL_LIMITS.target);
      return next ? { ...device, status: { on: next.on, target: next.level } } : device;
    }

    case "fan": {
      // The speeds are named, so the level is an index along FAN_SPEEDS, and a fan
      // moves one speed at a time.
      const { on, speed } = device.status;
      const limits = { min: 0, max: FAN_SPEEDS.length - 1 };
      const next = nextSwitched(on, FAN_SPEEDS.indexOf(speed), change, 1, limits);
      return next ? { ...device, status: { on: next.on, speed: FAN_SPEEDS[next.level] } } : device;
    }
  }
}

/**
 * A device with a switch - light, speaker, thermostat, fan - after the change: whether
 * it is on, and its level, kept within its limits. Anything that raises or sets the
 * level also turns it on; "decrease" leaves a device that is off alone. Null when the
 * change means nothing for it.
 */
function nextSwitched(
  on: boolean,
  level: number,
  change: TChange,
  by: number,
  { min, max }: TLimits,
): { on: boolean; level: number } | null {
  switch (change) {
    case "turn_on":
      return { on: true, level: clamp(level, min, max) };
    case "turn_off":
      return { on: false, level: clamp(level, min, max) };
    case "increase":
      return { on: true, level: clamp(level + by, min, max) };
    case "decrease":
      return on ? { on, level: clamp(level - by, min, max) } : null;
    case "set_low":
      return { on: true, level: min };
    case "set_high":
      return { on: true, level: max };
    default:
      return null;
  }
}

/**
 * A blind's position after the change. A blind has no switch, so it opens and closes
 * instead of turning on and off. Null when the change means nothing for it.
 */
function nextPosition(position: number, change: TChange, by: number): number | null {
  const { min, max } = LEVEL_LIMITS.position;
  switch (change) {
    case "increase":
      return clamp(position + by, min, max);
    case "decrease":
      return clamp(position - by, min, max);
    case "set_high":
    case "open":
      return max;
    case "set_low":
    case "close":
      return min;
    default:
      return null;
  }
}
