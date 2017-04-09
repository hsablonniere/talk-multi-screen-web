module.exports = function protocol() {

  return function (deck) {

    const metas = {}
    Array.from(document.querySelectorAll('head meta')).forEach((meta) => {
      metas[meta.getAttribute('name')] = meta.getAttribute('content')
    })

    const steps = deck.slides.map((slide, slideIdx) => {

      // const notes = [].slice.call(slide.querySelectorAll('aside[role="note"] p, aside[role="note"] li'))
      const notes = [].slice.call(slide.querySelectorAll('.cue'))
        .map((note) => note.innerHTML)
        .join('')

      if (slide.bullets && slide.bullets.length > 0) {
        return slide.bullets.map((b, bulletIdx) => {
          return {
            cursor: String(slideIdx) + '.' + String(bulletIdx),
            states: [],
            notes,
          }
        })
      }

      return {
        cursor: String(slideIdx),
        states: [],
        notes,
        slideLineno: Number(slide.dataset.slideLineno),
        notesLineno: Number(slide.dataset.notesLineno),
      }
    })

    const details = {
      title: document.title || '',
      authors: metas.author || '',
      description: metas.description || '',
      vendor: 'bespoke.js',
      steps,
      ratios: ['16/9'],
      themes: ['default'],
    }

    window.addEventListener('message', ({ source, data: { command, commandArgs } }) => {

      switch (command) {

        case 'get-slide-deck-details':
          source.postMessage({ event: 'slide-deck-details', eventData: { details } }, '*')
          break

        case 'go-to-step':
          const { cursor } = commandArgs
          const [slideIdx, subslideIdx] = cursor.split('.')
          deck.slide(Number(slideIdx))
          if (deck.activateBullet) {
            deck.activateBullet(Number(slideIdx), Number(subslideIdx))
          }
          break

        case 'toggle-slide-deck-state':
          const { enabled, state } = commandArgs
          console.log(commandArgs)
          if (enabled) {
            document.body.dataset.toggleState = state
          }
          else {
            document.body.removeAttribute('data-toggle-state')
          }

          break

        default:
          console.debug(`unknown protocol command ${command} with args`, commandArgs)
      }
    })
  }
}
