'use strict';

(function () {
  var PIN_HALF_WIDTH = 25;
  var PIN_HEIGHT = 70;

  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  /**
 * Функция создания нового пина
 * @param {object} offer объект, содержащий данные предложения
 * @return {object} pinElement DOM-элемент
 */
  window.renderPin = function (offer) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinElementImg = pinElement.querySelector('img');
    pinElement.style.left = offer.location.x - PIN_HALF_WIDTH + 'px';
    pinElement.style.top = offer.location.y - PIN_HEIGHT + 'px';
    pinElementImg.src = offer.author.avatar;
    pinElementImg.alt = offer.offer.title;

    return pinElement;
  };

  window.renderPins = function (data, size) {
    var offerPins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (offerPins.length) {
      offerPins.forEach(function (elem) {
        elem.remove();
      });
    }
    mapPins.appendChild(window.makeFragment(data, size));
  };

})();
