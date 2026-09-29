# TICKET-04: Marey String Chart & Trajectory Envelope

**Map:** [Wayfinder Map](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/MAP.md)  
**Label:** `wayfinder:prototype`  
**Status:** Open (Frontier)  
**Execution Mode:** HITL  
**Blocked By:** [TICKET-01](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/TICKET-01-data-layer-rtis-ingestion.md), [TICKET-03](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/TICKET-03-disjunctive-whatif-simulator.md)  

---

## Question

How should the Corridor String Chart ([`src/components/Planner/CorridorStringChart.tsx`](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/src/components/Planner/CorridorStringChart.tsx)) visually represent historical trajectory, real-time train head, dynamic $P_{50}$ prediction, and $P_{10}\text{--}P_{90}$ uncertainty envelopes?

---

## Deliverables

1. Enhanced string chart rendering:
   - Solid polyline for historical covered section.
   - Animated pulsing train head marker at current chainage and IST clock.
   - Dashed projected string for dynamic predicted arrival.
   - Shaded translucent polygon for $P_{10}\text{--}P_{90}$ arrival interval.
2. Interactive What-If Precedence Sandbox toggle directly on the planner canvas.
3. Rich hover tooltip showing train telemetry (speed, signal aspect, active TSR limit, delay root cause).

---

## Acceptance Criteria

- [ ] Clear visual distinction between scheduled WTT line and dynamic RTIS forecast line.
- [ ] Hover cards display speed and delay root-cause badges without flickering.
- [ ] What-If slider immediately re-renders modified trajectory strings.
