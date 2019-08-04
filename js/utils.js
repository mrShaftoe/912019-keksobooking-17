'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms
  var ESC_KEY_CODE = 27;
  var ENTER_KEY_CODE = 13;

  var lastTimeout;

  var debounce = function (cb) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
  };

  var Coordinates = function (x, y) {
    this.x = x;
    this.y = y;
  };

  Coordinates.prototype.setXY = function (x, y) {
    this.x = x;
    this.y = y;
  };

  var isEscPressed = function (evt) {
    return evt.keyCode === ESC_KEY_CODE;
  };

  var isEnterPressed = function (evt) {
    return evt.keyCode === ENTER_KEY_CODE;
  };

  window.utils = {
    debounce: debounce,
    Coordinates: Coordinates,
    isEscPressed: isEscPressed,
    isEnterPressed: isEnterPressed
  };
})();
