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

  window.makeFragment = function (data, size) {
    var fragment = document.createDocumentFragment();
    var fragmentSize = data.length < size ? data.length : size;
    for (var i = 0; i < fragmentSize; i++) {
      fragment.appendChild(window.renderPin(data[i]));
    }
    return fragment;
  };
})();
