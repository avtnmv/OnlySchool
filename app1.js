var modalBackground1 = document.getElementById("modalBackground1");
var modal1 = document.getElementById("myModal1");

var btn3 = document.getElementById("openModal3");
var span1 = document.getElementsByClassName("close1")[0];
var submitBtn1 = document.getElementById("submit-btn1");


btn3.onclick = function() {
  modal1.style.display = "block";
  modalBackground1.style.display = "block";
}

span1.onclick = function() {
  modal1.style.display = "none";
  modalBackground1.style.display = "none";
}

submitBtn1.onclick = function() {
  modal1.style.display = "none";
  modalBackground1.style.display = "none";
}

modalBackground1.onclick = function() {
  modal1.style.display = "none";
  modalBackground1.style.display = "none";
}


let nmtSlider = document.querySelector('.nmt-slider-one'),
  nmtSliderList = nmtSlider.querySelector('.nmt-slider-list-one'),
  nmtSliderTrack = nmtSlider.querySelector('.nmt-slider-track-one'),
  nmtSlides = nmtSlider.querySelectorAll('.nmt-slide-one'),
  nmtArrows = nmtSlider.querySelector('.slider-arrows-nmt-one'),
  nmtPrev = nmtArrows.children[0],
  nmtNext = nmtArrows.children[1],
  nmtSlideWidth = nmtSlides[0].offsetWidth,
  nmtSlideIndex = 0,
  nmtPosInit = 0,
  nmtPosX1 = 0,
  nmtPosX2 = 0,
  nmtPosY1 = 0,
  nmtPosY2 = 0,
  nmtPosFinal = 0,
  nmtIsSwipe = false,
  nmtIsScroll = false,
  nmtAllowSwipe = true,
  nmtTransition = true,
  nmtNextTrf = 0,
  nmtPrevTrf = 0,
  nmtLastTrf = --nmtSlides.length * nmtSlideWidth,
  nmtPosThreshold = nmtSlides[0].offsetWidth * 0.35,
  nmtTrfRegExp = /([-0-9.]+(?=px))/,
  nmtSwipeStartTime,
  nmtSwipeEndTime,
  nmtGetEvent = function() {
    return (event.type.search('touch') !== -1) ? event.touches[0] : event;
  },
  nmtSlide = function() {
    if (nmtTransition) {
      nmtSliderTrack.style.transition = 'transform .5s';
    }
    nmtSliderTrack.style.transform = `translate3d(-${nmtSlideIndex * nmtSlideWidth}px, 0px, 0px)`;

    nmtPrev.classList.toggle('disabled', nmtSlideIndex === 0);
    nmtNext.classList.toggle('disabled', nmtSlideIndex === --nmtSlides.length);
  },
  nmtSwipeStart = function() {
    let evt = nmtGetEvent();

    if (nmtAllowSwipe) {

      nmtSwipeStartTime = Date.now();
      
      nmtTransition = true;

      nmtNextTrf = (nmtSlideIndex + 1) * -nmtSlideWidth;
      nmtPrevTrf = (nmtSlideIndex - 1) * -nmtSlideWidth;

      nmtPosInit = nmtPosX1 = evt.clientX;
      nmtPosY1 = evt.clientY;

      nmtSliderTrack.style.transition = '';

      document.addEventListener('touchmove', nmtSwipeAction);
      document.addEventListener('mousemove', nmtSwipeAction);
      document.addEventListener('touchend', nmtSwipeEnd);
      document.addEventListener('mouseup', nmtSwipeEnd);

      nmtSliderList.classList.remove('grab');
      nmtSliderList.classList.add('grabbing');
    }
  },
  nmtSwipeAction = function() {

    let evt = nmtGetEvent(),
      style = nmtSliderTrack.style.transform,
      transform = +style.match(nmtTrfRegExp)[0];

    nmtPosX2 = nmtPosX1 - evt.clientX;
    nmtPosX1 = evt.clientX;

    nmtPosY2 = nmtPosY1 - evt.clientY;
    nmtPosY1 = evt.clientY;

    if (!nmtIsSwipe && !nmtIsScroll) {
      let posY = Math.abs(nmtPosY2);
      if (posY > 7 || nmtPosX2 === 0) {
        nmtIsScroll = true;
        nmtAllowSwipe = false;
      } else if (posY < 7) {
        nmtIsSwipe = true;
      }
    }

    if (nmtIsSwipe) {
      if (nmtSlideIndex === 0) {
        if (nmtPosInit < nmtPosX1) {
          nmtSetTransform(transform, 0);
          return;
        } else {
          nmtAllowSwipe = true;
        }
      }

      // запрет ухода вправо на последнем слайде
      if (nmtSlideIndex === --nmtSlides.length) {
        if (nmtPosInit > nmtPosX1) {
          nmtSetTransform(transform, nmtLastTrf);
          return;
        } else {
          nmtAllowSwipe = true;
        }
      }

      if (nmtPosInit > nmtPosX1 && transform < nmtNextTrf || nmtPosInit < nmtPosX1 && transform > nmtPrevTrf) {
        nmtReachEdge();
        return;
      }

      nmtSliderTrack.style.transform = `translate3d(${transform - nmtPosX2}px, 0px, 0px)`;
    }

  },
  nmtSwipeEnd = function() {
    nmtPosFinal = nmtPosInit - nmtPosX1;

    nmtIsScroll = false;
    nmtIsSwipe = false;

    document.removeEventListener('touchmove', nmtSwipeAction);
    document.removeEventListener('mousemove', nmtSwipeAction);
    document.removeEventListener('touchend', nmtSwipeEnd);
    document.removeEventListener('mouseup', nmtSwipeEnd);

    nmtSliderList.classList.add('grab');
    nmtSliderList.classList.remove('grabbing');

    if (nmtAllowSwipe) {
      nmtSwipeEndTime = Date.now();
      if (Math.abs(nmtPosFinal) > nmtPosThreshold || nmtSwipeEndTime - nmtSwipeStartTime < 300) {
        if (nmtPosInit < nmtPosX1) {
          nmtSlideIndex--;
        } else if (nmtPosInit > nmtPosX1) {
          nmtSlideIndex++;
        }
      }

      if (nmtPosInit !== nmtPosX1) {
        nmtAllowSwipe = false;
        nmtSlide();
      } else {
        nmtAllowSwipe = true;
      }

    } else {
      nmtAllowSwipe = true;
    }

  },
  nmtSetTransform = function(transform, comapreTransform) {
    if (transform >= comapreTransform) {
      if (transform > comapreTransform) {
        nmtSliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
      }
    }
    nmtAllowSwipe = false;
  },
  nmtReachEdge = function() {
    nmtTransition = false;
    nmtSwipeEnd();
    nmtAllowSwipe = true;
  };

nmtSliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';
nmtSliderList.classList.add('grab');

nmtSliderTrack.addEventListener('transitionend', () => nmtAllowSwipe = true);
nmtSlider.addEventListener('touchstart', nmtSwipeStart);
nmtSlider.addEventListener('mousedown', nmtSwipeStart);

nmtArrows.addEventListener('click', function() {
  let target = event.target;

  if (target.classList.contains('next-nmt-one')) {
    nmtSlideIndex++;
  } else if (target.classList.contains('prev-nmt-one')) {
    nmtSlideIndex--;
  } else {
    return;
  }

  nmtSlide();
});
