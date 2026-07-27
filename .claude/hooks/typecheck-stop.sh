#!/usr/bin/env bash
# Stop フック: ターン終了時に pnpm typecheck を実行し、型エラーがあれば Claude へ差し戻す。
# astro check は診断を stdout に出し終了コード 1 で終わるが、Stop フックの exit 1 は
# non-blocking 扱いで Claude に何も渡らない。exit 2 + stderr で差し戻す。
set -uo pipefail

input=$(cat)

# 既にこのフック起点で継続中なら再ブロックしない（公式の無限ループ防止パターン）
if command -v jq >/dev/null 2>&1; then
  stop_hook_active=$(jq -r '.stop_hook_active // false' <<<"$input")
elif grep -qE '"stop_hook_active"[[:space:]]*:[[:space:]]*true' <<<"$input"; then
  stop_hook_active=true
else
  stop_hook_active=false
fi

if [[ "$stop_hook_active" == "true" ]]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

if output=$(pnpm typecheck 2>&1); then
  exit 0
fi

# ANSI エスケープを除去してから差し戻す
plain=$(sed $'s/\033\\[[0-9;]*m//g' <<<"$output")

printf '%s\n\n%s\n' \
  "pnpm typecheck が型エラーを検出しました。修正してから終了してください。" \
  "$plain" >&2
exit 2
