import React, { useState, useEffect, useRef } from 'react';

import Hightlight from '../Highlight';

// import styles from './index.module.css';

const styles = {
  text: {},
  input: {
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
    fontSize: 14,
    background: 'none',
    border: '1px solid',
    width: '100%',
    resize: 'none',
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
  })

  const handleTextChange = (event) => {
    const { text: oldText, entities: oldEntities, onChange } = this.props;
    const text = event.target.value;
    const entities = [];

    // update the entity boudaries

    oldEntities.forEach(oldEntity => {
      const oldSelection = oldText.substr(oldEntity.start, oldEntity.end - oldEntity.start);

      function findClosestStart(lastMatch) {
        if (lastMatch == null) {
          const index = text.indexOf(oldSelection);
          if (index === -1) {
            return index;
          }
          return findClosestStart(index);
        }
        const from = lastMatch + oldSelection.length;
        const index = text.indexOf(oldSelection, from);
        if (index === -1) {
          return lastMatch;
        }
        const prevDiff = Math.abs(oldEntity.start - lastMatch);
        const nextDiff = Math.abs(oldEntity.start - index);
        if (prevDiff < nextDiff) {
          return lastMatch;
        }
        return findClosestStart(index);
      }
      const start = findClosestStart();
      if (start === -1) {
        return;
      }

      entities.push({
        ...oldEntity,
        start,
        end: start + oldSelection.length,
      });
    });

    onChange(text, entities);
  }

  const findEntities = (index) => {
    return entities.filter(e => e.start <= index && e.end > index);
  };

  // const focus = () => {
  //   if (inputNode) inputNode.focus();
  // }

  return (
    <>
      <div style={{ position: 'relative' }}>
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
          <Hightlight 
            text={text} 
            entity={entity} 
            key={index}
            index={index}
          />
        ))}
      </div>
      <br />
      <div>
          <input
            type="text"
            placeholder="Entity label"
            value={entityText}
            onChange={(event) => setEntityText(event.target.value)}
            disabled={selectionStart === selectionEnd}
          />
          <button
            onClick={() => onChange(text, entities.concat({ start: selectionStart, end: selectionEnd, label: entityText }))}
            disabled={selectionStart === selectionEnd}
          >Add entity for selection</button>
        </div>
        {selectionStart === selectionEnd && findEntities(selectionStart).length > 0 && (
          <div style={{ marginTop: 10 }}>
            {findEntities(selectionStart).map((e,i) => (
              <span key={i}>
                {text.substring(e.start, e.end)} ({e.label})
                <button
                  style={{ border: '0 none', cursor: 'pointer', backgroundColor: 'transparent' }}
                  onClick={() => this.deleteEntity(e)}
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

export default EntityHighlighter;
