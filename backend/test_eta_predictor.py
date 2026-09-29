"""
Pytest Test Suite for Dynamic Train ETA Forecasting (SIH26028).
Verifies kinematics, signal residual delay, confidence intervals, and REST API endpoints.
"""
import pytest
from fastapi.testclient import TestClient
from main import app
from ml.eta_predictor import (
    calculate_kinematic_travel_time,
    estimate_signal_residual_delay,
    compute_station_quantile_eta,
    evaluate_what_if_cascade
)

client = TestClient(app)


def test_kinematic_travel_time():
    """Verify nominal and TSR-affected travel time calculations."""
    # 54km at 120 km/h nominal -> 27.0 mins
    nominal = calculate_kinematic_travel_time(distance_km=54.0, max_speed_kmh=120.0)
    assert round(nominal, 1) == 27.0

    # With 30 km/h TSR over 6km zone
    with_tsr = calculate_kinematic_travel_time(
        distance_km=54.0,
        max_speed_kmh=120.0,
        active_tsr_kmh=30.0,
        tsr_length_km=6.0
    )
    assert with_tsr > nominal
    assert round(with_tsr - nominal, 1) >= 8.0  # At least 8 mins lost


def test_signal_residual_delay():
    """Verify signal aspect delay penalty."""
    assert estimate_signal_residual_delay("GREEN") == 0.0
    assert estimate_signal_residual_delay("DOUBLE_YELLOW") > 0.0
    assert estimate_signal_residual_delay("YELLOW") > estimate_signal_residual_delay("DOUBLE_YELLOW")
    assert estimate_signal_residual_delay("RED") >= 10.0


def test_confidence_interval_ordering_invariant():
    """Verify that P10 <= P50 <= P90 strictly holds."""
    quantiles = compute_station_quantile_eta(scheduled_arrival_min=360.0, delay_min=14.0)
    p10 = quantiles["p10EarliestMinutes"]
    p50 = quantiles["predictedEtaP50Minutes"]
    p90 = quantiles["p90LatestMinutes"]

    assert p10 <= p50
    assert p50 <= p90
    assert p50 == 374.0


def test_what_if_cascade_simulation():
    """Verify what-if delay propagation behind held train."""
    res = evaluate_what_if_cascade(
        hold_train_number="12137",
        hold_station="DR",
        hold_duration_minutes=15.0
    )
    assert len(res["impactedTrains"]) >= 2
    assert res["impactedTrains"][0]["trainNumber"] == "12137"
    assert res["impactedTrains"][0]["addedDelayMinutes"] == 15.0
    assert "Recommended" in res["recommendation"]


def test_fastapi_eta_corridor_endpoint():
    """Verify GET /api/v1/eta/corridor/CR-BB-01 returns live trains with valid confidence bands."""
    response = client.get("/api/v1/eta/corridor/CR-BB-01")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 4

    vande = next((t for t in data if t["trainNumber"] == "12345"), None)
    assert vande is not None
    assert vande["maxPermissibleSpeedKmh"] == 130
    assert len(vande["stations"]) > 0

    for stn in vande["stations"]:
        ci = stn["confidenceInterval"]
        assert ci["p10EarliestMinutes"] <= stn["predictedEtaP50Minutes"] <= ci["p90LatestMinutes"]


def test_fastapi_eta_forecast_endpoint():
    """Verify GET /api/v1/eta/forecast/12137."""
    response = client.get("/api/v1/eta/forecast/12137")
    assert response.status_code == 200
    data = response.json()
    assert data["trainNumber"] == "12137"
    assert data["trainName"] == "Punjab Mail"


def test_fastapi_eta_accuracy_metrics_endpoint():
    """Verify GET /api/v1/eta/accuracy-metrics."""
    response = client.get("/api/v1/eta/accuracy-metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["meanAbsolutePercentageErrorPct"] == 2.4
    assert data["onTimePunctualityIndexPct"] == 92.4


def test_fastapi_what_if_endpoint():
    """Verify POST /api/v1/eta/what-if."""
    payload = {
        "trainNumber": "12137",
        "holdStation": "DR",
        "holdDurationMinutes": 12.0
    }
    response = client.post("/api/v1/eta/what-if", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["impactedTrains"]) >= 2
    assert "recommendation" in data
