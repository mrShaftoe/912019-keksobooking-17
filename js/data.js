'use strict';

(function () {
  window.MapData = {
    map: document.querySelector('.map'),
    MIN_Y: 130,
    MAX_Y: 630
  };

  window.MainPin = {
    mainPin: window.MapData.map.querySelector('.map__pin--main'),
    WIDTH: 65,
    HEIGHT: 81
  };

  var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];

  /**
  * Функция получения случайного числа из заданного диапазона
  * @param {number} min целое число
  * @param {number} max целое число
  * @return {number} целое число из диапазона от min до max
  */
  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
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
   * Функция создания объекта предложения
   * @param {number} counter целое число, последний символ в имени файла аватара
   * @return {object} предложение
   */
  var getOfferData = function (counter) {
    return {
      'author': {
        'avatar': getAvatarSrc(counter)
      },

      'offer': {
        'type': OFFER_TYPES[getRandomNumber(0, OFFER_TYPES.length)]
      },

      'location': {
        'x': getRandomNumber(0, window.MapData.map.offsetWidth),
        'y': getRandomNumber(window.MapData.MIN_Y, window.MapData.MAX_Y)
      }
    };
  };

  window.makeFragment = function (length) {
    var fragment = document.createDocumentFragment();
    for (var i = 1; i <= length; i++) {
      fragment.appendChild(window.renderPin(getOfferData(i)));
    }
    return fragment;
  };
})();
