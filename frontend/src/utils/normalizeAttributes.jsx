export const normalizeAttributes = (data) => {
  if (!data || !data.option_group) return []

  return data?.option_group.map((group) => {
    const isMulti = group.max_count > 1

    return {
      id: group.id,
      name: group.name,
      max_count: group.max_count,
      isMulti: isMulti,
      items: group.items.map((item) => ({
        id: item.id,
        name: item.name,
        price_modifier: parseFloat(item.price_modifier) || 0,
      })),
    }
  })
}
