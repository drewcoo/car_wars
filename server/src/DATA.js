export const DATA = {}

export const matchCars = ({ match, _data = DATA }) => {
  return match.carIds.map((carId) => _data.cars.find((car) => car.id === carId))
}
