'use client';

import { getCookie } from 'cookies-next/client';

const sanitizeNullToMinusOne = (value: any): any => {
  if (value === null) {
    return -1;
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeNullToMinusOne(item));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, sanitizeNullToMinusOne(v)]),
    );
  }
  return value;
};

const getAbsentPlaceholderPayload = (comment: string) => ({
  autonomous: {
    autoStart: 0,
    leftStartingZone: false,
    fuelCount: 0,
    isTowerSuccess: false,
    shooterType: '',
    shotsTaken: 0,
    shotVolumes: '',
    subjectiveAccuracy: 0,
  },
  teleop: {
    fuelCount: 0,
    humanFuelCount: 0,
    passBump: false,
    passTrench: false,
    shotsTaken: 0,
    shotVolumes: '',
    subjectiveAccuracy: 0,
  },
  endAndAfterGame: {
    towerStatus: 'None',
    comments: comment,
    climbingTime: 0,
    rankingPoint: 0,
    coopPoint: false,
    autonomousMove: false,
    teleopMove: false,
  },
});

export const promptAbsentComment = (): string | null => {
  while (true) {
    const input = window.prompt('请输入缺勤备注（必填，取消则不提交）：', '');
    if (input === null) {
      return null;
    }

    const comment = input.trim();
    if (comment) {
      return comment;
    }

    window.alert('缺勤备注不能为空。');
  }
};

export const submitAbsentScoutingRecord = async (formData: any, comment: string) => {
  const scoutingData = sessionStorage.getItem('scoutingData');
  let submitData: any = {
    scoutEventId: formData.eventId,
    eventMatchId: formData.eventMatchId,
    matchType: formData.matchType,
    alliance: formData.alliance,
    teamNumber: formData.team,
    matchNumber: formData.matchNumber,
    ...getAbsentPlaceholderPayload(comment),
  };

  if (scoutingData) {
    const data = JSON.parse(scoutingData);

    if (data.selectedMatch && data.selectedTeam) {
      submitData = {
        ...submitData,
        scoutEventId: data.eventId,
        eventMatchId: data.selectedMatch.id,
        teamNumber: data.selectedTeam.teamNumber,
        alliance: data.selectedMatch.tbaMatch?.redAlliance?.includes(data.selectedTeam.teamNumber)
          ? 'Red'
          : 'Blue',
        matchType: data.selectedMatch.tbaMatch?.matchType || submitData.matchType,
      };
    }

    if (data.matchNumber !== undefined || data.matchType || data.teamNumber || data.alliance) {
      submitData = {
        ...submitData,
        scoutEventId: data.eventId || submitData.scoutEventId,
        matchType: data.matchType || submitData.matchType,
        matchNumber: data.matchNumber !== undefined ? data.matchNumber : submitData.matchNumber,
        teamNumber: data.teamNumber || submitData.teamNumber,
        alliance: data.alliance || submitData.alliance,
      };
    }
  }

  if (!submitData.scoutEventId || typeof submitData.scoutEventId !== 'string') {
    throw new Error('scoutEventId is missing');
  }
  if (!Number.isInteger(submitData.teamNumber) || submitData.teamNumber < 1) {
    throw new Error('teamNumber is invalid');
  }

  if (!submitData.teleop?.fetchBallPreference) {
    delete submitData.teleop.fetchBallPreference;
  }

  submitData = sanitizeNullToMinusOne(submitData);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouting/record`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getCookie('Authorization')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submitData),
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || 'Failed to submit absent record');
  }
};