
import { UpdateType } from '../const';
import Observable from '../framework/observable';
import AdapterService from '../service/adapter-service';

export default class PointsModel extends Observable {
  #points = [];
  #pointsApiService = null;
  #pointsAdapterService = new AdapterService();

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  getPoints() {
    return this.#points;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#pointsAdapterService.adaptToClient);
      this._notify(UpdateType.INIT);
    } catch (err) {
      this.#points = [];
      this._notify(UpdateType.INIT);
    }
  }

  async updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index !== -1) {
      try {
        const response = await this.#pointsApiService.updatePoint(updatedPoint);
        const updatePoint = this.#pointsAdapterService.adaptToClient(response);

        this.#points = [
          ...this.#points.slice(0, index),
          updatePoint,
          ...this.#points.slice(index + 1),
        ];

        this._notify(updateType, updatePoint);
      } catch (err) {
        throw new Error('Can\'t update point');
      }
    }

    this._notify(updateType, updatedPoint);
  }

  async addPoint(updateType, updatedPoint) {
    try {
      const response = await this.#pointsApiService.addPoint(updatedPoint);
      const newPoint = this.#pointsAdapterService.adaptToClient(response);

      this.#points = [
        updatedPoint,
        ...this.#points,
      ];

      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index !== -1) {
      try {
        await this.#pointsApiService.deletePoint(updatedPoint);

        this.#points = [
          ...this.#points.slice(0, index),
          ...this.#points.slice(index + 1),
        ];

        this._notify(updateType);
      } catch (err) {
        throw new Error('Can\'t delete point');
      }
    }
  }
}
