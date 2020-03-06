/**
 * @class KeyNode
 */
class KeyNode {
  constructor(value, ...aliases) {
    this.value = value;
    this.aliases = aliases.length ? aliases : null;
  }

  /**
   * Adds aliases to the KeyNode
   *
   * @param  {...string} aliases 
   */
  setAlias(alias) {
    if (typeof alias === 'undefined') return;

    this.aliases = (this.aliases || []).concat(alias);
    return this.aliases;
  }

  removeAlias(label) {
    if (!this.aliases || typeof label === 'undefined') return false;

    this.aliases = this.aliases.filter((alias) => alias !== label);
    if (!this.aliases.length) {
      this.aliases = null;
    }

    return true;
  }
}

/**
 * @class ValueNode
 */
class ValueNode {
  constructor(key) {
    this.value = key;
  }
}

/**
 * @class AliasNode
 */
class AliasNode {
  constructor(key, value) {
    this.value = value;
    this.aliasOf = key;
  }
}

module.exports = {
  KeyNode,
  ValueNode,
  AliasNode,
};
