export const createInlineStyle = (object, id = '') => {
  let styleString = ''

  if (Object.keys(object).length) {
    styleString += `.wp-block-hmb-modal#${id} .hmb-modal__inner-wrapper {`

    for (const key in object) {
      if (Object.hasOwnProperty.call(object, key)) {
        if (key !== 'breakpoints') {
          if (object[key]) {
            styleString += `--hmb-modal-${key}: ${object[key]};`
          }
        }
      }
    }

    styleString += '}'

    if (Object.keys(object.breakpoints).length) {
      for (const breakpoint in object.breakpoints) {
        if (Object.hasOwnProperty.call(object.breakpoints, breakpoint)) {
          const configs = object.breakpoints[breakpoint]

          if (Object.keys(configs).length) {
            styleString += `@container hmb-modal ${breakpoint} {`
            styleString += `.wp-block-hmb-modal#${id} .hmb-modal__inner-wrapper {`

            for (const key in configs) {
              if (Object.hasOwnProperty.call(configs, key)) {
                styleString += `--hmb-modal-${key}: ${configs[key]};`
              }
            }

            styleString += '}'
            styleString += '}'
          }
        }
      }
    }
  }

  return styleString
}
