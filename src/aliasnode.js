/**
 * @class AliasNode
 */
class AliasNode {
  constructor(key, value) {
    this.value = value;
    this.aliasOf = key;
  }
}

export default AliasNode;
