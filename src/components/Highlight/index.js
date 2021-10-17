import React from 'react';
import PropTypes from 'prop-types';

import hashString from '../../utils/hashString';
import {colors} from '../../constant';

const styles = {
  text: {},
  highlightText: {
    color: 'transparent',
    pointerEvents: 'none',
    padding: '0',
    whiteSpace: 'pre-wrap',
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
    fontSize: 14,
  },
  zeroPos: {
    textAlign: 'left',
    position: 'absolute',
    top: 1,
    left: 1,
  },
};

const Highlight = ({text, entity, index}) => {
  const start = text.substr(0, entity.start);
  const value = text.substr(entity.start, entity.end - entity.start);
  const end = text.substr(entity.end);
  const color = colors[hashString(entity.label) % colors.length].bg;
  
  return (
    <div key={index} style={{...styles.zeroPos, ...styles.highlightText}}>
    <span>{start}</span>
    <span style={{ opacity: 0.3, backgroundColor: color }}>
      {value}
    </span>
    <span>{end}</span>
  </div>
  );
}

Highlight.propTypes = {
  text: PropTypes.string.isRequired,
  entity: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
}

export default Highlight;
