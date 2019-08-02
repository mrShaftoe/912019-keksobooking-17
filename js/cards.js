'use strict';

(function () {
  var cardTemplate = document.querySelector('#card')
      .content
      .querySelector('.map__card');
  var photoTemplate = cardTemplate.querySelector('.popup__photo');

  var card = cardTemplate.cloneNode(true);
  var cardCloseButton = card.querySelector('.popup__close');
  var map = document.querySelector('.map');

  var HousingTypes = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var renderFeature = function (value) {
    var feature = document.createElement('li');
    feature.classList.add('popup__feature');
    feature.classList.add('popup__feature--' + value);
    return feature;
  };


  var updateCard = function (cardData) {
    card.querySelector('.popup__title').textContent = cardData.offer.title;
    card.querySelector('.popup__text--address').textContent = cardData.offer.address;
    var popupPrice = card.querySelector('.popup__text--price');
    var priceSpan = document.createElement('span');
    priceSpan.textContent = '/ночь';
    popupPrice.textContent = cardData.offer.price + '₽';
    popupPrice.appendChild(priceSpan);

    card.querySelector('.popup__type').textContent = HousingTypes[cardData.offer.type];
    card.querySelector('.popup__text--capacity').textContent = cardData.offer.rooms + ' комнаты для '
        + cardData.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardData.offer.checkin +
        ', выезд до ' + cardData.offer.checkout;

    var popupFeatures = card.querySelector('.popup__features');
    popupFeatures.innerHTML = '';
    cardData.offer.features.forEach(function (it) {
      popupFeatures.appendChild(renderFeature(it));
    });

    card.querySelector('.popup__description').textContent = cardData.offer.description;

    var popupPhotos = card.querySelector('.popup__photos');
    popupPhotos.innerHTML = '';
    for (var i = 0; i < cardData.offer.photos.length; i++) {
      var photo = photoTemplate.cloneNode();
      photo.src = cardData.offer.photos[i];
      popupPhotos.appendChild(photo);
    }

    card.querySelector('.popup__avatar').src = cardData.author.avatar;
  };

  var appendCardToMap = function () {
    card.classList.add('hidden');
    map.insertBefore(card, map.querySelector('.map__filters-container'));
  };

  var closeCard = function () {
    card.classList.add('hidden');
    document.removeEventListener('keydown', onEscPress);
  };

  var onEscPress = function (evt) {
    if (window.utils.isEscPressed(evt)) {
      closeCard();
    }
  };

  var onCloseButtonClick = function (evt) {
    evt.preventDefault();
    closeCard();
  };


  var showCard = function (data) {
    updateCard(data);
    card.classList.remove('hidden');
    document.addEventListener('keydown', onEscPress);
    cardCloseButton.addEventListener('click', onCloseButtonClick);
  };

  window.cards = {
    append: appendCardToMap,
    show: showCard,
    close: closeCard
  };

})();
