window.onload = () => {
  // wrapper element
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  // 所有 slides element
  let slides = document.querySelectorAll(".swiper-slide");
  // slides 數量
  let slidesLength = slides.length;
  // slide 的寬度
  const slideWidth = slides[0].offsetWidth;
  // slides 間的間格距離
  const slideGap = parseInt(window.getComputedStyle(slides[0]).marginRight);

  // 上一個/下一個按鈕
  const prevBtn = document.querySelector("#swiper-btn-prev");
  const nextBtn = document.querySelector("#swiper-btn-next");
  
  swiperWrapper.appendChild(slides[0].cloneNode(true))
  swiperWrapper.insertBefore(slides[slides.length - 1].cloneNode(true), slides[0])

  slidesLength += 2
  
  // translate3dX: 當前 wrapper 的 translate3d 的 x 的值
  // downX: 點擊的 x 座標
  // moveToX: 移動的 x 座標
  let translate3dX = -slideWidth - slideGap,
    downX = 0,
    moveToX = 0;

  let transitioning = false
  swiperWrapper.style.transition = 'none'
  swiperWrapper.style.transform = `translate3d(${translate3dX}px, 0, 0)`
  setTimeout(() => {
    swiperWrapper.style.transition = ''
  }, 100);
  
  // 目前的 slide index
  let currentIndex = 1;
  
  swiperWrapper.addEventListener('transitionend', () => {
    if (currentIndex === 0) {
      swiperWrapper.style.transition = 'none'

      currentIndex = slidesLength - 2
      translate3dX = -currentIndex * (slideWidth + slideGap)
      swiperWrapper.style.transform = `translate3d(${translate3dX}px, 0, 0)`

      setTimeout(() => {
        swiperWrapper.style.transition = ''
      }, 100);
    } else if (currentIndex === slidesLength - 1) {
      currentIndex = 1
      translate3dX = -currentIndex * (slideWidth + slideGap)
      swiperWrapper.style.transition = 'none'
      swiperWrapper.style.transform = `translate3d(${translate3dX}px, 0, 0)`

      setTimeout(() => {
        swiperWrapper.style.transition = ''
      }, 100);
    }

    transitioning = false
  })

  // slide to target index
  const slideTo = (index) => {
    if (transitioning) return
    transitioning = true
    console.log('slideto::', index)
    currentIndex = index

    // 計算 translate3dX = 目前 slide index * (slide寬 + 間距)
    translate3dX = -currentIndex * (slideWidth + slideGap);
    swiperWrapper.style.transform = `translate3d(${translate3dX}px, 0, 0)`;
  };

  prevBtn.onclick = () => slideTo(currentIndex - 1);
  nextBtn.onclick = () => slideTo(currentIndex + 1);

  const cancelDrag = () => {
    document.onmouseup = null;
    document.onmousemove = null;
    // 判斷 currentIndex 值
    currentIndex =
      moveToX < -100
        ? currentIndex + (currentIndex + 1 < slidesLength ? 1 : 0)
        : moveToX > 100
        ? currentIndex - (currentIndex - 1 >= 0 ? 1 : 0)
        : currentIndex;
    slideTo(currentIndex);
  };

  const drag = (e) => {
    e.preventDefault();
    moveToX = e.clientX - downX;
    swiperWrapper.style.transform = `translate3d(${
      moveToX + translate3dX
    }px, 0, 0)`;
  };

  swiperWrapper.onmousedown = (e) => {
    downX = e.clientX;
    document.onmouseup = cancelDrag;
    document.onmousemove = drag;
  };
};
