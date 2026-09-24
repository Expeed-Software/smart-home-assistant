"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { DEVICES, ROOMS } from "@/lib/demo-home";
import type { TDevice, TRoom } from "@/lib/types";

type THomeContext = {
  rooms: TRoom[];
  devices: TDevice[];
  /** Replaces one device, as a marker's controls change it. */
  changeDevice: (next: TDevice) => void;
  /** Replaces each device that has the same id as one of `changed`. */
  changeDevices: (changed: TDevice[]) => void;
};

const HomeContext = createContext<THomeContext | null>(null);

/**
 * Holds the rooms and the devices as they stand now, for everything under it. The floorplan and
 * the assistant are siblings, so they share them through this provider. Only the devices
 * change; the rooms are fixed.
 */
export function HomeProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<TDevice[]>(DEVICES);

  const changeDevices = useCallback((changed: TDevice[]) => {
    if (changed.length === 0) return;
    const byId = new Map(changed.map((device) => [device.id, device]));
    setDevices((current) => current.map((device) => byId.get(device.id) ?? device));
  }, []);

  const changeDevice = useCallback((next: TDevice) => changeDevices([next]), [changeDevices]);

  const value = useMemo(
    () => ({ rooms: ROOMS, devices, changeDevice, changeDevices }),
    [devices, changeDevice, changeDevices],
  );

  return <HomeContext value={value}>{children}</HomeContext>;
}

/** The rooms, the devices and the two ways to change them. Use it inside HomeProvider. */
export function useHome(): THomeContext {
  const home = useContext(HomeContext);
  if (!home) throw new Error("useHome must be used inside HomeProvider");
  return home;
}
