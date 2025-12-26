#!/bin/bash

# OGPDatastore KVキャッシュ全削除スクリプト
# このスクリプトはCloudflare KVのOGPDatastoreから全てのキーを削除します

set -e

echo "🧹 OGPDatastoreキャッシュ全削除スクリプト"
echo "============================================"

# 環境変数のチェック
if [[ -z "${CLOUDFLARE_API_TOKEN}" ]]; then
    echo "❌ CLOUDFLARE_API_TOKEN環境変数が設定されていません"
    echo "https://developers.cloudflare.com/fundamentals/api/get-started/create-token/ でAPIトークンを作成してください"
    exit 1
fi

# 一時ファイル名
KEYS_FILE="ogp_keys_list.json"
DELETE_FILE="ogp_keys_delete.json"

echo "📋 Step 1: OGPDatastoreからキー一覧を取得中..."

# キー一覧を取得（リモートのプロダクション環境から）
echo "🔍 Wranglerコマンドを実行中..."
if npx wrangler kv key list --binding=OGP_DATASTORE --remote --preview false > "$KEYS_FILE" 2>&1; then
    echo "✅ キー一覧の取得が完了しました"
else
    echo "❌ キー一覧の取得に失敗しました"
    echo "📄 エラー詳細:"
    cat "$KEYS_FILE"
    rm -f "$KEYS_FILE"
    exit 1
fi

# 取得したキー数を確認
echo "📊 取得したファイルの内容確認:"
echo "ファイルサイズ: $(wc -c < "$KEYS_FILE") bytes"
echo "行数: $(wc -l < "$KEYS_FILE")"
echo "最初の3行:"
head -3 "$KEYS_FILE" || echo "ファイルが空か読み取れません"

# jqの可用性をチェック
if ! command -v jq &> /dev/null; then
    echo "❌ jqコマンドが見つかりません。sedを使用してキー数をカウントします"
    # "name"フィールドの数をカウント（sedを使用）
    KEY_COUNT=$(grep -c '"name"' "$KEYS_FILE" || echo "0")
else
    echo "🔍 jqを使用してJSON妥当性チェック中..."
    # jqが利用可能な場合
    if KEY_COUNT=$(jq -r 'length' "$KEYS_FILE" 2>/dev/null) && [[ "$KEY_COUNT" =~ ^[0-9]+$ ]]; then
        echo "✅ jqによる解析成功"
    else
        echo "❌ jq解析失敗、sedにフォールバック"
        KEY_COUNT=$(grep -c '"name"' "$KEYS_FILE" || echo "0")
    fi
fi
echo "📊 見つかったキー数: $KEY_COUNT"

if [[ "$KEY_COUNT" -eq 0 ]]; then
    echo "✅ 削除するキーがありません"
    rm -f "$KEYS_FILE"
    exit 0
fi

echo "🔧 Step 2: バッチ削除用JSONファイルを作成中..."

# Wrangler kv bulk deleteで必要な形式に変換（文字列配列）
if command -v jq &> /dev/null; then
    echo "jqを使用して文字列配列に変換中..."
    jq '[.[].name]' "$KEYS_FILE" > "$DELETE_FILE"
else
    echo "jqが無いため、Node.jsを使用して文字列配列に変換中..."
    # Node.jsを使って文字列配列に変換
    node -e "
    const fs = require('fs');
    try {
        const data = JSON.parse(fs.readFileSync('$KEYS_FILE', 'utf8'));
        const deleteData = data.map(item => item.name);
        fs.writeFileSync('$DELETE_FILE', JSON.stringify(deleteData, null, 2));
        console.log('✅ Node.jsによる文字列配列変換完了');
    } catch (error) {
        console.error('❌ JSON変換エラー:', error.message);
        process.exit(1);
    }
    "
fi

# 作成されたファイルの確認
if [[ -s "$DELETE_FILE" ]]; then
    # 文字列配列なので、行数から1を引いて配列の要素数を計算（開始・終了の[]を除く）
    DELETE_COUNT=$(grep -v '^\[' "$DELETE_FILE" | grep -v '^\]' | grep -c '"' || echo "0")
    echo "✅ 削除用ファイル作成完了: $DELETE_COUNT エントリ"
    echo "最初の3行:"
    head -3 "$DELETE_FILE"
else
    echo "❌ 削除用ファイルの作成に失敗しました"
    rm -f "$KEYS_FILE" "$DELETE_FILE"
    exit 1
fi

echo "📁 作成されたファイル:"
echo "  - キー一覧: $KEYS_FILE"
echo "  - 削除用ファイル: $DELETE_FILE"

echo ""
echo "⚠️  警告: この操作は取り消しできません！"
echo "OGPDatastoreから $DELETE_COUNT 個のキーを削除します"
echo ""
read -p "続行しますか？ (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Step 3: バッチ削除を実行中..."
    
    # バッチ削除の実行（本番環境を明示的に指定）
    npx wrangler kv bulk delete --binding=OGP_DATASTORE --remote --preview false "$DELETE_FILE"
    
    echo "✅ OGPキャッシュの削除が完了しました！"
    echo ""
    echo "🧹 一時ファイルを削除中..."
    rm -f "$KEYS_FILE" "$DELETE_FILE"
    echo "✅ 完了！"
else
    echo "❌ キャンセルされました"
    echo "🧹 一時ファイルを削除中..."
    rm -f "$KEYS_FILE" "$DELETE_FILE"
    exit 1
fi