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

let nmtSlider2 = document.querySelector('.nmt-slider-two'),
  nmtSliderList2 = nmtSlider2.querySelector('.nmt-slider-list-two'),
  nmtSliderTrack2 = nmtSlider2.querySelector('.nmt-slider-track-two'),
  nmtSlides2 = nmtSlider2.querySelectorAll('.nmt-column'),
  nmtArrows2 = nmtSlider2.querySelector('.slider-arrows-nmt-two'),
  nmtPrev2 = nmtArrows2.children[0],
  nmtNext2 = nmtArrows2.children[1],
  nmtSlideWidth2 = nmtSlides2[0].offsetWidth,
  nmtSlideIndex2 = 0,
  nmtPosInit2 = 0,
  nmtPosX12 = 0,
  nmtPosX22 = 0,
  nmtPosY12 = 0,
  nmtPosY22 = 0,
  nmtPosFinal2 = 0,
  nmtIsSwipe2 = false,
  nmtIsScroll2 = false,
  nmtAllowSwipe2 = true,
  nmtTransition2 = true,
  nmtNextTrf2 = 0,
  nmtPrevTrf2 = 0,
  nmtLastTrf2 = --nmtSlides2.length * nmtSlideWidth2,
  nmtPosThreshold2 = nmtSlides2[0].offsetWidth * 0.35,
  nmtTrfRegExp2 = /([-0-9.]+(?=px))/,
  nmtSwipeStartTime2,
  nmtSwipeEndTime2,
  nmtGetEvent2 = function() {
    return (event.type.search('touch') !== -1) ? event.touches[0] : event;
  },
  nmtSlide2 = function() {
    if (nmtTransition2) {
      nmtSliderTrack2.style.transition = 'transform .5s';
    }
    nmtSliderTrack2.style.transform = `translate3d(-${nmtSlideIndex2 * nmtSlideWidth2}px, 0px, 0px)`;

    nmtPrev2.classList.toggle('disabled', nmtSlideIndex2 === 0);
    nmtNext2.classList.toggle('disabled', nmtSlideIndex2 === 3);
  },
  nmtSwipeStart2 = function() {
    let evt = nmtGetEvent2();

    if (nmtAllowSwipe2) {

      nmtSwipeStartTime2 = Date.now();
      
      nmtTransition2 = true;

      nmtNextTrf2 = (nmtSlideIndex2 + 1) * -nmtSlideWidth2;
      nmtPrevTrf2 = (nmtSlideIndex2 - 1) * -nmtSlideWidth2;

      nmtPosInit2 = nmtPosX12 = evt.clientX;
      nmtPosY12 = evt.clientY;

      nmtSliderTrack2.style.transition = '';

      document.addEventListener('touchmove', nmtSwipeAction2);
      document.addEventListener('mousemove', nmtSwipeAction2);
      document.addEventListener('touchend', nmtSwipeEnd2);
      document.addEventListener('mouseup', nmtSwipeEnd2);

      nmtSliderList2.classList.remove('grab');
      nmtSliderList2.classList.add('grabbing');
    }
  },
  nmtSwipeAction2 = function() {

    let evt = nmtGetEvent2(),
      style = nmtSliderTrack2.style.transform,
      transform = +style.match(nmtTrfRegExp2)[0];

    nmtPosX22 = nmtPosX12 - evt.clientX;
    nmtPosX12 = evt.clientX;

    nmtPosY22 = nmtPosY12 - evt.clientY;
    nmtPosY12 = evt.clientY;

    if (!nmtIsSwipe2 && !nmtIsScroll2) {
      let posY = Math.abs(nmtPosY22);
      if (posY > 7 || nmtPosX22 === 0) {
        nmtIsScroll2 = true;
        nmtAllowSwipe2 = false;
      } else if (posY < 7) {
        nmtIsSwipe2 = true;
      }
    }

    if (nmtIsSwipe2) {
      if (nmtSlideIndex2 === 0) {
        if (nmtPosInit2 < nmtPosX12) {
          nmtSetTransform2(transform, 0);
          return;
        } else {
          nmtAllowSwipe2 = true;
        }
      }

      // запрет ухода вправо на последнем слайде
      if (nmtSlideIndex2 === --nmtSlides2.length) {
        if (nmtPosInit2 > nmtPosX12) {
          nmtSetTransform2(transform, nmtLastTrf2);
          return;
        } else {
          nmtAllowSwipe2 = true;
        }
      }

      if (nmtPosInit2 > nmtPosX12 && transform < nmtNextTrf2 || nmtPosInit2 < nmtPosX12 && transform > nmtPrevTrf2) {
        nmtReachEdge2();
        return;
      }

      nmtSliderTrack2.style.transform = `translate3d(${transform - nmtPosX22}px, 0px, 0px)`;
    }

  },
  nmtSwipeEnd2 = function() {
    nmtPosFinal2 = nmtPosInit2 - nmtPosX12;

    nmtIsScroll2 = false;
    nmtIsSwipe2 = false;

    document.removeEventListener('touchmove', nmtSwipeAction2);
    document.removeEventListener('mousemove', nmtSwipeAction2);
    document.removeEventListener('touchend', nmtSwipeEnd2);
    document.removeEventListener('mouseup', nmtSwipeEnd2);

    nmtSliderList2.classList.add('grab');
    nmtSliderList2.classList.remove('grabbing');

    if (nmtAllowSwipe2) {
      nmtSwipeEndTime2 = Date.now();
      if (Math.abs(nmtPosFinal2) > nmtPosThreshold2 || nmtSwipeEndTime2 - nmtSwipeStartTime2 < 300) {
        if (nmtPosInit2 < nmtPosX12) {
          nmtSlideIndex2--;
        } else if (nmtPosInit2 > nmtPosX12) {
          nmtSlideIndex2++;
        }
      }

      if (nmtPosInit2 !== nmtPosX12) {
        nmtAllowSwipe2 = false;
        nmtSlide2();
      } else {
        nmtAllowSwipe2 = true;
      }

    } else {
      nmtAllowSwipe2 = true;
    }

  },
  nmtSetTransform2 = function(transform, comapreTransform) {
    if (transform >= comapreTransform) {
      if (transform > comapreTransform) {
        nmtSliderTrack2.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
      }
    }
    nmtAllowSwipe2 = false;
  },
  nmtReachEdge2 = function() {
    nmtTransition2 = false;
    nmtSwipeEnd2();
    nmtAllowSwipe2 = true;
  };

nmtSliderTrack2.style.transform = 'translate3d(0px, 0px, 0px)';
nmtSliderList2.classList.add('grab');

nmtSliderTrack2.addEventListener('transitionend', () => nmtAllowSwipe2 = true);
nmtSlider2.addEventListener('touchstart', nmtSwipeStart2);
nmtSlider2.addEventListener('mousedown', nmtSwipeStart2);

nmtArrows2.addEventListener('click', function() {
  let target = event.target;

  if (target.classList.contains('next-nmt-one-two')) {
    nmtSlideIndex2++;
  } else if (target.classList.contains('prev-nmt-one-two')) {
    nmtSlideIndex2--;
  } else {
    return;
  }

  nmtSlide2();
});

function looknmt(){
  param=document.getElementById('nmt-slide-one-1');
  if(param.style.display == "none") param.style.display = "block";
  else param.style.display = "none"
  }
  
    function looknmt2(){
      param=document.getElementById('nmt-slide-one-2');
      if(param.style.display == "none") param.style.display = "block";
      else param.style.display = "none"
      }
      
      function looknmt3(){
        param=document.getElementById('nmt-slide-one-3');
        if(param.style.display == "none") param.style.display = "block";
        else param.style.display = "none"
        }

        function looknmt4(){
          param=document.getElementById('nmt-slide-one-4');
          if(param.style.display == "none") param.style.display = "block";
          else param.style.display = "none"
          }
          function looknmt5(){
            param=document.getElementById('nmt-slide-one-5');
            if(param.style.display == "none") param.style.display = "block";
            else param.style.display = "none"
            }

            function looknmt6(){
              param=document.getElementById('nmt-slide-one-6');
              if(param.style.display == "none") param.style.display = "block";
              else param.style.display = "none"
              }