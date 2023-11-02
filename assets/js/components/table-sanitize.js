import { delay, post } from '../common/functions'
import { __, variables } from '../common/variables'
import { loadingNotyf } from './notification'

export const tableSanitize = () => {
  const form = document.getElementById('hmb-blocks__db-sanitize-form')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()

      const formData = new FormData(form)

      formData.append('action', 'hmb_blocks_sanitize_table')

      loadingNotyf.open({
        message: `${__('Chargement', 'hmb-blocks')}...`,
        type: 'info'
      })

      post(variables.ajaxURL, formData)
        .then((response) => {
          // Remove de la notice
          if (response.status === 'success') {
            const noticeWrapper = form.closest('.notice')
            if (noticeWrapper) {
              noticeWrapper.remove()
            }
          }

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
            message: __('Erreur ajax : mise à niveau de la base de données', 'hmb-blocks'),
            type: 'error'
          })
        })
        .finally(async () => {
          await delay(500)
          window.location.reload()

          // const cardForm = document.getElementById('hmb-blocks__settings-form')
          // if (cardForm) {
          //   cardForm.removeAttribute('data-disabled')
          // }
        })
    })
  }
}
