import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PidsStationBoard, formatTimeMinutes } from '@/components/Passenger/PidsStationBoard';
import { MOCK_LIVE_TRAINS } from '@/lib/mockData';

describe('SIH26028 Layer C / Ticket-03: PidsStationBoard Component', () => {
  it('renders PIDS board with live RTIS telemetry badge and station selector', () => {
    const html = renderToStaticMarkup(
      <PidsStationBoard liveTrains={MOCK_LIVE_TRAINS} defaultStationCode="KYN" />
    );

    expect(html).toContain('data-testid="pids-station-board"');
    expect(html).toContain('Passenger Information Display System (PIDS)');
    expect(html).toContain('Live RTIS Telemetry');
    expect(html).toContain('Kalyan Jn');
    expect(html).toContain('CSMT (Mumbai)');
  });

  it('renders scheduled trains with dynamic ETA and P10-P90 confidence bands', () => {
    const html = renderToStaticMarkup(
      <PidsStationBoard liveTrains={MOCK_LIVE_TRAINS} defaultStationCode="KYN" />
    );

    expect(html).toContain('12345');
    expect(html).toContain('Vande Bharat Express');
    expect(html).toContain('PF 4');

    expect(html).toContain('12137');
    expect(html).toContain('Punjab Mail');
    expect(html).toContain('+14m DELAY');
    expect(html).toContain('Caution TSR');
  });

  it('formats minutes into HH:MM time strings cleanly', () => {
    expect(formatTimeMinutes(365)).toBe('06:05');
    expect(formatTimeMinutes(1175)).toBe('19:35');
    expect(formatTimeMinutes(0)).toBe('00:00');
  });
});
