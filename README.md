# AliasMap
AliasMap class from lost types series. Bi-directional map with support of aliases. Might be very good solution for indexing unique data.

## Usage

In the terminal:
```

% npm install @lost-types/alias-map

```

Then in the module:
```js
// JavaScript modules
import AliasMap from '@lost-types/alias-map';

// CommonJS
const AliasMap = require('@lost-types/alias-map');

const aliasMap = new AliasMap();

```

## Story behind AliasMap

The idea came to me while working on Color type for the same series. I needed to map color names to their hexadecimal values and Map() sounded like a correct choice for the job. However, later I also needed to map hexadecimal values back to the names, and in addition to linear O(n) complexity of this task, colors also have aliases, for example both “grey” and “gray” result in one value which make the opposite task “stateful”, because you will have to determine which one is a primary key and which one is alias. All these resulted in AliasMap class with constant time bi-directional retrieval in the following way:

**`AliasMap.get(*KEY*) -> *VALUE*`**

**`AliasMap.get(*ALIAS*) -> *VALUE*`**

**`AliasMap.get(*VALUE*) -> *KEY*`**

```js

const aliasMap = new AliasMap();
aliasMap.set('gray', '#808080', 'grey');

aliasMap.get('gray'); // #808080
aliasMap.get('grey'); // #808080
aliasMap.get('#808080'); // "gray"

```

## API

### Properties

#### `AliasMap.size`
#### `AliasMap.entriesCount`

Returns total Map size and number of connected entries made, where one entry is a primary key, value and all the aliases associated with the key.

```js

const aliasMap = new AliasMap();

const user = { userData: 'Might be stored here' };
aliasMap.set('primary.email@example.com', user, 'secondary.email@gmail.com');

aliasMap.size; // 3
aliasMap.entriesCount; // 1

```

### Methods

#### `AliasMap.prototype.get()`

Returns value if primary key or any of aliases provided and primary key if value provided.

| **Parameter** | **Type** | **Default value** | **Notes**                      |
|---------------|----------|-------------------|--------------------------------|
| `item`        | `any`    |                   | Either key, value or alias     |

```js

const marvelUniverse = new AliasMap();
const ironManUrl = 'https://en.wikipedia.org/wiki/Iron_Man';

marvelUniverse.set('Iron Man', ironManUrl);
marvelUniverse.setAlias('Iron Man', 'Anthony Edward Stark', 'Tony Stark');

// Get value by key
marvelUniverse.get('Iron Man'); // "https://en.wikipedia.org/wiki/Iron_Man"

// Get Value by alias
marvelUniverse.get('Tony Stark'); // "https://en.wikipedia.org/wiki/Iron_Man"

// Get primary key by value
marvelUniverse.get(ironManUrl); // "Iron Man"

```

***

#### `AliasMap.prototype.getKey()`

Returns primary key for provided item. Item could be a key, value or any of aliases.

| **Parameter** | **Type** | **Default value** | **Notes**                      |
|---------------|----------|-------------------|--------------------------------|
| `item`        | `any`    |                   | Either key, value or alias     |

```js

// Map country aliases to ISO alpha-2 code
const countries = new AliasMap();

countries.set('United Kingdom', 'gb');
countries.setAlias('gb', 'United Kingdom of Great Britain and Northern Ireland', 'UK', 'U.K.', 'Great Britain', 'Britain', 'GBR', 'England', 'Nothern Ireland', 'Scotland', 'Wales');

countries.getKey('gb'); // "United Kingdom"
countries.getKey('Scotland'); // "United Kingdom"
countries.getKey('United Kingdom'); // "United Kingdom"
countries.getKey('USA'); // undefined

```

***

#### `AliasMap.prototype.getAliases()`

Returns all aliases for provided item. Item could be a key, value or any of aliases. Returns `null` if no aliases are set.

| **Parameter** | **Type** | **Default value** | **Notes**                      |
|---------------|----------|-------------------|--------------------------------|
| `item`        | `any`    |                   | Either key, value or alias     |

```js

const marvelUniverse = new AliasMap();

const wolverineUrl = 'https://en.wikipedia.org/wiki/Wolverine_(character)';
marvelUniverse.set('Wolverine', wolverineUrl);
marvelUniverse.setAlias('Wolverine', 'James Howlett', 'Logan', 'Weapon X');

marvelUniverse.getAliases('Wolverine'); // ['James Howlett', 'Logan', 'Weapon X']
marvelUniverse.getAliases('Logan'); // ['James Howlett', 'Logan', 'Weapon X']
marvelUniverse.getAliases(wolverineUrl); // ['James Howlett', 'Logan', 'Weapon X']

const blackPantherUrl = 'https://en.wikipedia.org/wiki/Black_Panther_(Marvel_Comics)';
marvelUniverse.set('Black Panther', blackPantherUrl);

marvelUniverse.getAliases('Black Panther'); // null

```

***

#### `AliasMap.prototype.has()`

Returns boolean indicating whether provided item is in AliasMap. AliasMap inherits this method from [Map.prototype.has](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has).


| **Parameter** | **Type** | **Default value** | **Notes**                      |
|---------------|----------|-------------------|--------------------------------|
| `item`        | `any`    |                   | Either key, value or alias     |

```js

const aliasMap = new AliasMap();

aliasMap.set('foo', 'bar', 'baz');

aliasMap.has('foo'); // true
aliasMap.has('moo'); // false
aliasMap.has('baz'); // true
aliasMap.has('fuzz'); // false

```

#### `AliasMap.prototype.hasAlias()`

Returns boolean indicating whether provided primary key has provided alias. For performance reason, to achieve constant time retrieval, provided item has to be a key.


| **Parameter** | **Type** | **Default value** | **Notes**                                   |
|---------------|----------|-------------------|---------------------------------------------|
| `key`         | `any`    |                   | Must only be a key for performance reasons  |
| `alias`       | `any`    |                   |                                             |

```js

const colors = new AliasMap();

colors.set('cyan', '#ffff00', 'aqua');

colors.hasAlias('cyan', 'aqua'); // true
colors.hasAlias('#ffff00', 'aqua'); // false

// To check by value or alias, you can do this:
colors.getAliases('#ffff00').some((color) => color === 'aqua'); // true

```

***

#### `AliasMap.prototype.set()`

Adds key, value and optional aliases to AlaisMap. If provided key already exists, updates key node. Returns updated AliasMap.

| **Parameter**  | **Type**  | **Default value** | **Notes**                                        |
|----------------|-----------|-------------------|--------------------------------------------------|
| `key`          |`any`      |                   |                                                  |
| `value`        |`any`      |                   |                                                  |
| `...aliases`   |`...any`   |                   | Optional list of aliases                         |

```js

const aliasMap = new AliasMap();

aliasMap.set('A', 'B', 'C'); // Map{ 'A' => KeyNode, 'B' => ValueNode, 'C' => AliasNode }

// If key exists, updates value and appends alias
aliasMap.set('A', 'D', 'E'); // Map{ 'A' => KeyNode, 'D' => ValueNode, 'C' => AliasNode, 'E' => AliasNode }

// Attempt to set existing item to another key will result in Error:
aliasMap.set('F', 'D', 'R'); // Throws Error: Value D is already in the map

```

***

#### `AliasMap.prototype.setAlias()`

Adds alias to primary key of provided item. Returns updated list. **Note:** Aliases that are already in the map are **ignored**.

| **Parameter**  | **Type**  | **Default value** | **Notes**                                              |
|----------------|-----------|-------------------|--------------------------------------------------------|
| `item`         | `any`     |                   | Either key, value or alias                             |
| `...aliases`   |`...any`   |                   | List of aliases. If alreay in the map, then ignored    |

```js

const aliasMap = new AliasMap();

aliasMap.set('A', 'B');
aliasMap.set('X', 'Y');

aliasMap.setAlias('A', 'C', 'D'); // Map{ 'A' => KeyNode, 'B' => ValueNode, 'C' => AliasNode, 'D' => AliasNode }

// NOTE! No error thrown!
aliasMap.setAlias('Y', 'C', 'Z'); // Map{ 'X' => KeyNode, 'Y' => ValueNode, 'Z' => AliasNode }

aliasMap.setAlias('F', 'G'); // undefined

```

***

#### `AliasMap.prototype.delete()`

Removes entry by provided item, where entry is a primary key, value and all the aliases associated with the key. Returns true if deletion was successful, otherwise - false.

| **Parameter** | **Type** | **Default value** | **Notes**                                      |
|---------------|----------|-------------------|------------------------------------------------|
| `item`        | `any`    |                   | Either key, value or alias                     |

```js

const marvelUniverse = new AliasMap();

const ironManUrl = 'https://en.wikipedia.org/wiki/Iron_Man';
marvelUniverse.set('Iron Man', ironManUrl);
marvelUniverse.setAlias('Iron Man', 'Anthony Edward Stark', 'Tony Stark');

marvelUniverse.size; // 4
marvelUniverse.entriesCount; // 1

marvelUniverse.delete('Anthony Edward Stark'); // true

marvelUniverse.size; // 0
marvelUniverse.entriesCount; // 0

```

***

#### `AliasMap.prototype.deleteAlias()`

Removes alias from provided item. Returns true if deletion was successful, otherwise - false.

| **Parameter** | **Type** | **Default value** | **Notes**                                      |
|---------------|----------|-------------------|------------------------------------------------|
| `item`        | `any`    |                   | Either key, value or alias                     |
| `alias`       | `any`    |                   | Alias to be removed                            |

```js

const marvelUniverse = new AliasMap();

const ironManUrl = 'https://en.wikipedia.org/wiki/Iron_Man';
marvelUniverse.set('Iron Man', ironManUrl);
marvelUniverse.setAlias('Iron Man', 'Anthony Edward Stark', 'Tony Stark');

marvelUniverse.deleteAlias('Iron Man', 'Anthony Edward Stark'); // true

marvelUniverse.getAliases(ironManUrl); // ['Tony Stark']

```

***

#### `AliasMap.prototype.clear()`

Clears AliasMap by removing all items. Returns `undefined`.

```js

const marvelUniverse = new AliasMap();

const ironManUrl = 'https://en.wikipedia.org/wiki/Iron_Man';
marvelUniverse.set('Iron Man', ironManUrl);
marvelUniverse.setAlias('Iron Man', 'Anthony Edward Stark', 'Tony Stark');

marvelUniverse.clear();

marvelUniverse.size; // 0

```