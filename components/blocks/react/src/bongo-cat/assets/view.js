/**
 * The script that'll be called when the block is rendered on the front-end
 */
window.addEventListener('DOMContentLoaded', () => {
  const bongoCatAnimate = (block, timerAnimation, delayAnimation) => {
    const bongoCat = block.querySelector('svg.bongocat')
    if (bongoCat) {
      bongoCat.classList.remove('animation-pause')
      clearTimeout(timerAnimation)
      timerAnimation = setTimeout(() => {
        bongoCat.classList.add('animation-pause')
      }, delayAnimation)
    }
  }

  const blocks = document.querySelectorAll('.wp-block-hmb-bongo-cat[data-animate="true"]:not(.js-intialized)')
  if (blocks.length) {
    blocks.forEach((block) => {
      block.classList.add('js-initialized')

      const delayAnimation = 250
      let timerAnimation
      window.addEventListener('keydown', (e) => {
        bongoCatAnimate(block, timerAnimation, delayAnimation)
      })

      window.addEventListener('click', (e) => {
        bongoCatAnimate(block, timerAnimation, delayAnimation)
      })
    })
  }
})
