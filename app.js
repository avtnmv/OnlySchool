let color;
function getCoords(elem) {
  let coords = elem.getBoundingClientRect();

  return {
    top: coords.top + window.pageYOffset,
    left: coords.left + window.pageXOffset,
    leftX: coords.left,
    rigth: coords.left + window.pageXOffset + coords.width,
    bottom: coords.top + window.pageYOffset + coords.height,
    width: coords.width,
  };
}

function moveRange(elem, e) {
  var coords = getCoords(elem);

  var colorRange = elem.parentElement.children[1];

  var parent = {};
  parent.element = elem.parentElement;
  parent.coords = getCoords(parent.element);

  var indicator = elem.querySelector("span");
  if (!indicator) {
    indicator = document.createElement("span");
    indicator.style.position = "absolute";
    indicator.style.top = "50%";
    indicator.style.left = "50%";
    indicator.style.transform = "translate(-50%, -50%)";
    elem.appendChild(indicator);
  }

  var text = elem.parentElement.querySelector(".text");

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("touchmove", onMouseMove);
  document.addEventListener("touchend", onMouseUp);

  elem.ondragstart = function () {
    return false;
  };

  function onMouseMove(e) {
    var pos = e.touches === undefined ? e.clientX : e.targetTouches[0].clientX;

    var newLeft = pos - parent.coords.leftX - coords.width / 2;

    var step = 25;
    var roundedValue;

    if (newLeft <= 0) {
      newLeft = 0;
      roundedValue = 150;
    } else if (newLeft > 0 && newLeft <= parent.coords.width / 3) {
      newLeft = Math.min(newLeft, parent.coords.width / 3 - coords.width);
      roundedValue =
        150 + Math.round((newLeft / (parent.coords.width / 3)) * 25);
    } else if (
      newLeft > parent.coords.width / 3 &&
      newLeft <= (parent.coords.width / 3) * 2
    ) {
      newLeft = Math.max(newLeft, parent.coords.width / 3);
      newLeft = Math.min(newLeft, (parent.coords.width / 3) * 2 - coords.width);
      roundedValue =
        175 +
        Math.round(
          ((newLeft - parent.coords.width / 3) / (parent.coords.width / 3)) * 10
        );
    } else if (
      newLeft > (parent.coords.width / 3) * 2 &&
      newLeft <= parent.coords.width - coords.width
    ) {
      newLeft = Math.max(newLeft, (parent.coords.width / 3) * 2);
      newLeft = Math.min(newLeft, parent.coords.width - coords.width);
      roundedValue =
        185 +
        Math.round(
          ((newLeft - (parent.coords.width / 3) * 2) /
            (parent.coords.width / 3)) *
            15
        );
    } else {
      newLeft = parent.coords.width - coords.width;
      roundedValue = 200;
    }

    elem.style.left = newLeft + "px";

    indicator.innerText = roundedValue;

    colorRange.style.left = 0;
    colorRange.style.width = newLeft + "px";

    updateText(roundedValue);
  }

  function onMouseUp() {
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("touchend", onMouseUp);
    document.removeEventListener("touchmove", onMouseMove);
  }

  onMouseMove(e);
}

let previousValue = 150; // Значение по умолчанию

function updateText(value) {
  var text = document.querySelector(".text");
  var newText = getText(value);

  if (newText !== undefined) {
    previousValue = value; // Обновляем предыдущее значение только если новое значение не undefined
  }

  text.innerText = getText(previousValue);
}

function getText(value) {
  switch (value) {
    case 150:
      return `Бiльше 2500 учнiв ONLY SCHOOL отримали на НМТ/ЗНО вiд 150 до 170 балiв`;
    case 175:
      return `Бiльше 3200 учнiв ONLY SCHOOL отримали на НМТ/ЗНО вiд 170 до 185 балiв`;
    case 185:
      return "Бiльше 2000 учнiв ONLY SCHOOL отримали на НМТ/ЗНО вiд 185 до 200 балiв";
    case 200:
      return `350 учнiв ONLY SCHOOL отримали на НМТ/ЗНО омрiяннi 200 балiв`;
    default:
      return undefined; // Возвращаем undefined для значений, для которых текст не определен
  }
}

let windowWidth = window.innerWidth;
let slider = document.querySelector(".slider"),
  sliderList = slider.querySelector(".slider-list"),
  sliderTrack = slider.querySelector(".slider-track"),
  slides = slider.querySelectorAll(".slide"),
  arrows = slider.querySelector(".slider-arrows"),
  prev = arrows.children[0],
  next = arrows.children[1],
  slideWidth = slides[0].offsetWidth,
  slideIndex = 0,
  posInit = 0,
  posX1 = 0,
  posX2 = 0,
  posY1 = 0,
  posY2 = 0,
  posFinal = 0,
  isSwipe = false,
  isScroll = false,
  allowSwipe = true,
  transition = true,
  nextTrf = 0,
  prevTrf = 0,
  lastTrf = --slides.length * slideWidth,
  posThreshold = slides[0].offsetWidth * 0.35,
  trfRegExp = /([-0-9.]+(?=px))/,
  swipeStartTime,
  swipeEndTime,
  getEvent = function () {
    return event.type.search("touch") !== -1 ? event.touches[0] : event;
  },
  slide = function () {
    if (transition) {
      sliderTrack.style.transition = "transform .5s";
    }
    sliderTrack.style.transform = `translate3d(-${
      slideIndex * slideWidth
    }px, 0px, 0px)`;

    if (windowWidth >= 1320) {
      prev.classList.toggle("disabled", slideIndex === 0);
      next.classList.toggle("disabled", slideIndex === 1);
    } else if (windowWidth < 1100 && windowWidth > 630) {
      prev.classList.toggle("disabled", slideIndex === 0);
      next.classList.toggle("disabled", slideIndex === 3);
    } else {
      prev.classList.toggle("disabled", slideIndex === 0);
      next.classList.toggle("disabled", slideIndex === 3);
    }
  },
  swipeStart = function () {
    let evt = getEvent();

    if (allowSwipe) {
      swipeStartTime = Date.now();

      transition = true;

      nextTrf = (slideIndex + 1) * -slideWidth;
      prevTrf = (slideIndex - 1) * -slideWidth;

      posInit = posX1 = evt.clientX;
      posY1 = evt.clientY;

      sliderTrack.style.transition = "";

      document.addEventListener("touchmove", swipeAction);
      document.addEventListener("mousemove", swipeAction);
      document.addEventListener("touchend", swipeEnd);
      document.addEventListener("mouseup", swipeEnd);

      sliderList.classList.remove("grab");
      sliderList.classList.add("grabbing");
    }
  },
  swipeAction = function () {
    let evt = getEvent(),
      style = sliderTrack.style.transform,
      transform = +style.match(trfRegExp)[0];

    posX2 = posX1 - evt.clientX;
    posX1 = evt.clientX;

    posY2 = posY1 - evt.clientY;
    posY1 = evt.clientY;

    if (!isSwipe && !isScroll) {
      let posY = Math.abs(posY2);
      if (posY > 7 || posX2 === 0) {
        isScroll = true;
        allowSwipe = false;
      } else if (posY < 7) {
        isSwipe = true;
      }
    }

    if (isSwipe) {
      if (slideIndex === 0) {
        if (posInit < posX1) {
          setTransform(transform, 0);
          return;
        } else {
          allowSwipe = true;
        }
      }

      // запрет ухода вправо на последнем слайде
      if (slideIndex === --slides.length) {
        if (posInit > posX1) {
          setTransform(transform, lastTrf);
          return;
        } else {
          allowSwipe = true;
        }
      }

      if (
        (posInit > posX1 && transform < nextTrf) ||
        (posInit < posX1 && transform > prevTrf)
      ) {
        reachEdge();
        return;
      }

      sliderTrack.style.transform = `translate3d(${
        transform - posX2
      }px, 0px, 0px)`;
    }
  },
  swipeEnd = function () {
    posFinal = posInit - posX1;

    isScroll = false;
    isSwipe = false;

    document.removeEventListener("touchmove", swipeAction);
    document.removeEventListener("mousemove", swipeAction);
    document.removeEventListener("touchend", swipeEnd);
    document.removeEventListener("mouseup", swipeEnd);

    sliderList.classList.add("grab");
    sliderList.classList.remove("grabbing");

    if (allowSwipe) {
      swipeEndTime = Date.now();
      if (
        Math.abs(posFinal) > posThreshold ||
        swipeEndTime - swipeStartTime < 300
      ) {
        if (posInit < posX1) {
          slideIndex--;
        } else if (posInit > posX1) {
          slideIndex++;
        }
      }

      if (posInit !== posX1) {
        allowSwipe = false;
        slide();
      } else {
        allowSwipe = true;
      }
    } else {
      allowSwipe = true;
    }
  },
  setTransform = function (transform, comapreTransform) {
    if (transform >= comapreTransform) {
      if (transform > comapreTransform) {
        sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
      }
    }
    allowSwipe = false;
  },
  reachEdge = function () {
    transition = false;
    swipeEnd();
    allowSwipe = true;
  };

sliderTrack.style.transform = "translate3d(0px, 0px, 0px)";
sliderList.classList.add("grab");

sliderTrack.addEventListener("transitionend", () => (allowSwipe = true));
slider.addEventListener("touchstart", swipeStart);
slider.addEventListener("mousedown", swipeStart);

arrows.addEventListener("click", function () {
  let target = event.target;

  if (target.classList.contains("next")) {
    if (slideIndex === 0) {
      prev.classList.remove("disabled");
    }
    slideIndex++;
  } else if (target.classList.contains("prev")) {
    if (slideIndex === 1) {
      next.classList.remove("disabled");
    }
    slideIndex--;
  } else {
    return;
  }

  slide();
});

prev.classList.add("disabled"); // Добавляем класс disabled для кнопки влево изначально

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("load-more");
  const rect = document.getElementById("card-container");

  button.addEventListener("click", () => {
    toggleTwoClasses(rect, "is-visible", "is-hidden", 500);
  });
});

function toggleTwoClasses(element, first, second, timeOfAnimation) {
  if (!element.classList.contains(first)) {
    element.classList.add(first);
    element.classList.remove(second);
  } else {
    element.classList.add(second);
    window.setTimeout(function () {
      element.classList.remove(first);
    }, timeOfAnimation);
  }
}

var modalBackground = document.getElementById("modalBackground");
var modal = document.getElementById("myModal");
var btn = document.getElementById("openModal");
var btn2 = document.getElementById("openModal2");
var btn3 = document.getElementById("openModal3");
var btn4 = document.getElementById("openModal4");
var btn5 = document.getElementById("openModal5");

btn.onclick = function () {
  modal.style.display = "block";
  modalBackground.style.display = "block";
};

btn2.onclick = function () {
  modal.style.display = "block";
  modalBackground.style.display = "block";
};
btn3.onclick = function () {
  modal.style.display = "block";
  modalBackground.style.display = "block";
};
btn4.onclick = function () {
  modal.style.display = "block";
  modalBackground.style.display = "block";
};
btn5.onclick = function () {
  modal.style.display = "block";
  modalBackground.style.display = "block";
};
modalBackground.onclick = function () {
  modal.style.display = "none";
  modalBackground.style.display = "none";
};
function look() {
  param = document.getElementById("div1");
  if (param.style.display == "none") param.style.display = "block";
  else param.style.display = "none";
}
function look() {
  param = document.getElementById("div1");
  if (param.style.display == "none") param.style.display = "block";
  else param.style.display = "none";
}

function look2() {
  param = document.getElementById("div2");
  if (param.style.display == "none") param.style.display = "block";
  else param.style.display = "none";
}

function look3() {
  param = document.getElementById("div3");
  if (param.style.display == "none") param.style.display = "block";
  else param.style.display = "none";
}

function look4() {
  param = document.getElementById("div4");
  if (param.style.display == "none") param.style.display = "block";
  else param.style.display = "none";
}

function look5() {
  param = document.getElementById("div5");
  if (param.style.display == "none") param.style.display = "block";
  else param.style.display = "none";
}

function look6() {
  param = document.getElementById("div6");
  if (param.style.display == "none") param.style.display = "block";
  else param.style.display = "none";
}

function look7() {
  param = document.getElementById("div7");
  if (param.style.display == "none") param.style.display = "block";
  else param.style.display = "none";
}

function look8() {
  param = document.getElementById("div8");
  if (param.style.display == "none") param.style.display = "block";
  else param.style.display = "none";
}

function look9() {
  param = document.getElementById("div9");
  if (param.style.display == "none") param.style.display = "block";
  else param.style.display = "none";
}

// DATA SENDING
document
  .getElementById("consultationForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      instagram: document.getElementById("instagram").value,
      subject: document.getElementById("subject").value,
    };
    const response = await fetch(
      "https://onlyback-git-main-ilyalazarenkoits-projects.vercel.app/createLead",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    if (response.ok) {
      modal.style.display = "none";
      modalBackground.style.display = "none";
      const successMessage = document.getElementById("successMessage");
      successMessage.style.display = "block";

      setTimeout(() => {
        successMessage.style.display = "none";
      }, 3000);
    } else {
      console.error("Ошибка при отправке данных:", response.statusText);
    }
    try {
    } catch (error) {
      console.error("Error:", error);
    }
  });
