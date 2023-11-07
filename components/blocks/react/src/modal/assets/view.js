/**
 * The script that'll be called when the block is rendered on the front-end
 */
window.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('.wp-block-hmb-modal:not(.is-init)')
  if (containers.length) {
    containers.forEach((container) => {
      container.classList.add('is-init')

      const storageType = container.dataset.storage

      // Hide la modale si elle a déjà été ouverte
      let storage = false
      if (storageType === 'local') {
        storage = localStorage.getItem(container.id)
      } else if (storageType === 'session') {
        storage = sessionStorage.getItem(container.id)
      }
      if (storage) {
        container.style.display = 'none'
        container.classList.remove('is-displayed')
        document.documentElement.classList.remove('hmb-modal-deployed')

        return
      }

      // Close the modal
      const closeElements = container.querySelectorAll('.js-close-modal')
      if (closeElements.length) {
        closeElements.forEach((element) => {
          element.addEventListener('click', (e) => {
            e.preventDefault()

            container.classList.remove('is-displayed')
            document.documentElement.classList.remove('hmb-modal-deployed')

            if (storageType === 'local') {
              storage = localStorage.setItem(container.id, 'opened')
            } else if (storageType === 'session') {
              storage = sessionStorage.setItem(container.id, 'opened')
            }
          })
        })
      }

      // Open the modal
      const openAuto = container.getAttribute('data-auto-open')
      if (openAuto === 'true') {
        container.classList.add('is-displayed')
        document.documentElement.classList.add('hmb-modal-deployed')
      } else if (openAuto === 'false') {
        let openSelector = container.getAttribute('data-open-selector')
        openSelector = JSON.parse(openSelector)
        if (openSelector) {
          const openElements = document.querySelectorAll(openSelector)
          if (openElements.length) {
            openElements.forEach((element) => {
              element.addEventListener('click', (e) => {
                e.preventDefault()

                container.classList.add('is-displayed')
                document.documentElement.classList.add('hmb-modal-deployed')
              })
            })
          } else {
            console.warn("this selector don't seem to match any element")
          }
        }
      }
    })
  }
})
