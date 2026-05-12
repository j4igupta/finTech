import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Providers } from '@/lib/providers';

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'queries'>) => {
  return render(ui, {
    wrapper: ({ children }) => <Providers>{children}</Providers>,
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render };