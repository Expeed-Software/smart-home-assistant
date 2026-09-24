"use client";

import { DeviceControls } from "@/components/device-controls";
import { DEVICE_TYPE_COLORS, DeviceIcon } from "@/components/device-icon";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "cn";
import { useHome } from "@/hooks/use-home";
import { FAN_SPEEDS } from "@/lib/constants";
import { describeStatus, isActive, primaryToggle, readingText } from "@/lib/devices";
import type { TDevice, TFanSpeed } from "@/lib/types";

/**
 * One device on the floorplan. Clicking it does the obvious thing - on/off,
 * open/close, lock/unlock. While it is on, its level - brightness, fan speed,
 * target temperature, how far a blind is open, volume - sits in a small tag on its
 * corner, so the plan reads without hovering; the tag is also the button for the
 * full controls.
 *
 * A device that is off has no tag and so no controls: there is no level worth
 * setting until it is on. A lock has nothing to set beyond the one click, so it
 * never has a tag. Its room and every change go through useHome.
 */
export function DeviceMarker({ device }: { device: TDevice }) {
  const { rooms, changeDevice } = useHome();
  const roomLabel = rooms.find((room) => room.id === device.roomId)?.label ?? "";
  const active = isActive(device);
  const toggle = primaryToggle(device);
  const unlocked = device.type === "lock" && !device.status.locked;
  const colors = DEVICE_TYPE_COLORS[device.type];
  const spin =
    device.type === "fan" && device.status.on ? FAN_SPIN[device.status.speed] : undefined;
  const reading = readingOf(device);

  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              aria-label={`${roomLabel} ${device.label}: ${toggle.label}`}
              onClick={() => changeDevice(toggle.next)}
              className="flex size-9 cursor-pointer rounded-full bg-background shadow-sm ring-2 ring-background transition-shadow outline-none focus-visible:ring-ring"
            />
          }
        >
          {/* The tint sits on an inner layer so the translucent off colour reads
              against the page background rather than the floorplan under it. */}
          <span
            className={cn(
              "flex size-full items-center justify-center rounded-full transition-colors",
              active ? colors.active : colors.inactive,
              unlocked && "bg-destructive text-white",
            )}
          >
            <DeviceIcon device={device} className={cn("size-4", spin)} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {device.label} · {describeStatus(device)}
        </TooltipContent>
      </Tooltip>

      {reading && (
        <Popover>
          <PopoverTrigger
            render={
              <button
                type="button"
                aria-label={`${roomLabel} ${device.label} controls`}
                className={cn(
                  "absolute -top-2 -right-4 flex h-4 cursor-pointer items-center rounded-full bg-background px-1.5 font-mono text-[10px] font-semibold shadow-sm ring-1 ring-border transition-colors hover:bg-muted",
                  colors.text,
                )}
              />
            }
          >
            {reading}
          </PopoverTrigger>
          <PopoverContent className="w-64 gap-3">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  active ? colors.active : colors.inactive,
                  unlocked && "bg-destructive/15 text-destructive",
                )}
              >
                <DeviceIcon device={device} className="size-4" />
              </span>
              <div className="min-w-0">
                <div className="truncate font-medium">{device.label}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {roomLabel} · {describeStatus(device)}
                </div>
              </div>
            </div>
            <DeviceControls device={device} onChange={changeDevice} />
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => changeDevice(toggle.next)}
            >
              {toggle.label}
            </Button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

/** The level on the marker's tag: a running fan's speed as bars, anything else as text. */
function readingOf(device: TDevice) {
  if (device.type === "fan") {
    const { on, speed } = device.status;
    return on ? <SpeedBars speed={speed} /> : null;
  }
  return readingText(device);
}

/** One rising vertical bar per fan speed, filled up to the current one. */
function SpeedBars({ speed }: { speed: TFanSpeed }) {
  const level = FAN_SPEEDS.indexOf(speed) + 1;
  const count = FAN_SPEEDS.length;
  return (
    <svg
      viewBox={`0 0 ${count * 4 - 1} 10`}
      className="h-2.5 w-3"
      role="img"
      aria-label={`Speed ${level} of ${count}`}
    >
      {FAN_SPEEDS.map((name, i) => (
        <rect
          key={name}
          x={i * 4}
          y={6 - i * 3}
          width={3}
          height={4 + i * 3}
          rx={0.75}
          fill="currentColor"
          opacity={i < level ? 1 : 0.25}
        />
      ))}
    </svg>
  );
}

/** A running fan's icon spins, faster at higher speeds. Written out for Tailwind. */
const FAN_SPIN: Record<TFanSpeed, string> = {
  low: "animate-[spin_2.4s_linear_infinite]",
  medium: "animate-[spin_1.2s_linear_infinite]",
  high: "animate-[spin_0.6s_linear_infinite]",
};
