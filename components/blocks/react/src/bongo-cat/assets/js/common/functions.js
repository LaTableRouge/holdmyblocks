export const formatUnitlessValue = (value, unit = 'px') => {
  if (!`${value}`.includes(unit)) {
    value = `${value}${unit}`
  }

  return value
}

export const sluggify = (e) => {
  if (e) {
    return e
      .normalize('NFD') // split an accented letter in the base letter and the acent
      .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
      .replace(/\s+/g, '_') // separator
  }
}

export const getConfigFromAttributes = (attributes) => {
  return Object.fromEntries(Object.entries(attributes).filter(([key]) => key !== 'blockId'))
}
