'use strict';

(function () {
  var ESC_KEY_CODE = 27;

  var errorTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');
  var main = document.querySelector('main');

  var showErrorWindow = function () {
    var errorWindow = errorTemplate.cloneNode(true);
    main.appendChild(errorWindow);

    var onEscPress = function (evt) {
      if (evt.keyCode === ESC_KEY_CODE) {
        evt.preventDefault();
        removeErrorWindow();
      }
    };

    var removeErrorWindow = function () {
      errorWindow.remove();
      document.removeEventListener('keydown', onEscPress);
    };

    errorWindow.addEventListener('click', removeErrorWindow);
    document.addEventListener('keydown', onEscPress);
  };

  window.error = {
    show: showErrorWindow
  };
})();
