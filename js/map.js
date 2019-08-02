'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var mapFilters = map.querySelector('.map__filters');
  var MapLimits = {
    left: 1,
    right: map.offsetWidth - 1,
    top: 130,
    bottom: 630
  };

  var PinCoordinates = function (x, y, limits, sizes) {
    window.utils.Coordinates.call(this, x, y);
    this._limits = limits;
    this._sizes = sizes;
  };
  PinCoordinates.prototype.setXY = function (x, y) {
    this.x = x;
    this.y = y;
    if (x < this._limits.left - this._sizes.width / 2) {
      this.x = this._limits.left - this._sizes.width / 2;
    }
    if (x > this._limits.right - this._sizes.width / 2) {
      this.x = this._limits.right - this._sizes.width / 2;
    }

    if (y < this._limits.top - this._sizes.height) {
      this.y = this._limits.top - this._sizes.height;
    }
    if (y > this._limits.bottom - this._sizes.height) {
      this.y = this._limits.bottom - this._sizes.height;
    }
  };

  /**
  * Функция перевода страницы в активный режим
  */
  var activatePage = function () {
    if (window.activated) {
      return;
    }
    window.activated = true;

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
        window.error.show
    );
  };

  var onEnterPress = function (evt) {
    if (window.utils.isEnterPressed(evt)) {
      evt.preventDefault();
      activatePage();
    }
  };

  mainPin.addEventListener('keydown', onEnterPress);

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    activatePage();
    var startCoords = new window.utils.Coordinates(evt.clientX, evt.clientY);
    var mainPinCoords = new PinCoordinates(mainPin.offsetLeft, mainPin.offsetTop, MapLimits, window.pins.MainPinSizes);
    var onMainPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      if (!window.activated) {
        window.activated = true;
        activatePage();
      }
      var shift = new window.utils.Coordinates(startCoords.x - moveEvt.clientX, startCoords.y - moveEvt.clientY);
      startCoords.setXY(moveEvt.clientX, moveEvt.clientY);
      mainPinCoords.setXY(mainPin.offsetLeft - shift.x, mainPin.offsetTop - shift.y);
      mainPin.style.left = mainPinCoords.x + 'px';
      mainPin.style.top = mainPinCoords.y + 'px';

      window.setAddress(mainPin.offsetLeft + Math.floor(window.pins.MainPinSizes.width / 2), mainPin.offsetTop + window.pins.MainPinSizes.height);
    };

    var onMainPinMouseUp = function (upEvt) {
      upEvt.preventDefault();

      window.setAddress(mainPin.offsetLeft + Math.floor(window.pins.MainPinSizes.width / 2), mainPin.offsetTop + window.pins.MainPinSizes.height);
      document.removeEventListener('mousemove', onMainPinMouseMove);
      document.removeEventListener('mouseup', onMainPinMouseUp);
    };

    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  });
})();
