export default normalized => {
  if (normalized && normalized.entities && normalized.result) {
    return normalized.result.map(id => normalized.entities[id]);
  } else {
    return [];
  }
};
