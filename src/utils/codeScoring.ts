/**
 * Code scoring utilities for evaluating coding question answers
 */

export interface CodeScore {
  score: number; // 0-100
  feedback: string;
  matchedKeywords: string[];
  missingKeywords: string[];
}

/**
 * Calculate similarity between two strings using Levenshtein distance
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + substitutionCost // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Normalize code for comparison (remove whitespace, comments, etc.)
 */
function normalizeCode(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
    .replace(/\/\/.*$/gm, "") // Remove line comments
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/[{}();,]/g, " ") // Normalize punctuation
    .trim()
    .toLowerCase();
}

/**
 * Extract keywords from code
 */
function extractKeywords(code: string): string[] {
  const normalized = normalizeCode(code);

  // Common programming keywords and patterns
  const keywords = [
    // Python keywords
    "def",
    "if",
    "else",
    "elif",
    "for",
    "while",
    "try",
    "except",
    "finally",
    "import",
    "from",
    "return",
    "class",
    "lambda",
    "with",
    "as",
    "in",
    "is",
    "and",
    "or",
    "not",
    "True",
    "False",
    "None",

    // Common functions
    "print",
    "len",
    "range",
    "enumerate",
    "zip",
    "map",
    "filter",
    "sorted",
    "max",
    "min",
    "sum",
    "any",
    "all",
    "open",
    "read",
    "write",

    // Data structures
    "list",
    "dict",
    "tuple",
    "set",
    "str",
    "int",
    "float",
    "bool",

    // Networking specific
    "socket",
    "connect",
    "bind",
    "listen",
    "accept",
    "send",
    "recv",
    "ip",
    "port",
    "host",
    "address",
    "network",
    "protocol",
    "tcp",
    "udp",
    "http",
    "https",
    "request",
    "response",
    "header",
    "status",

    // Regex patterns
    "re",
    "match",
    "search",
    "findall",
    "sub",
    "compile",
    "pattern",

    // Common patterns
    "split",
    "join",
    "strip",
    "replace",
    "startswith",
    "endswith",
    "append",
    "extend",
    "insert",
    "remove",
    "pop",
    "index",
    "count",
  ];

  const foundKeywords = keywords.filter((keyword) =>
    normalized.includes(keyword.toLowerCase())
  );

  // Also extract variable names and function names
  const variablePattern = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
  const variables = normalized.match(variablePattern) || [];

  return [...new Set([...foundKeywords, ...variables])];
}

/**
 * Calculate code similarity score
 */
export function calculateCodeSimilarity(
  userCode: string,
  correctCode: string
): number {
  if (!userCode.trim()) return 0;

  const normalizedUser = normalizeCode(userCode);
  const normalizedCorrect = normalizeCode(correctCode);

  if (normalizedUser === normalizedCorrect) return 100;

  const distance = levenshteinDistance(normalizedUser, normalizedCorrect);
  const maxLength = Math.max(normalizedUser.length, normalizedCorrect.length);

  if (maxLength === 0) return 0;

  const similarity = ((maxLength - distance) / maxLength) * 100;
  return Math.max(0, Math.round(similarity));
}

/**
 * Calculate keyword-based score
 */
export function calculateKeywordScore(
  userCode: string,
  correctCode: string
): CodeScore {
  const userKeywords = extractKeywords(userCode);
  const correctKeywords = extractKeywords(correctCode);

  const matchedKeywords = userKeywords.filter((keyword) =>
    correctKeywords.includes(keyword)
  );

  const missingKeywords = correctKeywords.filter(
    (keyword) => !userKeywords.includes(keyword)
  );

  const keywordScore =
    correctKeywords.length > 0
      ? Math.round((matchedKeywords.length / correctKeywords.length) * 100)
      : 0;

  let feedback = "";
  if (keywordScore >= 80) {
    feedback = "Excellent! Your solution covers most key concepts.";
  } else if (keywordScore >= 60) {
    feedback = "Good! Your solution shows understanding of the main concepts.";
  } else if (keywordScore >= 40) {
    feedback = "Partial credit. Some key concepts are missing.";
  } else if (keywordScore >= 20) {
    feedback = "Limited understanding. Consider reviewing the concepts.";
  } else {
    feedback = "Please try again. The solution needs significant improvement.";
  }

  return {
    score: keywordScore,
    feedback,
    matchedKeywords,
    missingKeywords,
  };
}

/**
 * Calculate overall code score combining multiple factors
 */
export function calculateCodeScore(
  userCode: string,
  correctCode: string
): CodeScore {
  if (!userCode.trim()) {
    return {
      score: 0,
      feedback: "No code submitted.",
      matchedKeywords: [],
      missingKeywords: [],
    };
  }

  // Calculate different types of scores
  const similarityScore = calculateCodeSimilarity(userCode, correctCode);
  const keywordScore = calculateKeywordScore(userCode, correctCode);

  // Weighted combination (similarity 40%, keywords 60%)
  const overallScore = Math.round(
    similarityScore * 0.4 + keywordScore.score * 0.6
  );

  // Determine feedback based on overall score
  let feedback = keywordScore.feedback;
  if (similarityScore > 80) {
    feedback = "Excellent! Your solution is very close to the expected answer.";
  } else if (similarityScore > 60) {
    feedback = "Good! Your solution shows strong understanding.";
  }

  return {
    score: Math.min(100, Math.max(0, overallScore)),
    feedback,
    matchedKeywords: keywordScore.matchedKeywords,
    missingKeywords: keywordScore.missingKeywords,
  };
}

/**
 * Check if code contains specific patterns or functions
 */
export function checkCodePatterns(
  userCode: string,
  requiredPatterns: string[]
): {
  found: string[];
  missing: string[];
  score: number;
} {
  const normalizedUser = normalizeCode(userCode);
  const found = requiredPatterns.filter((pattern) =>
    normalizedUser.includes(pattern.toLowerCase())
  );
  const missing = requiredPatterns.filter(
    (pattern) => !normalizedUser.includes(pattern.toLowerCase())
  );

  const score =
    requiredPatterns.length > 0
      ? Math.round((found.length / requiredPatterns.length) * 100)
      : 0;

  return { found, missing, score };
}
