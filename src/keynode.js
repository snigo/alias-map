/**
 * @class KeyNode
 */
class KeyNode {
  constructor(value, ...aliases) {
    if (value == null) throw Error('Value cannot be undefined or null');

    this.value = value;
    this.aliases = aliases.length ? aliases : null;
  }

  /**
   * Adds aliases to the KeyNode
   *
   * @param  {...string} aliases
   */
  setAlias(alias) {
    if (typeof alias === 'undefined') return undefined;

    this.aliases = (this.aliases || []).concat(alias);
    return this.aliases;
  }

  removeAlias(label) {
    if (!this.aliases || typeof label === 'undefined') return false;

    const aliases = [];
    let found = false;

    this.aliases.forEach((alias) => {
      if (alias !== label) {
        aliases.push(alias);
      } else {
        found = true;
      }
    });

    this.aliases = aliases.length ? aliases : null;

    return found;
  }
}

export default KeyNode;
