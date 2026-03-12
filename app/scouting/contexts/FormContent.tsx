"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

type AutonomousData = {
  autoStart: number;
  leftStartingZone: boolean;
  fuelCount: number;
  isTowerSuccess: boolean;
  shooterType: string;
  shotsTaken: number | null;
  shotVolumes: string;
  subjectiveAccuracy: number | null;
};

type TeleopData = {
  fuelCount: number;
  humanFuelCount: number;
  passBump: boolean;
  passTrench: boolean;
  fetchBallPreference: string;
  shotsTaken: number | null;
  shotVolumes: string;
  subjectiveAccuracy: number | null;
};

type EndAndAfterGameData = {
  towerStatus: string;
  comments: string;
  climbingTime: number;
  rankingPoint: number;
  coopPoint: boolean;
  autonomousMove: boolean;
  teleopMove: boolean;
};

export type ScoutingFormData = {
  eventId: string;
  eventMatchId: string;
  scoutingData: unknown;
  matchType: string;
  matchNumber: number;
  alliance: string;
  team: number;
  scouter: string;
  autonomous: AutonomousData;
  teleop: TeleopData;
  endAndAfterGame: EndAndAfterGameData;
};

type FormContextType = {
  formData: ScoutingFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScoutingFormData>>;
};

const initialFormData: ScoutingFormData = {
  eventId: "",
  eventMatchId: "",
  scoutingData: null,
  matchType: "",
  matchNumber: 0,
  alliance: "",
  team: 0,
  scouter: "",

  autonomous: {
    autoStart: 0,
    leftStartingZone: false,
    fuelCount: 0,
    isTowerSuccess: false,

    // === NEW FIELDS ===
    shooterType: "",
    shotsTaken: null,
    shotVolumes: "",
    subjectiveAccuracy: null,
  },

  teleop: {
    fuelCount: 0,
    humanFuelCount: 0,
    passBump: false,
    passTrench: false,
    fetchBallPreference: "",

    // === NEW FIELDS ===
    shotsTaken: null,
    shotVolumes: "",
    subjectiveAccuracy: null,
  },

  endAndAfterGame: {
    towerStatus: "None",
    comments: "",
    climbingTime: 0,
    rankingPoint: 0,
    coopPoint: false,
    autonomousMove: false,
    teleopMove: false,
  },
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState<ScoutingFormData>(initialFormData);

  // Load initial data from sessionStorage if available
  useEffect(() => {
    const scoutingData = sessionStorage.getItem('scoutingData');
    if (scoutingData) {
      const data = JSON.parse(scoutingData);

      setFormData(prev => ({
        ...prev,
        eventId: data.eventId || '',
        eventMatchId: data.eventMatchId || '',
        scoutingData: data,
        matchType: data.selectedMatch?.tbaMatch?.matchType || data.matchType || '',
        matchNumber: data.selectedMatch?.tbaMatch?.matchNumber || (data.matchNumber !== undefined ? data.matchNumber : 0),
        team: data.selectedTeam?.teamNumber || data.teamNumber || 0,
        alliance: data.alliance || '',
      }));
    }
  }, []);

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
