import AliasMap from '../src/aliasmap';

test('creating AliasMap class', () => {
  const aliasMap = new AliasMap();

  expect(aliasMap).toBeInstanceOf(AliasMap);
  expect(Object.keys(aliasMap)).toHaveLength(0);
  expect(typeof aliasMap.get).toBe('function');
  expect(typeof aliasMap.getAliases).toBe('function');
  expect(typeof aliasMap.getKey).toBe('function');
  expect(typeof aliasMap.has).toBe('function');
  expect(typeof aliasMap.hasAlias).toBe('function');
  expect(typeof aliasMap.set).toBe('function');
  expect(typeof aliasMap.setAlias).toBe('function');
  expect(typeof aliasMap.delete).toBe('function');
  expect(typeof aliasMap.deleteAlias).toBe('function');
  expect(typeof aliasMap.clear).toBe('function');
  expect(aliasMap.size).toBe(0);
  expect(aliasMap.entriesCount).toBe(0);
  expect(AliasMap).toThrow();
});

test('operations with empty map', () => {
  const aliasMap = new AliasMap();

  expect(aliasMap.get('foo')).toBeUndefined();
  expect(aliasMap.getKey('foo')).toBeUndefined();
  expect(aliasMap.has('foo')).toBe(false);
  expect(aliasMap.hasAlias('foo', 'bar')).toBe(false);
  expect(aliasMap.delete('foo')).toBe(false);
  expect(typeof aliasMap.deleteAlias).toBe('function');
});

test('crud operations', () => {
  const aliasMap = new AliasMap();
  aliasMap.set('foo', 'bar');

  expect(aliasMap.size).toBe(2);
  expect(aliasMap.entriesCount).toBe(1);
  expect(aliasMap.has('foo')).toBe(true);
  expect(aliasMap.has('bar')).toBe(true);
  expect(aliasMap.getAliases('bar')).toBeNull();

  aliasMap.set('alice', 'neighbors', 'bob');
  expect(aliasMap.size).toBe(5);
  expect(aliasMap.entriesCount).toBe(2);
  expect(aliasMap.has('alice')).toBe(true);
  expect(aliasMap.has('bob')).toBe(true);
  expect(aliasMap.has('neighbors')).toBe(true);
  expect(aliasMap.hasAlias('alice', 'bob')).toBe(true);
  expect(aliasMap.hasAlias('bob', 'alice')).toBe(false);

  aliasMap.setAlias('bar', 'bizz');
  expect(aliasMap.size).toBe(6);
  expect(aliasMap.entriesCount).toBe(2);
  expect(aliasMap.hasAlias('foo', 'bizz')).toBe(true);
  expect(aliasMap.get('foo')).toBe('bar');
  expect(aliasMap.get('bar')).toBe('foo');
  expect(aliasMap.get('bizz')).toBe('bar');
  expect(aliasMap.getKey('bizz')).toBe('foo');
  expect(aliasMap.getKey('bar')).toBe('foo');
  expect(aliasMap.getAliases('bar')).toEqual(['bizz']);

  aliasMap.delete('bob');
  expect(aliasMap.size).toBe(3);
  expect(aliasMap.entriesCount).toBe(1);
  expect(aliasMap.get('alice')).toBeUndefined();
  expect(aliasMap.getKey('neighbors')).toBeUndefined();
  expect(aliasMap.getAliases('bob')).toBeUndefined();
  expect(aliasMap.deleteAlias('bar', 'boomer')).toBe(false);

  aliasMap.deleteAlias('bar', 'bizz');
  expect(aliasMap.size).toBe(2);
  expect(aliasMap.entriesCount).toBe(1);
  expect(aliasMap.getAliases('foo')).toBeNull();

  aliasMap.clear();
  expect(aliasMap.size).toBe(0);
  expect(aliasMap.entriesCount).toBe(0);
});

test('Conflict handling', () => {
  const aliasMap = new AliasMap();
  aliasMap.set('A', 'B', 'C');

  expect(() => aliasMap.set('B', 'E', 'F')).toThrow();
  expect(() => aliasMap.set('C', 'E', 'F')).toThrow();
  expect(() => aliasMap.set('E', 'B', 'F')).toThrow();
  expect(() => aliasMap.set('E', 'C', 'F')).toThrow();
  expect(() => aliasMap.set('F', 'E', 'B')).toThrow();
  expect(() => aliasMap.set('F', 'E', 'C')).toThrow();
  expect(() => aliasMap.set('E', 'A', 'F')).toThrow();
  expect(() => aliasMap.set('F', 'E', 'A')).toThrow();

  aliasMap.set('A', 'C', 'B');
  expect(aliasMap.get('B')).toBe('C');
  expect(aliasMap.getAliases('C')).toEqual(['B']);
});
