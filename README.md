# alias-map
Alias map data structure from lost types series. Bi-directional map with support of aliases. Might be very good solution for indexing unique data.

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

AliasMap.get(*KEY*) -> *VALUE*

AliasMap.get(*ALIAS*) -> *VALUE*

AliasMap.get(*VALUE*) -> *KEY*

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

Returns total Map size and number of connected entries made, where one entry is a primary key, value and all the aliases associated with key
```js

const aliasMap = new AliasMap();
const user = {
  userData: 'Might be stored here',
};
aliasMap.set('primaryEmail@example.com', user, 'secondary.email@gmail.com');
aliasMap.size; // 3
aliasMap.entriesCount; // 1

```

### Methods

#### `Range.prototype.get()`

Returns value if primary key or any of aliases provided and primary key if value provided.

| **Parameter** | **Type** | **Default value** | **Notes**      |
|---------------|----------|-------------------|----------------|
| `item`        | `any`    |                   |                |

```js

const aliasMap = new AliasMap();

```

***

#### `Range.prototype.clamp()`

Similarly to [_.clamp()](https://lodash.com/docs/4.17.15#clamp), ensures resulting number is in the range. Returns clamped number.

| **Parameter** | **Type** | **Default value** | **Notes**                                      |
|---------------|----------|-------------------|------------------------------------------------|
| `number`      | `number` |                   |                                                |

```js

const range = new Range(99);
range.clamp(100); // 99
range.clamp(-42); // 0
range.clamp(15); // 15
range.clamp(); // NaN

```

***

#### `Range.prototype.has()`

Returns boolean indicating whether provided number within a range.

| **Parameter** | **Type** | **Default value** | **Notes**                                      |
|---------------|----------|-------------------|------------------------------------------------|
| `number`      | `number` |                   |                                                |

```js

const range = new Range(99);
range.has(100); // false
range.has(-42); // false
range.has(15); // true
range.has(); // false

```

***

#### `Range.prototype.forEach()`

Executes provided function on every element of the range with provided step. If no step provided initial this.step will be used. Similarly to forEach in `Array`, following arguments will be passed to the callback:
  * currentValue
  * index
  * range

Will try to account for precision errors between numbers in the range. Always returns `undefined`.

| **Parameter** | **Type**  | **Default value** | **Notes**                                      |
|---------------|-----------|-------------------|------------------------------------------------|
| `fn`          |`function` |                   | To be invoked as fn(number, index, range)      |
| `step`        |`number`   | Range.step        | forEach() can be invoked with custom step      |

```js

const range = new Range(-1, 1);
range.forEach((number) => {
  console.log(number);
}, 0.5);
// -1
// -0.5
// 0
// 0.5
// 1

```

***

#### `Range.prototype.forEachReverse()`

Similarly to `Range.prototype.forEach()`, executes provided function on every element of the range with provided step in reversed manner. If no step provided initial this.step will be used. Similarly to forEach in `Array`, following arguments will be passed to the callback:
  * currentValue
  * index
  * range

Will try to account for precision errors between numbers in the range. Always returns `undefined`.

| **Parameter** | **Type**  | **Default value** | **Notes**                                        |
|---------------|-----------|-------------------|--------------------------------------------------|
| `fn`          |`function` |                   | To be invoked as fn(number, index, range)        |
| `step`        |`number`   | Range.step        | forEachReverse() can be invoked with custom step |

```js

const range = new Range(-1, 1);
range.forEachReverse((number) => {
  console.log(number);
}, 0.5);
// 1
// 0.5
// 0
// -0.5
// -1

```

***

#### `Range.prototype.getFraction()`

Returns ratio of the provided number propotional to the range.

| **Parameter** | **Type** | **Default value** | **Notes**                                      |
|---------------|----------|-------------------|------------------------------------------------|
| `number`      | `number` |                   |                                                |
| `precision`   | `number` | 12                | Optional                                       |

Useful to calculate percentage value of the range.

```js

const range = new Range(255);
range.getFraction(17, 4); // 0.0667
// Value 17 represents 6.67% of the [0 ... 255] range

```

***

#### `Range.prototype.fromFraction()`

Inverse method from `Range.prototype.getFraction()`. Returns number represented by provided ratio relative to the range.

| **Parameter** | **Type** | **Default value** | **Notes**                                      |
|---------------|----------|-------------------|------------------------------------------------|
| `ratio`       | `number` |                   |                                                |
| `precision`   | `number` | 12                | Optional                                       |

Useful to calculate value from the percentage.

```js

const range = new Range(255);
range.fromFraction(0.065, 0); // 17
// Value 17 represents 6.5% of the [0 ... 255] range with 0 floating point precision

```

***

#### `Range.prototype.toArray()`

Converts range to array. Throws error with range length is greater than max possible array size.

```js

const range = new Range(0.1, 0.5, 0.1);
range.toArray(); // [0.1, 0.2, 0.3, 0.4, 0.5]
// same as [...range]

const infiniteRange = new Range(0.1, 0.5, Number.MIN_VALUE);
infiniteRange.length; // Infinity
range.toArray(); // throws Error: Cannot iterate infinite size range

```

***

#### `Range.prototype.mod()`

Returns number in the range which is result if modulo operation of provided input number to range.

| **Parameter** | **Type** | **Default value** | **Notes**                                      |
|---------------|----------|-------------------|------------------------------------------------|
| `number`      | `number` |                   |                                                |

It's really much easier to explain on the example:

```js

const range = new Range(359);
range.mod(360); // 0
range.mod(-45); // 315
range.mod(15); // 15
range.mod(89352); // 72

```

***

#### `Range.prototype.slice()`

Slices range into provided number of equal parts. Returns array of numbers representing starting boundaries of each such slice.

| **Parameter** | **Type** | **Default value** | **Notes**                                      |
|---------------|----------|-------------------|------------------------------------------------|
| `parts`       | `number` |                   | Cannot be negative number                      |

```js

const range = new Range(359);
range.slice(6); // [0, 60, 120, 180, 240, 300]
range.slice(9); // [0, 40, 80, 120, 160, 200, 240, 280, 320]
range.slice(12); // [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]

```