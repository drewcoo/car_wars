import React from 'react';
import { useSelector } from 'react-redux';


export default class Players {
  static contructor() {

  }
  __players() {
    return useSelector((state) => state.players);
  }

  current_index() {
    return this.__players().current_index;
  }

  current() {
    return this.__players().all[this.current_index()];
  }
}
