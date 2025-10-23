// WER実装のクイックテスト (Pure JavaScript)

// 文字列を単語に分割する関数
function tokenizeWords(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // 句読点を除去
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

// 単語レベルでのLevenshtein距離を計算する関数
function wordLevenshteinDistance(words1, words2) {
  const len1 = words1.length;
  const len2 = words2.length;

  // 動的プログラミング用の2次元配列
  const dp = Array(len1 + 1)
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

// WERベースの類似度を計算する関数
function calculateWERSimilarity(text1, text2) {
  if (text1 === text2) return 1;

  const words1 = tokenizeWords(text1);
  const words2 = tokenizeWords(text2);

  if (words1.length === 0 && words2.length === 0) return 1;
  if (words1.length === 0 || words2.length === 0) return 0;

  const distance = wordLevenshteinDistance(words1, words2);
  const maxLength = Math.max(words1.length, words2.length);
  const wer = distance / maxLength;

  return 1 - wer;
}

// キャプションの類似度をWERでチェックする関数
function checkCaptionSimilarityWER(caption1, caption2) {
  return calculateWERSimilarity(caption1, caption2);
}

console.log("=== WER類似度計算テスト ===");

// 基本的なテスト
console.log("完全一致:", calculateWERSimilarity("hello world", "hello world")); // 1.0
console.log(
  "単語追加:",
  calculateWERSimilarity("hello world", "hello beautiful world")
); // 約0.67
console.log("単語置換:", calculateWERSimilarity("hello world", "hello earth")); // 0.5
console.log(
  "全く違う:",
  calculateWERSimilarity("hello world", "goodbye universe")
); // 0.0

// キャプションテスト
const caption1 = "A beautiful sunset over the ocean";
const caption2 = "A beautiful sunset over the ocean with colors";
const caption3 = "A cat sitting on a windowsill";

console.log("類似キャプション:", checkCaptionSimilarityWER(caption1, caption2));
console.log(
  "異なるキャプション:",
  checkCaptionSimilarityWER(caption1, caption3)
);
