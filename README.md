# 天马黑珍珠社群导航页

这是基于 Notion 导出内容整理的纯静态网页，适合直接托管到 GitHub Pages。

## 文件结构

- `index.html`：页面结构
- `styles.css`：页面样式
- `script.js`：读取 `assets/data/*.csv` 并生成内容卡片
- `assets/images`：从 Notion 导出里保留的图片资源
- `assets/data`：从 Notion 导出里整理出的 CSV 数据
- `.nojekyll`：避免 GitHub Pages 对静态资源做 Jekyll 处理

## 本地预览

可在当前目录启动一个静态服务，例如：

```bash
python3 -m http.server 4173
```

然后打开 `http://localhost:4173`。

## GitHub Pages 托管

1. 在 GitHub 新建一个仓库。
2. 把当前目录内容推送到该仓库的 `main` 分支。
3. 进入仓库 `Settings` -> `Pages`。
4. `Build and deployment` 选择 `Deploy from a branch`。
5. 分支选择 `main`，目录选择 `/ (root)`。
6. 保存后等待 GitHub Pages 生成访问地址。

如果仓库名不是用户名主页仓库，访问地址通常为：

```text
https://<github-username>.github.io/<repo-name>/
```
