/**
 * @class KeyNode Node class for AliasMap
 */
class KeyNode {
  /**
   * @constructor
   *
   * @param {any} value Keynode value
   * @param  {...any} aliases Keynode aliases
   */
  constructor(value, ...aliases) {
    if (value == null) throw Error('Value cannot be undefined or null');
    if (aliases.some((alias) => alias == null)) throw Error('Alais cannot be undefined or null');

    this.value = value;
    this.aliases = aliases.length ? new Set(aliases) : null;
  }

  static get name() {
    return 'KeyNode';
  }


  /**
   * @method setAlias Adds alias to the KeyNode
   *
   * @param {any} alias
   */
  setAlias(alias) {
    // Ignore undefined or null values
    if (alias == null) return undefined;

    if (!this.aliases) {
      this.aliases = new Set();
    }

    return [...this.aliases.add(alias)];
  }


  /**
   * @method removeAlias Removes alias from the KeyNode
   *
   * @param {any} alias
   */
  removeAlias(alias) {
    if (!this.aliases || alias == null) return false;

    const result = this.aliases.delete(alias);
    if (!this.aliases.size) this.aliases = null;

    return result;
  }
}

export default KeyNode;
