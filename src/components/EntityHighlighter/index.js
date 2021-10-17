import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import TextHighlight from '../TextHighlight';

import { EntityLabels } from '../../constant';

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
  button: {
    border: '0 none',
    cursor: 'pointer',
    backgroundColor: 'transparent',
  },
};

const EntityHighlighter = ({ text, entities, onChange }) => {
  let inputNode = useRef(null);

  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [entityText, setEntityText] = useState('');

  useEffect(() => {
     const selectionChangeHandler = (event) => {
      const target = event.target;

      if(target === inputNode) {
        setSelectionStart(inputNode.selectionStart);
        setSelectionEnd(inputNode.selectionEnd)
      }
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

    // update the entity boundaries

    entities.forEach(entity => {
      const oldSelection = text.substr(entity.start, entity.end - entity.start);

      const findClosestStart = (lastMatch) => {
        if (lastMatch == null) {
          const index = newText.indexOf(oldSelection);
          if (index === -1) {
            return index;
          }
          return findClosestStart(index);
        }
        const from = lastMatch + oldSelection.length;
        const index = newText.indexOf(oldSelection, from);
        if (index === -1) {
          return lastMatch;
        }
        const prevDiff = Math.abs(entity.start - lastMatch);
        const nextDiff = Math.abs(entity.start - index);
        if (prevDiff < nextDiff) {
          return lastMatch;
        }
        return findClosestStart(index);
      }
      const start = findClosestStart();
      if (start === -1) {
        return;
      }

      NewEntities.push({
        ...entity,
        start,
        end: start + oldSelection.length,
      });
    });

    onChange(newText, NewEntities);
  }

  const findEntities = (index) => {
    return entities.filter(e => e.start <= index && e.end > index);
  };

  const deleteEntity = (entity) => {
    const newList = entities.filter((item) => item.start !== entity.start && item.end !== entity.end && item.label !== entity.label);
    onChange(text, newList);
  }

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
          onChange={event => handleTextChange(event)}
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
      <div>
        <select name="entity labels"
          value={entityText}
          onChange={(event) => setEntityText(event.target.value)}
          disabled={selectionStart === selectionEnd}>
            <option value="">Entity Label</option>
            {EntityLabels.map((entity, index) => (
              <option key={index} value={entity.label}>{entity.label}</option>
            ))}
        </select>
        <button
          onClick={() => onChange(text, entities.concat({ start: selectionStart, end: selectionEnd, label: entityText }))}
          disabled={selectionStart === selectionEnd}
        >
          Add entity for selection
        </button>
      </div>
      {selectionStart === selectionEnd && findEntities(selectionStart).length > 0 && (
        <div style={styles.buttonContainer}>
          {findEntities(selectionStart).map((entity,index) => (
            <span key={index}>
              {text.substring(entity.start, entity.end)} ({entity.label})
                <button
                  style={styles.button}
                  onClick={() => deleteEntity(entity)}
                >
                <span role="img" aria-label="Delete">🗑️</span>
                </button>
            </span>
          ))}
        </div>
      )}
    </>
  )
}

EntityHighlighter.propTypes = {
  text: PropTypes.string.isRequired,
  entities: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default EntityHighlighter;
