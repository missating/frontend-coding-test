import React, { useState, useEffect } from 'react';

import styles from './index.module.css'
import logo from '../rasa.svg';
import EntityHighlighter from '../EntityHighlighter/index';

const App = () => {
  const [text, setText] = useState('Venture first mover advantage learning curve market ecosystem funding stealth disruptive social proof scrum project growth hacking niche market user experience graphical user interface.')
  const [entities, setEntities] = useState([
    { start: 160, end: 184, label: 'very important'},
    { start: 144, end: 159, label: 'very important'},
    { start: 62, end: 69, label: 'important' },
    { start: 116, end: 130, label: 'nonsense' },
    { start: 8, end: 29, label: 'nonsense' },
  ])

  const handleChange = (text, entities) => {
    let newEntities = [...entities]
    setText(text)
    setEntities(newEntities)
  }
  
  useEffect(() => { 
    setEntities(entities)
    setText(text)
  }, [entities, text])

  return (
    <div className={styles.app}>
    <header>
      <img src={logo} className={styles.logo} alt="Rasa" />
      <h1>
        Entity Highlighting
      </h1>
    </header>
    <section>
      <p>
        Rasa is writing a new natural language classifier to sort useful concepts in tech from meaningless jargon <span role="img" aria-label="Hell yeah">💯</span>.
        You are writing the interface to help us train the classifier! One of the important parts of the interface is
        what we call the EntityHighlighter, which allows the user to highlight and identify parts of a string.
        Try clicking existing highlights, or adding some of your own by selecting some text and <del>filling the form</del> selecting from the dropdown the entity label that best describes text.
      </p>
      <p>
        However, the code is in a bit of a mess and a nightmare to maintain - <span role="img" aria-label="Oh no">😱</span> everyone is afraid of touching it!
        Your task is to refactor <code>EntityHighlighter.js</code> and fix any bugs you find.
      </p>
    </section>
    <section>
      <EntityHighlighter
        text={text}
        entities={entities}
        onChange={(text, entities) => handleChange(text, entities)}
      />
    </section>
  </div>
  )
}

export default App;
