import { sluggify } from '../common/functions'

export const searchBlock = () => {
  const form = document.getElementById('hmb-blocks__search-form')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()

      if (form.dataset.disabled) {
        return
      }

      // Récupère les datas du formulaire de recherche
      const formData = new FormData(form)

      // Setup d'une regex pour match les différents keywords des blocs
      const searchValue = formData.get('search-blocks')
      const regex = new RegExp(sluggify(searchValue), '')

      // Setup d'un array pour match les types des blocs
      const searchTypes = []
      const acfOn = formData.get('acf')
      if (acfOn) {
        searchTypes.push('acf')
      }
      const reactOn = formData.get('react')
      if (reactOn) {
        searchTypes.push('react')
      }

      const cards = document.querySelectorAll('.block-card')
      if (cards.length) {
        if (!searchValue && !searchTypes.length) {
          cards.forEach((card) => {
            card.removeAttribute('style')
          })
        } else {
          const foundCards = []

          cards.forEach((card) => {
            // Vérification du type
            let matchType
            const type = card.dataset.type
            if (searchTypes.includes(type)) {
              matchType = true
            }

            // Vérification des keywords
            let matchKeywords = true
            let keywords = card.dataset.keywords
            keywords = JSON.parse(keywords)
            if (keywords.length) {
              keywords.forEach((keyword) => {
                matchKeywords = keyword.match(regex)
              })
            }

            if (matchType && matchKeywords) {
              foundCards.push(card)
            }

            // Hide de toutes les  cards
            card.style.display = 'none'
          })

          // Show des cards qui matchent
          if (foundCards.length) {
            foundCards.forEach((card) => {
              card.removeAttribute('style')
            })
          }
        }
      }
    })
  }
}
