# OICL laboratory website

An English-first, static Astro website for an optical communications laboratory. A separate Sanity Studio lets nontechnical editors maintain research themes, publications, people and news. Chinese names and Chinese-only items are supported without inventing translations.

## Current state

This repository is a **content preview**. It includes a curated English summary of the Ning Deng biography and bibliography supplied by the laboratory, with selected publication links checked against publisher or conference records. It does not assume an expansion of **OICL**, invent other members or projects, or add unapproved photos. Preview builds show a notice and add `noindex` to every page. A production build is blocked until the official laboratory name and core facts are reviewed and entered in Sanity.

## Run the website

Requires Node.js 22 or later.

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Open the local URL printed by Astro. `npm run build` creates a preview build in `dist/`; `npm run preview` serves it locally.

## Connect Sanity

1. Create a Sanity project and a `production` dataset owned by the laboratory.
2. Copy `.env.example` to `.env` in both the repository root and `studio/`.
3. Set `SANITY_PROJECT_ID` in the website root and `SANITY_STUDIO_PROJECT_ID` in `studio/` to the same project ID. Keep the dataset names in sync.
   For a private dataset, set `SANITY_READ_TOKEN` only in the website build environment; never expose it as a public variable.
4. Install and run the editing studio:

   ```powershell
   npm --prefix studio install
   npm run studio:dev
   ```

5. In Studio, open **Site settings** and enter verified facts. Add Research themes, Publications and People. Add News only when a real update exists. Uploaded images require meaningful alternative text.
6. Sanity project settings must allow the deployed website's origin for any future browser-side features. The current website reads published content only during its server-side build.

The website reads published Sanity content during each build. Keep draft content unpublished until verified. The dataset must allow the build process to read published documents; configure a server-side read token if the laboratory chooses a private dataset.

## Minimum verified content before launch

- Official English laboratory name and institutional affiliation
- English introduction and collaboration email
- At least one specific research theme with an accurate summary
- At least one confirmed publication with citation metadata and a DOI or original source link
- At least one confirmed team member

Set `PUBLICATION_MODE=production` and `SITE_URL` to the canonical public HTTPS URL when those facts are ready. `npm run build` will fail if the core fields are missing, if Sanity is not connected, or if the configured site URL is still the example value. The production build removes the preview notice and `noindex` metadata.

## Publishing flow

The frontend is prepared for **GitHub Pages** in `.github/workflows/deploy-pages.yml`, targeting `berhbro/DisplayWebpage`. The repository stays private while the laboratory verifies its identity and content; the team plans to make it public afterward. Push this source, including `package-lock.json`. After verification, change the repository visibility to public and choose **GitHub Actions** in **Settings → Pages**. The workflow defaults to `https://berhbro.github.io/DisplayWebpage/`; set a repository `SITE_URL` variable only if using a custom domain. Set `SANITY_PROJECT_ID` and optionally `SANITY_DATASET` as repository variables; set `SANITY_READ_TOKEN` as a repository secret only for a private dataset. The URL path determines Astro's base path, so repository pages and custom-domain root pages both work.

The workflow runs **manually** from the Actions tab or via a `sanity-published` repository-dispatch event, and always builds with `PUBLICATION_MODE=production`. It cannot deploy the preview content: missing verified Sanity content or an unset URL stops the build. Once the site is approved, run the workflow and check the GitHub Pages URL. To automate future edits, configure a Sanity webhook for published changes to POST `{"event_type":"sanity-published"}` to GitHub's repository-dispatch endpoint using a carefully scoped GitHub token; keep the token in Sanity's private webhook settings. Test one edit, publication, rebuild and live page update before announcing the site.

The GitHub Pages workflow is prepared, but no Sanity account is connected. The team must supply the project credentials, verified content and approved images before public launch. GitHub Pages availability and speed in mainland China should be measured from real user networks; hosting there does not guarantee regional performance.

## Dependency note

The website production dependency audit currently reports no findings. Sanity Studio 6.18.0 pulls in 17 reported transitive dependency advisories (9 high, 8 moderate), largely through its CLI and build tools. `npm audit` offers only a breaking downgrade to Sanity 5.14.1 as an automatic fix. Review updated Sanity releases and rerun the audit before deploying Studio; do not apply that downgrade blindly.

## Preview source references

- [Great Bay University](https://www.gbu.edu.cn/)
- [Optica record: optical switching for computing center networks](https://opg.optica.org/abstract.cfm?uri=CLEOPR-2024-Mo3K_1)
- [Optica record: multi-band WDM optical networks](https://opg.optica.org/jlt/abstract.cfm?URI=jlt-40-11-3385)
- [Optica record: ultradense wavelength switched network](https://opg.optica.org/jlt/abstract.cfm?uri=jlt-35-11-2063)
- [ACP 2025 program](https://www.acpconf.com/uploads/file/20251015/1760521606357993.pdf)

## Content conventions

- English is the primary navigation and explanatory language.
- Use Chinese name fields for verified names or terms. Mark Chinese-only publication/news entries as Chinese in Studio; the website adds a language badge and `lang="zh-CN"` to their titles.
- Enter DOI as `10.xxxx/...` or a DOI URL. It takes priority over the optional original source URL.
- Link to authoritative source records rather than uploading copies of papers.
- Feature up to three publications on the home page. If none are explicitly featured, the newest three are selected automatically.
- News appears only when entries exist; there is no empty news archive.

---

# OICL 实验室网站（中文说明）

这是一个以英文为主的光通信实验室静态网站，使用 Astro 构建。独立的 Sanity Studio 供非技术成员维护研究方向、论文、成员和新闻。网站支持中文姓名及仅有中文原文的内容，不会自行编造英文译文。

## 当前状态

本仓库目前是**内容预览版**。预览内容包含根据实验室提供的邓宁老师简介和论文资料整理的英文摘要；部分论文链接已与出版社或会议记录核对。网站没有推测 **OICL** 的英文全称，也没有虚构其他成员、项目或使用未经批准的照片。预览版每页都有提示，并设置 `noindex`。在正式名称和核心资料经核实并录入 Sanity 前，正式版构建会被阻止。

## 本地运行网站

需要 Node.js 22 或更新版本。

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

在浏览器中打开 Astro 输出的本地网址。`npm run build` 会在 `dist/` 中生成预览版；`npm run preview` 可在本地查看构建结果。

## 连接 Sanity

1. 由实验室创建 Sanity 项目和名为 `production` 的数据集。
2. 分别在仓库根目录和 `studio/` 中，将 `.env.example` 复制为 `.env`。
3. 将根目录的 `SANITY_PROJECT_ID` 和 `studio/` 中的 `SANITY_STUDIO_PROJECT_ID` 设为同一个项目 ID，并保持数据集名称一致。如果使用私有数据集，仅在网站构建环境中设置 `SANITY_READ_TOKEN`，不要将其设为公开变量。
4. 安装并启动内容编辑后台：

   ```powershell
   npm --prefix studio install
   npm run studio:dev
   ```

5. 在 Studio 的 **Site settings** 中填写已核实的信息，再添加研究方向、论文和成员。确有更新时才添加新闻。上传图片时须填写有意义的替代文字。
6. 若将来添加浏览器端读取 Sanity 的功能，需要在 Sanity 项目设置中允许已部署网站的来源地址。当前网站仅在服务端构建时读取已发布的内容。

网站每次构建时都会读取 Sanity 中已发布的内容。资料核实前，请将其保留为草稿。数据集必须允许构建程序读取已发布文档；如果使用私有数据集，应配置仅供服务端使用的读取令牌。

## 正式上线前的最小核实内容

- 实验室正式英文名称及所属机构
- 英文简介和合作联系邮箱
- 至少一个准确描述的具体研究方向
- 至少一篇引文信息已确认、附 DOI 或原始来源链接的论文
- 至少一位已确认的成员

资料准备好后，将 `PUBLICATION_MODE=production`，并把 `SITE_URL` 设为正式的 HTTPS 网址。如果核心字段缺失、Sanity 尚未连接，或网址仍是示例值，`npm run build` 会失败。正式版构建会移除预览提示和 `noindex` 标记。

## 发布流程

前端已在 `.github/workflows/deploy-pages.yml` 中准备好 **GitHub Pages** 发布流程，目标仓库为 `berhbro/DisplayWebpage`。实验室核实名称和内容期间，仓库保持私有；核实完成后再改为公开。推送源代码时须包含 `package-lock.json`。核实完成后，在仓库的 **Settings → Pages** 中选择 **GitHub Actions** 作为构建来源。工作流默认使用 `https://berhbro.github.io/DisplayWebpage/`；仅在使用自定义域名时设置仓库变量 `SITE_URL`。将 `SANITY_PROJECT_ID` 及可选的 `SANITY_DATASET` 设置为仓库变量。仅在使用私有数据集时，把 `SANITY_READ_TOKEN` 设置为仓库 Secret。程序会根据网址中的路径自动处理 GitHub 项目页或自定义域名根路径。

工作流可从 Actions 页面**手动运行**，也支持通过 `sanity-published` 仓库分发事件触发，且始终以 `PUBLICATION_MODE=production` 构建。若 Sanity 中缺少经核实的内容或网址未设置，构建会停止，不会把预览资料部署到公开网站。资料获批后，运行工作流并检查 GitHub Pages 网址。若要让后续内容发布自动重建，可为已发布内容配置 Sanity webhook，使用权限范围尽量小的 GitHub 令牌，向仓库分发接口发送 `{"event_type":"sanity-published"}`；令牌只保存在 Sanity 私有的 webhook 设置中。在 webhook 配好前，内容更新后需手动重跑工作流。对外公布网站前，应实际测试一次内容编辑、发布、重新构建及线上页面更新的完整流程。

GitHub Pages 工作流已准备好，但尚未连接 Sanity 账号。公开上线前，实验室还需提供项目凭据、核实后的内容和获准使用的图片。GitHub Pages 在中国大陆的实际可用性与速度应通过真实网络测试，不能仅凭托管平台名称保证。

## 依赖说明

目前网站生产依赖的审计没有发现问题。Sanity Studio 6.18.0 的间接依赖有 17 条审计告警（9 条高风险、8 条中风险），主要来自 CLI 和构建工具。`npm audit` 给出的自动修复方案需要将 Sanity 降级到不兼容的 5.14.1。部署 Studio 前，应检查 Sanity 的后续版本并重新审计，不要直接执行该降级方案。

## 预览内容的参考来源

- [大湾区大学](https://www.gbu.edu.cn/)
- [Optica：计算中心网络光交换论文记录](https://opg.optica.org/abstract.cfm?uri=CLEOPR-2024-Mo3K_1)
- [Optica：多波段 WDM 光网络论文记录](https://opg.optica.org/jlt/abstract.cfm?URI=jlt-40-11-3385)
- [Optica：超密集波长交换网络论文记录](https://opg.optica.org/jlt/abstract.cfm?uri=jlt-35-11-2063)
- [ACP 2025 会议日程](https://www.acpconf.com/uploads/file/20251015/1760521606357993.pdf)

## 内容填写约定

- 导航和研究说明以英文为主。
- 已核实的中文姓名或术语可填写在对应中文字段中。仅有中文原文的论文或新闻应在 Studio 中标记为中文；网站会为标题添加语言标签和 `lang="zh-CN"` 属性。
- DOI 可填写为 `10.xxxx/...` 或 DOI 网址，优先于可选的原始来源网址。
- 优先链接到权威来源记录，不上传论文副本。
- 首页最多展示三篇精选论文；若未手动精选，则自动展示最新的三篇。
- 仅在有新闻内容时显示新闻板块，不设置空的新闻归档页。
