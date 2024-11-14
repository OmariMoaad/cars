import { Car } from "../models/car-entity";
import * as CarsData from "./../assets/vehicle-prices.json";

export class CarService {
  public static getCars(): Car[] {
    return CarsData.vehicles;
  }

  public static getCarManufactures(): Array<string> {
    return Array.from(new Set(CarsData.vehicles.map((car) => car.make)));
  }
  public static getMakeByModel(model: string): string | null {
    const car = this.getCars().find((car) => car.model === model);
    return car ? car.make : null;
  }
  public static getCarModels(make: string): Array<string> {
    if (!make) {
      return Array.from(new Set(CarsData.vehicles.map((car) => car.model)));
    }
    return Array.from(
      new Set(
        CarsData.vehicles
          .filter((car) => car.make === make)
          .map((car) => car.model)
      )
    );
  }
}
