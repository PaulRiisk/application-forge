// tiny fuzzy matcher: subsequence match with a relevance score, no deps.
// returns null when the query chars don't appear in order in the haystack,
// otherwise a score where higher is better. scoring rewards: a contiguous
// run, a match at the start, and matches right after a word boundary — so
// "idnt" ranks "Identität" high and typos within a word still match.

export function fuzzyScore(haystack: string, query: string): number | null {
  const h = haystack.toLowerCase();
  const q = query.toLowerCase();
  if (q === "") return 0;

  let score = 0;
  let hi = 0;
  let prevMatch = -2; // index in h of the previous matched char
  let runLength = 0;

  for (let qi = 0; qi < q.length; qi++) {
    const c = q[qi];
    const found = h.indexOf(c, hi);
    if (found === -1) return null; // a query char is missing → no match

    // base point for the match
    score += 1;
    // contiguous run bonus (grows so longer runs score progressively better)
    if (found === prevMatch + 1) {
      runLength += 1;
      score += 4 + runLength;
    } else {
      runLength = 0;
    }
    // start-of-string bonus
    if (found === 0) score += 8;
    // word-boundary bonus (after a space, dash, slash, underscore)
    else if (/[\s\-/_·]/.test(h[found - 1])) score += 6;
    // penalty for how far we had to skip to find this char
    score -= Math.min(found - hi, 4);

    prevMatch = found;
    hi = found + 1;
  }

  // shorter haystacks that fully matched are slightly preferred
  score -= h.length * 0.02;
  return score;
}
