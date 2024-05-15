let windowWidthR = window.innerWidth;
let sliderR = document.querySelector('.slider-reviews'),
  sliderListR = sliderR.querySelector('.slider-list-reviews'),
  sliderTrackR = sliderR.querySelector('.slider-track-reviews'),
  slidesR = sliderR.querySelectorAll('.slide-reviews'),
  arrowsR = document.querySelector('.slider-arrows-reviews'), // изменено
  prevR = arrowsR.children[0],
  nextR = arrowsR.children[1],
  slideWidthR = slidesR[0].offsetWidth,
  slideIndexR = 0,
  posInitR = 0,
  posX1R = 0,
  posX2R = 0,
  posY1R = 0,
  posY2R = 0,
  posFinalR = 0,
  isSwipeR = false,
  isScrollR = false,
  allowSwipeR = true,
  transitionR = true,
  nextTrfR = 0,
  prevTrfR = 0,
  lastTrfR = --slidesR.length * slideWidthR,
  posThresholdR = slidesR[0].offsetWidth * 0.35,
  trfRegExpR = /([-0-9.]+(?=px))/,
  swipeStartTimeR,
  swipeEndTimeR,
  getEventR = function() {
    return (event.type.search('touch') !== -1) ? event.touches[0] : event;
  },
  slideR = function() {
    if (transitionR) {
      sliderTrackR.style.transition = 'transform .5s';
    }
    sliderTrackR.style.transform = `translate3d(-${slideIndexR * slideWidthR}px, 0px, 0px)`;

    if(windowWidthR >= 1320){
      prevR.classList.toggle('disabled', slideIndexR === 0);
      nextR.classList.toggle('disabled', slideIndexR === 7);
    }
    else if(windowWidthR < 1100 && windowWidthR > 630){
      prevR.classList.toggle('disabled', slideIndexR === 0);
      nextR.classList.toggle('disabled', slideIndexR === 9);
    }

  },
  swipeStartR = function() {
    let evt = getEventR();

    if (allowSwipeR) {

      swipeStartTimeR = Date.now();
      
      transitionR = true;

      nextTrfR = (slideIndexR + 1) * -slideWidthR;
      prevTrfR = (slideIndexR - 1) * -slideWidthR;

      posInitR = posX1R = evt.clientX;
      posY1R = evt.clientY;

      sliderTrackR.style.transition = '';

      document.addEventListener('touchmove', swipeActionR);
      document.addEventListener('mousemove', swipeActionR);
      document.addEventListener('touchend', swipeEndR);
      document.addEventListener('mouseup', swipeEndR);

      sliderListR.classList.remove('grab');
      sliderListR.classList.add('grabbing');
    }
  },
  swipeActionR = function() {

    let evt = getEventR(),
      style = sliderTrackR.style.transform,
      transform = +style.match(trfRegExpR)[0];

    posX2R = posX1R - evt.clientX;
    posX1R = evt.clientX;

    posY2R = posY1R - evt.clientY;
    posY1R = evt.clientY;

    if (!isSwipeR && !isScrollR) {
      let posY = Math.abs(posY2R);
      if (posY > 7 || posX2R === 0) {
        isScrollR = true;
        allowSwipeR = false;
      } else if (posY < 7) {
        isSwipeR = true;
      }
    }

    if (isSwipeR) {
      if (slideIndexR === 0) {
        if (posInitR < posX1R) {
          setTransformR(transform, 0);
          return;
        } else {
          allowSwipeR = true;
        }
      }

      // запрет ухода вправо на последнем слайде
      if (slideIndexR === --slidesR.length) {
        if (posInitR > posX1R) {
          setTransformR(transform, lastTrfR);
          return;
        } else {
          allowSwipeR = true;
        }
      }

      if (posInitR > posX1R && transform < nextTrfR || posInitR < posX1R && transform > prevTrfR) {
        reachEdgeR();
        return;
      }

      sliderTrackR.style.transform = `translate3d(${transform - posX2R}px, 0px, 0px)`;
    }

  },
  swipeEndR = function() {
    posFinalR = posInitR - posX1R;

    isScrollR = false;
    isSwipeR = false;

    document.removeEventListener('touchmove', swipeActionR);
    document.removeEventListener('mousemove', swipeActionR);
    document.removeEventListener('touchend', swipeEndR);
    document.removeEventListener('mouseup', swipeEndR);

    sliderListR.classList.add('grab');
    sliderListR.classList.remove('grabbing');

    if (allowSwipeR) {
      swipeEndTimeR = Date.now();
      if (Math.abs(posFinalR) > posThresholdR || swipeEndTimeR - swipeStartTimeR < 300) {
        if (posInitR < posX1R) {
          slideIndexR--;
        } else if (posInitR > posX1R) {
          slideIndexR++;
        }
      }

      if (posInitR !== posX1R) {
        allowSwipeR = false;
        slideR();
      } else {
        allowSwipeR = true;
      }

    } else {
      allowSwipeR = true;
    }

  },
  setTransformR = function(transform, comapreTransform) {
    if (transform >= comapreTransform) {
      if (transform > comapreTransform) {
        sliderTrackR.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
      }
    }
    allowSwipeR = false;
  },
  reachEdgeR = function() {
    transitionR = false;
    swipeEndR();
    allowSwipeR = true;
  };

sliderTrackR.style.transform = 'translate3d(0px, 0px, 0px)';
sliderListR.classList.add('grab');

sliderTrackR.addEventListener('transitionend', () => allowSwipeR = true);
sliderR.addEventListener('touchstart', swipeStartR);
sliderR.addEventListener('mousedown', swipeStartR);

document.addEventListener('click', function(event) { // изменено
  let target = event.target;

  if (target.classList.contains('next-reviews')) {
    slideIndexR++;
  } else if (target.classList.contains('prev-reviews')) {
    slideIndexR--;
  } else {
    return;
  }

  slideR();
});

// Добавляем класс disabled, если slideIndex равен 0
if (slideIndexR === 0) {
  prevR.classList.add('disabled');
}

function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}
