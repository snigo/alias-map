import ValueNode from '../src/valuenode';

test('creating ValueNode class', () => {
  const valueNode = new ValueNode('foo');

  // Check the instance and all properties to be in place
  expect(valueNode).toBeInstanceOf(ValueNode);
  expect(valueNode).toHaveProperty('value', 'foo');
  expect(Object.keys(valueNode)).toHaveLength(1);

  // ValueNode class cannot be invoked without "new" Valueword
  expect(ValueNode).toThrow();

  // Value cannot be undefined or null
  expect(() => new ValueNode()).toThrow();
  expect(() => new ValueNode(null)).toThrow();
});
