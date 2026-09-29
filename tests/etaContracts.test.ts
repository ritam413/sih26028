import { describe, it, expect } from 'vitest';
import {
  MOCK_LIVE_TRAINS,
  MOCK_ETA_ACCURACY_METRICS,
  MOCK_TRAIN_SCHEDULES
} from '@/lib/mockData';
import {
  fetchLiveTrainTelemetry,
  fetchCorridorLiveTrains,
  fetchEtaAccuracyMetrics,
  simulateWhatIfScenario
} from '@/lib/apiClient';

describe('SIH26028 Layer A / Ticket-01: Dynamic Train ETA Contracts & Ingestion', () => {
  it('validates grounded RTIS live train telemetry records and fields', () => {
    expect(MOCK_LIVE_TRAINS.length).toBeGreaterThanOrEqual(4);

    const vandeBharat = MOCK_LIVE_TRAINS.find((t) => t.trainNumber === '12345');
    expect(vandeBharat).toBeDefined();
    expect(vandeBharat?.trainName).toContain('Vande Bharat');
    expect(vandeBharat?.maxPermissibleSpeedKmh).toBe(130);
    expect(vandeBharat?.routeProgressPct).toBeGreaterThan(0);
    expect(vandeBharat?.routeProgressPct).toBeLessThanOrEqual(100);
    expect(vandeBharat?.signalAspectAhead).toBe('GREEN');

    const punjabMail = MOCK_LIVE_TRAINS.find((t) => t.trainNumber === '12137');
    expect(punjabMail).toBeDefined();
    expect(punjabMail?.activeTsrLimitKmh).toBe(30);
    expect(punjabMail?.signalAspectAhead).toBe('DOUBLE_YELLOW');
  });

  it('enforces mathematical confidence interval invariant: P10 <= P50 <= P90 across all stations', () => {
    MOCK_LIVE_TRAINS.forEach((train) => {
      expect(train.stations.length).toBeGreaterThan(0);
      train.stations.forEach((stn) => {
        const { p10EarliestMinutes, p90LatestMinutes } = stn.confidenceInterval;
        const p50 = stn.predictedEtaP50Minutes;

        expect(p10EarliestMinutes).toBeLessThanOrEqual(p50);
        expect(p50).toBeLessThanOrEqual(p90LatestMinutes);
        expect(stn.chainageKm).toBeGreaterThanOrEqual(0);
        expect(stn.chainageKm).toBeLessThanOrEqual(54);
      });
    });
  });

  it('verifies dynamic ETA accuracy metrics baseline', () => {
    expect(MOCK_ETA_ACCURACY_METRICS.meanAbsolutePercentageErrorPct).toBeLessThan(5.0);
    expect(MOCK_ETA_ACCURACY_METRICS.rootMeanSquaredErrorMinutes).toBeLessThan(3.0);
    expect(MOCK_ETA_ACCURACY_METRICS.onTimePunctualityIndexPct).toBeGreaterThan(90.0);
    expect(MOCK_ETA_ACCURACY_METRICS.modelConfidenceScore).toBeGreaterThan(0.9);
  });

  it('verifies train schedule slots link cleanly to live telemetry', () => {
    const slot1 = MOCK_TRAIN_SCHEDULES[0];
    expect(slot1.liveTelemetry).toBeDefined();
    expect(slot1.liveTelemetry?.trainNumber).toBe('12345');
    expect(slot1.liveTelemetry?.stations.length).toBeGreaterThan(0);
  });

  it('tests apiClient fetchLiveTrainTelemetry fallback behavior', async () => {
    const telemetry = await fetchLiveTrainTelemetry('12345');
    expect(telemetry).not.toBeNull();
    expect(telemetry?.trainNumber).toBe('12345');
  });

  it('tests apiClient fetchCorridorLiveTrains fallback behavior', async () => {
    const liveTrains = await fetchCorridorLiveTrains();
    expect(liveTrains.length).toBeGreaterThanOrEqual(4);
    expect(liveTrains[0].trainNumber).toBe('12345');
  });

  it('tests apiClient fetchEtaAccuracyMetrics fallback behavior', async () => {
    const metrics = await fetchEtaAccuracyMetrics();
    expect(metrics.meanAbsolutePercentageErrorPct).toBe(2.4);
    expect(metrics.onTimePunctualityIndexPct).toBe(92.4);
  });

  it('tests apiClient simulateWhatIfScenario fallback simulation', async () => {
    const result = await simulateWhatIfScenario({
      trainNumber: '12137',
      holdStation: 'DR',
      holdDurationMinutes: 10
    });
    expect(result.impactedTrains.length).toBeGreaterThan(0);
    expect(result.impactedTrains[0].trainNumber).toBe('12137');
    expect(result.impactedTrains[0].addedDelayMinutes).toBe(10);
    expect(result.recommendation).toContain('Recommended');
  });
});
