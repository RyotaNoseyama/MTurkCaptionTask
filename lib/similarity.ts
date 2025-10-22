/**
 * Levenshtein距離を計算する関数
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  // 動的プログラミング用の2次元配列
  const dp: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));

  // 初期化
  for (let i = 0; i <= len1; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= len2; j++) {
    dp[0][j] = j;
  }

  // 動的プログラミング
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // 削除
          dp[i][j - 1] + 1, // 挿入
          dp[i - 1][j - 1] + 1 // 置換
        );
      }
    }
  }

  return dp[len1][len2];
}

/**
 * 2つの文字列の類似度を0-1の範囲で計算する関数
 * 1に近いほど類似している
 */
export function calculateSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1;
  if (str1.length === 0 && str2.length === 0) return 1;
  if (str1.length === 0 || str2.length === 0) return 0;

  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);

  return 1 - distance / maxLength;
}

/**
 * キャプションの類似度をチェックする関数
 * 2つのキャプション（A, B）の組み合わせで類似度を計算
 */
export function checkCaptionSimilarity(
  captions1: { a: string; b: string },
  captions2: { a: string; b: string }
): number {
  // 4つのパターンで類似度を計算
  const similarities = [
    calculateSimilarity(captions1.a, captions2.a), // A同士
    calculateSimilarity(captions1.b, captions2.b), // B同士
  ];

  // 最も高い類似度を返す
  return Math.max(...similarities);
}
