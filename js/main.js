'use strict';

var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var PIN_HALF_WIDTH = 25;
var PIN_HEIGHT = 70;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 81;
var MAX_Y = 630;
var MIN_Y = 130;
var HOUSING_MIN_PRICES = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mainPin = map.querySelector('.map__pin--main');
var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
var offers = [];
var mapFilters = map.querySelector('.map__filters');
var adForm = document.querySelector('.ad-form');
var address = adForm.querySelector('#address');
var houseTypeSelect = adForm.querySelector('#type');
var pricePerNight = adForm.querySelector('#price');
var timein = adForm.querySelector('#timein');
var timeout = adForm.querySelector('#timeout');
var activated = false;
/**
 * Функция получения координаты x метки на карте
 * @return {number} целое число, координата середины метки
 */
var getPinX = function () {
  return Math.floor(Math.random() * ((map.offsetWidth - PIN_HALF_WIDTH) - PIN_HALF_WIDTH) + PIN_HALF_WIDTH);
};

/**
 * Функция получения координаты y метки на карте
 * @return {number} целое число, координата низа метки
 */
var getPinY = function () {
  return Math.floor(Math.random() * (MAX_Y - MIN_Y) + MIN_Y);
};

/**
 * Функция получения ссылки на аватар автора
 * @param {number} number целое положительное число
 * @return {string} относительная ссылка на аватар автора
 */
var getAvatarSrc = function (number) {
  return 'img/avatars/user0' + number + '.png';
};

/**
 * Функция получения типа предложения из списка предложений
 * @return {string} тип предложения
 */
var getOfferType = function () {
  return OFFER_TYPES[Math.floor(Math.random() * OFFER_TYPES.length)];
};

/**
 * Функция создания объекта предложения
 * @param {number} counter целое число, последний символ в имени файла аватара
 * @return {object} предложение
 */
var createOffer = function (counter) {
  return {
    'author': {
      'avatar': getAvatarSrc(counter)
    },

    'offer': {
      'type': getOfferType()
    },

    'location': {
      'x': getPinX(),
      'y': getPinY()
    }
  };
};

/**
 * Функция создания нового пина
 * @param {object} offer объект, содержащий данные предложения
 * @return {object} pinElement DOM-элемент
 */
var renderPin = function (offer) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinElementImg = pinElement.querySelector('img');
  pinElement.style.left = offer.location.x - PIN_HALF_WIDTH + 'px';
  pinElement.style.top = offer.location.y - PIN_HEIGHT + 'px';
  pinElementImg.src = offer.author.avatar;
  pinElementImg.alt = offer.offer.type;

  return pinElement;
};

// Cоздание массива из 8 предложений
for (var i = 1; i <= 8; i++) {
  offers.push(createOffer(i));
}

// Создание фрагмента
var fragment = document.createDocumentFragment();

// Генерация всех элементов из списка предложений и добавление их во фрагмент
for (i = 0; i < offers.length; i++) {
  fragment.appendChild(renderPin(offers[i]));
}

/**
 * Функция изменяет значение поля input#price в зависимости от выбранного
 * option в houseTypeSelect
 * @param {object} evt Event
 */
var onHouseTypeSelectChange = function (evt) {
  pricePerNight.min = HOUSING_MIN_PRICES[evt.target.value];
  pricePerNight.placeholder = HOUSING_MIN_PRICES[evt.target.value];
};

/**
 * Функция изменяет значение одного select в зависимости от другого
 * @param {object} evt Event
 * @param {object} timeSelect select, в который требуется внести изменения
 */
var onTimeSelectChange = function (evt, timeSelect) {
  timeSelect.value = evt.target.value;
};

/**
 * Функция блокировки полей форм и подстановки стартовых координат в поле address
 * при запуске страницы
 */
var initial = function () {
  for (i = 0; i < adForm.children.length; i++) {
    adForm.children[i].disabled = true;
  }

  for (i = 0; i < mapFilters.children.length; i++) {
    mapFilters.children[i].disabled = true;
  }

  setAddressCoords(mainPin.offsetLeft + MAIN_PIN_WIDTH / 2, mainPin.offsetTop + MAIN_PIN_WIDTH / 2);
};

/**
 * Функция перевода страницы в активный режим
 */
var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  for (i = 0; i < adForm.children.length; i++) {
    adForm.children[i].disabled = false;
  }
  for (i = 0; i < mapFilters.children.length; i++) {
    mapFilters.children[i].disabled = false;
  }
  mapPins.appendChild(fragment);
};

/**
 * Функция подстановки координат пина в поле адрес
 * @param {number} x Х-координата пина
 * @param {number} y Y-координата пина
 */
var setAddressCoords = function (x, y) {
  address.value = x + ', ' + y;
};

mainPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMainPinMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    if (!activated) {
      activated = true;
      activatePage();
    }
    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
    mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';

    if (mainPin.offsetLeft < 0) {
      mainPin.style.left = 0 + 'px';
    }

    if (mainPin.offsetLeft > map.offsetWidth - MAIN_PIN_WIDTH) {
      mainPin.style.left = (map.offsetWidth - MAIN_PIN_WIDTH) + 'px';
    }

    if (mainPin.offsetTop < MIN_Y - MAIN_PIN_HEIGHT) {
      mainPin.style.top = (MIN_Y - MAIN_PIN_HEIGHT) + 'px';
    }

    if (mainPin.offsetTop > MAX_Y - MAIN_PIN_HEIGHT) {
      mainPin.style.top = (MAX_Y - MAIN_PIN_HEIGHT) + 'px';
    }

    setAddressCoords(mainPin.offsetLeft + MAIN_PIN_WIDTH, mainPin.offsetTop + MAIN_PIN_HEIGHT);
  };

  var onMainPinMouseUp = function (upEvt) {
    upEvt.preventDefault();

    setAddressCoords(mainPin.offsetLeft + MAIN_PIN_WIDTH, mainPin.offsetTop + MAIN_PIN_HEIGHT);
    document.removeEventListener('mousemove', onMainPinMouseMove);
    document.removeEventListener('mouseup', onMainPinMouseUp);
  };

  document.addEventListener('mousemove', onMainPinMouseMove);
  document.addEventListener('mouseup', onMainPinMouseUp);
});

initial();

// mainPin.addEventListener('mouseup', onMainPinMouseUp);
houseTypeSelect.addEventListener('change', function (evt) {
  onHouseTypeSelectChange(evt);
});
timein.addEventListener('change', function (evt) {
  onTimeSelectChange(evt, timeout);
});
timeout.addEventListener('change', function (evt) {
  onTimeSelectChange(evt, timein);
});
