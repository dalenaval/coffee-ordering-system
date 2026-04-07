export const buildDefaultSelections = (attribute) => {
  return attribute.reduce((acc, group) => {
    if (group.isMulti) {
      acc[group.id] = [];
    } else {
      acc[group.id] = group.items[0] || null;
    }
    return acc;
  }, {});
};
