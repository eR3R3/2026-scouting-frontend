'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { calculateAutoScore, calculateTeleopScore, calculateEndGameScore } from '@/app/lib/utils';

export function TeamComparisonChart({ records }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!records || !chartRef.current) return;

    interface TeamData {
      matches: number[];
      totalScores: number[];
      matchCount: number;
    }

    const teamData: Record<number, TeamData> = {};

    records.forEach(record => {
      if (!record.team) return;
      if (!teamData[record.team]) {
        teamData[record.team] = { matches: [], totalScores: [], matchCount: 0 };
      }

      const autoScore = calculateAutoScore(record.autonomous);
      const teleopScore = calculateTeleopScore(record.teleop);
      const endGameScore = calculateEndGameScore(record.endAndAfterGame?.towerStatus);

      teamData[record.team].matches.push(record.matchNumber);
      teamData[record.team].totalScores.push(autoScore + teleopScore + endGameScore);
      teamData[record.team].matchCount++;
    });

    const chart = echarts.init(chartRef.current);
    chart.setOption({
      title: { text: 'Team Performance Comparison', left: 'center' },
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      legend: {
        data: Object.keys(teamData).map(t => `Team ${t}`),
        top: 30, type: 'scroll',
      },
      grid: { left: '10%', right: '5%', bottom: '15%', top: '30%', containLabel: true },
      xAxis: {
        type: 'category',
        data: Array.from(
          { length: Math.max(...Object.values(teamData).map(d => d.matches.length), 0) },
          (_, i) => `Match ${i + 1}`,
        ),
        name: 'Match Number',
      },
      yAxis: { type: 'value', name: 'Points' },
      series: Object.entries(teamData).map(([team, d]) => ({
        name: `Team ${team}`,
        type: 'line',
        data: d.totalScores,
        smooth: true,
        markPoint: { data: [{ type: 'max', name: 'Max' }, { type: 'min', name: 'Min' }] },
      })),
    });

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    return () => { chart.dispose(); window.removeEventListener('resize', handleResize); };
  }, [records]);

  return (
    <div className="space-y-4">
      <div ref={chartRef} style={{ width: '100%', height: '700px' }} className="min-h-[700px]" />
    </div>
  );
}
