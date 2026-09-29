// tests/setup.ts
import { vi } from 'vitest';
import React from 'react';

// Mock next/link
vi.mock('next/link', () => {
  return {
    default: ({ children, href, ...rest }: any) => {
      return React.createElement('a', { href, ...rest }, children);
    }
  };
});

// Mock next/dynamic
vi.mock('next/dynamic', () => {
  return {
    default: (loader: () => Promise<any>, options?: any) => {
      const Component = (props: any) => {
        return React.createElement('div', { 'data-testid': 'dynamic-mock' }, options?.loading ? options.loading() : null);
      };
      return Component;
    }
  };
});

// Mock next/navigation
vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
  };
});
