import {
  Blinds,
  Fan,
  Lightbulb,
  LightbulbOff,
  Lock,
  LockOpen,
  Thermometer,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { TDevice, TDeviceType } from "@/lib/types";

/**
 * A colour per device type, so the markers on the floorplan can be told apart by
 * what they are. The inactive tint keeps the type readable while the marker still
 * reads as off.
 * Class strings are written out in full so Tailwind can see them.
 */
export const DEVICE_TYPE_COLORS: Record<
  TDeviceType,
  { active: string; inactive: string; text: string }
> = {
  light: {
    active: "bg-amber-500 text-white dark:bg-amber-400 dark:text-amber-950",
    inactive: "bg-amber-500/10 text-amber-600/70 dark:text-amber-400/70",
    text: "text-amber-600 dark:text-amber-400",
  },
  fan: {
    active: "bg-sky-500 text-white dark:bg-sky-400 dark:text-sky-950",
    inactive: "bg-sky-500/10 text-sky-600/70 dark:text-sky-400/70",
    text: "text-sky-600 dark:text-sky-400",
  },
  thermostat: {
    active: "bg-orange-500 text-white dark:bg-orange-400 dark:text-orange-950",
    inactive: "bg-orange-500/10 text-orange-600/70 dark:text-orange-400/70",
    text: "text-orange-600 dark:text-orange-400",
  },
  lock: {
    active: "bg-emerald-500 text-white dark:bg-emerald-400 dark:text-emerald-950",
    inactive: "bg-emerald-500/10 text-emerald-600/70 dark:text-emerald-400/70",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  blind: {
    active: "bg-violet-500 text-white dark:bg-violet-400 dark:text-violet-950",
    inactive: "bg-violet-500/10 text-violet-600/70 dark:text-violet-400/70",
    text: "text-violet-600 dark:text-violet-400",
  },
  speaker: {
    active: "bg-rose-500 text-white dark:bg-rose-400 dark:text-rose-950",
    inactive: "bg-rose-500/10 text-rose-600/70 dark:text-rose-400/70",
    text: "text-rose-600 dark:text-rose-400",
  },
};

/**
 * The icon for a device. A few types have a second icon for their inactive state,
 * because "off" reads faster as a different glyph than as a dimmer colour.
 */
export function DeviceIcon({ device, className }: { device: TDevice; className?: string }) {
  switch (device.type) {
    case "light":
      return device.status.on ? (
        <Lightbulb className={className} />
      ) : (
        <LightbulbOff className={className} />
      );
    case "lock":
      return device.status.locked ? (
        <Lock className={className} />
      ) : (
        <LockOpen className={className} />
      );
    case "speaker":
      return device.status.on ? (
        <Volume2 className={className} />
      ) : (
        <VolumeX className={className} />
      );
    case "fan":
      return <Fan className={className} />;
    case "thermostat":
      return <Thermometer className={className} />;
    case "blind":
      return <Blinds className={className} />;
  }
}
