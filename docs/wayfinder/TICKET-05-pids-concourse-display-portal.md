# TICKET-05: PIDS Concourse Display Board & Public Route

**Map:** [Wayfinder Map](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/MAP.md)  
**Label:** `wayfinder:prototype`  
**Status:** Open (Frontier)  
**Execution Mode:** HITL  
**Blocked By:** [TICKET-01](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/TICKET-01-data-layer-rtis-ingestion.md)  

---

## Question

How should station concourse displays (PIDS) communicate dynamic arrival times, confidence scores, delay reasons, and assigned platforms to passengers across Mumbai CSMT, Dadar, Thane, and Kalyan stations?

---

## Deliverables

1. [`src/components/Passenger/PidsStationBoard.tsx`](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/src/components/Passenger/PidsStationBoard.tsx):
   - Station switcher (`CSMT`, `Dadar Central`, `Thane`, `Kalyan Jn`).
   - High-contrast digital LED/LCD style typography with live IST clock.
   - Dynamic ETA vs Scheduled Arrival comparison.
   - Plain-language delay root cause badges (e.g., `+14m Caution Order at Kurla`, `On Time (Green Wave)`).
   - Assigned platform & blinking live arrival status.
2. Dedicated public route [`src/app/pids/page.tsx`](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/src/app/pids/page.tsx).
3. Navigation link in [`src/components/Navbar.tsx`](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/src/components/Navbar.tsx).

---

## Acceptance Criteria

- [ ] Switching between stations filters incoming trains accurately.
- [ ] Auto-refresh countdown updates smoothly every second.
- [ ] Responsive on both desktop screens and large concourse displays.
