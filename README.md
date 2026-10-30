# OICL laboratory website

An English-first, static Astro website for OICL. A separate Sanity Studio lets editors maintain research, people, outcomes, activities and links. Chinese names and Chinese-only items are supported without inventing translations.

## October 2026 redesign

The site follows the laboratory PPT: **Optical Information and Communications Laboratory**, three AI-computing research areas, and the Home / Research / People / Outcomes / Activities / Links / Contact navigation. Its visual system uses GBU's Ignition Orange (`#ff4a05`) and Quantum Blue (`#0d00b2`). The adopted OICL fiber logo appears in the site header, footer and favicon; its SVG assets are in `public/images/brand/`. The PPT portrait and research figures are published with alternative text and full-size links. Empty sections indicate that content is still being collected.

Run `npm run dev` and open the URL printed by Astro (this repository's `SITE_URL` uses the `/DisplayWebpage/` base path). Preview mode reads the local PPT sample content even if a Sanity project ID is configured. Set `CONTENT_SOURCE=sanity` locally to inspect published CMS records. Production builds always read Sanity and never use sample content. The public website is [OICL on GitHub Pages](https://spsp6.github.io/DisplayWebpage/).

## Current state

The public Sanity dataset contains the PPT-approved laboratory name, principal investigator, three research directions and their images. The earlier research themes remain in Sanity with **Show on website** turned off. Twelve existing publication and patent records are displayed on the professor profile. Activities, prototypes, applications and two institutional URLs still await confirmed details.

## Run the website

Requires Node.js 22 or later.

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Open the local URL printed by Astro. `npm run build` creates a preview build in `dist/`; `npm run preview` serves it locally.

## Sanity content studio

The Sanity project is **`gd1we79o`**, with a public `production` dataset. The editing interface is hosted at [OICL Content Studio](https://oicl-content-gd1we79o.sanity.studio/); sign in with an account granted access to the project. Published documents in a public dataset can be queried publicly, so keep unverified material as drafts. The updated Studio schema is deployed.

1. Copy `.env.example` to `.env` in both the repository root and `studio/`. Set root `SANITY_PROJECT_ID=gd1we79o` and Studio `SANITY_STUDIO_PROJECT_ID=gd1we79o`; keep both dataset names as `production`. The local `.env` files are ignored by Git.
2. To run the editing studio locally:

   ```powershell
   npm --prefix studio install
   npm run studio:dev
   ```

3. In Studio, open **Site settings** and enter verified facts. Add Research themes, Publications and People. The updated local schema also supports prototypes, applications, dated activities with photos, and important links. Upload images with meaningful alternative text.
   For a publication that should remain in a person profile but not appear on Outcomes, enable **Hide from Outcomes** in its publication record.
   In Activities, use **Featured group or PI activity** to place confirmed group and PI events before individual highlights. **Show on website** can hide an activity or one photo while keeping it in Sanity.
4. After changing the Studio schema or editor interface, run `npm run studio:deploy` from the repository root to rebuild and update the hosted Studio. This requires an authorized Sanity CLI login. Ordinary content edits are saved directly in Sanity and do not require a Studio redeploy.
5. Sanity project settings must allow the deployed website's origin for any future browser-side features. The current website reads published content only during its server-side build.

The website reads published Sanity content during each build. Keep draft content unpublished until verified. The current public dataset requires no read token. If the laboratory later switches to a private dataset, configure `SANITY_READ_TOKEN` only in the website build environment, never as a public variable.

## Minimum verified content before launch

- Official English laboratory name and institutional affiliation
- English introduction and collaboration email
- At least one specific research theme with an accurate summary
- At least one confirmed publication with citation metadata and a DOI or original source link
- At least one confirmed team member

Set `PUBLICATION_MODE=production` and `SITE_URL` to the canonical public HTTPS URL when those facts are ready. `npm run build` will fail if the core fields are missing, if Sanity is not connected, or if the configured site URL is still the example value. The production build removes the preview notice and `noindex` metadata.

## Publishing flow

The frontend is prepared for **GitHub Pages** in `.github/workflows/deploy-pages.yml`, targeting the public `spsp6/DisplayWebpage` repository. Choose **GitHub Actions** in **Settings → Pages**. The workflow defaults to `https://spsp6.github.io/DisplayWebpage/`; set a repository `SITE_URL` variable only if using a custom domain. Set `SANITY_PROJECT_ID` and optionally `SANITY_DATASET` as repository variables; set `SANITY_READ_TOKEN` as a repository secret only for a private dataset. The URL path determines Astro's base path, so repository pages and custom-domain root pages both work.

The workflow runs on pushes to `main`, manually from the Actions tab, or via a `sanity-published` repository-dispatch event. It always builds with `PUBLICATION_MODE=production`; missing verified Sanity content stops the build. Ordinary Sanity content edits do **not** automatically deploy until a webhook is configured or the workflow is run manually. To automate them, configure a Sanity webhook for published changes to POST `{"event_type":"sanity-published"}` to GitHub's repository-dispatch endpoint using a carefully scoped GitHub token; keep the token in Sanity's private webhook settings.

GitHub Pages is configured to build from GitHub Actions, and the repository variable `SANITY_PROJECT_ID` points to the Sanity project. GitHub Pages availability and speed in mainland China should be measured from real user networks; hosting there does not guarantee regional performance.

## Dependency note

The website production dependency audit currently reports no findings. Sanity Studio 6.18.0 pulls in 17 reported transitive dependency advisories (9 high, 8 moderate), largely through its CLI and build tools. `npm audit` offers only a breaking downgrade to Sanity 5.14.1 as an automatic fix. Review updated Sanity releases and rerun the audit when updating Studio; do not apply that downgrade blindly.

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
- The Activities page shows dated updates when available; otherwise it displays a clear preparation state.

---

# OICL 实验室网站（中文说明）

这是一个以英文为主的 OICL 实验室静态网站，使用 Astro 构建。独立的 Sanity Studio 供非技术成员维护研究、人员、成果、活动和链接。网站支持中文姓名及仅有中文原文的内容，不会自行编造英文译文。

## 2026 年 10 月改版

网站依据实验室 PPT，采用正式英文名称 **Optical Information and Communications Laboratory**、三个面向 AI 算力的研究方向，以及 Home / Research / People / Outcomes / Activities / Links / Contact 栏目。视觉以启明橙（`#ff4a05`）为主、量子蓝（`#0d00b2`）为辅。已选定的 OICL 光纤 Logo 用于网站页眉、页脚和 favicon，SVG 资源位于 `public/images/brand/`。PPT 中的肖像和研究图片已展示在网站，附替代文字和原图入口；尚未收集到资料的栏目会明确显示待更新状态。

运行 `npm run dev` 后打开 Astro 输出的地址；当前 `SITE_URL` 使用 `/DisplayWebpage/` 路径。预览模式默认读取本地 PPT 示例资料，即使配置了 Sanity 项目 ID 也是如此；若想在本地查看现有 CMS 数据，可设置 `CONTENT_SOURCE=sanity`。正式版构建始终读取 Sanity，绝不使用示例资料。公开网址为 [OICL GitHub Pages](https://spsp6.github.io/DisplayWebpage/)。

## 当前状态

公开 Sanity 数据集已更新 PPT 中的实验室名称、PI、三个研究方向及图片；之前的四个方向保留在后台，但关闭了 **Show on website**。邓宁教授资料页展示原有的 12 条论文和专利记录。Activities、Prototypes、Applications 和两个机构网址仍待补齐资料。

## 本地运行网站

需要 Node.js 22 或更新版本。

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

在浏览器中打开 Astro 输出的本地网址。`npm run build` 会在 `dist/` 中生成预览版；`npm run preview` 可在本地查看构建结果。

## Sanity 内容后台

Sanity 项目 ID 为 **`gd1we79o`**，使用公开的 `production` 数据集。可在 [OICL Content Studio](https://oicl-content-gd1we79o.sanity.studio/) 登录并编辑；账号需拥有该项目权限。公开数据集里已发布的文档可被公众查询，未经核实的资料请只存为草稿。新版后台结构已部署。

1. 分别在仓库根目录和 `studio/` 中，将 `.env.example` 复制为 `.env`。根目录填写 `SANITY_PROJECT_ID=gd1we79o`，Studio 填写 `SANITY_STUDIO_PROJECT_ID=gd1we79o`；两个数据集名称均保持 `production`。本地 `.env` 文件不会提交到 Git。
2. 如果需要在本地运行编辑后台：

   ```powershell
   npm --prefix studio install
   npm run studio:dev
   ```

3. 在 Studio 的 **Site settings** 中填写已核实的信息，再添加研究方向、论文和成员。新版本地结构还支持原型、应用、带照片的活动和重要链接。上传图片时须填写有意义的替代文字。
   论文需要保留在个人主页、但不显示于 Outcomes 时，在该论文记录中启用 **Hide from Outcomes**。
   Activities 中可用 **Featured group or PI activity** 将经确认的集体或 PI 活动排在个人照片前；活动及单张照片均可用 **Show on website** 暂停展示，资料仍保留在 Sanity。
4. 如果修改了 Studio 的内容结构或编辑界面，在仓库根目录运行 `npm run studio:deploy`，重新构建并更新线上 Studio；这需要已授权的 Sanity CLI 登录。平常编辑资料直接存入 Sanity，无需重新部署 Studio。
5. 若将来添加浏览器端读取 Sanity 的功能，需要在 Sanity 项目设置中允许已部署网站的来源地址。当前网站仅在服务端构建时读取已发布的内容。

网站每次构建时都会读取 Sanity 中已发布的内容。资料核实前，请将其保留为草稿。当前公开数据集无需读取令牌。若将来改为私有数据集，只在网站构建环境中设置 `SANITY_READ_TOKEN`，不要将其设为公开变量。

## 正式上线前的最小核实内容

- 实验室正式英文名称及所属机构
- 英文简介和合作联系邮箱
- 至少一个准确描述的具体研究方向
- 至少一篇引文信息已确认、附 DOI 或原始来源链接的论文
- 至少一位已确认的成员

资料准备好后，将 `PUBLICATION_MODE=production`，并把 `SITE_URL` 设为正式的 HTTPS 网址。如果核心字段缺失、Sanity 尚未连接，或网址仍是示例值，`npm run build` 会失败。正式版构建会移除预览提示和 `noindex` 标记。

## 发布流程

前端已在 `.github/workflows/deploy-pages.yml` 中准备好 **GitHub Pages** 发布流程，目标为公开仓库 `spsp6/DisplayWebpage`。在仓库的 **Settings → Pages** 中选择 **GitHub Actions** 作为构建来源。工作流默认使用 `https://spsp6.github.io/DisplayWebpage/`；仅在使用自定义域名时设置仓库变量 `SITE_URL`。将 `SANITY_PROJECT_ID` 及可选的 `SANITY_DATASET` 设置为仓库变量。仅在使用私有数据集时，把 `SANITY_READ_TOKEN` 设置为仓库 Secret。程序会根据网址中的路径自动处理 GitHub 项目页或自定义域名根路径。

工作流在代码推送到 `main` 时运行，也可从 Actions 页面**手动运行**，或通过 `sanity-published` 仓库分发事件触发，始终以 `PUBLICATION_MODE=production` 构建。若 Sanity 中缺少经核实的内容，构建会停止。一般的 Sanity 资料修改不会自动部署；需手动重跑工作流，或配置 Sanity webhook。配置 webhook 时，应使用权限范围尽量小的 GitHub 令牌，向仓库分发接口发送 `{"event_type":"sanity-published"}`，并只将令牌保存在 Sanity 私有设置中。

GitHub Pages 已设置为从 GitHub Actions 构建，仓库变量 `SANITY_PROJECT_ID` 也已指向当前 Sanity 项目。GitHub Pages 在中国大陆的实际可用性与速度应通过真实网络测试，不能仅凭托管平台名称保证。

## 依赖说明

目前网站生产依赖的审计没有发现问题。Sanity Studio 6.18.0 的间接依赖有 17 条审计告警（9 条高风险、8 条中风险），主要来自 CLI 和构建工具。`npm audit` 给出的自动修复方案需要将 Sanity 降级到不兼容的 5.14.1。更新 Studio 时应检查 Sanity 的后续版本并重新审计，不要直接执行该降级方案。

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
- Activities 页面有资料时按日期展示；暂无资料时明确显示待更新状态。
