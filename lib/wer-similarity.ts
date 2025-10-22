/**
 * Word Error Rate (WER) を使った類似度計算
 */

/**
 * 文字列を単語に分割する関数
 * 句読点を除去し、小文字に変換
 */
function tokenizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // 句読点を除去
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

/**
 * 単語レベルでのLevenshtein距離を計算する関数
 */
function wordLevenshteinDistance(words1: string[], words2: string[]): number {
  const len1 = words1.length;
  const len2 = words2.length;

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
      if (words1[i - 1] === words2[j - 1]) {
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
 * Word Error Rate (WER) を計算する関数
 * 0に近いほど類似している（エラー率が低い）
 * 1に近いほど異なっている（エラー率が高い）
 */
export function calculateWER(text1: string, text2: string): number {
  const words1 = tokenizeWords(text1);
  const words2 = tokenizeWords(text2);

  if (words1.length === 0 && words2.length === 0) return 0;
  if (words1.length === 0 || words2.length === 0) return 1;

  const distance = wordLevenshteinDistance(words1, words2);
  const maxLength = Math.max(words1.length, words2.length);

  return distance / maxLength;
}

/**
 * WERベースの類似度を計算する関数
 * 1に近いほど類似している（WERの逆数）
 */
export function calculateWERSimilarity(text1: string, text2: string): number {
  if (text1 === text2) return 1;

  const wer = calculateWER(text1, text2);
  return 1 - wer;
}

/**
 * キャプションの類似度をWERでチェックする関数
 * 2つのキャプション（A, B）の組み合わせで類似度を計算
 */
export function checkCaptionSimilarityWER(
  captions1: { a: string; b: string },
  captions2: { a: string; b: string }
): number {
  // 2つのパターンで類似度を計算
  const similarities = [
    calculateWERSimilarity(captions1.a, captions2.a), // A同士
    calculateWERSimilarity(captions1.b, captions2.b), // B同士
  ];

  // 最も高い類似度を返す
  return Math.max(...similarities);
}
