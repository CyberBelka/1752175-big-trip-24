import AbstractView from '../framework/view/abstract-view.js';
import { capitalizeFirstLetter, dateContent, dateDateTime, formatDuration, timeContent, timeDateTime } from '../utils.js';
import he from 'he';

function createPointTemplate(point, offers, destination) {
  const { basePrice, type, isFavorite } = point;

  return `<li class="trip-events__item">
            <div class="event">
              <time class="event__date" datetime="${dateDateTime(point.dateFrom)}">${dateContent(point.dateFrom)}</time>
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${capitalizeFirstLetter(he.encode(type))} ${he.encode(destination?.name || '')}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  <time class="event__start-time" datetime="${timeDateTime(point.dateFrom)}">${timeContent(point.dateFrom)}</time>
                  &mdash;
                  <time class="event__end-time" datetime="${timeDateTime(point.dateTo)}">${timeContent(point.dateTo)}</time>
                </p>
                <p class="event__duration">${formatDuration(point.dateFrom, point.dateTo)}</p>
              </div>
              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
              </p>
              <h4 class="visually-hidden">Offers:</h4>
              <ul class="event__selected-offers">
                ${offers.map((offer) => `
                  <li class="event__offer">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.price}</span>
                  </li>
                `).join('')}
              </ul>
              <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
                <span class="visually-hidden">Add to favorite</span>
                <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                  <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                </svg>
              </button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div>
          </li>`;
}

export default class Point extends AbstractView {
  #point = null;
  #offers = [];
  #destination = null;
  #onOpenEditButtonClick = null;
  #onFavoriteButtonClick = null;

  constructor({point, offers, destination, onOpenEditButtonClick, onFavoriteButtonClick}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destination = destination;
    this.#onOpenEditButtonClick = onOpenEditButtonClick;
    this.#onFavoriteButtonClick = onFavoriteButtonClick;
    this.#setEventListeners();
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destination);
  }

  #setEventListeners() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#openEditButtonClickHandler);

    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteButtonClickHandler);
  }

  #openEditButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onOpenEditButtonClick();
  };

  #favoriteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteButtonClick();
  };
}
