const updateEntityBoundary = (newText, NewEntities, entities, text) => {
  entities.forEach(entity => {
    const oldSelection = text.substr(entity.start, entity.end - entity.start);

    const findClosestStart = (lastMatch) => {
      if(lastMatch === 0) {
        return;
      }

      if (lastMatch === undefined) {
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
};

export default updateEntityBoundary;
