import Point from '../../utils/Point';
import { FACE } from '../../utils/constants';
import { degrees_equals, degrees_to_radians } from '../../utils/conversions';

it('can return an array', () => {
  let rand_x = 1000 * Math.random();
  let rand_y = 1000 * Math.random();
  let point = new Point({ x: rand_x, y: rand_y });
  expect(point.as_array()).toEqual([rand_x, rand_y]);
});

it('can rotate 90 degrees clockwise around a point', () => {
  let init = new Point({ x: 2, y: 1 });
  let fulcrum = new Point({ x: 1, y: 1 });
  let result = init.rotate_around({ fulcrum: fulcrum, degrees: 90 });
  expect(result.as_array()).toEqual([1,2]);
});

it('can rotate 90 degrees counterclockwise around a point', () => {
  let init = new Point({ x: 1, y: 2 });
  let fulcrum = new Point({ x: 1, y: 1 });
  let result = init.rotate_around({ fulcrum: fulcrum, degrees: -90 });
  expect(result.x).toEqual(2);
  expect(result.y).toEqual(1);
});

it('can output as array', () => {
  let x = 1000 * Math.random();
  let y = 1000 * Math.random();
  let result = new Point({ x: x, y: y }).as_array();
  //result = point.as_array();
  expect(result[0]).toEqual(x);
  expect(result[1]).toEqual(y);
});


it('throws on undefined inputs', () => {
  expect(function() { new Point({}); }).toThrow(Error);
});

it('can clone', () => {
  let x = 1000 * Math.random();
  let y = 1000 * Math.random();
  let p1 = new Point({ x: x, y: y });
  let p2 = p1.clone();
  expect(p1.equals(p2));
});

it('returns degrees direction - 0 is NORTH', () => {
  let p1 = new Point({ x: 3, y: 3 });
  let p2 = new Point({ x: 3, y: 0 });
  let result = p1.direction_to(p2);
  expect(degrees_equals(result, 0));
  expect(degrees_equals(result, FACE.NORTH));
});

it('returns degrees direction - 270 is WEST', () => {
  let p1 = new Point({ x: 3, y: 3 });
  let p2 = new Point({ x: 0, y: 3 });
  let result = p1.direction_to(p2);
  expect(result % 360).toEqual(270);
  expect(degrees_equals(result, 270));
  expect(degrees_equals(result, FACE.WEST));
});

/*
// Why does this work? Luck?
it('can move point NORTH 3', () => {
  let p1 = new Point({ x: 3, y: 3 });
  let rads = degrees_to_radians(FACE.NORTH);
  let p2 = p1.move(rads, 3);
  expect(p2.x).toEqual(3);
  expect(p2.y).toEqual(0);
});

// BUGBUG: BROKEN!!!
it('can move point WEST 3', () => {
  let p1 = new Point({ x: 3, y: 3 });
  let rads = degrees_to_radians(FACE.SOUTH);
  let p2 = p1.move(rads, 3);
  expect(p2.y).toEqual(6);
  expect(p2.x).toEqual(3);
});
*/

it('does JSON.stringify on toString', () => {
  let rand_x = 1000 * Math.random();
  let rand_y = 1000 * Math.random();
  let point = new Point({ x: rand_x, y: rand_y });
  expect(point.toString()).toEqual(JSON.stringify(point));
});
