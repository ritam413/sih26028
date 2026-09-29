// tests/PidsPage.test.tsx
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PidsPublicPage from '../src/app/pids/page';

describe('PidsPublicPage (/pids)', () => {
  it('renders PIDS public page with concourse headers and live station board', () => {
    const html = renderToStaticMarkup(<PidsPublicPage />);
    expect(html).toContain('Passenger Information Display System (PIDS)');
    expect(html).toContain('Central Railway');
    expect(html).toContain('LIVE GPS');
    expect(html).toContain('Open Corridor Planner');
    expect(html).toContain('Kalyan Jn');
  });
});
