window.onload = () => {
  // wrapper element
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  // 所有 slides element
  const slides = document.querySelectorAll(".swiper-slide");
  // slides 數量
  const slidesLength = slides.length;
  // slide 的寬度
  const slideWidth = slides[0].offsetWidth;
  // slides 間的間格距離
  const slideGap = parseInt(window.getComputedStyle(slides[0]).marginRight);

  // 上一個/下一個按鈕
  const prevBtn = document.querySelector("#swiper-btn-prev");
  const nextBtn = document.querySelector("#swiper-btn-next");
  // translate3dX: 當前 wrapper 的 translate3d 的 x 的值
  // downX: 點擊的 x 座標
  // moveToX: 移動的 x 座標
  let translate3dX = 0,
    downX = 0,
    moveToX = 0;

  // 目前的 slide index
  let currentIndex = 0;

  // slide to target index
  const slideTo = (index) => {
    // 判斷是否在 0 <= index < slidesLength 範圍內
    // index < 0 就 設為 -.1
    // index >= slidesLength 就 設為 slidesLength - .9
    currentIndex =
      index < 0 ? -0.1 : index >= slidesLength ? slides.length - 0.9 : index;

    // 計算 translate3dX = 目前 slide index * (slide寬 + 間距)
    translate3dX = -currentIndex * (slideWidth + slideGap);
    swiperWrapper.style.transform = `translate3d(${translate3dX}px, 0, 0)`;

    setTimeout(() => {
      // 左右到底時的效果
      currentIndex =
        currentIndex < 0 ? Math.ceil(currentIndex) : Math.floor(currentIndex);
      translate3dX = -currentIndex * (slideWidth + slideGap);
      swiperWrapper.style.transform = `translate3d(${translate3dX}px, 0, 0)`;
    }, 400);
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
