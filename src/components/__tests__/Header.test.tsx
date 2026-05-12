import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
  it('renders the brand name', () => {
    render(<Header />);
    expect(screen.getByText('Financial MMO')).toBeInTheDocument();
  });

  it('displays the NetWorth component', () => {
    render(<Header />);
    expect(screen.getByText('Net Worth:')).toBeInTheDocument();
  });

  it('displays the Streaks component', () => {
    render(<Header />);
    expect(screen.getByText('Streak:')).toBeInTheDocument();
  });
});