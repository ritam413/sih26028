# TICKET-02: Kinematic & Probabilistic ML Forecasting Engine

**Map:** [Wayfinder Map](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/MAP.md)  
**Label:** `wayfinder:prototype`  
**Status:** Open (Frontier)  
**Execution Mode:** AFK  
**Blocks:** [TICKET-03](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/TICKET-03-disjunctive-whatif-simulator.md), [TICKET-04](file:///c:/CCodes_WebDevelopment/hckthon/sih26028/docs/wayfinder/TICKET-04-marey-string-chart-visualizer.md)  

---

## Question

How should the Python hybrid forecasting engine compute physics-bounded segment traversal times, signal aspect damping, and probabilistic uncertainty quantiles ($P_{10} \le P_{50} \le P_{90}$)?

---

## Deliverables

1. `backend/ml/eta_predictor.py` implementing:
   - Kinematic segment integrator: $\int \frac{1}{\min(v_{\text{mps}}, v_{\text{TSR}})} ds + t_{\text{accel}} + t_{\text{decel}}$
   - 4-Aspect signal damping penalty (Green = $0\text{s}$, Double Yellow = $+45\text{s}$, Yellow = $+90\text{s}$, Red = hold)
   - $P_{10}, P_{50}, P_{90}$ quantile computation with modulo-1440 circular time arithmetic.
2. `backend/routers/eta.py` exposing REST routes `/api/v1/eta/forecast/{train_number}` and `/api/v1/eta/corridor/{corridor_id}`.
3. Python unit tests in `backend/test_eta_predictor.py`.

---

## Acceptance Criteria

- [ ] Strict quantile monotonicity: $P_{10} \le P_{50} \le P_{90}$ holds across 100% of evaluation cases.
- [ ] No predicted train speed exceeds sectional MPS ($130\text{ km/h}$ for Vande Bharat / Rajdhani, $110\text{ km/h}$ for Mail/Express).
- [ ] Pytest passes all test assertions.
