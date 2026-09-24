"use client";

import { DeviceMarker } from "@/components/device-marker";
import { useHome } from "@/hooks/use-home";

/** A rectangle on the plan, in SVG user units. */
type TRect = { x: number; y: number; w: number; h: number };

/**
 * A straight run along a wall, from `x`, `y`: horizontal when `w` is set, vertical
 * when `h` is.
 */
type TSpan = { x: number; y: number; w?: number; h?: number };

/** The floorplan's size, in SVG user units. Device positions use the same units. */
const PLAN_WIDTH = 1000;
const PLAN_HEIGHT = 680;

/** Where each device's marker sits on the plan, in SVG user units. */
const DEVICE_POS: Readonly<Record<string, { x: number; y: number }>> = {
  d_living_ceiling: { x: 510, y: 390 },
  d_living_thermostat: { x: 312, y: 320 },
  d_living_speaker: { x: 712, y: 390 },
  d_living_blind: { x: 660, y: 540 },
  d_dining_door: { x: 510, y: 40 },
  d_dining_chandelier: { x: 510, y: 140 },
  d_kitchen_blind: { x: 160, y: 40 },
  d_kitchen_ceiling: { x: 160, y: 160 },
  d_bedroom_overhead: { x: 820, y: 160 },
  d_bedroom_fan: { x: 880, y: 160 },
  d_bedroom_blind: { x: 960, y: 140 },
  d_office_ceiling: { x: 160, y: 410 },
  d_office_blind: { x: 160, y: 540 },
  d_garage_light: { x: 850, y: 410 },
  d_garage_door: { x: 860, y: 540 },
  d_porch_light: { x: 510, y: 590 },
  d_porch_lock: { x: 440, y: 540 },
};

/**
 * Each room's rectangle on the plan, in SVG user units. An outdoor room has no
 * walls and is drawn as a dashed outline.
 */
const ROOMS_POS: Readonly<Record<string, TRect & { outdoor?: true }>> = {
  r_living: { x: 280, y: 240, w: 460, h: 300 },
  r_dining: { x: 280, y: 40, w: 460, h: 200 },
  r_kitchen: { x: 40, y: 40, w: 240, h: 240 },
  r_bedroom: { x: 740, y: 40, w: 220, h: 240 },
  r_office: { x: 40, y: 280, w: 240, h: 260 },
  r_garage: { x: 740, y: 280, w: 220, h: 260 },
  r_porch: { x: 280, y: 540, w: 460, h: 100, outdoor: true },
};

/** How thick the walls are drawn. */
const WALL = 8;

/**
 * The left panel: the home as a floorplan. The rooms from useHome are drawn at their
 * ROOMS_POS rectangles, the doors and windows are static SVG, and the devices are
 * HTML markers laid over it, so popovers, tooltips and focus behave as they do
 * anywhere else in the app.
 */
export function Home() {
  const { rooms, devices } = useHome();

  // The rooms that have a place on the plan, with that place.
  const placed = rooms.flatMap((room) => {
    const at = ROOMS_POS[room.id];
    return at ? [{ room, at }] : [];
  });
  const outdoor = placed.filter(({ at }) => at.outdoor);
  const indoor = placed.filter(({ at }) => !at.outdoor);

  return (
    <div className="flex h-full items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-6xl">
        <svg
          viewBox={`0 0 ${PLAN_WIDTH} ${PLAN_HEIGHT}`}
          className="block h-auto w-full"
          role="img"
          aria-label="Floorplan of the home"
        >
          {/* Each room: its floor and walls (an outdoor room has no walls), then its
              name, a little below the centre so it clears the markers. Outdoor rooms
              come first, so the walls next to them sit on top. */}
          {[...outdoor, ...indoor].map(({ room, at }) => (
            <g key={room.id}>
              {at.outdoor ? (
                <Porch x={at.x} y={at.y} w={at.w} h={at.h} />
              ) : (
                <Wall x={at.x} y={at.y} w={at.w} h={at.h} />
              )}
              <RoomLabel x={at.x + at.w / 2} y={at.y + at.h / 2 + 34} label={room.label} />
            </g>
          ))}

          {/* Doors. */}
          <Door x={470} y={40} w={80} />
          <Door x={400} y={540} w={80} />
          <Door x={740} y={150} h={60} />
          <Door x={280} y={400} h={70} />
          <Door x={777} y={540} w={165} />

          {/* The kitchen, dining area and living room are one open space. */}
          <OpenEdge x={280} y={44} h={232} />
          <OpenEdge x={284} y={240} w={452} />

          {/* Windows, each behind a blind. */}
          <Window x={600} y={540} w={120} />
          <Window x={960} y={85} h={110} />
          <Window x={100} y={540} w={120} />
          <Window x={100} y={40} w={120} />
        </svg>

        {/* Each marker is placed in percentages of the plan, so it stays pinned to
            its spot on the SVG however the plan is scaled. */}
        {devices.map((device) => {
          const at = DEVICE_POS[device.id];
          if (!at) return null;
          return (
            <div
              key={device.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${(at.x / PLAN_WIDTH) * 100}%`,
                top: `${(at.y / PLAN_HEIGHT) * 100}%`,
              }}
            >
              <DeviceMarker device={device} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** A room's name, centred on `x` and `y`. */
function RoomLabel({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={13}
      className="pointer-events-none fill-muted-foreground font-medium"
    >
      {label}
    </text>
  );
}

/** An outdoor space with no walls: its floor, and a dashed outline around it. */
function Porch({ x, y, w, h }: TRect) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      className="fill-card stroke-foreground/30"
      strokeWidth={2}
      strokeDasharray="10 8"
    />
  );
}

/** A room's walls: its floor, outlined all round by a wall `WALL` thick. */
function Wall({ x, y, w, h }: TRect) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      className="fill-card stroke-neutral-600"
      strokeWidth={WALL}
    />
  );
}

/** A door: the gap in the wall, with a thin line where the door closes. */
function Door({ x, y, w = 0, h = 0 }: TSpan) {
  return (
    <g>
      <OpenEdge x={x} y={y} w={w} h={h} />
      <line x1={x} y1={y} x2={x + w} y2={y + h} className="stroke-foreground/25" strokeWidth={2} />
    </g>
  );
}

/**
 * A stretch with no wall between two rooms: the wall cut away, with nothing across
 * the gap. Callers inset it by half a wall so the corners stay square.
 */
function OpenEdge({ x, y, w = 0, h = 0 }: TSpan) {
  return <line x1={x} y1={y} x2={x + w} y2={y + h} className="stroke-card" strokeWidth={10} />;
}

/**
 * A window as an architect draws one: the wall opened up, a pane of two thin
 * parallel lines across it, and the jambs closed off at either end.
 */
function Window({ x, y, w = 0, h = 0 }: TSpan) {
  const [x2, y2] = [x + w, y + h];
  // Half the wall's thickness, across the wall.
  const [nx, ny] = w > 0 ? [0, WALL / 2] : [WALL / 2, 0];
  const glass = 0.35;
  return (
    <g>
      <rect x={x - nx} y={y - ny} width={w + nx * 2} height={h + ny * 2} className="fill-card" />
      <g className="stroke-foreground/50" strokeWidth={1.5}>
        {[-glass, glass].map((k) => (
          <line
            key={k}
            x1={x + nx * k * 2}
            y1={y + ny * k * 2}
            x2={x2 + nx * k * 2}
            y2={y2 + ny * k * 2}
          />
        ))}
        <line x1={x - nx} y1={y - ny} x2={x + nx} y2={y + ny} />
        <line x1={x2 - nx} y1={y2 - ny} x2={x2 + nx} y2={y2 + ny} />
      </g>
    </g>
  );
}
