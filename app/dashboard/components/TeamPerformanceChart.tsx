'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { calculateAutoScore, calculateTeleopScore, calculateEndGameScore, AUTO_TOWER_L1_POINTS, FUEL_POINTS } from '@/app/lib/utils';

export function TeamPerformanceChart({ records }) {
  const autoChartRef = useRef(null);
  const teleopChartRef = useRef(null);
  const totalScoreChartRef = useRef(null);

  useEffect(() => {
    if (!records || !autoChartRef.current || !teleopChartRef.current || !totalScoreChartRef.current) return;

    const data = {
      matchNumbers: [] as number[],
      autoFuel: [] as number[],
      autoTower: [] as number[],
      teleopFuel: [] as number[],
      teleopHumanFuel: [] as number[],
      endGameScores: [] as number[],
      autoTotalScores: [] as number[],
      teleopTotalScores: [] as number[],
      endGameTotalScores: [] as number[],
      totalScores: [] as number[],
    };

    records.sort((a, b) => a.matchNumber - b.matchNumber).forEach(record => {
      data.matchNumbers.push(record.matchNumber);

      data.autoFuel.push((record.autonomous?.fuelCount || 0) * FUEL_POINTS);
      data.autoTower.push(record.autonomous?.isTowerSuccess ? AUTO_TOWER_L1_POINTS : 0);

      data.teleopFuel.push((record.teleop?.fuelCount || 0) * FUEL_POINTS);
      data.teleopHumanFuel.push((record.teleop?.humanFuelCount || 0) * FUEL_POINTS);

      const autoScore = calculateAutoScore(record.autonomous);
      const teleopScore = calculateTeleopScore(record.teleop);
      const endGameScore = calculateEndGameScore(record.endAndAfterGame?.towerStatus);
      data.endGameScores.push(endGameScore);

      data.autoTotalScores.push(autoScore);
      data.teleopTotalScores.push(teleopScore);
      data.endGameTotalScores.push(endGameScore);
      data.totalScores.push(autoScore + teleopScore + endGameScore);
    });

    const autoChart = echarts.init(autoChartRef.current);
    autoChart.setOption({
      title: { text: 'Autonomous Performance', left: 'center', subtext: `Average: ${average(data.autoTotalScores).toFixed(1)} pts` },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['Fuel (1pt)', 'Tower L1 (15pts)'], top: 50, type: 'scroll' },
      grid: { top: 100, left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: data.matchNumbers.map(n => `Match ${n}`) },
      yAxis: { type: 'value', name: 'Points' },
      series: [
        { name: 'Fuel (1pt)', type: 'bar', stack: 'total', data: data.autoFuel },
        { name: 'Tower L1 (15pts)', type: 'bar', stack: 'total', data: data.autoTower },
      ],
    });

    const teleopChart = echarts.init(teleopChartRef.current);
    teleopChart.setOption({
      title: { text: 'Teleop + End Game Performance', left: 'center', subtext: `Teleop Avg: ${average(data.teleopTotalScores).toFixed(1)} | EndGame Avg: ${average(data.endGameTotalScores).toFixed(1)}` },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['Fuel (1pt)', 'Human Fuel (1pt)', 'End Game'], top: 50, type: 'scroll' },
      grid: { top: 100, left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: data.matchNumbers.map(n => `Match ${n}`) },
      yAxis: { type: 'value', name: 'Points' },
      series: [
        { name: 'Fuel (1pt)', type: 'bar', stack: 'total', data: data.teleopFuel },
        { name: 'Human Fuel (1pt)', type: 'bar', stack: 'total', data: data.teleopHumanFuel },
        { name: 'End Game', type: 'bar', stack: 'total', data: data.endGameScores },
      ],
    });

    const totalScoreChart = echarts.init(totalScoreChartRef.current);
    totalScoreChart.setOption({
      title: { text: 'Total Match Scores', left: 'center', subtext: `Average: ${average(data.totalScores).toFixed(1)} pts` },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const i = params[0].dataIndex;
          return `Match ${data.matchNumbers[i]}<br/>Auto: ${data.autoTotalScores[i]} pts<br/>Teleop: ${data.teleopTotalScores[i]} pts<br/>EndGame: ${data.endGameTotalScores[i]} pts<br/><strong>Total: ${data.totalScores[i]} pts</strong>`;
        },
      },
      grid: { top: 80, left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: data.matchNumbers.map(n => `Match ${n}`) },
      yAxis: { type: 'value', name: 'Points' },
      series: [{ name: 'Total', type: 'bar', data: data.totalScores, itemStyle: { color: '#1a73e8' }, markLine: { data: [{ type: 'average', name: 'Avg' }] } }],
    });

    const handleResize = () => { autoChart.resize(); teleopChart.resize(); totalScoreChart.resize(); };
    window.addEventListener('resize', handleResize);
    return () => { autoChart.dispose(); teleopChart.dispose(); totalScoreChart.dispose(); window.removeEventListener('resize', handleResize); };
  }, [records]);

  return (
    <div className="space-y-6 pt-4">
      <div ref={autoChartRef} style={{ width: '100%', height: '350px' }} className="min-h-[300px]" />
      <div ref={teleopChartRef} style={{ width: '100%', height: '350px' }} className="min-h-[300px]" />
      <div ref={totalScoreChartRef} style={{ width: '100%', height: '350px' }} className="min-h-[300px]" />
    </div>
  );
}

function average(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}
