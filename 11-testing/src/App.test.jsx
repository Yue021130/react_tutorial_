import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Counter', () => {
  it('should render initial count of 0', () => {
    render(<App />);
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('should increment on + click', () => {
    render(<App />);
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('should decrement on - click', () => {
    render(<App />);
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('-'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });
});
