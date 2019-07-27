'use strict';

(function () {
  var ESC_KEY_CODE = 27;
  var MIME_TYPES = ['image/gif', 'image/jpeg', 'image/png'];
  var HousingMinPrices = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var main = document.querySelector('main');
  var adForm = document.querySelector('.ad-form');
  var title = adForm.querySelector('#title');
  var address = adForm.querySelector('#address');
  var houseTypeSelect = adForm.querySelector('#type');
  var roomsNumber = adForm.querySelector('#room_number');
  var capacity = adForm.querySelector('#capacity');
  var pricePerNight = adForm.querySelector('#price');
  var timein = adForm.querySelector('#timein');
  var timeout = adForm.querySelector('#timeout');
  var fieldsToValidate = [title, pricePerNight, capacity];

  var avatar = null;
  var avatarUploader = adForm.querySelector('#avatar');
  var avatarDropzone = adForm.querySelector('.ad-form-header__drop-zone');
  var avatarPreview = adForm.querySelector('.ad-form-header__preview img');
  var defaultAvatar = avatarPreview.src;

  var housingPhotos = {};
  var housingPhotosUploader = adForm.querySelector('#images');
  var housingPhotosDropzone = adForm.querySelector('.ad-form__drop-zone');
  var housingPhotosPreview = adForm.querySelector('.ad-form__photo');
  var dragObj = null;

  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters');
  var mainPin = map.querySelector('.map__pin--main');
  var successTemplate = document.querySelector('#success')
                        .content
                        .querySelector('.success');

  var FieldsValidation = {
    title: function () {
      return title.value.length > 30 && title.value.length < 100;
    },

    price: function () {
      return pricePerNight.value >= HousingMinPrices[houseTypeSelect.value];
    },

    capacity: function () {
      var rooms = roomsNumber.value === '100' ? 0 : Number(roomsNumber.value);
      return rooms >= capacity.value;
    },
  };

  var validateFields = function () {
    return fieldsToValidate.filter(function (it) {
      return !FieldsValidation[it.name]();
    });
  };

  var setValidationError = function (elem) {
    var action = elem.tagName === 'INPUT' ? 'input' : 'change';
    elem.addEventListener(action, removeValidationError);
    elem.classList.add('field-error');
  };

  var removeValidationError = function (evt) {
    var action = evt.target.tagName === 'INPUT' ? 'input' : 'change';
    if (FieldsValidation[evt.target.name]()) {
      evt.target.classList.remove('field-error');
      event.target.removeEventListener(action, removeValidationError);
    }
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
  var setAddress = function (x, y) {
    address.value = x + ', ' + y;
  };

  var changeCapacityOptions = function (value) {
    capacity.setCustomValidity('');
    var rooms = value === '100' ? 0 : Number(value);
    Array.prototype.forEach.call(capacity.children, function (it) {
      it.disabled = (Number(it.value) === 0 && rooms !== 0) || Number(it.value) > rooms;
    });
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

  var onImageDrop = function (evt) {
    evt.preventDefault();
    evt.target.parentNode.insertBefore(dragObj, evt.target);
  };

  var addDragListeners = function (obj) {
    obj.addEventListener('dragstart', function () {
      dragObj = obj;
    });
    obj.addEventListener('drop', onImageDrop);
  };

  var isImage = function (file) {
    return MIME_TYPES.indexOf(file.type) !== -1;
  };

  var isNotUploaded = function (file) {
    var notUploaded = !housingPhotos[file.size];
    if (notUploaded) {
      housingPhotos[file.size] = file;
    }

    return notUploaded;
  };

  var setAvatarImage = function (imageSrc) {
    avatarPreview.src = imageSrc;
  };

  var resetAvatar = function () {
    avatarPreview.src = defaultAvatar;
  };

  var resetHousingPhotos = function () {
    var photos = document.querySelectorAll('.ad-form__photo');
    if (photos) {
      photos.forEach(function (it) {
        if (it.hasChildNodes()) {
          it.remove();
        }
      });
    }
  };

  var renderHousingPhoto = function (photoSrc) {
    var photoDiv = housingPhotosPreview.cloneNode();
    var image = document.createElement('img');
    image.src = photoSrc;
    photoDiv.draggable = true;
    photoDiv.appendChild(image);
    addDragListeners(photoDiv);
    housingPhotosPreview.parentNode.insertBefore(photoDiv, housingPhotosPreview);
  };


  var upload = function (file, cb) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      cb(reader.result);
    });

    reader.readAsDataURL(file);
  };

  var uploadAvatar = function (data) {
    var dataArr = Array.from(data).filter(isImage);
    if (dataArr.length) {
      avatar = data[0];
      upload(avatar, setAvatarImage);
    }
  };

  var uploadHousingPhotos = function (data) {
    var dataArr = Array.from(data).filter(function (it) {
      return isImage(it) && isNotUploaded(it);
    });
    dataArr.forEach(function (it) {
      upload(it, renderHousingPhoto);
    });
  };

  var setAvatarUploaderFile = function (data) {
    if (avatar) {
      data.set('avatar', avatar, avatar.name);
    }
  };

  var setHousingPhotosUploaderFiles = function (data) {
    var photos = Object.values(housingPhotos);
    if (photos.length) {
      data.set('images', []);
      photos.forEach(function (it) {
        data.append('images', it, it.name);
      });
    }
  };

  /**
  * Функция блокировки полей форм и подстановки стартовых координат в поле address
  * при запуске страницы
  */

  var initial = function () {
    adForm.reset();
    window.activated = false;
    window.pins.append([]);
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    resetAvatar();
    resetHousingPhotos();
    mainPin.style.left = window.MainPinCoords.x;
    mainPin.style.top = window.MainPinCoords.y;
    for (var i = 0; i < adForm.children.length; i++) {
      adForm.children[i].disabled = true;
    }

    for (i = 0; i < mapFilters.children.length; i++) {
      mapFilters.children[i].disabled = true;
    }
    changeCapacityOptions(roomsNumber.value);
    setAddress(mainPin.offsetLeft + window.pins.MainPinSizes.width / 2, mainPin.offsetTop + window.pins.MainPinSizes.width / 2);
  };

  var onFormSaveSuccess = function () {
    initial();
    showSuccessWindow();
  };

  initial();

  // Запрет действия по умолчанию при перетаскивание файла извне
  document.addEventListener('dragover', function (evt) {
    evt.preventDefault();
  });
  document.addEventListener('dragenter', function (evt) {
    evt.preventDefault();
  });

  document.addEventListener('drop', function (evt) {
    evt.preventDefault();
  });

  // Загрузка аватара через input
  avatarUploader.addEventListener('change', function () {
    uploadAvatar(avatarUploader.files);
  });

  // Загрузка аватара при перетаскивании
  avatarDropzone.addEventListener('drop', function (evt) {
    evt.preventDefault();
    uploadAvatar(evt.dataTransfer.files);
  });

  avatarDropzone.addEventListener('dragenter', function () {
    avatarDropzone.classList.add('ad-form-header__drop-zone--hover');
  });

  avatarDropzone.addEventListener('dragleave', function () {
    avatarDropzone.classList.remove('ad-form-header__drop-zone--hover');
  });

  // Загрузка фотографий жилья через input
  housingPhotosUploader.addEventListener('change', function () {
    uploadHousingPhotos(housingPhotosUploader.files);
  });

  // Загрузка фотографий жилья при перетаскивании
  housingPhotosDropzone.addEventListener('drop', function (evt) {
    evt.preventDefault();
    uploadHousingPhotos(evt.dataTransfer.files);
  });

  housingPhotosDropzone.addEventListener('dragenter', function () {
    housingPhotosDropzone.classList.add('ad-form__drop-zone--hover');
  });

  housingPhotosDropzone.addEventListener('dragleave', function () {
    housingPhotosDropzone.classList.remove('ad-form__drop-zone--hover');
  });

  housingPhotosPreview.addEventListener('drop', onImageDrop);

  // Изменение минимальной цены и плейсхолдера поля ввода цены при изменении типа жилья
  houseTypeSelect.addEventListener('change', function (evt) {
    onHouseTypeSelectChange(evt);
  });

  // Изменение времени выезда при изменении времени заезда
  timein.addEventListener('change', function (evt) {
    onTimeSelectChange(evt, timeout);
  });

  // Изменение времени заезда при изменении времени выезда
  timeout.addEventListener('change', function (evt) {
    onTimeSelectChange(evt, timein);
  });

  // Изменение доступных опций поля "Количество мест" при изменении количества комнат
  roomsNumber.addEventListener('change', function (evt) {
    changeCapacityOptions(evt.target.value);
  });

  // Отправка формы
  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var result = validateFields();
    if (!result.length) {
      var data = new FormData(adForm);
      setAvatarUploaderFile(data);
      setHousingPhotosUploaderFiles(data);
      window.backend.save(
          data,
          onFormSaveSuccess,
          window.error.show
      );
    } else {
      result.forEach(setValidationError);
    }
  });

  adForm.addEventListener('reset', initial);

  window.form = {
    setAddress: setAddress,
  };
})();
