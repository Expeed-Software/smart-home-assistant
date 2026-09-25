"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { MAX_COMMAND_LENGTH } from "@/lib/constants";

/**
 * The chips under the command box. Hand-written rather than generated, so they are
 * predictable and cost nothing. Each one is written against the home as it starts
 * out (DEVICES in lib/demo-home.ts) so that it visibly changes something.
 *
 * Picked so that between them they show the range: one device, indirect relative
 * changes, a kind of device across the whole home, a kind of device in one room, a
 * whole room (with a device the command skips), a step up, straight to the highest,
 * and a lock, across every kind of device.
 */
const SUGGESTED_ACTIONS: string[] = [
  // One device, switched on: the porch light starts off.
  "Turn on the front porch light",
  // Indirect and relative: nothing names the speaker, on at 25%.
  "The TV is too loud",
  // A kind of device everywhere: three of the four blinds are open.
  "Close all the blinds",
  // A whole room: the light, thermostat and speaker go off; the blind is skipped,
  // since "off" means nothing to a blind.
  "Turn off everything in the living room",
  // A lock: every door starts locked.
  "Unlock the garage door",
  // Indirect, one kind in one room: nothing names the thermostat, set to 72.
  "It's too warm in the living room",
  // A step up: the bedroom fan starts on low.
  "Turn the bedroom fan up",
  // Straight to the highest: the living room light is on at 70%.
  "Full brightness in the living room",
  // Indirect open: nothing names the blind, and the bedroom's starts fully closed.
  "Let some light into the bedroom",
];

/** What to ask for: a box to type in, or one of the suggestions to pick. */
export function Command({
  pending,
  onSubmit,
}: {
  pending: boolean;
  onSubmit: (command: string) => void;
}) {
  const [text, setText] = useState("");

  // Typed or picked, a command is sent trimmed, and the box empties ready for the next.
  // Nothing is sent while one is in flight - Enter in the box included.
  function send(value: string) {
    const command = value.trim();
    if (pending || command.length === 0) return;
    onSubmit(command);
    setText("");
  }

  return (
    <>
      <div className="flex gap-2">
        <Textarea
          value={text}
          rows={2}
          maxLength={MAX_COMMAND_LENGTH}
          placeholder="Tell the home what to do. For example: dim the bedroom lights a bit"
          className="resize-none"
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            // Enter sends; Shift+Enter is a newline, as everywhere else.
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send(text);
            }
          }}
        />
        <Button
          aria-label="Send"
          disabled={pending || text.trim().length === 0}
          onClick={() => send(text)}
        >
          {pending ? <Spinner /> : <Send />}
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {SUGGESTED_ACTIONS.map((suggestion) => (
          <Button
            key={suggestion}
            size="xs"
            variant="outline"
            disabled={pending}
            onClick={() => send(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </>
  );
}
