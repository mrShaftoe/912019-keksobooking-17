'use strict';

(function () {
  var cardTemplate = document.querySelector('#card')
      .content
      .querySelector('.map__card');
  var photoTemplate = cardTemplate.querySelector('.popup__photo');

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');

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

  var renderCard = function (cardData) {
    var card = cardTemplate.cloneNode(true);
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
    card.classList.add('hidden');

    return card;
  };

  var appendCardToMap = function (data) {
    mapPins.appendChild(renderCard(data[0]));
    var card = mapPins.querySelector('.map__card');
    card.classList.remove('hidden');
  };

  window.cards = {
    append: appendCardToMap
  };

})();
