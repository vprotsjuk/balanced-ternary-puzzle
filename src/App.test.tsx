import { render, screen } from '@testing-library/react';
import { GameView } from './components/GameView';

it('renders the mobile shell with board size buttons, displays, and input controls', () => {
  render(<GameView />);

  expect(screen.getByRole('button', { name: '2x2' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '3x3' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '4x4' })).toBeInTheDocument();
  expect(screen.getByText(/target/i)).toBeInTheDocument();
  expect(screen.getByText(/current sum/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /random/i })).toBeInTheDocument();
});
