/**
 * @class ValueNode Utility node class for AliasMap
 */
class ValueNode {
  /**
   * @constructor
   *
   * @param {any} key
   */
  constructor(key) {
    if (key == null) throw Error('Key cannot be undefined or null');

    this.value = key;
  }

  static get name() {
    return 'ValueNode';
  }
}

export default ValueNode;
