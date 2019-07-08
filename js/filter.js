'use strict';

(function () {
  var filters = document.querySelectorAll('.map__filters select, .map__filters input[type="checkbox"]');

  var callbacks = {
    'housing-type': function (option, item) {
      return option.value === item.offer.type;
    },

    'housing-price': function (option, item) {
      var price;
      switch (true) {
        case item.offer.price < 10000:
          price = 'low';
          break;
        case item.offer.price <= 50000:
          price = 'middle';
          break;
        case item.offer.price > 50000:
          price = 'high';
          break;
      }

      return option.value === price;
    },

    'housing-rooms': function (option, item) {
      return option.value === item.offer.rooms.toString();
    },

    'housing-guests': function (option, item) {
      return option.value === '0' ? item.offer.guests === parseInt(option.value, 10) : item.offer.guests >= parseInt(option.value, 10);
    },

    'features': function (checkbox, item) {
      var isInOfferFeatures = function (elem) {
        return elem === checkbox.value;
      };

      if (checkbox.checked) {
        return item.offer.features.some(isInOfferFeatures);
      }
      return true;
    }

  };

  var filterBy = function (option, item) {
    return option.value === 'any' || callbacks[option.name](option, item);
  };

  window.filterOffers = function (data) {
    filters.forEach(function (option) {
      data = data.filter(function (it) {
        return filterBy(option, it);
      });
    });
    return data;
  };
})();
