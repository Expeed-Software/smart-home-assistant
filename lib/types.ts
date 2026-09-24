/** Types for devices */
export type TDeviceType = "light" | "fan" | "thermostat" | "lock" | "blind" | "speaker";

/** A fan that is off keeps its speed, as a light keeps its brightness. */
export type TFanSpeed = "low" | "medium" | "high";

// Status is per device type. `TDevice.type` is the one tag: switching on it narrows
// `device.status` to that type's shape.
export type TLightStatus = { on: boolean; brightness: number };
export type TFanStatus = { on: boolean; speed: TFanSpeed };
export type TThermostatStatus = { on: boolean; target: number };
export type TLockStatus = { locked: boolean };
export type TBlindStatus = { position: number };
export type TSpeakerStatus = { on: boolean; volume: number };

type TStatusByType = {
  light: TLightStatus;
  fan: TFanStatus;
  thermostat: TThermostatStatus;
  lock: TLockStatus;
  blind: TBlindStatus;
  speaker: TSpeakerStatus;
};

export type TStatusOf<T extends TDeviceType> = TStatusByType[T];

type TDeviceBase = {
  id: string;
  label: string;
  roomId: string;
};

/** A device of type `T`, whose status has that type's shape. */
export type TDeviceOf<T extends TDeviceType> = TDeviceBase & { type: T; status: TStatusOf<T> };

/** Any device. Switch on `device.type` to narrow its status. */
export type TDevice = { [T in TDeviceType]: TDeviceOf<T> }[TDeviceType];

export type TRoom = {
  id: string;
  label: string;
};

/** The rooms and the devices as they stand now. */
export type THome = {
  rooms: TRoom[];
  devices: TDevice[];
};

/** What the browser sends to /api/commands. Questions are built on the server. */
export type TCommandRequest = {
  command: string;
  home: THome;
};

/** One option the model weighed, with its probability. */
export type TChoice = {
  label: string;
  probability: number;
};

/** One question's answer, written out for a person. */
export type TDecision = {
  question: string;
  /** The chosen label; it matches one of the choices. */
  choice: string;
  confidence: number;
  choices: TChoice[];
};

/** What /api/commands returns: the decisions, and the devices they changed. */
export type TCommandResponse = {
  latencyMs: number;
  /** Input tokens. */
  tokens: number;
  decisions: TDecision[];
  /** Each device the command changed, with its new status. */
  actions: TDevice[];
};

export type TCommandError = {
  message: string;
};
