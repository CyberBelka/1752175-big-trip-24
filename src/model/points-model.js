
import { points } from '../mock/points';
import Observable from '../framework/observable';

export default class TripModel extends Observable {
  #points = points;

  getPoints() {
    return this.#points;
  }

  updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index !== -1) {
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
    }

    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, updatedPoint) {
    this.#points = [
      updatedPoint,
      ...this.#points,
    ];

    this._notify(updateType, updatedPoint);
  }

  deletePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index !== -1) {
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
    }

    this._notify(updateType);
  }
}
