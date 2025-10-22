import { calculateSimilarity, checkCaptionSimilarity } from "./similarity";

// テスト用の関数（開発時のデバッグ用）
export function testSimilarityFunction() {
  console.log("=== 類似度計算テスト ===");

  // 完全一致のテスト
  const identical = calculateSimilarity("hello world", "hello world");
  console.log("完全一致:", identical); // 1.0

  // 少し異なる文字列のテスト
  const similar = calculateSimilarity("hello world", "hello world!");
  console.log("少し違う:", similar); // 0.9以上

  // 全く違う文字列のテスト
  const different = calculateSimilarity("hello world", "goodbye universe");
  console.log("全く違う:", different); // 0.5以下

  // キャプションの類似度テスト
  console.log("\n=== キャプション類似度テスト ===");

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

  const similarCaptions = checkCaptionSimilarity(captions1, captions2);
  const differentCaptions = checkCaptionSimilarity(captions1, captions3);

  console.log("類似したキャプション:", similarCaptions); // 0.8以上
  console.log("異なるキャプション:", differentCaptions); // 0.8未満

  return {
    identical,
    similar,
    different,
    similarCaptions,
    differentCaptions,
  };
}

// 開発環境でのみ実行
if (process.env.NODE_ENV === "development") {
  // testSimilarityFunction();
}
