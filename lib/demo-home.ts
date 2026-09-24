import type { TDevice, TRoom } from "@/lib/types";

// The demo home as it starts out on every load. The floorplan positions in
// components/home.tsx and the suggestions in components/command.tsx are written
// against these ids and statuses.

/** The demo home's rooms. */
export const ROOMS: TRoom[] = [
  { id: "r_living", label: "Living Room" },
  { id: "r_dining", label: "Dining Area" },
  { id: "r_kitchen", label: "Kitchen" },
  { id: "r_bedroom", label: "Bedroom" },
  { id: "r_office", label: "Office" },
  { id: "r_garage", label: "Garage" },
  { id: "r_porch", label: "Front Porch" },
];

/** The demo home's devices as it starts out. */
export const DEVICES: TDevice[] = [
  {
    id: "d_living_ceiling",
    label: "Ceiling Light",
    roomId: "r_living",
    type: "light",
    status: { on: true, brightness: 70 },
  },
  {
    id: "d_living_thermostat",
    label: "Thermostat",
    roomId: "r_living",
    type: "thermostat",
    status: { on: true, target: 72 },
  },
  {
    id: "d_living_speaker",
    label: "TV Speaker",
    roomId: "r_living",
    type: "speaker",
    status: { on: true, volume: 25 },
  },
  {
    id: "d_living_blind",
    label: "Window Blind",
    roomId: "r_living",
    type: "blind",
    status: { position: 60 },
  },
  {
    id: "d_dining_door",
    label: "Back Door",
    roomId: "r_dining",
    type: "lock",
    status: { locked: true },
  },
  {
    id: "d_dining_chandelier",
    label: "Chandelier",
    roomId: "r_dining",
    type: "light",
    status: { on: false, brightness: 80 },
  },
  {
    id: "d_kitchen_blind",
    label: "Window Blind",
    roomId: "r_kitchen",
    type: "blind",
    status: { position: 80 },
  },
  {
    id: "d_kitchen_ceiling",
    label: "Ceiling Light",
    roomId: "r_kitchen",
    type: "light",
    status: { on: false, brightness: 80 },
  },
  {
    id: "d_bedroom_overhead",
    label: "Overhead Light",
    roomId: "r_bedroom",
    type: "light",
    status: { on: false, brightness: 60 },
  },
  {
    id: "d_bedroom_fan",
    label: "Ceiling Fan",
    roomId: "r_bedroom",
    type: "fan",
    status: { on: true, speed: "low" },
  },
  {
    id: "d_bedroom_blind",
    label: "Blackout Blind",
    roomId: "r_bedroom",
    type: "blind",
    status: { position: 0 },
  },
  {
    id: "d_office_ceiling",
    label: "Ceiling Light",
    roomId: "r_office",
    type: "light",
    status: { on: false, brightness: 90 },
  },
  {
    id: "d_office_blind",
    label: "Window Blind",
    roomId: "r_office",
    type: "blind",
    status: { position: 100 },
  },
  {
    id: "d_garage_light",
    label: "Garage Light",
    roomId: "r_garage",
    type: "light",
    status: { on: false, brightness: 100 },
  },
  {
    id: "d_garage_door",
    label: "Garage Door",
    roomId: "r_garage",
    type: "lock",
    status: { locked: true },
  },
  {
    id: "d_porch_light",
    label: "Porch Light",
    roomId: "r_porch",
    type: "light",
    status: { on: false, brightness: 100 },
  },
  {
    id: "d_porch_lock",
    label: "Front Door",
    roomId: "r_porch",
    type: "lock",
    status: { locked: true },
  },
];
