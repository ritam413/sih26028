# TICKET-06: Explainable Delay Decomposition & Audit Waterfall

**Map:** [Wayfinder Map](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/MAP.md)  
**Label:** `wayfinder:task`  
**Status:** Open (Frontier)  
**Execution Mode:** AFK  
**Blocked By:** [TICKET-01](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/TICKET-01-data-layer-rtis-ingestion.md)  

---

## Question

How can the Auditor Workspace ([`src/components/Auditor/AuditorWorkspace.tsx`](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/src/components/Auditor/AuditorWorkspace.tsx)) provide transparent, tamper-evident delay decomposition and model accuracy metrics (MAPE, RMSE)?

---

## Deliverables

1. "Dynamic ETA Model Accuracy & Delay Root Cause" tab in `AuditorWorkspace.tsx`:
   - Delay decomposition waterfall breakdown (TSR penalty vs. signal hold vs. station dwell overrun).
   - Residual error distribution curve and lead-time accuracy drift chart (15m vs. 60m horizon).
   - SHA-256 cryptographic verification seal.
2. Updated KPI metrics in [`src/components/Overview/KpiStrip.tsx`](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/src/components/Overview/KpiStrip.tsx).

---

## Acceptance Criteria

- [ ] Sum of decomposed delay constituents matches total train delay.
- [ ] Accuracy metrics display realistic calibrated figures (MAPE: $2.4\%$, RMSE: $1.8\text{ mins}$, Confidence: $96.2\%$).
- [ ] SHA-256 seal passes integrity checks.
