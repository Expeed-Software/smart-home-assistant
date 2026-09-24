import { choice, type Questions, type SystemOneResult } from "@typesafe-ai/sdk";
import {
  CHANGE_OPTIONS,
  DEVICE_SENTINEL_OPTIONS,
  DEVICE_TYPE_OPTIONS,
  DEVICE_TYPE_SENTINEL_OPTIONS,
  QUESTION_INSTRUCTIONS,
  ROOM_SENTINEL_OPTIONS,
  SCOPE_OPTIONS,
} from "./constants";
import type { THome } from "@/lib/types";
import type { TOption, TQuestionKey } from "./types";

/**
 * The five questions that turn one typed sentence into decisions. Their answers
 * are applied to the devices in ./apply-answers.ts and turned into decisions for
 * the person in ./build-decisions.ts.
 *
 * All five go in ONE systemOne call. They are independent judgements over the same
 * state, they run in parallel, and only some of them are consumed: which target
 * question matters depends on the scope. That is the trade being made deliberately - the alternative is
 * resolving the scope first and asking again, which doubles latency on every action.
 */

/**
 * Every question's options, keyed like the questions: each option's key is its
 * answer, with a label the decisions show and criteria the model chooses by. The
 * home is sent in the systemOne state - the rooms, and each device's room, type and
 * current status - so each room and device option's criteria only name what its id
 * stands for. Answer keys are the room ids (`r_living`) and the device ids
 * (`d_living_ceiling`) themselves, plus the "all"/"none" options in ./constants.ts.
 */
export function optionsOf(home: THome) {
  const rooms: Record<string, TOption> = {};
  for (const room of home.rooms) {
    rooms[room.id] = { label: room.label, criteria: room.label };
  }

  // A device whose room is not in the home is not offered.
  const roomLabels = new Map(home.rooms.map((room) => [room.id, room.label]));
  const devices: Record<string, TOption> = {};
  for (const device of home.devices) {
    const roomLabel = roomLabels.get(device.roomId);
    if (!roomLabel) continue;
    devices[device.id] = {
      label: `${roomLabel} · ${device.label}`,
      criteria: `${device.label} in the ${roomLabel}`,
    };
  }

  return {
    scope: SCOPE_OPTIONS,
    targetRoom: { ...rooms, ...ROOM_SENTINEL_OPTIONS },
    targetDeviceType: { ...DEVICE_TYPE_OPTIONS, ...DEVICE_TYPE_SENTINEL_OPTIONS },
    targetDevice: { ...devices, ...DEVICE_SENTINEL_OPTIONS },
    change: CHANGE_OPTIONS,
  } satisfies Record<TQuestionKey, unknown>;
}

export type TOptions = ReturnType<typeof optionsOf>;

/** The criteria of each option, keyed as the options are. */
function criteriaOf<K extends string>(options: Record<K, TOption>): Record<K, string> {
  return Object.fromEntries(
    Object.entries<TOption>(options).map(([key, option]) => [key, option.criteria]),
  ) as Record<K, string>;
}


/** The questions as the SDK takes them: each one's instructions and its options' criteria. */
export function buildQuestions(options: TOptions) {
  return {
    scope: choice(QUESTION_INSTRUCTIONS.scope, criteriaOf(options.scope)),
    targetRoom: choice(QUESTION_INSTRUCTIONS.targetRoom, criteriaOf(options.targetRoom)),
    targetDeviceType: choice(
      QUESTION_INSTRUCTIONS.targetDeviceType,
      criteriaOf(options.targetDeviceType),
    ),
    targetDevice: choice(QUESTION_INSTRUCTIONS.targetDevice, criteriaOf(options.targetDevice)),
    change: choice(QUESTION_INSTRUCTIONS.change, criteriaOf(options.change)),
  } satisfies Questions;
}

/** The questions exactly as built, so the SDK types each answer from its question. */
export type TQuestions = ReturnType<typeof buildQuestions>;

/** The answers, typed by the SDK from the questions buildQuestions made. */
export type TAnswers = SystemOneResult<TQuestions>["answers"];
