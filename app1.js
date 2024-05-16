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
  nmtArrows = nmtSlider.querySelector('.slider-arrows-nmt-one-nmt'),
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
  nmtLastTrf = 9 * nmtSlideWidth,  // 9 шагов вправо
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
    nmtNext.classList.toggle('disabled', nmtSlideIndex === 9);
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

      // запрет ухода вправо на последнем допустимом слайде (9 раз)
      if (nmtSlideIndex === 9) {
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
  nmtSetTransform = function(transform, compareTransform) {
    if (transform >= compareTransform) {
      if (transform > compareTransform) {
        nmtSliderTrack.style.transform = `translate3d(${compareTransform}px, 0px, 0px)`;
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

nmtArrows.addEventListener('click', function(event) {
  let target = event.target;

  if (target.classList.contains('next-nmt-one-nmt') && nmtSlideIndex < 9) {
    nmtSlideIndex++;
  } else if (target.classList.contains('prev-nmt-one-nmt') && nmtSlideIndex > 0) {
    nmtSlideIndex--;
  } else {
    return;
  }

  nmtSlide();
});

let windowWidthSlide = window.innerWidth
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

    if (windowWidthSlide >= 1320){
      nmtPrev2.classList.toggle('disabled', nmtSlideIndex2 === 0);
      nmtNext2.classList.toggle('disabled', nmtSlideIndex2 === 3);
    }
    else if(windowWidthSlide < 1100 && windowWidthSlide > 630){
      nmtPrev2.classList.toggle('disabled', nmtSlideIndex2 === 0);
      nmtNext2.classList.toggle('disabled', nmtSlideIndex2 === 5);
    }
    // else{
    //   prev.classList.toggle('disabled', slideIndex === 0);
    //   next.classList.toggle('disabled', slideIndex === 4);
    // }

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
              let windowWidthSlide2 = window.innerWidth
              let nmtSlider2M = document.querySelector('.nmt-slider-two-M'),
              nmtSliderList2M = nmtSlider2M.querySelector('.nmt-slider-list-two-M'),
              nmtSliderTrack2M = nmtSlider2M.querySelector('.nmt-slider-track-two-M'),
              nmtSlides2M = nmtSlider2M.querySelectorAll('.nmt-column-M'),
              nmtArrows2M = nmtSlider2M.querySelector('.slider-M'),
              nmtPrev2M = nmtArrows2M.children[0],
              nmtNext2M = nmtArrows2M.children[1],
              nmtSlideWidth2M = nmtSlides2M[0].offsetWidth,
              nmtSlideIndex2M = 0,
              nmtPosInit2M = 0,
              nmtPosX12M = 0,
              nmtPosX22M = 0,
              nmtPosY12M = 0,
              nmtPosY22M = 0,
              nmtPosFinal2M = 0,
              nmtIsSwipe2M = false,
              nmtIsScroll2M = false,
              nmtAllowSwipe2M = true,
              nmtTransition2M = true,
              nmtNextTrf2M = 0,
              nmtPrevTrf2M = 0,
              nmtLastTrf2M = --nmtSlides2M.length * nmtSlideWidth2M,
              nmtPosThreshold2M = nmtSlides2M[0].offsetWidth * 0.35,
              nmtTrfRegExp2M = /([-0-9.]+(?=px))/,
              nmtSwipeStartTime2M,
              nmtSwipeEndTime2M,
              nmtGetEvent2M = function() {
                return (event.type.search('touch') !== -1) ? event.touches[0] : event;
              },
              nmtSlide2M = function() {
                if (nmtTransition2M) {
                  nmtSliderTrack2M.style.transition = 'transform .5s';
                }
                nmtSliderTrack2M.style.transform = `translate3d(-${nmtSlideIndex2M * nmtSlideWidth2M}px, 0px, 0px)`;
            
                if(windowWidthSlide2 >= 1320){
                  nmtPrev2M.classList.toggle('disabled', nmtSlideIndex2M === 0);
                  nmtNext2M.classList.toggle('disabled', nmtSlideIndex2M === 2);
                }
                else if((windowWidthSlide < 1100 && windowWidthSlide2 > 630)){
                    nmtPrev2M.classList.toggle('disabled', nmtSlideIndex2M === 0);
                    nmtNext2M.classList.toggle('disabled', nmtSlideIndex2M === 4);
                  }
                
              },
              nmtSwipeStart2M = function() {
                let evt = nmtGetEvent2M();
            
                if (nmtAllowSwipe2M) {
            
                  nmtSwipeStartTime2M = Date.now();
                  
                  nmtTransition2M = true;
            
                  nmtNextTrf2M = (nmtSlideIndex2M + 1) * -nmtSlideWidth2M;
                  nmtPrevTrf2M = (nmtSlideIndex2M - 1) * -nmtSlideWidth2M;
            
                  nmtPosInit2M = nmtPosX12M = evt.clientX;
                  nmtPosY12M = evt.clientY;
            
                  nmtSliderTrack2M.style.transition = '';
            
                  document.addEventListener('touchmove', nmtSwipeAction2M);
                  document.addEventListener('mousemove', nmtSwipeAction2M);
                  document.addEventListener('touchend', nmtSwipeEnd2M);
                  document.addEventListener('mouseup', nmtSwipeEnd2M);
            
                  nmtSliderList2M.classList.remove('grab');
                  nmtSliderList2M.classList.add('grabbing');
                }
              },
              nmtSwipeAction2M = function() {
            
                let evt = nmtGetEvent2M(),
                  style = nmtSliderTrack2M.style.transform,
                  transform = +style.match(nmtTrfRegExp2M)[0];
            
                nmtPosX22M = nmtPosX12M - evt.clientX;
                nmtPosX12M = evt.clientX;
            
                nmtPosY22M = nmtPosY12M - evt.clientY;
                nmtPosY12M = evt.clientY;
            
                if (!nmtIsSwipe2M && !nmtIsScroll2M) {
                  let posY = Math.abs(nmtPosY22M);
                  if (posY > 7 || nmtPosX22M === 0) {
                    nmtIsScroll2M = true;
                    nmtAllowSwipe2M = false;
                  } else if (posY < 7) {
                    nmtIsSwipe2M = true;
                  }
                }
            
                if (nmtIsSwipe2M) {
                  if (nmtSlideIndex2M === 0) {
                    if (nmtPosInit2M < nmtPosX12M) {
                      nmtSetTransform2M(transform, 0);
                      return;
                    } else {
                      nmtAllowSwipe2M = true;
                    }
                  }
            
                  // запрет ухода вправо на последнем слайде
                  if (nmtSlideIndex2M === --nmtSlides2M.length) {
                    if (nmtPosInit2M > nmtPosX12M) {
                      nmtSetTransform2M(transform, nmtLastTrf2M);
                      return;
                    } else {
                      nmtAllowSwipe2M = true;
                    }
                  }
            
                  if (nmtPosInit2M > nmtPosX12M && transform < nmtNextTrf2M || nmtPosInit2M < nmtPosX12M && transform > nmtPrevTrf2M) {
                    nmtReachEdge2M();
                    return;
                  }
            
                  nmtSliderTrack2M.style.transform = `translate3d(${transform - nmtPosX22M}px, 0px, 0px)`;
                }
            
              },
              nmtSwipeEnd2M = function() {
                nmtPosFinal2M = nmtPosInit2M - nmtPosX12M;
            
                nmtIsScroll2M = false;
                nmtIsSwipe2M = false;
            
                document.removeEventListener('touchmove', nmtSwipeAction2M);
                document.removeEventListener('mousemove', nmtSwipeAction2M);
                document.removeEventListener('touchend', nmtSwipeEnd2M);
                document.removeEventListener('mouseup', nmtSwipeEnd2M);
            
                nmtSliderList2M.classList.add('grab');
                nmtSliderList2M.classList.remove('grabbing');
            
                if (nmtAllowSwipe2M) {
                  nmtSwipeEndTime2M = Date.now();
                  if (Math.abs(nmtPosFinal2M) > nmtPosThreshold2M || nmtSwipeEndTime2M - nmtSwipeStartTime2M < 300) {
                    if (nmtPosInit2M < nmtPosX12M) {
                      nmtSlideIndex2M--;
                    } else if (nmtPosInit2M > nmtPosX12M) {
                      nmtSlideIndex2M++;
                    }
                  }
            
                  if (nmtPosInit2M !== nmtPosX12M) {
                    nmtAllowSwipe2M = false;
                    nmtSlide2M();
                  } else {
                    nmtAllowSwipe2M = true;
                  }
            
                } else {
                  nmtAllowSwipe2M = true;
                }
            
              },
              nmtSetTransform2M = function(transform, comapreTransform) {
                if (transform >= comapreTransform) {
                  if (transform > comapreTransform) {
                    nmtSliderTrack2M.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
                  }
                }
                nmtAllowSwipe2M = false;
              },
              nmtReachEdge2M = function() {
                nmtTransition2M = false;
                nmtSwipeEnd2M();
                nmtAllowSwipe2M = true;
              };
            
            nmtSliderTrack2M.style.transform = 'translate3d(0px, 0px, 0px)';
            nmtSliderList2M.classList.add('grab');
            
            nmtSliderTrack2M.addEventListener('transitionend', () => nmtAllowSwipe2M = true);
            nmtSlider2.addEventListener('touchstart', nmtSwipeStart2M);
            nmtSlider2.addEventListener('mousedown', nmtSwipeStart2M);
            
            nmtArrows2M.addEventListener('click', function() {
              let target = event.target;
            
              if (target.classList.contains('next-nmt-one-two-M')) {
                nmtSlideIndex2M++;
              } else if (target.classList.contains('prev-nmt-one-two-M')) {
                nmtSlideIndex2M--;
              } else {
                return;
              }
            
              nmtSlide2M();
            });
            
            function looknmtM(){
              param=document.getElementById('nmt-slide-one-1-M');
              if(param.style.display == "none") param.style.display = "block";
              else param.style.display = "none"
              }
              
            function looknmt2M(){
              param=document.getElementById('nmt-slide-one-2-M');
              if(param.style.display == "none") param.style.display = "block";
              else param.style.display = "none"
            }
            
            function looknmt3M(){
              param=document.getElementById('nmt-slide-one-3-M');
              if(param.style.display == "none") param.style.display = "block";
              else param.style.display = "none"
            }
            
            function looknmt4M(){
              param=document.getElementById('nmt-slide-one-4-M');
              if(param.style.display == "none") param.style.display = "block";
              else param.style.display = "none"
            }
            
            function looknmt5MN(){
              param=document.getElementById('nmt-slide-one-5-M');
              if(param.style.display == "none") param.style.display = "block";
              else param.style.display = "none"
            }
            
            function looknmt6M(){
              param=document.getElementById('nmt-slide-one-6-M');
              if(param.style.display == "none") param.style.display = "block";
              else param.style.display = "none"
            }
            

            function lookacc(){
              param=document.getElementById('divacc1');
              if(param.style.display == "none") param.style.display = "block";
              else param.style.display = "none"
              }

              function lookacc2(){
                param=document.getElementById('divacc2');
                if(param.style.display == "none") param.style.display = "block";
                else param.style.display = "none"
                }

                function lookacc3(){
                  param=document.getElementById('divacc3');
                  if(param.style.display == "none") param.style.display = "block";
                  else param.style.display = "none"
                  }

                  function lookacc4(){
                    param=document.getElementById('divacc4');
                    if(param.style.display == "none") param.style.display = "block";
                    else param.style.display = "none"
                    }

                    function lookacc5(){
                      param=document.getElementById('divacc5');
                      if(param.style.display == "none") param.style.display = "block";
                      else param.style.display = "none"
                      }
              
          