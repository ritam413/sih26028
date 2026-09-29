# SOTA Research Report: Dynamic Train ETA Forecasting (SIH26028)

**Document Status:** Production Research & Architectural Foundation  
**Problem Statement:** SIH26028 — Dynamic Forecast of Expected Time of Arrival (ETA) for Coaching Trains  
**Primary Authorities:** Ministry of Railways, Centre for Railway Information Systems (CRIS), ISRO, and Academic Rail AI Literature  

---

## 1. Executive Summary & Existing Landscape

Dynamic Train ETA forecasting across Indian Railways' high-density mixed corridors (such as the Mumbai CSMT–Kalyan 54 km quad-track corridor) requires resolving the non-linear interaction between **static schedules (WTT/NTES)**, **real-time locomotive telemetry (RTIS/ISRO GAGAN)**, and **dynamic network constraints (TSRs, signal aspects, and cascade ripple delays)**.

Existing solutions in the industry and research landscape fall into three distinct generations:

```
[Gen 1: Static NTES / Sectional Averages]
       ↓ (High latency, static schedule minus average past lag)
[Gen 2: Pure ML / GBDT / LSTM Time Series]
       ↓ (Suffers from hallucinated speed profiles and zero physical bounds)
[Gen 3: Hybrid Physics-Kinematics + Spatio-Temporal Graph / Residual ML (Our System)]
```

---

## 2. Benchmark Analysis of Existing Approaches

| Approach / Solution | Strengths | Limitations | SOTA Applicability for SIH26028 |
|---|---|---|---|
| **1. Static NTES / CRIS COA Extrapolation** | • Authoritative timetable source<br>• Directly connected to station master logging | • Lacks mid-section velocity tracking<br>• Cannot predict deceleration caused by downstream caution orders (Form T/409) | Baseline schedule benchmark ($T_{\text{sched}}$) |
| **2. Pure Data-Driven ML (Random Forest / LightGBM / LSTM)** | • Captures historical time-of-day seasonal patterns<br>• Fast multi-station batch inference | • Violates kinematic limits ($v > v_{\max}$)<br>• Cannot handle dynamic dispatcher interventions (looping/holding) | Used as residual correction layer ($\Delta t_{\text{ML}}$) |
| **3. Spatio-Temporal Graph Neural Networks (RSTGCN / STGCN)** | • Models track network topology as graph nodes<br>• Captures delay contagion across adjacent lines | • Requires heavy GPU inference pipelines<br>• High cold-start latency for unplanned incidents | Topology graph mapping for cascade prediction |
| **4. Hybrid Kinematic-Physics + Quantile Bounds (Our SOTA Model)** | • Strictly bounded by physics ($v_{\max}$, braking curves, TSR zones)<br>• 30s RTIS GPS telemetry alignment<br>• $P_{10}/P_{50}/P_{90}$ probabilistic uncertainty intervals | • Requires high-quality track circuit and signal telemetry | **Chosen Production Architecture** |

---

## 3. Mathematical Grounding of the Hybrid SOTA Engine

### 3.1 Kinematic Base Traversal
For a track segment of length $d$ between chainage $s_1$ and $s_2$:

$$t_{\text{kinematic}} = \int_{s_1}^{s_2} \frac{1}{\min\left(v_{\text{mps}}(s), v_{\text{TSR}}(s)\right)} \, ds + t_{\text{accel}} + t_{\text{decel}}$$

Where:
- $v_{\text{mps}}(s)$ is the sectional Maximum Permissible Speed ($130\text{ km/h}$ for Vande Bharat / Rajdhani, $110\text{ km/h}$ for Superfast).
- $v_{\text{TSR}}(s)$ is the temporary speed restriction enforced by Caution Order Form T/409 (e.g., $30\text{ km/h}$ over track fracture / renewal zones).

### 3.2 Signal Aspect Progression Penalty
Upcoming signals inject deterministic velocity damping:

$$\Delta t_{\text{signal}} = \begin{cases} 
0\text{ s} & \text{Aspect = GREEN (Clear)} \\
+45\text{ s} & \text{Aspect = DOUBLE\_YELLOW (Attention, target } 60\text{ km/h}) \\
+90\text{ s} & \text{Aspect = YELLOW (Caution, target } 30\text{ km/h}) \\
\Delta t_{\text{hold}} & \text{Aspect = RED / STOP (Interlocking Lockout)}
\end{cases}$$

### 3.3 Probabilistic Uncertainty Quantiles ($P_{10}, P_{50}, P_{90}$)
Dynamic station arrival timestamps are estimated as:

$$\text{ETA}_{P50} = t_{\text{current}} + t_{\text{kinematic}} + \Delta t_{\text{signal}} + \Delta t_{\text{dwell}} + \hat{\epsilon}_{\text{residual}}$$

$$\text{ETA}_{P10} = \text{ETA}_{P50} - 1.28 \cdot \sigma_{\text{route}} \quad (\text{Ideal green wave, no trailing delays})$$

$$\text{ETA}_{P90} = \text{ETA}_{P50} + 1.28 \cdot \sigma_{\text{route}} + \Delta t_{\text{cascade}} \quad (\text{Trailing delay ripple})$$

---

## 4. Key Architectural Patterns for Implementation

1. **Dual-Path Data Pipeline**:
   - Primary: 30-second cadence ISRO GSAT MSS / 4G cellular RTIS telemetry frames.
   - Secondary: Static NTES Working Time Tables (WTT) and Caution Orders.
2. **Explainable Delay Decomposition**:
   - Disaggregate every minute of delay into constituent root causes:
     - **TSR Speed Restriction**
     - **Signal Hold / Headway Compression**
     - **Preceding Train Cascade**
     - **Platform Dwell Overrun**
3. **Dispatcher What-If Simulation Sandbox**:
   - Enables Section Controllers to simulate precedence swaps (e.g. holding Train 12137 at Thane Loop Line for 8 minutes to grant a clear high-speed corridor to Train 12345 Vande Bharat).
4. **Passenger Transparency (PIDS Display System)**:
   - Station arrival boards broadcasting dynamic $P_{50}$ ETA, confidence scores, delay reasons, and live platform allocations.
