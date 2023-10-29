import { post } from '../common/functions'
import { __, variables } from '../common/variables'
import { loadingNotyf } from './notification'

export const toggleBlocks = () => {
  const form = document.getElementById('hmb-blocks__settings-form')
  if (form) {
    form.addEventListener('submit-form', (e) => {
      e.preventDefault()

      if (form.dataset.disabled) {
        return
      }

      loadingNotyf.open({
        message: `${__('Chargement', 'hmb-blocks')}...`,
        type: 'info'
      })

      const formData = new FormData(form)
      formData.append('action', 'hmb_blocks_update_table')

      form.dataset.disabled = true

      post(variables.ajaxURL, formData)
        .then((response) => {
          console.log(response)

          loadingNotyf.dismissAll()
          loadingNotyf.open({
            message: response.message,
            type: response.status
          })
        })
        .catch((err) => {
          console.error(`${err} - Erreur ajax`)

          loadingNotyf.dismissAll()
          loadingNotyf.open({
            message: __('Erreur ajax : activation/désactivation du block', 'hmb-blocks'),
            type: 'error'
          })
        })
        .finally(() => {
          form.removeAttribute('data-disabled')
        })
    })

    const cards = form.querySelectorAll('.block-card input[type="checkbox"]')
    if (cards.length) {
      cards.forEach((card) => {
        card.addEventListener('change', (e) => {
          form.dispatchEvent(new Event('submit-form'))
        })
      })
    }
  }
}
