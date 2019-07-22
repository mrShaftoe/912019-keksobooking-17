'use strict';

(function () {
  var map = document.querySelector('.map');
  var MapLimitsY = {
    MIN: 130,
    MAX: 630
  };

  var mainPin = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var mapFilters = map.querySelector('.map__filters');

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

    window.backend.load(
        window.onDataLoad,
        function () {
          window.error.show();
        }
    );
  };

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMainPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      if (!window.activated) {
        window.activated = true;
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

      if (mainPin.offsetLeft > map.offsetWidth - window.MainPin.WIDTH / 2 - 1) {
        mainPin.style.left = (map.offsetWidth - window.MainPin.WIDTH / 2 - 1) + 'px';
      }

      if (mainPin.offsetTop < MapLimitsY.MIN - window.MainPin.HEIGHT) {
        mainPin.style.top = (MapLimitsY.MIN - window.MainPin.HEIGHT) + 'px';
      }

      if (mainPin.offsetTop > MapLimitsY.MAX - window.MainPin.HEIGHT) {
        mainPin.style.top = (MapLimitsY.MAX - window.MainPin.HEIGHT) + 'px';
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
