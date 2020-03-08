import KeyNode from './keynode';
import ValueNode from './valuenode';
import AliasNode from './aliasnode';

/**
 * @class AliasMap
 */
class AliasMap extends Map {
  #entriesCount = 0;

  /**
   * @property entriesCount: Number of entries made, one entry is
   * a primary key, value and all the aliases associated with key
   */
  get entriesCount() {
    return this.#entriesCount;
  }

  /**
   * @method get Gets value by given label: key, alias or value
   * If value is provided, returns key for that value
   * @param {any} label
   *
   * @returns {any} Value of provided label or undefined
   */
  get(label) {
    const result = Map.prototype.get.call(this, label);
    return (result && ('value' in result)) ? result.value : undefined;
  }

  /**
   * @method getKey Gets key for provided label: key, alias or value
   *
   * @param {any} label
   *
   * @returns {any} Key or undefined if no key found
   */
  getKey(label) {
    const node = Map.prototype.get.call(this, label);
    if (!node) return undefined;

    if (node instanceof AliasNode) {
      return node.aliasOf;
    }

    if (node instanceof ValueNode) {
      return node.value;
    }

    return label;
  }

  /**
   * @method getAliases Returns all aliases for provided label:
   * key, alias or value
   *
   * @param {any} label
   */
  getAliases(label) {
    const key = this.getKey(label);
    return (typeof key !== 'undefined')
      ? Map.prototype.get.call(this, key).aliases
      : null;
  }

  delete(label) {
    const key = this.getKey(label);
    if (typeof key === 'undefined') return false;

    const { value, aliases } = Map.prototype.get.call(this, key);

    aliases && aliases.forEach((alias) => {
      Map.prototype.delete.call(this, alias);
    });
    Map.prototype.delete.call(this, value);
    Map.prototype.delete.call(this, key);

    this.#entriesCount -= 1;
    return true;
  }

  hasAlias(key, alias) {
    const aliasNode = Map.prototype.get.call(this, alias);
    if (typeof aliasNode === 'undefined' || !(aliasNode instanceof AliasNode)) return false;

    return aliasNode.aliasOf === key;
  }

  deleteAlias(label, alias) {
    if (!this.hasAlias(label, alias)) return false;

    const keyNode = Map.prototype.get.call(this, this.getKey(label));

    keyNode.removeAlias(alias);
    Map.prototype.delete.call(this, alias);

    return true;
  }

  /**
   * @method set Sets key, value pair and optional aliases:
   * key, alias or value
   *
   * @param {any} key
   * @param {any} value
   * @param {...any} aliases
   */
  set(key, value, ...aliases) {
    if (typeof key === 'undefined' || typeof value === 'undefined') return undefined;

    if (this.has(value) && Map.prototype.get.call(this, value).value !== key) {
      throw Error('Cannot set value. Value is already in the AliasMap.');
    }

    for (let i = 0; i < aliases.length; i += 1) {
      if (this.has(aliases[i]) && Map.prototype.get.call(this, aliases[i]).aliasOf !== key) {
        throw Error('Cannot set alias. Alias is already in the AliasMap.');
      }
    }

    if (this.has(key)) {
      const node = Map.prototype.get.call(this, key);
      if (!(node instanceof KeyNode)) throw Error('Cannot set key. Key must be of KeyNode type.');

      if (node.aliases) {
        aliases = [...new Set((aliases || []).concat(this.getAliases(key)))];
      }

      this.delete(key);
    }

    Map.prototype.set.call(this, key, new KeyNode(value, ...aliases));
    Map.prototype.set.call(this, value, new ValueNode(key));
    aliases.forEach((alias) => {
      Map.prototype.set.call(this, alias, new AliasNode(key, value));
    });

    this.#entriesCount += 1;
    return this;
  }

  setAlias(label, ...aliasList) {
    if (typeof label === 'undefined' || !aliasList.length) return undefined;

    const key = this.getKey(label);
    const keyNode = Map.prototype.get.call(this, key);
    aliasList.forEach((alias) => {
      !this.hasAlias(key, alias)
        && keyNode.setAlias(alias)
        && Map.prototype.set.call(this, alias, new AliasNode(key, keyNode.value));
    });
    return this;
  }

  clear() {
    this.#entriesCount = 0;
    return Map.prototype.clear.call(this);
  }
}

export default AliasMap;
