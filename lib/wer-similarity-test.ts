import { calculateWER, calculateWERSimilarity, checkCaptionSimilarityWER } from "./wer-similarity";

// テスト用の関数（開発時のデバッグ用）
export function testWERSimilarityFunction() {
  console.log("=== WER類似度計算テスト ===");

  // 完全一致のテスト
  const identical = calculateWERSimilarity("hello world", "hello world");
  console.log("完全一致:", identical); // 1.0

  // 少し異なる文字列のテスト（単語追加）
  const similar1 = calculateWERSimilarity("hello world", "hello beautiful world");
  console.log("単語追加:", similar1); // 約0.67

  // 少し異なる文字列のテスト（単語置換）
  const similar2 = calculateWERSimilarity("hello world", "hello earth");
  console.log("単語置換:", similar2); // 0.5

  // 順序変更のテスト
  const reordered = calculateWERSimilarity("hello world", "world hello");
  console.log("順序変更:", reordered); // 0.0

  // 全く違う文字列のテスト
  const different = calculateWERSimilarity("hello world", "goodbye universe");
  console.log("全く違う:", different); // 0.0

  // WER値のテスト
  console.log("\n=== WER値テスト ===");
  const wer1 = calculateWER("hello world", "hello beautiful world");
  console.log("WER (単語追加):", wer1); // 約0.33

  const wer2 = calculateWER("hello world", "hello earth");
  console.log("WER (単語置換):", wer2); // 0.5

  // キャプションの類似度テスト
  console.log("\n=== キャプション類似度テスト（WER） ===");

  const captions1 = {
    a: "A beautiful sunset over the ocean with orange and pink colors",
    b: "The waves gently crash against the shore as the sun sets",
  };

  const captions2 = {
    a: "A beautiful sunset over the ocean with orange and pink hues",
    b: "The waves softly crash against the beach as the sun sets",
  };

  const captions3 = {
    a: "A cat sitting on a windowsill looking outside",
    b: "The furry feline watches birds through the glass",
  };

  const similarCaptions = checkCaptionSimilarityWER(captions1, captions2);
  const differentCaptions = checkCaptionSimilarityWER(captions1, captions3);

  console.log("類似したキャプション:", similarCaptions); // 高い値
  console.log("異なるキャプション:", differentCaptions); // 低い値

  return {
    identical,
    similar1,
    similar2,
    reordered,
    different,
    wer1,
    wer2,
    similarCaptions,
    differentCaptions,
  };
}

// 開発環境でのみ実行
if (process.env.NODE_ENV === "development") {
  // testWERSimilarityFunction();
}
