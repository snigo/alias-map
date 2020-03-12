import AliasNode from '../src/aliasnode';

test('creating AliasNode class', () => {
  const aliasNode = new AliasNode('foo', 'bar');

  // Check the instance and all properties to be in place
  expect(aliasNode).toBeInstanceOf(AliasNode);
  expect(aliasNode).toHaveProperty('aliasOf', 'foo');
  expect(aliasNode).toHaveProperty('value', 'bar');
  expect(Object.keys(aliasNode)).toHaveLength(2);

  // AliasNode class cannot be invoked without "new" keyword
  expect(AliasNode).toThrow();

  // Alias cannot be undefined or null
  expect(() => new AliasNode()).toThrow();
  expect(() => new AliasNode(null)).toThrow();
});
