'use strict';

(function () {
  var HousingMinPrices = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var adForm = document.querySelector('.ad-form');
  var address = adForm.querySelector('#address');
  var houseTypeSelect = adForm.querySelector('#type');
  var roomsNumber = adForm.querySelector('#room_number');
  var capacity = adForm.querySelector('#capacity');
  var pricePerNight = adForm.querySelector('#price');
  var timein = adForm.querySelector('#timein');
  var timeout = adForm.querySelector('#timeout');
  var mapFilters = document.querySelector('.map__filters');
  var mainPin = document.querySelector('.map__pin--main');
  var RoomsCapacity = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  /**
  * Функция изменяет значение поля input#price в зависимости от выбранного
  * option в houseTypeSelect
  * @param {object} evt Event
  */
  var onHouseTypeSelectChange = function (evt) {
    pricePerNight.min = HousingMinPrices[evt.target.value];
    pricePerNight.placeholder = HousingMinPrices[evt.target.value];
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

  // var setCapacityOptions = function (roomsQuantity) {
  //   var rooms = roomsQuantity === '100' ? 0 : Number(roomsQuantity);
  //   var options = Array.prototype.filter.call(capacityOptions, function (it) {
  //     var value = Number(it.value);
  //     return rooms === 0 ? rooms === value : value && rooms >= value;
  //   });
  //   capacityOptions.forEach(function (it) {
  //     it.disabled = false;
  //     if (options.indexOf(it) === -1) {
  //       it.disabled = true;
  //     }
  //   });
  // };

  var changeCapacityOptions = function (value) {
    capacity.setCustomValidity('');
    Array.prototype.forEach.call(capacity.children, function (it) {
      it.disabled = false;
      if (RoomsCapacity[value].indexOf(it.value) === -1) {
        it.disabled = true;
      }
    });
    if (RoomsCapacity[value].indexOf(capacity.value) === -1) {
      capacity.setCustomValidity('Выбранное количество гостей не соответствует выбранному количеству комнат');
    }
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
    changeCapacityOptions(roomsNumber.value);
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
  roomsNumber.addEventListener('change', function (evt) {
    changeCapacityOptions(evt.target.value);
  });
  capacity.addEventListener('change', function () {
    capacity.setCustomValidity('');
  });
})();
