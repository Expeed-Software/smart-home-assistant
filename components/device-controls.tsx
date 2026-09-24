"use client";

import { Minus, Plus } from "lucide-react";
import { LevelSlider } from "@/components/level-slider";
import { Button } from "@/components/ui/button";
import { FAN_SPEEDS, LEVEL_LIMITS, TEMP_UNIT } from "@/lib/constants";
import type { TDevice } from "@/lib/types";

/**
 * The hands-on controls in a device's popover: brightness, fan speed, temperature,
 * blind position, speaker volume. A lock has nothing to set beyond locked or
 * unlocked, so it has none.
 *
 * The popover only exists while the device is active (see DeviceMarker), so every
 * control here is live.
 */
export function DeviceControls({
  device,
  onChange,
}: {
  device: TDevice;
  onChange: (device: TDevice) => void;
}) {
  switch (device.type) {
    case "light":
      return (
        <LevelSlider
          label="Brightness"
          value={device.status.brightness}
          min={LEVEL_LIMITS.brightness.min}
          max={LEVEL_LIMITS.brightness.max}
          suffix="%"
          onCommit={(brightness) =>
            onChange({ ...device, status: { ...device.status, brightness } })
          }
        />
      );

    case "blind":
      return (
        <LevelSlider
          label="Open"
          value={device.status.position}
          min={LEVEL_LIMITS.position.min}
          max={LEVEL_LIMITS.position.max}
          suffix="%"
          onCommit={(position) => onChange({ ...device, status: { position } })}
        />
      );

    case "speaker":
      return (
        <LevelSlider
          label="Volume"
          value={device.status.volume}
          min={LEVEL_LIMITS.volume.min}
          max={LEVEL_LIMITS.volume.max}
          suffix="%"
          onCommit={(volume) => onChange({ ...device, status: { ...device.status, volume } })}
        />
      );

    case "fan":
      return (
        <div className="grid gap-1.5">
          <span className="text-xs text-muted-foreground">Speed</span>
          <div className="flex gap-1">
            {FAN_SPEEDS.map((speed) => (
              <Button
                key={speed}
                size="xs"
                variant={device.status.speed === speed ? "default" : "outline"}
                className="flex-1 capitalize"
                onClick={() => onChange({ ...device, status: { ...device.status, speed } })}
              >
                {speed}
              </Button>
            ))}
          </div>
        </div>
      );

    case "thermostat": {
      const { target } = device.status;
      const { min, max } = LEVEL_LIMITS.target;
      const setTarget = (next: number) =>
        onChange({ ...device, status: { ...device.status, target: next } });
      return (
        <div className="grid gap-1.5">
          <span className="text-xs text-muted-foreground">Target</span>
          <div className="flex items-center gap-2">
            <Button
              size="icon-sm"
              variant="outline"
              aria-label="One degree cooler"
              disabled={target <= min}
              onClick={() => setTarget(target - 1)}
            >
              <Minus />
            </Button>
            <span className="flex-1 text-center font-mono text-sm">
              {target}
              {TEMP_UNIT}
            </span>
            <Button
              size="icon-sm"
              variant="outline"
              aria-label="One degree warmer"
              disabled={target >= max}
              onClick={() => setTarget(target + 1)}
            >
              <Plus />
            </Button>
          </div>
        </div>
      );
    }

    case "lock":
      return null;
  }
}
