declare global {
  interface Map<K, V> {
    getOrInsert(key: K, defaultValue: V): V;
  }
}

if (!Map.prototype.getOrInsert) {
  Map.prototype.getOrInsert = function <K, V>(
    this: Map<K, V>,
    key: K,
    defaultValue: V,
  ): V {
    if (this.has(key)) return this.get(key) as V;
    this.set(key, defaultValue);
    return defaultValue;
  };
}

export {};
