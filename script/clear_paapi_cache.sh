#!/bin/bash

# PAAPI_DATASTORE KVキャッシュ全削除スクリプト
# PA-API v5 → Creators API 移行後に旧形式（PascalCase）キャッシュを削除するために使用

set -euo pipefail

BINDING="PAAPI_DATASTORE"

echo "$BINDING キャッシュ全削除スクリプト"
echo "============================================"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
    echo "ERROR: CLOUDFLARE_API_TOKEN 環境変数が設定されていません" >&2
    echo "https://developers.cloudflare.com/fundamentals/api/get-started/create-token/" >&2
    exit 1
fi

if ! command -v jq &>/dev/null; then
    echo "ERROR: jq コマンドが見つかりません。brew install jq などでインストールしてください" >&2
    exit 1
fi

TEMP_DIR=$(mktemp -d "/tmp/${BINDING}_delete_XXXXXX")
TEMP_FILE="$TEMP_DIR/keys.json"
trap 'rm -rf "$TEMP_DIR"' EXIT

echo "Step 1: $BINDING からキー一覧を取得中..."

if ! KEY_LIST=$(pnpm wrangler kv key list --binding="$BINDING" --remote --preview false); then
    echo "ERROR: キー一覧の取得に失敗しました。上の wrangler の出力を確認してください" >&2
    exit 1
fi

if ! KEY_COUNT=$(printf '%s' "$KEY_LIST" | jq -e 'if type == "array" then length else error("キー一覧が JSON 配列ではありません") end'); then
    echo "ERROR: wrangler の出力を JSON 配列として解釈できませんでした。取得した出力は以下のとおりです" >&2
    printf '%s\n' "$KEY_LIST" | head -n 20 >&2 || true
    exit 1
fi

if [[ ! "$KEY_COUNT" =~ ^[0-9]+$ ]]; then
    echo "ERROR: キー数を数値として取得できませんでした: '$KEY_COUNT'" >&2
    exit 1
fi

echo "見つかったキー数: $KEY_COUNT"

if ((KEY_COUNT == 0)); then
    echo "削除するキーがありません"
    exit 0
fi

printf '%s' "$KEY_LIST" | jq '[.[].name]' >"$TEMP_FILE"

echo ""
echo "警告: この操作は取り消しできません！"
echo "$BINDING から $KEY_COUNT 個のキーを削除します"
echo ""
REPLY=""
read -rp "続行しますか？ (y/N): " -n 1 REPLY || true
echo

if [[ ! "$REPLY" =~ ^[Yy]$ ]]; then
    echo "キャンセルされました"
    exit 1
fi

echo "Step 2: バッチ削除を実行中..."
if ! pnpm wrangler kv bulk delete --binding="$BINDING" --remote --preview false "$TEMP_FILE"; then
    echo "ERROR: バッチ削除に失敗しました。上の wrangler の出力を確認してください" >&2
    exit 1
fi

echo "$BINDING キャッシュの削除が完了しました"
