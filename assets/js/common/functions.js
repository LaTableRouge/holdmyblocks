const request = (url, params = {}, method = 'GET', format = 'json') => {
  const options = {
    method
  }

  if (method === 'GET') {
    url += `?${new URLSearchParams(params)}`
  } else {
    let formData = params
    if (typeof params === 'object' && !(params instanceof FormData)) {
      formData = new FormData()
      for (const key in params) {
        formData.append(key, params[key])
      }
    }

    options.body = formData
  }

  return fetch(url, options).then((response) => (format === 'json' ? response.json() : response.text()))
}

export const get = (url, params, format) => request(url, params, 'GET', format)
export const post = (url, params, format) => request(url, params, 'POST', format)

export const delay = (n) => {
  n = n || 2000
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, n)
  })
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
