# TICKET-01: Data Layer & 30s RTIS Telemetry Ingestion

**Map:** [Wayfinder Map](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/MAP.md)  
**Label:** `wayfinder:task`  
**Status:** Open (Frontier)  
**Execution Mode:** AFK  

---

## Question

How should the data contracts and mock dataset in `src/types/apiContracts.ts` and `src/lib/mockData.ts` be structured to seamlessly ingest 30-second ISRO GAGAN/RTIS GPS packets, Central Railway Working Time Tables (WTT), and Caution Orders (Form T/409 TSRs)?

---

## Deliverables

1. Complete `DynamicStationEta`, `LiveTrainTelemetry`, `DelayRootCause`, `EtaAccuracyMetrics`, `WhatIfScenarioRequest`, and `WhatIfScenarioResult` interfaces in `src/types/apiContracts.ts`.
2. Full mock data records for 6 Central Railway coaching trains (`12345`, `12137`, `22691`, `12051`, `97045`, `97062`) in `src/lib/mockData.ts`.
3. Offline fallback integration in `src/lib/apiClient.ts`.

---

## Acceptance Criteria

- [ ] All 6 trains have valid chainage coordinates ($0 \le \text{km} \le 54.0$).
- [ ] Active TSRs accurately reflect $30\text{ km/h}$ at Kurla-Bhandup for Train 12137.
- [ ] TypeScript compiler passes with zero type errors (`npx tsc --noEmit`).
