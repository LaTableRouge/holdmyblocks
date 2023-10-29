const randomizeArray = (array) => {
  return [...array]
    .map((value) => [Math.random(), value])
    .sort(([a], [b]) => a - b)
    .map((entry) => entry[1])
}

const intervalSetActive = (array, counter) => {
  if (counter + 1 === array.length) {
    counter = 0
  } else {
    counter++
  }

  // Remove de l'actif sur tout les élèments
  array.forEach((element) => {
    element.classList.remove('active')
  })

  // Set de l'actif sur l'élèment survolé
  array[counter].classList.add('active')

  return counter
}

export const blockCloudTagsTextAnimate = () => {
  const blocks = document.querySelectorAll('.block---cloud-tags:not(.js-executed)')
  if (blocks.length) {
    blocks.forEach((block) => {
      block.classList.add('js-executed')

      let interval = false
      let counter = 0
      let elements = []
      const delay = 1000

      block.addEventListener('mouseout', (e) => {
        if (!interval) {
          // relaance l'interval s'il n'est pas déjà lancé
          interval = setInterval(() => {
            // incrémente le counter avec lequel on se déplace dans l'array
            counter = intervalSetActive(elements, counter)

            // shuffle l'array d'élèments quand on arrive à la fin de la boucle
            if (counter + 1 === elements.length) {
              elements = randomizeArray(elements)
            }
          }, delay)
        }
      })

      elements = block.querySelectorAll('.cloud-tags__element')
      if (elements.length) {
        // shuffle l'array d'élèments
        elements = randomizeArray(elements)

        // Lance l'interval une première fois
        interval = setInterval(() => {
          // incrémente le counter avec lequel on se déplace dans l'array
          counter = intervalSetActive(elements, counter)

          // shuffle l'array d'élèments quand on arrive à la fin de la boucle
          if (counter + 1 === elements.length) {
            elements = randomizeArray(elements)
          }
        }, delay)

        elements.forEach((element) => {
          element.addEventListener('mouseover', (e) => {
            e.preventDefault()

            // Stop l'interval
            clearInterval(interval)
            interval = false

            // Remove de l'actif sur tout les élèments
            elements.forEach((element) => {
              element.classList.remove('active')
            })

            // Set de l'actif sur l'élèment survolé
            element.classList.add('active')
          })
        })
      }
    })
  }
}
