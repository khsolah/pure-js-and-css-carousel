window.onload = () => {
  const swiperWrapper = document.querySelector('.swiper-wrapper')
  let slides = document.querySelectorAll('.swiper-slide')

  // 將第一個複製到結尾，將最後一個複製到第一個位置前
  // 0 1 2 3 4 => 4 0 1 2 3 4 1
  swiperWrapper.appendChild(slides[0].cloneNode(true))
  swiperWrapper.insertBefore(
    slides[slides.length - 1].cloneNode(true),
    slides[0]
  )

  slides = document.querySelectorAll('.swiper-slide')

  // 上一個/下一個按鈕
  const prevBtn = document.querySelector('.swiper-btn-prev')
  const nextBtn = document.querySelector('.swiper-btn-next')

  ////////////////////////////////////////////////////////////////////////////////
  // define carousel
  const carouselProperty = {
    index: 1,
    translate3dX: 0,
    slidesLength: slides.length,
    useTransition: false,
    transitioning: false,
    _slidesWidth: slides[0].offsetWidth,
    _slidesGap: parseInt(window.getComputedStyle(slides[0]).marginRight)
  }

  const carousel = new Proxy(carouselProperty, {
    set(target, prop, value) {
      switch (prop) {
        case 'index':
          if (target.useTransition) {
            if (target.transitioning) return
            target.transitioning = true
          }
          target.index = value
          target.translate3dX =
            -target.index * (target._slidesWidth + target._slidesGap)
          if (target.useTransition) {
            swiperWrapper.style['transition-duration'] = '300ms'
          } else {
            target.useTransition = true
          }
          swiperWrapper.style.transform = `translate3d(${target.translate3dX}px, 0, 0)`
          break
        case 'useTransition':
        case 'transitioning':
          target[prop] = value
          break
        default:
          if (!target.hasOwnProperty(prop))
            throw new Error(`This object doesn't have this property: ${prop}`)
          if (prop !== 'index')
            throw new Error(`Can't set this property: ${prop}`)
          if (typeof value !== 'number')
            throw new Error(`Expected number, got ${typeof value}`)
      }
    },
    get(target, prop) {
      if (prop.substr(0, 1) === '_')
        throw new Error(`This property is private: ${prop}`)
      if (!target.hasOwnProperty(prop))
        throw new Error(`Can't find this property: ${prop}`)
      // if (prop === 'translate3dX') return -target.index * (target.slidesWidth * target._slidesGap)
      return target[prop]
    }
  })

  ////////////////////////////////////////////////////////////////////////////////
  prevBtn.addEventListener('click', () => slideTo(-1))
  nextBtn.addEventListener('click', () => slideTo(1))

  ////////////////////////////////////////////////////////////////////////////////
  let downX = 0,
    moveToX = 0

  // init
  carousel.index = 1

  // start drag element when mousedown on swiperWrapper
  swiperWrapper.addEventListener('mousedown', (e) => {
    e.preventDefault()
    downX = e.clientX
    document.addEventListener('mousemove', draggingElement)
    document.addEventListener('mouseup', stopDraggingElement)
  })

  // set transition status = false when transitionend
  swiperWrapper.addEventListener('transitionend', () => {
    carousel.transitioning = false
    swiperWrapper.style['transition-duration'] = '0ms'
    if (carousel.index === 0) {
      carousel.useTransition = false
      carousel.index = carousel.slidesLength - 2
    } else if (carousel.index === carousel.slidesLength - 1) {
      carousel.useTransition = false
      carousel.index = 1
    }
  })

  ////////////////////////////////////////////////////////////////////////////////
  // functions
  /** slide to target index
   * @param {number} index target index
   */
  function slideTo(index) {
    carousel.index += index
  }

  /** dragging element */
  function draggingElement(e) {
    e.preventDefault()
    moveToX = e.clientX
    swiperWrapper.style.transform = `translate3d(${
      moveToX - downX + carousel.translate3dX
    }px, 0, 0)`
  }

  /** stop dragging element */
  function stopDraggingElement(e) {
    e.preventDefault()
    document.removeEventListener('mousemove', draggingElement)
    document.removeEventListener('mouseup', stopDraggingElement)
    slideTo(moveToX - downX > 100 ? -1 : moveToX - downX < -100 ? 1 : 0)
  }
}
