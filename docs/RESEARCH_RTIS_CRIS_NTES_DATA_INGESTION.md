# Primary Research: CRIS RTIS, ISRO GAGAN, & NTES Schema Ingestion for SIH26028 Dynamic ETA

**Document Status:** Grounded Primary Specification  
**Authority:** Centre for Railway Information Systems (CRIS) / Ministry of Railways / ISRO  
**Aligned Hackathon Problem Statement:** SIH26028 (*Dynamic Forecast of Expected Time of Arrival (ETA) for Coaching Trains*)  

---

## 1. Official Grounding & Architecture: Real-Time Train Information System (RTIS)

### 1.1 System Genesis & Operational Ownership
The **Real-Time Train Information System (RTIS)** is a joint initiative by the **Centre for Railway Information Systems (CRIS)** and the **Indian Space Research Organisation (ISRO)** to automate train tracking, delay logging, and section occupancy plotting on the **Control Office Application (COA)** and the **National Train Enquiry System (NTES)** without manual station master interventions.

### 1.2 On-Locomotive Hardware Architecture
1. **Outdoor Unit (RMT - Rail MSS Terminal):**
   - Mounted on the locomotive roof.
   - S-band Mobile Satellite Service (MSS) transceiver connecting to ISRO **GSAT** satellites.
   - Dual-constellation GPS / **GAGAN** (GPS Aided Geo-Augmented Navigation) receiver.
2. **Indoor Unit (IRN - Indian Rail Navigator):**
   - Mounted in the Loco Pilot cab.
   - Display Processing Engine (DPE) running an embedded Linux OS (RHEL) on quad-core Intel architecture.
   - Integrated 4G/3G cellular transceiver (ICM) with automatic fallback to satellite MSS in remote non-cellular sections.

### 1.3 Transmission Cadence & Data Payload
* **Mid-Section Reporting Interval:** Continuous updates every **30 seconds**.
* **Station Event Reporting:** Triggered immediately upon entering, halting, or departing station GPS geofences ($<10\text{m}$ accuracy).
* **Core RTIS Telemetry Frame:**
```json
{
  "locoId": "WAP7-30245",
  "trainNumber": "12345",
  "timestamp": "2026-09-29T10:45:30Z",
  "latitude": 19.1860,
  "longitude": 72.9756,
  "speedKmh": 104.5,
  "headingDegrees": 45.2,
  "currentTrackCircuit": "TC-THANE-UP-02",
  "signalAspectAhead": "DOUBLE_YELLOW",
  "source": "ISRO_GAGAN_RTIS",
  "satelliteFixStatus": "DGPS_3D_LOCK"
}
```

---

## 2. Schedule Baseline: NTES & Working Time Table (WTT)

Official static schedules are sourced from the Central Railway Working Time Table (WTT) and NTES:

| Train No | Train Name | Class | Route | MPS ($v_{\max}$) | Key Stops |
|---|---|---|---|---|---|
| **12345** | CSMT-Solapur Vande Bharat | Premium Superfast | CSMT $\to$ KYN | $130\text{ km/h}$ | CSMT (06:05), DR (06:14), TNA (06:33), KYN (06:53) |
| **12137** | Punjab Mail | Superfast Mail | CSMT $\to$ KYN | $110\text{ km/h}$ | CSMT (19:35), DR (19:47), KYN (20:32) |
| **22691** | Bengaluru Rajdhani | Premium Rajdhani | KYN $\to$ CSMT | $130\text{ km/h}$ | KYN (05:10), TNA (05:30), CSMT (06:15) |
| **12051** | Madgaon Jan Shatabdi | Intercity Superfast | CSMT $\to$ KYN | $110\text{ km/h}$ | CSMT (05:10), TNA (05:43), KYN (06:03) |

---

## 3. Dynamic ETA Ingestion & Forecast Pipeline

The dynamic forecasting pipeline bridges static WTT tables with RTIS real-time feeds:

```
[Official NTES WTT Baseline] ──┐
                               ├──► [Hybrid Kinematics + ML Graph Engine] ──► [P10/P50/P90 Dynamic ETA]
[30-Sec RTIS GPS + Signals]  ──┘
```

1. **Step 1 (Ingest):** Pull scheduled arrival $T_{\text{sched}}$ from NTES baseline.
2. **Step 2 (Kinematic Projection):** Compute nominal traversal time across upcoming track segments given current velocity $v$ and TSR limits $v_{\text{TSR}}$ from Caution Orders (Form T/409).
3. **Step 3 (ML Congestion Factor):** Predict residual knock-on delay $\Delta t$ using downstream track circuit occupancy and signal aspect sequences.
4. **Step 4 (Confidence Interval):** Compute $T_{\text{ETA}}(P10)$, $T_{\text{ETA}}(P50)$, $T_{\text{ETA}}(P90)$ uncertainty bands.
