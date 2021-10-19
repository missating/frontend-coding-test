import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import EntityHighlighter from './index';

describe('EntityHighlighter Component', () => {
  test('it should render entity highlighter component correctly', () => {
    const { getAllByText } = render(
    <EntityHighlighter 
      text={'mock text'} 
      entities={[ { start: 160, end: 184, label: 'very important'}]} 
      onChange={jest.fn()}
    />);
    expect(getAllByText(/mock text/i)).toBeTruthy();
  });

  test('it should simulate text change for entity label and entity text', () => {
    const onChange = jest.fn();

    render(
      <EntityHighlighter  
        text={'mock test'} 
        entities={[{ start: 160, end: 184, label: 'very important'}]} 
        onChange={onChange}
      />);

      let textareaNode = screen.getByRole('textbox', { name: /entityText/i });
      act(() => {
        userEvent.type(textareaNode, 'Hello');
      });

      let inputNode = screen.getByRole('textbox', { name: /entityLabel/i });
      fireEvent.change(inputNode, { target: { value: 'important' } })
      expect(inputNode.value).toBe('important');

      fireEvent.click(screen.getByText(/Add entity for selection/i));
      expect(onChange).toHaveBeenCalled();
  });
});
