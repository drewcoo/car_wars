export const DATA = {}

export const matchCars = ({ match }) => {
  return match.carIds.map(outerCarId => DATA.cars.find(innerCar => outerCarId === innerCar.id))
}
