# ブランチ命名規則

## Cloudflare Workers プレビュー URL の制約

ブランチ名はプレビューURLのDNSラベルになるため、以下の制約がある:

- 小文字・数字・ハイフンのみ使用可能
- `<branch-name>-blog` の合計が63文字を超える場合は自動短縮される
- アンダースコアはハイフンに変換される

## 推奨パターン

```
feature/add-search
fix/og-image-cache
design/phase4-refactor
```

プレビューURLには `feature-add-search-blog.xxxx.workers.dev` のように変換される。
