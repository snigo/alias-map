/**
 * @class AliasNode Utility node class for AliasMap
 */
class AliasNode {
  /**
   * @constructor
   *
   * @param {any} key
   * @param {any} value
   */
  constructor(key, value) {
    if (key == null) throw Error('Key cannot be undefined or null');
    if (value == null) throw Error('Value cannot be undefined or null');

    this.value = value;
    this.aliasOf = key;
  }

  static get name() {
    return 'AliasNode';
  }
}

export default AliasNode;
