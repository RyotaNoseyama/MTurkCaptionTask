/**
 * 空白を除いた文字数を計算する関数
 * @param text 対象のテキスト
 * @returns 空白を除いた文字数
 */
export function countNonWhitespaceCharacters(text: string): number {
  return text.replace(/\s/g, "").length;
}

/**
 * 空白を除いて文字数制限をチェックする関数
 * @param text 対象のテキスト
 * @param minLength 最小文字数
 * @param maxLength 最大文字数
 * @returns 文字数制限を満たしているかどうか
 */
export function isValidNonWhitespaceLength(
  text: string,
  minLength: number,
  maxLength: number
): boolean {
  const nonWhitespaceLength = countNonWhitespaceCharacters(text);
  return nonWhitespaceLength >= minLength && nonWhitespaceLength <= maxLength;
}
