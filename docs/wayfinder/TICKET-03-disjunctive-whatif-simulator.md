# TICKET-03: Disjunctive What-If Rescheduling Sandbox

**Map:** [Wayfinder Map](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/MAP.md)  
**Label:** `wayfinder:prototype`  
**Status:** Open (Frontier)  
**Execution Mode:** HITL / AFK  
**Blocked By:** [TICKET-02](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/TICKET-02-kinematic-ml-forecasting-engine.md)  
**Blocks:** [TICKET-04](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/TICKET-04-marey-string-chart-visualizer.md)  

---

## Question

How can Section Controllers simulate dynamic precedence swaps (e.g. looping Train 12137 at Thane to give clear passage to Train 12345 Vande Bharat) and observe immediate ripple delay resolution?

---

## Deliverables

1. POST `/api/v1/eta/what-if` endpoint in `backend/routers/eta.py`.
2. Client method `simulateWhatIfScenario()` in `src/lib/apiClient.ts` with instant mock resolution.
3. Disjunctive conflict detection ensuring minimum safety headway $\Delta t_{\text{clear}} \ge 15\text{ mins}$.

---

## Acceptance Criteria

- [ ] Simulating a 6-minute loop hold on Train 12137 eliminates conflict on UP Fast line and recalculates Train 12345 delay to $0\text{ mins}$.
- [ ] Network punctuality metric is updated in real time.
