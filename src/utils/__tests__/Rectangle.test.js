import Point from '../../utils/Point';
import Rectangle from '../../utils/Rectangle';
import { FACE, INCH } from '../../utils/constants';
import { degrees_equals, degrees_to_radians } from '../../utils/conversions';


/*
if (rect_data.BR_point === undefined ||
    rect_data.BR_point.x === undefined ||
    rect_data.BR_point.y === undefined) {
    throw new Error(`(${rect_data.BR_point.x}, ${rect_data.BR_point.y}) - UNDEFINED!!!`);
}
this.__BR_point = rect_data.__BR_point || rect_data.BR_point;
this.facing = (rect_data.facing + 360) % 360;
this.length = rect_data.length || INCH;
this.width = rect_data.width || INCH/2 ;

expect(function() { new Point({}); }).toThrow(Error);
*/

it('throws if no point', () => {
  var rect = { facing: FACE.NORTH };
  expect(function() { new Rectangle(rect); }).toThrow(Error);
});

it('throws if no facing', () => {
  var rect = { BR_point: new Point({ x: 1000 * Math.random(), y: 1000 * Math.random() }) };
  expect(function() { new Rectangle(rect); }).toThrow(Error);
});

it('JSON.stringifies on toString', () => {
  var rect = new Rectangle({
    facing: FACE.NORTH,
    BR_point: new Point({ x: 1000 * Math.random(), y: 1000 * Math.random() })
  });
  expect(rect.toString()).toEqual(JSON.stringify(rect));
});

it('returns __BR_point on BR_point', () => {
  const point = new Point({ x: 1000 * Math.random(), y: 1000 * Math.random() });
  var rect = new Rectangle({
    facing: FACE.NORTH,
    BR_point: point
  });
  expect(rect.BR_point().equals(rect.__BR_point));
});

it('thows on __BR_point not point', () => {
  const point = [new Point({ x: 1000 * Math.random(), y: 1000 * Math.random() })];
  var rect = new Rectangle({
    facing: FACE.NORTH,
    BR_point: point
  });
  rect.__BR_point = 'not_a_point';
  expect(function() { rect.BR_point() }).toThrow(Error);
});

it('returns BL_point, one width the left of BR_point', () => {
  const point = new Point({ x: 3 * INCH, y: 3 * INCH });
  const rect = new Rectangle({
    facing: FACE.NORTH,
    BR_point: point
  });
  const result = rect.BL_point();
  const expected = new Point({ x: 3 * INCH - rect.width, y: 3 * INCH });
  expect(result instanceof Point);
  expect(expected.equals(result));
});

it('returns FR_point, one length to the front of BR_point', () => {
  const point = new Point({ x: 3 * INCH, y: 3 * INCH });
  const rect = new Rectangle({
    facing: FACE.NORTH,
    BR_point: point
  });
  const result = rect.BL_point();
  const expected = new Point({ x: 3 * INCH, y: 3 * INCH - rect.length  });
  expect(result instanceof Point);
  expect(expected.equals(result));
});



it('returns FL_point, one length to the front, one to left of BR_point', () => {
  const point = new Point({ x: 3 * INCH, y: 3 * INCH });
  const rect = new Rectangle({
    facing: FACE.NORTH,
    BR_point: point
  });
  const result = rect.FL_point();
  const expected = new Point({ x: 3 * INCH - rect.width, y: 3 * INCH - rect.length  });
  expect(result instanceof Point);
  expect(expected.equals(result));
});


it('returns center, 1/2 length to the front, 1/2 width to left of BR_point', () => {
  const point = new Point({ x: 3 * INCH, y: 3 * INCH });
  const rect = new Rectangle({
    facing: FACE.NORTH,
    BR_point: point
  });
  const result = rect.center();
  const expected = new Point({ x: 3 * INCH - .5 * rect.width, y: 3 * INCH - .5 * rect.length  });
  expect(result instanceof Point);
  expect(expected.equals(result));
});







/*


  FL_point() {
    return this.BL_point().move((this.facing + FACE.FRONT), this.length);
  }

  center() {
    return new Segment([this.FL_point(), this.BR_point()]).middle();
  }
*/
