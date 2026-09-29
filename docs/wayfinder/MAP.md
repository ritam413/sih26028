# Wayfinder Map: SIH26028 Dynamic Train ETA Forecasting

**Label:** `wayfinder:map`  
**Status:** Completed (100% Implemented & Verified)  

---

## Destination

Deliver an end-to-end, multi-engine Dynamic Train ETA Prediction and Optimization System for Indian Railways (CRIS / SIH26028) that outperforms static NTES and black-box ML models by integrating 30s RTIS GPS telemetry, physics-kinematic bounds, 4-aspect signal progression, Spatio-Temporal Graph cascade modeling, Section Controller What-If sandbox, and Passenger PIDS concourse display boards across the Mumbai CSMT–Kalyan 54 km quad-track corridor.

---

## Notes

- **Domain:** Indian Railways, CRIS RTIS (ISRO GSAT MSS / GAGAN), NTES WTT, 4-Aspect Signalling, Quad-Track Suburban/Mail-Express Corridors.
- **Skills:** `beads`, `multica`, `tdd`, `i-have-adhd`, `taste`.
- **Standing Preferences:** Strict mathematical monotonicity ($P_{10} \le P_{50} \le P_{90}$), dual-mode live backend + instant offline fallback, full preservation of existing 3D digital twins and RBAC modules.

---

## Implemented & Verified Tickets

1. [TICKET-01: Data Layer & 30s RTIS Telemetry Ingestion](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/TICKET-01-data-layer-rtis-ingestion.md) (`Status: Complete ✅`)
2. [TICKET-02: Kinematic & Probabilistic ML Forecasting Engine](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/TICKET-02-kinematic-ml-forecasting-engine.md) (`Status: Complete ✅`)
3. [TICKET-03: Disjunctive What-If Rescheduling Sandbox](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/TICKET-03-disjunctive-whatif-simulator.md) (`Status: Complete ✅`)
4. [TICKET-04: Marey String Chart & Trajectory Envelope](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/TICKET-04-marey-string-chart-visualizer.md) (`Status: Complete ✅`)
5. [TICKET-05: PIDS Concourse Display Board & Public Route](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/TICKET-05-pids-concourse-display-portal.md) (`Status: Complete ✅`)
6. [TICKET-06: Explainable Delay Decomposition & Audit Waterfall](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/TICKET-06-explainable-delay-audit-waterfall.md) (`Status: Complete ✅`)
7. [TICKET-07: Automated Verification & Handoff Gate](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/TICKET-07-verification-and-handoff-gate.md) (`Status: Complete ✅`)

---

## Decisions So Far

- [Official Grounding Decision](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/RESEARCH_RTIS_CRIS_NTES_DATA_INGESTION.md): Primary data schema grounded in official CRIS RTIS 30s satellite telemetry and Central Railway Working Time Tables.
- [SOTA Architecture Consensus](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/MULTICA_CONSENSUS_SIH26028.md): Unanimous 10/10 MULTICA decision selecting Hybrid Kinematic + Signal Damping + Quantiles over pure ML.
- [Circular Modulo-1440 Arithmetic](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/MULTICA_CONSENSUS_SIH26028.md): All train time calculations hardened against midnight rollover.

---

## Not Yet Specified (Fog of War)

- Automated integration with live National Train Enquiry System REST APIs if public key access is granted during live hackathon evaluation.
- Mobile push notification integration for Loco Pilot Kavach HUD in low-bandwidth cellular dead zones.

---

## Out of Scope

- Physical locomotive cab hardware firmware re-flashing (system interfaces with software telemetry frames).
- Non-standard freight rakes without GPS or speed limit profiles.
