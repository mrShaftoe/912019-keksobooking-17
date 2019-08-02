'use strict';

(function () {
  var errorTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');
  var main = document.querySelector('main');

  var showErrorWindow = function () {
    var errorWindow = errorTemplate.cloneNode(true);
    main.appendChild(errorWindow);

    var onEscPress = function (evt) {
      if (window.utils.isEscPressed(evt)) {
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

  window.showErrorWindow = showErrorWindow;
})();
