'use strict';

(function () {
  var mapFilters = document.querySelector('.map__filters');
  var filters = mapFilters.querySelectorAll('select, input[type="checkbox"]');
  var filtersResults = {};
  var initialData;

  var isSelect = function (elem) {
    return elem.tagName === 'SELECT';
  };

  var isCheckbox = function (elem) {
    return elem.tagName === 'INPUT' && elem.type === 'checkbox';
  };

  var isCheckboxChecked = function (checkbox) {
    return checkbox.checked;
  };

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
      return Number(option.value) === item.offer.rooms;
    },

    'housing-guests': function (option, item) {
      return option.value === '0' ? item.offer.guests === Number(option.value) : item.offer.guests >= Number(option.value);
    },

    'features': function (checkbox, item) {
      var isInOfferFeatures = function (elem) {
        return elem === checkbox.value;
      };
      return item.offer.features.some(function (it) {
        return isInOfferFeatures(it);
      });
    }
  };

  var updateFiltersResults = function (elem) {
    if (isSelect(elem)) {
      if (elem.value === 'any') {
        filtersResults[elem.name] = initialData;
      } else {
        filtersResults[elem.name] = initialData.filter(function (it) {
          return callbacks[elem.name](elem, it);
        });
      }
    } else if (isCheckbox(elem)) {
      if (isCheckboxChecked(elem)) {
        filtersResults[elem.value] = initialData.filter(function (it) {
          return callbacks[elem.name](elem, it);
        });
      } else {
        filtersResults[elem.value] = initialData;
      }
    }
  };

  var concatAllFitersResults = function () {
    var newData = [];
    for (var item in filtersResults) {
      if (Object.prototype.hasOwnProperty.call(filtersResults, item)) {
        newData = newData.concat(filtersResults[item]);
      }
    }

    return newData;
  };

  var getAllUniquesCount = function (data) {
    return data.reduce(function (acc, el) {
      var idx = initialData.indexOf(el);
      acc[idx] = (acc[idx] || 0) + 1;
      return acc;
    }, {});
  };

  var getFilteredData = function (counterObj) {
    var filteredData = [];
    for (var item in counterObj) {
      if (Object.prototype.hasOwnProperty.call(counterObj, item)) {
        if (counterObj[item] === filters.length) {
          filteredData.push(initialData[item]);
        }
      }
    }
    return filteredData;
  };

  var onFilterChange = function (evt) {
    updateFiltersResults(evt.target);
    var newData = getFilteredData(getAllUniquesCount(concatAllFitersResults()));
    window.pins.appendToMap(newData);
  };

  window.mapFilterInit = function (data) {
    initialData = data.slice();
    filters.forEach(function (filter) {
      if (isSelect(filter)) {
        filtersResults[filter.name] = initialData;
      } else {
        filtersResults[filter.value] = initialData;
      }
    });
    mapFilters.addEventListener('change', function (evt) {
      window.debounce(function () {
        onFilterChange(evt);
      });
    });
  };


})();
