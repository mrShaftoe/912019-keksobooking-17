'use strict';

(function () {
  var PIN_HALF_WIDTH = 25;
  var PIN_HEIGHT = 70;
  window.MainPin = {
    WIDTH: 65,
    HEIGHT: 81
  };
  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var pinsQuantity;
  /**
 * Функция создания нового пина
 * @param {object} data объект, содержащий данные предложения
 * @return {object} pinElement DOM-элемент
 */
  window.renderPin = function (data) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinElementImg = pinElement.querySelector('img');
    pinElement.style.left = data.location.x - PIN_HALF_WIDTH + 'px';
    pinElement.style.top = data.location.y - PIN_HEIGHT + 'px';
    pinElementImg.src = data.author.avatar;
    pinElementImg.alt = data.offer.title;

    return pinElement;
  };

  var makeFragment = function (data) {
    var fragment = document.createDocumentFragment();
    var fragmentSize = data.length < pinsQuantity ? data.length : pinsQuantity;
    for (var i = 0; i < fragmentSize; i++) {
      fragment.appendChild(window.renderPin(data[i]));
    }
    return fragment;
  };

  var appendPinsToMap = function (data) {
    var pins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (pins.length) {
      pins.forEach(function (pin) {
        pin.remove();
      });
    }
    mapPins.appendChild(makeFragment(data));
  };

  var setShownPinsQuantity = function (size) {
    pinsQuantity = size;
  };

  window.pins = {
    appendToMap: appendPinsToMap,
    setShownQuantity: setShownPinsQuantity
  };

})();