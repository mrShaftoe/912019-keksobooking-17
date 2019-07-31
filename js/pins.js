'use strict';

(function () {
  var PinSizes = function (width, height) {
    this.width = width;
    this.height = height;
  };
  var OfferPinSizes = new PinSizes(50, 70);
  var MainPinSizes = new PinSizes(65, 81);
  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var pinsQuantity;
  var mainPin = mapPins.querySelector('.map__pin--main');
  window.MainPinCoords = new window.utils.Coordinates(mainPin.offsetLeft, mainPin.offsetTop);
  var onPinClick = function (data) {
    window.cards.show(data);
  };

  /**
 * Функция создания нового пина
 * @param {object} data объект, содержащий данные предложения
 * @return {object} pinElement DOM-элемент
 */
  var renderPin = function (data) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinElementImg = pinElement.querySelector('img');
    pinElement.dataset.id = data.id;
    pinElement.style.left = data.location.x - OfferPinSizes.width / 2 + 'px';
    pinElement.style.top = data.location.y - OfferPinSizes.height + 'px';
    pinElementImg.src = data.author.avatar;
    pinElementImg.alt = data.offer.title;

    pinElement.addEventListener('click', function (evt) {
      evt.preventDefault();
      onPinClick(data);
    });

    return pinElement;
  };

  var makeFragment = function (data) {
    var fragment = document.createDocumentFragment();
    var fragmentSize = data.length < pinsQuantity ? data.length : pinsQuantity;
    for (var i = 0; i < fragmentSize; i++) {
      fragment.appendChild(renderPin(data[i]));
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
    append: appendPinsToMap,
    MainPinSizes: MainPinSizes,
    setShownQuantity: setShownPinsQuantity
  };

})();
