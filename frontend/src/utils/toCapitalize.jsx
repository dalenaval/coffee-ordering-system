export const toCapitalize = (str) => {
  if (!str) return ''
  return str.replace(/(^\w|\s\w)/g, (match) => match.toUpperCase())
}
