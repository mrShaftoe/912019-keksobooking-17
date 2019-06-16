'use strict';

var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var PIN_HALF_WIDTH = 25;
var PIN_HEIGHT = 70;
var MAIN_PIN_WIDTH = 65;
var MAX_Y = 630;
var MIN_Y = 130;


var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mainPin = map.querySelector('.map__pin--main');
var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
var offers = [];
var mapFilters = map.querySelector('.map__filters');
var mapFiltersInputs = mapFilters.querySelectorAll('select, fieldset');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var address = adForm.querySelector('#address');


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

/**
 * Функция перевода страницы в активный режим
 */
var onMainPinClick = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].disabled = false;
  }
  for (i = 0; i < mapFiltersInputs.length; i++) {
    mapFiltersInputs[i].disabled = false;
  }
};

var getAddressCoord = function (position) {
  return parseInt(mainPin.style[position].slice(0, -2), 10) + MAIN_PIN_WIDTH / 2;
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

// Добавление фрагмента в .map__pins
mapPins.appendChild(fragment);

// Установка всем fieldset формы disabled=true
for (i = 0; i < adFormFieldsets.length; i++) {
  adFormFieldsets[i].disabled = true;
}

for (i = 0; i < mapFiltersInputs.length; i++) {
  mapFiltersInputs[i].disabled = true;
}

address.value = getAddressCoord('left') + ', ' + getAddressCoord('top');
mainPin.addEventListener('click', onMainPinClick);


