export const reassignBulkProps = (durations, type, value) => {
  const recurse = (parent) => {
    Object.keys(parent).forEach((key) => {
      const child = parent[key];
      // eslint-disable-next-line valid-typeof
      if (typeof child === type) {
        parent[key] = value;
        return;
      }
      recurse(child);
    });
  };
  recurse(durations);
};

export default {
  reassignBulkProps,
};
