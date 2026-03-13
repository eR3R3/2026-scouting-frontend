"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

// @ts-ignore
const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
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
  });

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

export const useForm = () => useContext(FormContext);
