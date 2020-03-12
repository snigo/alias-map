import KeyNode from '../src/keynode';

test('creating KeyNode class', () => {
  const keyNode = new KeyNode('foo');

  // Check the instance and all properties to be in place
  expect(keyNode).toBeInstanceOf(KeyNode);
  expect(keyNode).toHaveProperty('value', 'foo');
  expect(keyNode).toHaveProperty('aliases', null);
  expect(Object.keys(keyNode)).toHaveLength(2);
  expect(typeof keyNode.setAlias).toBe('function');
  expect(typeof keyNode.removeAlias).toBe('function');

  // KeyNode class cannot be invoked without "new" keyword
  expect(KeyNode).toThrow();

  // Value cannot be undefined or null
  expect(() => new KeyNode()).toThrow();
  expect(() => new KeyNode(null)).toThrow();
});

test('setAlias and removeAlias methods', () => {
  const gray = new KeyNode('#808080', 'grey', 'neutral gray');

  expect(gray).toHaveProperty('aliases');
  expect(gray.aliases.has('grey')).toBe(true);
  expect(gray.aliases.has('neutral gray')).toBe(true);
  expect(gray.aliases.size).toBe(2);

  const aliases = gray.setAlias('neutral grey');
  expect([...gray.aliases]).toEqual(['grey', 'neutral gray', 'neutral grey']);
  expect(aliases).toHaveLength(3);

  const successfulRemove = gray.removeAlias('neutral gray');
  expect(successfulRemove).toBe(true);
  expect(gray.aliases.size).toBe(2);

  const unsuccessfulRemove = gray.removeAlias('neutral gray');
  expect(unsuccessfulRemove).toBe(false);

  gray.removeAlias('neutral grey');
  gray.removeAlias('grey');
  expect(gray.aliases).toBe(null);

  expect(gray.removeAlias('foo')).toBe(false);

  gray.setAlias(gray);
  expect(gray.aliases.size).toBe(1);
});
