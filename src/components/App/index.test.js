import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './index';

describe('App Component', () => {
  test('it should render instructions for completing task', () => {
    render(<App />);
    expect(screen.getByText('Entity Highlighting')).toBeInTheDocument();
  });
  
  test('it should render child component', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Add entity for selection/i)).toBeInTheDocument();
  });
});
