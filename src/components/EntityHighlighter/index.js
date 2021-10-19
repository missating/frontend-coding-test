import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import updateEntityBoundary from '../../utils/updateEntityBoundary';
import TextHighlight from '../TextHighlight';

const styles = {
  container: {
    position: 'relative',
  },
  input: {
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
    fontSize: 14,
    background: 'none',
    border: '1px solid',
    width: '100%',
    resize: 'none',
  },
  buttonContainer: {
    marginTop: 10,
  },
  deleteButton: {
    border: '0 none',
    cursor: 'pointer',
    backgroundColor: 'transparent',
  },
  addButton: {
    cursor: 'pointer',
  },
};

const EntityHighlighter = ({ text, entities = [], onChange }) => {
  let inputNode = useRef(null);

  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [entityText, setEntityText] = useState('');

  useEffect(() => {
     const selectionChangeHandler = (event) => {
      const target = event.target;

      if(target === inputNode) {
        setSelectionStart(inputNode.selectionStart);
        setSelectionEnd(inputNode.selectionEnd);
      };
    };

    document.addEventListener('select', selectionChangeHandler, false);
    document.addEventListener('click', selectionChangeHandler, false);
    document.addEventListener('keydown', selectionChangeHandler, false);

    return () => {
      document.removeEventListener('select', selectionChangeHandler);
      document.removeEventListener('click', selectionChangeHandler);
      document.removeEventListener('keydown', selectionChangeHandler);
    };
  });

  const handleTextChange = (event) => {
    const newText = event.target.value;    
    const NewEntities = [];

    updateEntityBoundary(newText, NewEntities, entities, text);

    onChange(newText, NewEntities);
  };

  const findEntities = (selectionStart) => {
    return entities.filter(e => e.start <= selectionStart && e.end > selectionStart);
  };

  const deleteEntity = (entity) => {
    const deleted = entities.findIndex(e => e.start === entity.start && e.end === entity.end && e.label === entity.label);
    const result = [...entities.slice(0, deleted), ...entities.slice(deleted + 1)];
    onChange(text, result);
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    onChange(text, entities.concat({ start: selectionStart, end: selectionEnd, label: entityText }));
    setEntityText('');
  };

  return (
    <>
      <div style={styles.container}>
        <textarea
          style={styles.input}
          ref={node => { 
            if (node) {
              inputNode = node;
            }
         }}
          aria-label="entityText"
          name="entityText"
          onChange={(event) => handleTextChange(event)}
          value={text}
          rows={10}
        />
        {entities.map((entity, index) => (
          <TextHighlight 
            text={text} 
            entity={entity} 
            key={index}
            index={index}
          />
        ))}
      </div>
      <br />
      <form onSubmit={onFormSubmit}>
        <div>
          <input
            type="text"
            aria-label="entityLabel"
            name="entityLabel"
            placeholder="Entity label"
            value={entityText}
            onChange={(event) => setEntityText(event.target.value)}
            disabled={selectionStart === selectionEnd}
          />
          <button
            type="submit"
            disabled={entityText.length === 0}
            style={styles.addButton}
          >
            Add entity for selection
          </button>
        </div>
      </form>
      <div style={styles.buttonContainer}>
        {findEntities(selectionStart).map((entity,index) => (
          <span key={index}>
            {text.substring(entity.start, entity.end)} ({entity.label})
              <button
                style={styles.deleteButton}
                onClick={() => deleteEntity(entity)}
              >
              <span role="img" aria-label="Delete">🗑️</span>
              </button>
          </span>
        ))}
      </div>
    </>
  );
};

EntityHighlighter.propTypes = {
  text: PropTypes.string.isRequired,
  entities: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default EntityHighlighter;
