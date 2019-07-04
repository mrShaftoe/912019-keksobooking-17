'use strict';

(function () {
  var HOUSING_MIN_PRICES = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var adForm = document.querySelector('.ad-form');
  var address = adForm.querySelector('#address');
  var houseTypeSelect = adForm.querySelector('#type');
  var pricePerNight = adForm.querySelector('#price');
  var timein = adForm.querySelector('#timein');
  var timeout = adForm.querySelector('#timeout');
  var mapFilters = window.MapData.map.querySelector('.map__filters');
  var mainPin = window.MainPin.mainPin;

  /**
  * Функция изменяет значение поля input#price в зависимости от выбранного
  * option в houseTypeSelect
  * @param {object} evt Event
  */
  var onHouseTypeSelectChange = function (evt) {
    pricePerNight.min = HOUSING_MIN_PRICES[evt.target.value];
    pricePerNight.placeholder = HOUSING_MIN_PRICES[evt.target.value];
  };

  /**
  * Функция изменяет значение одного select в зависимости от другого
  * @param {object} evt Event
  * @param {object} timeSelect select, в который требуется внести изменения
  */
  var onTimeSelectChange = function (evt, timeSelect) {
    timeSelect.value = evt.target.value;
  };

  /**
   * Функция подстановки координат пина в поле адрес
   * @param {number} x Х-координата пина
   * @param {number} y Y-координата пина
   */
  window.setAddressCoords = function (x, y) {
    address.value = x + ', ' + y;
  };

  /**
  * Функция блокировки полей форм и подстановки стартовых координат в поле address
  * при запуске страницы
  */

  var initial = function () {
    for (var i = 0; i < adForm.children.length; i++) {
      adForm.children[i].disabled = true;
    }

    for (i = 0; i < mapFilters.children.length; i++) {
      mapFilters.children[i].disabled = true;
    }
    window.setAddressCoords(mainPin.offsetLeft + window.MainPin.WIDTH / 2, mainPin.offsetTop + window.MainPin.WIDTH / 2);
  };

  initial();

  houseTypeSelect.addEventListener('change', function (evt) {
    onHouseTypeSelectChange(evt);
  });
  timein.addEventListener('change', function (evt) {
    onTimeSelectChange(evt, timeout);
  });
  timeout.addEventListener('change', function (evt) {
    onTimeSelectChange(evt, timein);
  });
})();
