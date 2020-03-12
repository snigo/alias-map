import KeyNode from './keynode';
import ValueNode from './valuenode';
import AliasNode from './aliasnode';

/**
 * @class AliasMap
 */
class AliasMap extends Map {
  #entriesCount = 0;


  /**
   * @property entriesCount: Number of entries made, where one entry is
   * a primary key, value and all the aliases associated with key
   */
  get entriesCount() {
    return this.#entriesCount;
  }


  /**
   * Gets value by given item.
   * If value is provided, returns primary key for that value
   *
   * @param {any} item Key, alias or value
   */
  get(item) {
    const result = Map.prototype.get.call(this, item);
    return (result && ('value' in result)) ? result.value : undefined;
  }


  /**
   * Gets primary key for provided item
   *
   * @param {any} item Key, alias or value
   */
  getKey(item) {
    const node = Map.prototype.get.call(this, item);
    if (!node) return undefined;

    if (node instanceof AliasNode) {
      return node.aliasOf;
    }

    if (node instanceof ValueNode) {
      return node.value;
    }

    return item;
  }


  /**
   * Returns all aliases for provided item
   *
   * @param {any} item Key, alias or value
   */
  getAliases(item) {
    const key = this.getKey(item);
    if (key == null) return undefined;

    const keyNode = Map.prototype.get.call(this, key);
    return (keyNode.aliases)
      ? [...keyNode.aliases]
      : null;
  }


  /* NOTE AliasMap inherits .has() method from Map */

  /**
   * Returns a boolean indicating whether provided key has alias
   *
   * @param {any} key Primary key
   * @param {any} alias Alias to test for presence
   */
  hasAlias(key, alias) {
    const aliasNode = Map.prototype.get.call(this, alias);
    if (!(aliasNode instanceof AliasNode)) return false;

    return aliasNode.aliasOf === key;
  }


  /**
   * Deletes entry by provided item.
   * Where entry is a primary key, value and all the aliases
   *
   * @param {any} item Key, alias or value
   */
  delete(item) {
    const key = this.getKey(item);
    if (key == null) return false;

    const { value, aliases } = Map.prototype.get.call(this, key);

    // Delete all alias nodes
    aliases && aliases.forEach((alias) => {
      Map.prototype.delete.call(this, alias);
    });

    // Delete value node
    Map.prototype.delete.call(this, value);

    // Delete primary key node
    Map.prototype.delete.call(this, key);

    this.#entriesCount -= 1;
    return true;
  }


  /**
   * Deletes alias from provided item
   *
   * @param {any} item Key, alias or value
   * @param {any} alias Alias value to be deleted
   */
  deleteAlias(item, alias) {
    const key = this.getKey(item);
    if (key == null || !this.hasAlias(key, alias)) return false;

    const keyNode = Map.prototype.get.call(this, key);
    keyNode.removeAlias(alias);

    Map.prototype.delete.call(this, alias);

    return true;
  }


  /**
   * Adds key, value and optional aliases to AlaisMap.
   * If provided key already exists, updates key node
   *
   * @param {any} key Primary key
   * @param {any} value Value for primary
   * @param {...any} aliases List of aliases
   */
  set(key, value, ...aliases) {
    if (key == null || value == null) return undefined;

    if (this.has(value) && this.getKey(value) !== key) {
      throw Error('Cannot set value. Value is already in the AliasMap.');
    }

    aliases = aliases.filter((alias) => alias != null);
    for (let i = 0; i < aliases.length; i += 1) {
      if (this.has(aliases[i]) && this.getKey(aliases[i]) !== key) {
        throw Error('Cannot rewrite foreign alias.');
      }
    }

    if (this.has(key)) {
      const node = Map.prototype.get.call(this, key);
      if (!(node instanceof KeyNode)) throw Error('Cannot set key. Key must be of KeyNode type.');

      if (this.hasAlias(key, value)) {
        this.deleteAlias(key, value);
      }

      if (node.aliases) {
        aliases = new Set(this.getAliases(key).concat(aliases || []));
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


  /**
   * Adds alias to primary key of provided item
   *
   * @param {any} item Key, alias or value
   * @param  {...any} aliasList List of aliases to add
   */
  setAlias(item, ...aliasList) {
    if (item == null || !aliasList.length) return undefined;

    const key = this.getKey(item);
    if (key == null) return undefined;

    const keyNode = Map.prototype.get.call(this, key);
    aliasList.forEach((alias) => {
      !this.hasAlias(key, alias)
        && keyNode.setAlias(alias)
        && Map.prototype.set.call(this, alias, new AliasNode(key, keyNode.value));
    });

    return this;
  }


  /**
   * Clears AliasMap
   */
  clear() {
    this.#entriesCount = 0;
    return Map.prototype.clear.call(this);
  }
}

export default AliasMap;
