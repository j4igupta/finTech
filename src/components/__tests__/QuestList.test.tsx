import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuestList } from '../QuestList';

describe('QuestList', () => {
  it('renders quest list', async () => {
    render(<QuestList />);
    expect(await screen.findByText('Read 2 earnings summaries')).toBeInTheDocument();
    expect(await screen.findByText('Diversify into healthcare')).toBeInTheDocument();
  });

  it('allows completing a quest', async () => {
    render(<QuestList />);
    const questItem = await screen.findByText(/Read 2 earnings summaries/i);
    await userEvent.click(questItem);
    expect(await screen.findByText('✓ Completed')).toBeInTheDocument();
    expect(await screen.findByText('XP: 50')).toBeInTheDocument();
    expect(await screen.findByText('Streak: 2 days')).toBeInTheDocument();
  });
});