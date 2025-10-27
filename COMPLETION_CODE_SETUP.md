# Completion Code 機能の追加手順

このファイルは、submission テーブルに Completion Code 保存機能を追加するための手順を説明します。

## 実行手順

### 1. SQL マイグレーションの実行

以下の SQL ファイルを実行してください：

```bash
# PostgreSQLに接続して実行
psql -d your_database_name -f add_completion_code_column.sql
```

または、データベース管理ツール（pgAdmin、TablePlus など）で `add_completion_code_column.sql` の内容を実行してください。

### 2. Prisma Client の再生成

SQL マイグレーション後、Prisma クライアントを再生成してください：

```bash
npx prisma generate
```

### 3. アプリケーションコードの有効化

`/app/api/submissions/route.ts` ファイル内で、以下の変更を行ってください：

#### 変更前（現在の状態）：

```typescript
const submission = await prisma.submission.create({
  data: {
    workerId: finalWorkerId,
    dayIdx: currentDayIdx,
    captionA: trimmedCaption,
    rtMs: rtMs || null,
    // completionCode: completionCode, // SQLマイグレーション後に有効化
  },
});

// コンプリーションコードを生成（類似度が高くない場合のみ）
let completionCode = null;
if (!isSimilar) {
  completionCode = generateCompletionCode();
  // SQLマイグレーション後に以下のコメントアウトを外して、上記のcreatの部分も有効化してください
  /*
  await prisma.submission.update({
    where: { id: submission.id },
    data: { completionCode: completionCode },
  });
  */
}
```

#### 変更後：

```typescript
// コンプリーションコードを生成（類似度が高くない場合のみ）
const completionCode = isSimilar ? null : generateCompletionCode();

const submission = await prisma.submission.create({
  data: {
    workerId: finalWorkerId,
    dayIdx: currentDayIdx,
    captionA: trimmedCaption,
    rtMs: rtMs || null,
    completionCode: completionCode,
  },
});
```

## 機能の説明

### 新しいテーブル構造

`submissions` テーブルに以下のカラムが追加されます：

- `completion_code` (VARCHAR(20), NULL 許可): MTurk コンプリーションコード

### 動作

1. **正常な提出の場合**: `generateCompletionCode()` でユニークなコードを生成し、テーブルに保存
2. **類似度が高い提出の場合**: `completion_code` は `null` で保存、ユーザーにはコードを提供しない

### コードフォーマット

生成されるコードは `COMP-XXXX-XXRX-XXXX` の形式で、中央の文字が必ず 'R' になります。

## 注意事項

- 既存の提出データに影響はありません（新しいカラムは NULL 許可）
- フロントエンド側の実装はすでに完了しています
- SQL マイグレーションと Prisma クライアントの再生成後に、必ずアプリケーションを再起動してください
