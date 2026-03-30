import { render, screen } from '@testing-library/react';
import App from './App';

it('renders the mobile shell with board size buttons, displays, and input controls', () => {
  render(<App />);

  expect(screen.getByRole('button', { name: '2x2' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '3x3' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '4x4' })).toBeInTheDocument();
  expect(screen.getByText(/target/i)).toBeInTheDocument();
  expect(screen.getByText(/current sum/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/value/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Enter' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /random/i })).toBeInTheDocument();
});
