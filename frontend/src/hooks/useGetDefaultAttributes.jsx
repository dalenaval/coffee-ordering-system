const useGetDefaultAttributes = (attributes) => {
  if (!attributes || !attributes?.option_group) return [];

  return attributes.option_group?.reduce((acc, group) => {
    const { max_count, id, items } = group;

    if (!items || items.length === 0) {
      acc[id] = max_count > 1 ? [] : null;
      return acc;
    }

    if (max_count === 1) {
      acc[id] = items[0];
    } else {
      acc[id] = [];
    }

    return acc;
  }, {});
};

export default useGetDefaultAttributes;
