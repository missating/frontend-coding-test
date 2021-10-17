import React from 'react';
import { render } from '@testing-library/react';
import Highlight from './index';

const mockProps = {
  text: 'Venture Capital',
  entity: { start: 160, end: 184, label: 'very important'},
  index: 1,
}

describe('Highlight Component', () => {
  test('renders highlight div with the correct styles', () => {
    const {container} = render(<Highlight {...mockProps}/>);
    expect(container.firstChild).toHaveStyle(`color: transparent; textAlign: left`)
  });
});