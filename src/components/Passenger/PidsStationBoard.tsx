'use client';

import React, { useState } from 'react';
import { LiveTrainTelemetry, DynamicStationEta } from '@/types/apiContracts';
import { MOCK_LIVE_TRAINS } from '@/lib/mockData';

export interface PidsStationBoardProps {
  liveTrains?: LiveTrainTelemetry[];
  defaultStationCode?: string;
}

export function formatTimeMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = Math.floor(minutes % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export const PidsStationBoard: React.FC<PidsStationBoardProps> = ({
  liveTrains = MOCK_LIVE_TRAINS,
  defaultStationCode = 'KYN'
}) => {
  const [selectedStation, setSelectedStation] = useState(defaultStationCode);
  const [filter, setFilter] = useState<'ALL' | 'ON_TIME' | 'DELAYED'>('ALL');

  const STATIONS = [
    { code: 'CSMT', name: 'CSMT (Mumbai)' },
    { code: 'DR',   name: 'Dadar Central' },
    { code: 'TNA',  name: 'Thane' },
    { code: 'KYN',  name: 'Kalyan Jn' }
  ];

  // Extract station arrival items across all trains
  const stationRows = liveTrains
    .map((train) => {
      const stn = train.stations.find((s) => s.stationCode === selectedStation);
      if (!stn) return null;
      return {
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        trainType: train.trainType,
        currentSpeedKmh: train.currentSpeedKmh,
        signalAspect: train.signalAspectAhead,
        stationData: stn
      };
    })
    .filter(Boolean) as Array<{
      trainNumber: string;
      trainName: string;
      trainType: string;
      currentSpeedKmh: number;
      signalAspect: string;
      stationData: DynamicStationEta;
    }>;

  // Filter rows
  const filteredRows = stationRows.filter((item) => {
    if (filter === 'ON_TIME') return item.stationData.delayMinutes === 0;
    if (filter === 'DELAYED') return item.stationData.delayMinutes > 0;
    return true;
  });

  return (
    <div
      className="bg-white dark:bg-[#040406] border border-[#D0DFEE] dark:border-[#1c1d22] rounded-[16px] p-4 shadow-sm select-none"
      data-testid="pids-station-board"
    >
      {/* Header & Station Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-[#1c1d22]">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-[#e2e3e9] flex items-center gap-2">
            <span>📺 Passenger Information Display System (PIDS)</span>
            <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 px-2 py-0.5 rounded-[4px] border border-cyan-200 dark:border-cyan-500/30">
              Live RTIS Telemetry
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#9194a1]">
            Dynamic ETA forecasts with P10/P50/P90 confidence bands and delay root-cause attribution.
          </p>
        </div>

        {/* Station Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#121317] p-1 rounded-[4px] border border-slate-200 dark:border-[#1c1d22]">
          {STATIONS.map((stn) => (
            <button
              key={stn.code}
              onClick={() => setSelectedStation(stn.code)}
              className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-[3px] transition-all cursor-pointer ${
                selectedStation === stn.code
                  ? 'bg-[#2B7FFF] text-white shadow-xs'
                  : 'text-slate-600 dark:text-[#9194a1] hover:text-slate-900 dark:hover:text-[#e2e3e9]'
              }`}
              data-testid={`pids-station-${stn.code}`}
            >
              {stn.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs & Counter */}
      <div className="flex items-center justify-between gap-2 mb-3 text-xs font-mono">
        <div className="flex items-center gap-1">
          {(['ALL', 'ON_TIME', 'DELAYED'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-2 py-0.5 rounded-[3px] transition-all cursor-pointer ${
                filter === mode
                  ? 'bg-slate-800 text-white dark:bg-[#1c1d22] dark:text-[#38bdf8] font-bold'
                  : 'text-slate-500 dark:text-[#9194a1] hover:bg-slate-100 dark:hover:bg-[#121317]'
              }`}
            >
              {mode === 'ALL' ? 'All Trains' : mode === 'ON_TIME' ? '🟢 On-Time' : '🔴 Delayed'}
            </button>
          ))}
        </div>
        <span className="text-slate-500 dark:text-[#9194a1]">
          Showing {filteredRows.length} of {stationRows.length} Scheduled Trains
        </span>
      </div>

      {/* High-Contrast PIDS Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#121317] text-slate-500 dark:text-[#9194a1] border-b border-slate-200 dark:border-[#1c1d22]">
              <th className="py-2.5 px-3">Train No. & Name</th>
              <th className="py-2.5 px-3">PF</th>
              <th className="py-2.5 px-3">Scheduled</th>
              <th className="py-2.5 px-3">Dynamic ETA (P50)</th>
              <th className="py-2.5 px-3">Confidence Window (P10–P90)</th>
              <th className="py-2.5 px-3">Status & Root Cause</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1c1d22]">
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => {
                const isDelayed = row.stationData.delayMinutes > 0;
                const { p10EarliestMinutes, p90LatestMinutes } = row.stationData.confidenceInterval;

                return (
                  <tr
                    key={row.trainNumber}
                    className="hover:bg-slate-50/80 dark:hover:bg-[#121317]/60 transition-colors"
                    data-testid={`pids-row-${row.trainNumber}`}
                  >
                    {/* Train Info */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-[#ffffff]">{row.trainNumber}</span>
                        <span className="text-slate-600 dark:text-[#c7c9d1] truncate max-w-[180px]">{row.trainName}</span>
                      </div>
                    </td>

                    {/* Platform Badge */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-[3px] border border-slate-300 dark:border-slate-700">
                        PF {row.stationData.platformAssigned}
                      </span>
                    </td>

                    {/* Scheduled Time */}
                    <td className="py-3 px-3 text-slate-600 dark:text-[#9194a1]">
                      {formatTimeMinutes(row.stationData.scheduledArrivalMinutes)}
                    </td>

                    {/* Dynamic Predicted Arrival */}
                    <td className="py-3 px-3">
                      <span className={`font-bold ${isDelayed ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {formatTimeMinutes(row.stationData.predictedEtaP50Minutes)}
                      </span>
                    </td>

                    {/* P10 - P90 Confidence Band */}
                    <td className="py-3 px-3 text-slate-600 dark:text-[#c7c9d1]">
                      <span>{formatTimeMinutes(p10EarliestMinutes)} – {formatTimeMinutes(p90LatestMinutes)}</span>
                    </td>

                    {/* Status & Delay Cause */}
                    <td className="py-3 px-3">
                      {isDelayed ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded-[3px] bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-700/50 text-[10px]">
                            +{row.stationData.delayMinutes}m DELAY
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-[#9194a1] truncate max-w-[160px]">
                            {row.stationData.delayRootCause === 'TSR_SPEED_RESTRICTION'
                              ? '⚠️ Caution TSR'
                              : row.stationData.delayRootCause === 'PRECEDING_TRAIN_CASCADE'
                              ? '⚡ Cascade Delay'
                              : row.stationData.delayRootCause}
                          </span>
                        </div>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-[3px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-700/50 text-[10px]">
                          ON TIME (96% CONF)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400 dark:text-slate-600">
                  No trains found matching the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PidsStationBoard;
