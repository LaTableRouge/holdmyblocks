import { Notyf } from 'notyf'

export const loadingNotyfConfig = {
  ripple: false,
  icon: {
    tagName: 'span',
    text: ''
  }
}

export const loadingNotyf = new Notyf({
  position: {
    x: 'right',
    y: 'bottom'
  },
  types: [
    {
      ...loadingNotyfConfig,
      type: 'info',
      className: 'notyf__toast--info',
      duration: 0,
      dismissible: true
    },
    {
      ...loadingNotyfConfig,
      type: 'warning',
      className: 'notyf__toast--warning',
      duration: 0,
      dismissible: true
    },
    {
      ...loadingNotyfConfig,
      type: 'error',
      className: 'notyf__toast--error'
    },
    {
      ...loadingNotyfConfig,
      type: 'success',
      className: 'notyf__toast--success'
    }
  ]
})
