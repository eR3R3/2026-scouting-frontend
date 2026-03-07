'use client';

import { useState, useMemo } from 'react';
import { Card } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { calculateAutoScore, calculateTeleopScore, calculateEndGameScore } from '@/app/lib/utils';

interface MatchRecord {
  team: number;
  autonomous: {
    fuelCount: number;
    isTowerSuccess: boolean;
  };
  teleop: {
    fuelCount: number;
    humanFuelCount: number;
  };
  endAndAfterGame: {
    towerStatus: string;
  };
}

interface TeamStats {
  teamNumber: number;
  avgAutoScore: number;
  avgTeleopScore: number;
  avgEndGameScore: number;
  avgTotalScore: number;
  towerSuccessRate: number;
  matches: number;
}

const sortOptions = [
  { value: 'totalScore', label: 'Total Score' },
  { value: 'autoScore', label: 'Auto Score' },
  { value: 'teleopScore', label: 'Teleop Score' },
  { value: 'endGameScore', label: 'End Game Score' },
  { value: 'towerSuccess', label: 'Auto Tower Success' },
];

export function TeamRankings({ matchRecords }: { matchRecords: MatchRecord[] }) {
  const [sortBy, setSortBy] = useState('totalScore');

  const teamStats = useMemo(() => {
    const stats = new Map<number, {
      matches: number;
      autoTotal: number;
      teleopTotal: number;
      endGameTotal: number;
      towerSuccesses: number;
    }>();

    matchRecords.forEach(record => {
      const team = record.team;
      if (!team) return;

      const autoScore = calculateAutoScore(record.autonomous);
      const teleopScore = calculateTeleopScore(record.teleop);
      const endGameScore = calculateEndGameScore(record.endAndAfterGame?.towerStatus);

      if (!stats.has(team)) {
        stats.set(team, { matches: 0, autoTotal: 0, teleopTotal: 0, endGameTotal: 0, towerSuccesses: 0 });
      }

      const s = stats.get(team)!;
      s.matches++;
      s.autoTotal += autoScore;
      s.teleopTotal += teleopScore;
      s.endGameTotal += endGameScore;
      if (record.autonomous?.isTowerSuccess) s.towerSuccesses++;
    });

    return Array.from(stats.entries()).map(([teamNumber, data]): TeamStats => ({
      teamNumber,
      avgAutoScore: data.autoTotal / data.matches,
      avgTeleopScore: data.teleopTotal / data.matches,
      avgEndGameScore: data.endGameTotal / data.matches,
      avgTotalScore: (data.autoTotal + data.teleopTotal + data.endGameTotal) / data.matches,
      towerSuccessRate: (data.towerSuccesses / data.matches) * 100,
      matches: data.matches,
    }));
  }, [matchRecords]);

  const sortedTeams = useMemo(() => {
    return [...teamStats].sort((a, b) => {
      switch (sortBy) {
        case 'autoScore': return b.avgAutoScore - a.avgAutoScore;
        case 'teleopScore': return b.avgTeleopScore - a.avgTeleopScore;
        case 'endGameScore': return b.avgEndGameScore - a.avgEndGameScore;
        case 'towerSuccess': return b.towerSuccessRate - a.towerSuccessRate;
        default: return b.avgTotalScore - a.avgTotalScore;
      }
    });
  }, [teamStats, sortBy]);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Team Rankings</h2>
        <Select label="Sort by" selectedKeys={[sortBy]} onChange={(e) => setSortBy(e.target.value)} className="w-48">
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Rank</th>
              <th className="text-left py-3 px-4">Team</th>
              <th className="text-right py-3 px-4">Matches</th>
              <th className="text-right py-3 px-4">Avg Auto</th>
              <th className="text-right py-3 px-4">Avg Teleop</th>
              <th className="text-right py-3 px-4">Avg EndGame</th>
              <th className="text-right py-3 px-4">Avg Total</th>
              <th className="text-right py-3 px-4">Tower %</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => (
              <tr key={team.teamNumber} className="border-b last:border-b-0 hover:bg-default-100 transition-colors">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{team.teamNumber}</td>
                <td className="text-right py-3 px-4">{team.matches}</td>
                <td className="text-right py-3 px-4">{team.avgAutoScore.toFixed(1)}</td>
                <td className="text-right py-3 px-4">{team.avgTeleopScore.toFixed(1)}</td>
                <td className="text-right py-3 px-4">{team.avgEndGameScore.toFixed(1)}</td>
                <td className="text-right py-3 px-4">{team.avgTotalScore.toFixed(1)}</td>
                <td className="text-right py-3 px-4">{team.towerSuccessRate.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
