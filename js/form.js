'use strict';

(function () {
  var ESC_KEY_CODE = 27;
  var HousingMinPrices = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var main = document.querySelector('main');
  var adForm = document.querySelector('.ad-form');
  var address = adForm.querySelector('#address');
  var houseTypeSelect = adForm.querySelector('#type');
  var roomsNumber = adForm.querySelector('#room_number');
  var capacity = adForm.querySelector('#capacity');
  var pricePerNight = adForm.querySelector('#price');
  var timein = adForm.querySelector('#timein');
  var timeout = adForm.querySelector('#timeout');
  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters');
  var mainPin = map.querySelector('.map__pin--main');
  var successTemplate = document.querySelector('#success')
                        .content
                        .querySelector('.success');

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

  var changeCapacityOptions = function (value) {
    capacity.setCustomValidity('');
    var rooms = value === '100' ? 0 : Number(value);
    Array.prototype.forEach.call(capacity.children, function (it) {
      it.disabled = (Number(it.value) === 0 && rooms !== 0) || Number(it.value) > rooms;
    });
    if (value < capacity.value) {
      capacity.setCustomValidity('Выбранное количество гостей не соответствует выбранному количеству комнат');
    }
  };

  var showSuccessWindow = function () {
    var successWindow = successTemplate.cloneNode(true);
    main.appendChild(successWindow);

    var removeSuccesWindow = function (evt) {
      if (evt.keyCode === ESC_KEY_CODE) {
        successWindow.remove();
        document.removeEventListener('keydown', removeSuccesWindow);
      }
    };

    successWindow.addEventListener('click', function (evt) {
      evt.preventDefault();
      successWindow.remove();
    });

    document.addEventListener('keydown', removeSuccesWindow);
  };
  /**
  * Функция блокировки полей форм и подстановки стартовых координат в поле address
  * при запуске страницы
  */

  var initial = function () {
    adForm.reset();
    window.activated = false;
    window.pins.appendToMap([]);
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    mainPin.style.left = window.MainPinCoords.x;
    mainPin.style.top = window.MainPinCoords.y;
    for (var i = 0; i < adForm.children.length; i++) {
      adForm.children[i].disabled = true;
    }

    for (i = 0; i < mapFilters.children.length; i++) {
      mapFilters.children[i].disabled = true;
    }
    changeCapacityOptions(roomsNumber.value);
    window.setAddressCoords(mainPin.offsetLeft + window.MainPin.WIDTH / 2, mainPin.offsetTop + window.MainPin.WIDTH / 2);
  };

  window.onFormSaveSuccess = function () {
    window.error.remove();
    initial();
    showSuccessWindow();
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

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var data = new FormData(adForm);
    window.backend.save(
        data,
        window.onFormSaveSuccess,
        function () {
          window.error.show(data);
        }
    );
  });
})();
