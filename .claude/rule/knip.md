# knip.json の ignoreFiles / ignoreDependencies について

意図的に多数の除外設定が入っている。誤って削除しないこと。

## ignoreFiles

- **MDXコンポーネント群**（`Amzn.astro`, `LinkCard.astro`, `SimpleLinkCard.astro`, `positive.tsx`, `negative.tsx` およびそれらが依存するファイル）:
  `astro-auto-import` で全MDXファイルにビルド時注入される。knipにはastro-auto-importプラグインがなく、かつ `src/content/**` がignore対象のためknipが使用を検出できない。

- **`cfImageService.ts`**:
  `astro.config.ts` 内で文字列として参照されるため静的解析で検出不可。

## ignoreDependencies

- **`textlint-*`**:
  VS Code拡張（vscode-textlint）が直接参照する。scriptsやCIには登場しないがアンインストール不可。

- **`@iconify-json/mdi`, `swr`, `react-icons` 等**:
  astro-iconやignoreFiles対象コンポーネントから使用されているが、knipのトレースが届かない。
