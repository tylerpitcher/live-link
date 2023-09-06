function difference(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);

  const onlyInA = a.filter((item) => !setB.has(item));
  const onlyInB = b.filter((item) => !setA.has(item));

  return [onlyInA, onlyInB];
}

module.exports = difference;
