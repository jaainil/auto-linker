export function createBM25(docs: string[][]) {
  const counts = docs.map(doc => {
    const map = new Map<string, number>();
    for (const word of doc) map.set(word, (map.get(word) ?? 0) + 1);
    return map;
  });
  const df = new Map<string, number>();
  for (const map of counts) for (const word of map.keys()) df.set(word, (df.get(word) ?? 0) + 1);
  const average = docs.reduce((n, doc) => n + doc.length, 0) / (docs.length || 1) || 1;
  return (index: number, query: string[]) => {
    let score = 0;
    for (const word of new Set(query)) {
      const tf = counts[index].get(word) ?? 0;
      if (!tf) continue;
      const idf = Math.log(1 + (docs.length - (df.get(word) ?? 0) + 0.5) / ((df.get(word) ?? 0) + 0.5));
      score += idf * (tf * 2.2) / (tf + 1.2 * (0.25 + 0.75 * docs[index].length / average));
    }
    return score;
  };
}
