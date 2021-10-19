![Rasa](/src/components/rasa.svg)

# Rasa Frontend Take Home Task

## Technology Stack:

---

1.  [React](https://reactjs.org/)
1.  [React Testing Library](https://testing-library.com/)

## Getting Started:

---

1. Clone repository by running `git clone https://github.com/missating/frontend-coding-test.git`.
2. `cd` into the root of the **project directory**.
3. Run `npm install` on the terminal to install dependecies.
4. To start the application run `npm start`

## Testing:

---

Unit testing is achieved through the use of `jest` framework with `React Testing Library`.

while within the **project root directory**.

1. **Unit tests** - Run `npm test` on the terminal
2. **Test Coverage** - Run `npm test -- --coverage` on the terminal

## What was improved (1st Iteration):

---

1. Refactored `EntityHighlighter.js` from a class to a functional component
2. Broke down some parts of `EntityHighlighter.js` into small components to make it more readable eg: `TextHighlight`
3. Refactored `App.js` from a class component into a functional component
4. Added test for all refactored components 
5. Moved functions like `hashString.js` and `updateEntityBoundary.js` into `utils` folder
6. In `EntityHighlighter.js` refactored  `deleteEntity method` from using `splice` to `slice` as the former mutates the array
7. Update the utils function `updateEntityBoundary.js` to have a condition so it stops calling itself
8. Fix bugs with allowing a user `Add entity for selection` without typing the `Entity Label`
9. Improved usability issues by enabling user `Add entity for selection` by pressing `Enter Key`


## What can be improved (2nd Iteration):

---

1. Adding a `legend` with the different `Entity Labels` so when a user clicks on an `Entity Label` they can see the text for that label
2. Improving the quality of test for all components
3. Adding proper documentation for all functions eg: using JS Docs
4. Moving component styling into their respective style sheet or using CSS-In-JS which provides an API to describe state-based styles in a better way than using a bunch of conditional class names, eg: of this would be what we have in `TextHighlight` component
