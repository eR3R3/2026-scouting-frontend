"use client";

import React, { createContext, useState, useContext } from "react";

// @ts-ignore
const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
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
    },
    teleop: {
      fuelCount: 0,
      humanFuelCount: 0,
      passBump: false,
      passTrench: false,
      fetchBallPreference: "",
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

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => useContext(FormContext);
