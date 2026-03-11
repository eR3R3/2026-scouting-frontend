interface Autonomous {
  fuelCount: number;
  isTowerSuccess: boolean;
  leftStartingZone?: boolean;
  autoStart?: number;
}

interface Teleop {
  fuelCount: number;
  humanFuelCount: number;
  passBump?: boolean;
  passTrench?: boolean;
  fetchBallPreference?: string;
}

export const TOWER_POINTS = { L1: 10, L2: 20, L3: 30 } as const;
export const AUTO_TOWER_L1_POINTS = 15;
export const FUEL_POINTS = 1;

export function calculateAutoScore(auto: Autonomous | null | undefined): number {
  if (!auto) return 0;
  const fuelScore = (auto.fuelCount || 0) * FUEL_POINTS;
  const towerScore = auto.isTowerSuccess ? AUTO_TOWER_L1_POINTS : 0;
  return fuelScore + towerScore;
}

export function calculateTeleopScore(teleop: Teleop | null | undefined): number {
  if (!teleop) return 0;
  return ((teleop.fuelCount || 0) + (teleop.humanFuelCount || 0)) * FUEL_POINTS;
}

export function calculateEndGameScore(towerStatus: string | null | undefined): number {
  if (!towerStatus || towerStatus === 'None') return 0;
  return TOWER_POINTS[towerStatus as keyof typeof TOWER_POINTS] || 0;
}

export function calculateTotalScore(
  auto: Autonomous | null | undefined,
  teleop: Teleop | null | undefined,
  towerStatus: string | null | undefined,
): number {
  return calculateAutoScore(auto) + calculateTeleopScore(teleop) + calculateEndGameScore(towerStatus);
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
