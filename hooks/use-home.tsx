"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DEVICES, ROOMS } from "@/lib/demo-home";
import type { TDevice, TRoom } from "@/lib/types";

/** How long the devices changeDevices changed stay highlighted. */
const HIGHLIGHT_MS = 2000;

type THomeContext = {
  rooms: TRoom[];
  devices: TDevice[];
  /** The ids of the devices the last changeDevices call changed, for a few seconds after it. */
  highlighted: string[];
  /** Replaces one device, as a marker's controls change it. No highlight. */
  changeDevice: (next: TDevice) => void;
  /**
   * Replaces each device that has the same id as one of `changed`, as the assistant's
   * actions change them, and highlights them for a few seconds.
   */
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
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const highlightTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Swaps in each changed device by id.
  const replace = useCallback((changed: TDevice[]) => {
    const byId = new Map(changed.map((device) => [device.id, device]));
    setDevices((current) => current.map((device) => byId.get(device.id) ?? device));
  }, []);

  const changeDevice = useCallback((next: TDevice) => replace([next]), [replace]);

  const changeDevices = useCallback(
    (changed: TDevice[]) => {
      if (changed.length === 0) return;
      replace(changed);
      // A new change replaces the highlight and restarts its timer.
      setHighlighted(changed.map((device) => device.id));
      clearTimeout(highlightTimer.current);
      highlightTimer.current = setTimeout(() => setHighlighted([]), HIGHLIGHT_MS);
    },
    [replace],
  );

  useEffect(() => () => clearTimeout(highlightTimer.current), []);

  const value = useMemo(
    () => ({ rooms: ROOMS, devices, highlighted, changeDevice, changeDevices }),
    [devices, highlighted, changeDevice, changeDevices],
  );

  return <HomeContext value={value}>{children}</HomeContext>;
}

/** The rooms, the devices and the two ways to change them. Use it inside HomeProvider. */
export function useHome(): THomeContext {
  const home = useContext(HomeContext);
  if (!home) throw new Error("useHome must be used inside HomeProvider");
  return home;
}
