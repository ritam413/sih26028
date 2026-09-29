"""
Pydantic v2 models for Dynamic Train ETA Forecasting & Live RTIS Telemetry.
Strictly maps to src/types/apiContracts.ts
"""
from typing import List, Optional, Literal
from pydantic import BaseModel, Field

SignalAspect = Literal['RED', 'YELLOW', 'DOUBLE_YELLOW', 'GREEN']
DelayRootCause = Literal[
    'NOMINAL',
    'TSR_SPEED_RESTRICTION',
    'SIGNAL_HOLD',
    'PRECEDING_TRAIN_CASCADE',
    'PLATFORM_CONGESTION',
    'WEATHER_FOG_IMPACT'
]


class ConfidenceIntervalModel(BaseModel):
    p10EarliestMinutes: float
    p90LatestMinutes: float


class DynamicStationEtaModel(BaseModel):
    stationCode: str
    stationName: str
    chainageKm: float
    scheduledArrivalMinutes: float
    scheduledDepartureMinutes: float
    predictedEtaP50Minutes: float
    confidenceInterval: ConfidenceIntervalModel
    delayMinutes: float
    delayRootCause: DelayRootCause
    recoveryMarginMinutes: float = 0.0
    platformAssigned: str = "1"


class LiveTrainTelemetryModel(BaseModel):
    trainNumber: str
    trainName: str
    trainType: str
    originStation: str
    destinationStation: str
    currentKm: float
    currentSpeedKmh: float
    maxPermissibleSpeedKmh: float
    currentTrackCircuit: str
    signalAspectAhead: SignalAspect
    activeTsrLimitKmh: Optional[float] = None
    routeProgressPct: float
    lastGpsUpdateTimestamp: str
    stations: List[DynamicStationEtaModel]


class EtaAccuracyMetricsModel(BaseModel):
    corridorName: str
    meanAbsolutePercentageErrorPct: float
    rootMeanSquaredErrorMinutes: float
    onTimePunctualityIndexPct: float
    evaluatedTrainCount: int
    modelConfidenceScore: float
    lastCalibrationTimestamp: str


class WhatIfScenarioRequest(BaseModel):
    trainNumber: str
    holdStation: str
    holdDurationMinutes: float


class ImpactedTrainDetail(BaseModel):
    trainNumber: str
    addedDelayMinutes: float
    cascadeReason: str


class WhatIfScenarioResponse(BaseModel):
    impactedTrains: List[ImpactedTrainDetail]
    recommendation: str
