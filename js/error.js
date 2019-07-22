'use strict';

(function () {
  var ESC_KEY_CODE = 27;

  var errorTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');
  var errorWindow;
  var errorButton;
  var main = document.querySelector('main');

  var removeErrorWindow = function () {
    errorWindow = document.querySelector('.error');
    if (errorWindow) {
      errorWindow.parentNode.removeChild(errorWindow);
    }
  };

  var onScreenClick = function (evt) {
    if (evt.target !== errorButton) {
      removeErrorWindow();
    }
  };

  var onEscPress = function (evt) {
    if (evt.keyCode === ESC_KEY_CODE) {
      removeErrorWindow();
      document.removeEventListener('keydown', onEscPress);
    }
  };

  var onError = function (data) {
    removeErrorWindow();
    main.appendChild(errorTemplate.cloneNode(true));
    errorButton = document.querySelector('.error__button');
    if (data) {
      errorButton.addEventListener('click', function () {
        errorButton.disabled = true;
        window.backend.save(
            data,
            window.onFormSaveSuccess,
            function () {
              onError(data);
            });
      });
    } else {
      errorButton.addEventListener('click', function () {
        errorButton.disabled = true;
        window.backend.load(window.onDataLoad, function () {
          onError();
        });
      });
    }
    setTimeout(function () {
      errorWindow = document.querySelector('.error');
      errorWindow.addEventListener('click', onScreenClick);
    }, 100);
    document.addEventListener('keydown', onEscPress);
  };

  window.error = {
    remove: removeErrorWindow,
    show: onError
  };
})();
