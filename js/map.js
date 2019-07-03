'use strict';

(function () {
  var OFFERS_QUANTITY = 8;
  var map = window.MapData.map;
  var mapPins = map.querySelector('.map__pins');
  var mainPin = window.MainPin.mainPin;
  var adForm = document.querySelector('.ad-form');
  var mapFilters = map.querySelector('.map__filters');

  var activated = false;

  /**
  * Функция перевода страницы в активный режим
  */
  var activatePage = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    for (var i = 0; i < adForm.children.length; i++) {
      adForm.children[i].disabled = false;
    }
    for (i = 0; i < mapFilters.children.length; i++) {
      mapFilters.children[i].disabled = false;
    }
    mapPins.appendChild(window.makeFragment(OFFERS_QUANTITY));
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

      if (mainPin.offsetLeft < 1 - window.MainPin.WIDTH / 2) {
        mainPin.style.left = 1 - window.MainPin.WIDTH / 2 + 'px';
      }

      if (mainPin.offsetLeft > window.MapData.map.offsetWidth - window.MainPin.WIDTH / 2 - 1) {
        mainPin.style.left = (window.MapData.map.offsetWidth - window.MainPin.WIDTH / 2 - 1) + 'px';
      }

      if (mainPin.offsetTop < window.MapData.MIN_Y - window.MainPin.HEIGHT) {
        mainPin.style.top = (window.MapData.MIN_Y - window.MainPin.HEIGHT) + 'px';
      }

      if (mainPin.offsetTop > window.MapData.MAX_Y - window.MainPin.HEIGHT) {
        mainPin.style.top = (window.MapData.MAX_Y - window.MainPin.HEIGHT) + 'px';
      }

      window.setAddressCoords(mainPin.offsetLeft + window.MainPin.WIDTH, mainPin.offsetTop + window.MainPin.HEIGHT);
    };

    var onMainPinMouseUp = function (upEvt) {
      upEvt.preventDefault();

      window.window.setAddressCoords(mainPin.offsetLeft + window.MainPin.WIDTH, mainPin.offsetTop + window.MainPin.HEIGHT);
      document.removeEventListener('mousemove', onMainPinMouseMove);
      document.removeEventListener('mouseup', onMainPinMouseUp);
    };

    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  });
})();