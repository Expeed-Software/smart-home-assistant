import { LEVEL_LIMITS, TEMP_UNIT } from "@/lib/constants";
import type { TDevice } from "@/lib/types";

// What a device looks like to a person: whether it reads as on, its status in words,
// its level at a glance, and the one click that does the obvious thing.

/** True when a device reads as active: on, open, or locked. */
export function isActive(device: TDevice): boolean {
  switch (device.type) {
    case "lock":
      return device.status.locked;
    case "blind":
      return device.status.position > 0;
    case "light":
    case "fan":
    case "thermostat":
    case "speaker":
      return device.status.on;
  }
}

/** The status in words, for the tooltip and the popover. */
export function describeStatus(device: TDevice): string {
  switch (device.type) {
    case "light":
      return device.status.on ? `On, ${device.status.brightness}% brightness` : "Off";
    case "fan":
      return device.status.on ? `On, ${device.status.speed} speed` : "Off";
    case "thermostat":
      return device.status.on ? `On, set to ${device.status.target}${TEMP_UNIT}` : "Off";
    case "lock":
      return device.status.locked ? "Locked" : "Unlocked";
    case "speaker":
      return device.status.on ? `On, volume ${device.status.volume}%` : "Off";
    case "blind": {
      const { position } = device.status;
      if (position === 0) return "Closed";
      if (position === 100) return "Fully open";
      return `${position}% open`;
    }
  }
}

/**
 * The numbered level worth showing on the plan, or null when the device is off or
 * has none. A fan's speed is not a number; the marker draws it as bars.
 */
export function readingText(device: TDevice): string | null {
  switch (device.type) {
    case "light":
      return device.status.on ? `${device.status.brightness}%` : null;
    case "thermostat":
      return device.status.on ? `${device.status.target}°` : null;
    case "speaker":
      return device.status.on ? `${device.status.volume}%` : null;
    case "blind":
      return device.status.position > 0 ? `${device.status.position}%` : null;
    case "fan":
    case "lock":
      return null;
  }
}

/** The one click that does the obvious thing: on/off, open/close, lock/unlock. */
export function primaryToggle(device: TDevice): { label: string; next: TDevice } {
  switch (device.type) {
    case "light": {
      const { on, brightness } = device.status;
      const lit = Math.max(brightness, LEVEL_LIMITS.brightness.min);
      return {
        label: on ? "Turn off" : "Turn on",
        next: { ...device, status: { on: !on, brightness: lit } },
      };
    }
    case "speaker": {
      const { on, volume } = device.status;
      const audible = Math.max(volume, LEVEL_LIMITS.volume.min);
      return {
        label: on ? "Turn off" : "Turn on",
        next: { ...device, status: { on: !on, volume: audible } },
      };
    }
    case "fan": {
      const { on } = device.status;
      return {
        label: on ? "Turn off" : "Turn on",
        next: { ...device, status: { ...device.status, on: !on } },
      };
    }
    case "thermostat": {
      const { on } = device.status;
      return {
        label: on ? "Turn off" : "Turn on",
        next: { ...device, status: { ...device.status, on: !on } },
      };
    }
    case "lock": {
      const { locked } = device.status;
      return {
        label: locked ? "Unlock" : "Lock",
        next: { ...device, status: { locked: !locked } },
      };
    }
    case "blind": {
      const open = device.status.position > 0;
      const { min, max } = LEVEL_LIMITS.position;
      return {
        label: open ? "Close" : "Open",
        next: { ...device, status: { position: open ? min : max } },
      };
    }
  }
}
