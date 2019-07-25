import Point from '../../utils/Point';
import Segment from '../../utils/Segment';

it('throws on constructor not called with two elements', () => {
  expect(function() { new Segment([1, 2, 3]); }).toThrow(Error);
});

it('throws on element 0 not Point', () => {
  const p1 = 'not_a_point';
  const p2 = new Point({ x: 1000 * Math.random(), y: 1000 * Math.random() });
  expect(function() { new Segment([p1, p2]).toThrow(Error) });
});

it('throws on element 0 not Point', () => {
  const p1 = new Point({ x: 1000 * Math.random(), y: 1000 * Math.random() });
  const p2 = [];
  expect(function() { new Segment([p1, p2]).toThrow(Error) });
});
