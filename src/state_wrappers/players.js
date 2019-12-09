import { useSelector } from 'react-redux'

export default class Players {
  static contructor () {

  }

  __players () {
    return useSelector((state) => state.players)
  }

  currentIndex () {
    return this.__players().currentIndex
  }

  current () {
    return this.__players().all[this.currentIndex()]
  }
}
