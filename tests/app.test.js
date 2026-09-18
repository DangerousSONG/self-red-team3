"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "app.js"), "utf8");
const pagesScript = fs.readFileSync(path.join(root, "pages.js"), "utf8");
const dataScript = fs.readFileSync(path.join(root, "data.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const dashboardHtml = fs.readFileSync(path.join(root, "dashboard", "index.html"), "utf8");
const dashboardScript = fs.readFileSync(path.join(root, "dashboard", "script.js"), "utf8");
const dashboardStyles = fs.readFileSync(path.join(root, "dashboard", "styles.css"), "utf8");

test("embeds the supplied situation-awareness dashboard", () => {
  assert.match(html, /id="app" class="app-shell is-dashboard is-booting"/);
  assert.match(script, /function dashboardPage\(\)/);
  assert.match(script, /src="dashboard\/index\.html"/);
  assert.match(styles, /\.dashboard-frame \{ width: 100%; height: 100%;/);
  assert.doesNotMatch(script, /Dashboard 内容待梳理|dashboard-placeholder/);
  assert.match(dashboardHtml, /靶场实时攻防态势总览/);
  assert.match(dashboardHtml, /assets\/scene-map\.png/);
  assert.match(dashboardHtml, /class="benchmark-track"/);
  assert.match(dashboardHtml, /id="capRadarNow"/);
  assert.match(dashboardHtml, /id="attackReactDubbo"/);
  assert.doesNotMatch(dashboardScript, /setupBenchmarkLoop\(\);/);
  assert.match(dashboardScript, /function setupTopologyAttack\(\)/);
  assert.match(dashboardScript, /function updateAgentCapability\(/);
  assert.match(dashboardScript, /const stageSize = \{ minWidth: 1920, height: 1080 \}/);
  assert.match(dashboardScript, /const stageWidth = Math\.max\(stageSize\.minWidth, viewportWidth \/ scale\)/);
  assert.match(dashboardScript, /--stage-width/);
  assert.match(dashboardStyles, /\.stage \{[\s\S]*width: var\(--stage-width, 1920px\);/);
  assert.match(dashboardStyles, /\.kpi-row \{[\s\S]*left: 372px;[\s\S]*right: 448px;[\s\S]*width: auto;/);
  assert.match(dashboardStyles, /\.kpi-card \{[\s\S]*padding: 8px 12px 10px 64px;/);
  assert.match(dashboardStyles, /\.topology \{[\s\S]*left: calc\(50% - 563\.5px\);[\s\S]*right: auto;[\s\S]*width: 1192px;/);
  assert.match(dashboardHtml, /<h2 class="topology-title">实时攻防态势拓扑<\/h2>[\s\S]*<section class="topology"/);
  assert.match(dashboardStyles, /\.topology-title \{[\s\S]*left: 325px;[\s\S]*top: 112px;/);
  assert.match(dashboardHtml, /<div class="route-legend" aria-label="拓扑图例">[\s\S]*分区链路[\s\S]*攻击路径[\s\S]*攻击节点/);
  assert.match(dashboardStyles, /\.route-legend \{[\s\S]*left: 325px;[\s\S]*bottom: 200px;/);
  assert.match(dashboardStyles, /\.leg-attack-path \{[\s\S]*border-top: 2px dashed #ff7668;/);
  assert.match(dashboardStyles, /\.event-feed \{[\s\S]*left: 307px;[\s\S]*right: 408px;[\s\S]*width: auto;/);
  assert.match(dashboardHtml, /<span class="time-block">[\s\S]*id="clock"[\s\S]*id="clock-date"[\s\S]*<\/span>[\s\S]*<\/nav>/);
  assert.doesNotMatch(dashboardHtml, /class="(?:weather|moon|utility-strip|utility-divider)"/);
  assert.match(dashboardScript, /clockDate\.textContent =/);
  assert.match(dashboardStyles, /\.system-ribbon \{[\s\S]*width: 414px;[\s\S]*grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(dashboardStyles, /\.system-ribbon > span:nth-child\(5\) \{ grid-column: 4; grid-row: 2; \}/);
  assert.match(dashboardHtml, /class="hud-panel overview-panel" hidden/);
  assert.match(dashboardHtml, /class="hud-panel run-panel" hidden/);
  assert.match(dashboardHtml, /class="hud-panel gpu-panel" hidden/);
  assert.match(dashboardHtml, /class="hud-panel train-panel" hidden/);
  assert.match(dashboardStyles, /\[hidden\] \{\s*display: none !important;/);
  assert.match(dashboardStyles, /grid-template-rows: 956px;/);
  assert.match(dashboardStyles, /grid-template-rows: 160px 160px 624px;/);
  assert.match(dashboardStyles, /grid-template-rows: 70px 222px minmax\(0, 1fr\);/);
  assert.match(dashboardStyles, /\.agent-carousel-head \{[\s\S]*grid-template-rows: 34px 18px;[\s\S]*padding: 7px 10px;/);
  assert.match(dashboardStyles, /\.efficiency-block \{\s*display: grid;\s*grid-template-rows: 22px 68px minmax\(0, 1fr\);/);
  assert.match(dashboardStyles, /\.task-panel \{[\s\S]*grid-template-rows: 28px minmax\(0, 1fr\);/);
  assert.match(dashboardStyles, /\.duel-panel \{[\s\S]*grid-template-rows: 28px 1fr auto auto 1fr;/);
  assert.match(dashboardStyles, /\.efficiency-bars \{[\s\S]*align-content: center;[\s\S]*gap: 16px;/);
  assert.match(dashboardScript, /rightColumn\.append\(capabilityPanel\)/);
  assert.match(dashboardStyles, /\.benchmark-track \{[\s\S]*animation: none;/);
  assert.match(dashboardStyles, /\.benchmark-rank \.is-current \{[\s\S]*border: 1px solid rgba\(104, 239, 247, 0\.34\);[\s\S]*inset 2px 0 0 rgba\(112, 255, 240, 0\.58\),/);
  assert.match(dashboardStyles, /rgba\(83, 238, 235, 0\.15\)[\s\S]*rgba\(74, 165, 232, 0\.025\)/);
  assert.match(dashboardStyles, /\.benchmark-rank \.is-current span,[\s\S]*font-size: 13px;[\s\S]*font-weight: 800;/);
  assert.match(dashboardHtml, /MDASH[\s\S]*92\.00%[\s\S]*Whizard[\s\S]*68\.90%/);
  assert.match(dashboardHtml, /DoGNAVY<\/span><b>90\.84%<\/b><\/li>[\s\S]*其他参赛模型[\s\S]*<i>7<\/i><span>Xuanwu Autin AI/);
  assert.match(dashboardHtml, /GPT-5\.6-Sol[\s\S]*293[\s\S]*GLM-5\.1[\s\S]*>4</);
  assert.match(dashboardHtml, /OpenCode[\s\S]*37\.39%[\s\S]*OpenHands[\s\S]*35\.10%/);
  const duelMarkup = dashboardHtml.match(/<section class="hud-panel duel-panel">([\s\S]*?)<\/section>/)?.[1] || "";
  assert.doesNotMatch(duelMarkup, /data-number|data-percent|data-min|data-max/);
  assert.ok(fs.existsSync(path.join(root, "dashboard", "assets", "scene-map.png")));
});

test("sidebar state is derived from the current route only", () => {
  assert.match(html, /class="app-shell is-dashboard is-booting"/);
  assert.match(script, /route === "dashboard"/);
  assert.match(script, /classList\.toggle\("is-dashboard", dashboard\)/);
  assert.match(script, /classList\.toggle\("is-inner-page", !dashboard\)/);
  assert.doesNotMatch(script, /toggleSidebar|sidebarToggle|localStorage/);
  assert.match(styles, /\.is-dashboard \.side-rail \{ width: 64px; overflow: visible; \}/);
  assert.match(styles, /content: attr\(data-tooltip\)/);
  assert.match(styles, /a:focus-visible::after/);
  assert.match(script, /data-tooltip="\$\{item\.label\}"/);
  assert.match(styles, /\.side-rail[\s\S]*width: 240px/);
  assert.match(styles, /\.app-shell\.is-booting \.side-rail,[\s\S]*transition: none/);
  assert.match(script, /app\.classList\.remove\("is-booting"\)/);
});

test("has no external runtime dependencies", () => {
  assert.doesNotMatch(html, /https?:\/\//);
  assert.doesNotMatch(html, /react|vue|angular|next/i);
});

test("does not render a global top bar", () => {
  assert.doesNotMatch(html, /global-bar|topbar|顶栏/);
  assert.doesNotMatch(styles, /\.global-bar|\.topbar/);
});

test("does not render a current-space selector", () => {
  assert.doesNotMatch(html, /当前空间|国家安全实验室|tenant-card/);
  assert.doesNotMatch(styles, /tenant-card/);
});

test("uses the battle shield as the temporary brand mark", () => {
  assert.doesNotMatch(html, /CYBERSEC RANGE · 830|>CR</);
  assert.match(html, /id="brand-symbol"/);
  assert.match(script, /brandSymbol\.innerHTML = iconMarkup\("shield", "brand-icon"\)/);
  assert.match(styles, /\.brand-name strong \{ font-size: 18px; font-weight: 600; \}/);
});

test("uses locally embedded Lucide menu icons", () => {
  assert.match(script, /const iconShapes = \{/);
  assert.match(script, /layout-dashboard/);
  assert.match(script, /clipboard-list/);
  assert.match(script, /brain-circuit/);
  assert.match(script, /stroke-width="1\.8"/);
  assert.doesNotMatch(script, /glyph:/);
});

test("matches the required navigation information architecture", () => {
  assert.match(script, /name: "操作中心",[\s\S]*?route: "tasks", label: "测试任务"[\s\S]*?route: "training", label: "训练任务"/);
  assert.doesNotMatch(script, /route: "results", label: "评测结果"/);
  assert.match(script, /name: "资源中心",[\s\S]*?label: "数据中心"[\s\S]*?route: "data", label: "首页"[\s\S]*?route: "data-resources", label: "评测题集\/靶场"[\s\S]*?route: "data-raw", label: "原始产物"[\s\S]*?route: "data-assets", label: "SFT \/ RL 数据"[\s\S]*?route: "gateway", label: "接入网关"[\s\S]*?route: "settings", label: "用户设置"/);
  assert.doesNotMatch(script, /route: "range-hall", label: "靶场大厅"/);
  assert.doesNotMatch(script, /id: "test"|id: "training"/);
  assert.match(pagesScript, /pageHead\("测试任务"/);
  assert.doesNotMatch(script, /\{ route: "confirm", label: "结果确认"/);
  assert.match(script, /confirm: "测试任务 · 结果确认"/);
  assert.match(pagesScript, /pageHead\("训练任务"/);
  assert.doesNotMatch(script, /\{ route: "training-live", label: "实时监控"/);
  assert.match(script, /"training-live": "训练任务 · 实时监控"/);
  assert.doesNotMatch(script, /label: "实战演练场"/);
  assert.doesNotMatch(script, /id: "user"/);
  assert.match(script, /route: "settings", label: "用户设置"/);
  assert.match(pagesScript, /pageHead\("用户设置"/);
  assert.doesNotMatch(pagesScript, /pageHead\("任务中心"|pageHead\("个人中心"/);
  assert.match(script, /document\.title = `\$\{routeLabels\[route\]\} · 网安攻防演练场`/);
  assert.match(script, /class="nav-parent"/);
  assert.match(script, /href="#\/\$\{item\.children\[0\]\.route\}"/);
  assert.match(script, /data-parent-route="\$\{item\.children\[0\]\.route\}"/);
  assert.match(script, /class="nav-children"/);
  assert.doesNotMatch(script, /sectionLabel/);
  assert.doesNotMatch(styles, /nav-subcaption/);
  assert.match(styles, /\.side-nav a\.nav-child \{ height: 32px; padding: 0 10px 0 40px;/);
  assert.match(styles, /\.is-dashboard \.nav-children \{ display: none; \}/);
});

test("keeps informational text at the 12px readability baseline", () => {
  const declaredFontSizes = [
    ...[...styles.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1])),
    ...[...styles.matchAll(/font:\s*[^;]*?\b(\d+)px\//g)].map((match) => Number(match[1])),
  ];
  assert.ok(declaredFontSizes.every((size) => size >= 12));
  assert.match(styles, /\.side-nav a > span,\s*\.nav-parent > span \{ font-size: 13px; \}/);
  assert.match(styles, /\.page-placeholder p[^}]*font-size: 14px/);
  const dashboardFontSizes = [...dashboardStyles.matchAll(/font-size:\s*([0-9.]+)px/g)].map((match) => Number(match[1]));
  assert.ok(dashboardFontSizes.every((size) => size >= 12));
});

test("uses the current design-token color palette", () => {
  const expectedColors = [
    "#01050a", "#02080e", "#06131e", "#0a2030", "#062131",
    "#59bede", "#274f61", "#8ecbff", "#a6d8ff", "#77bcff",
    "#6defff", "#65f5e3", "#ffd267", "#ff746c",
    "#f4fbff", "#d7e9f2", "#a9c2ce",
  ];

  expectedColors.forEach((color) => {
    assert.ok(styles.includes(color), `main shell is missing ${color}`);
  });

  assert.match(dashboardHtml, /stop-color="#55a8ff"/);
  assert.match(dashboardStyles, /background: #01050a/);
  assert.doesNotMatch(styles, /#55e6e2|#55a7e8/);
});

test("implements every non-dashboard navigation destination", () => {
  assert.match(html, /<script src="data\.js"><\/script>/);
  assert.match(html, /<script src="pages\.js"><\/script>/);
  assert.match(script, /window\.RangePages\.render\(route, pageRoot\)/);
  [
    "tasks", "benchmark-detail", "confirm", "training", "training-live",
    "data", "data-resources", "data-raw", "data-process", "data-assets", "results", "results-raw", "results-process", "results-records", "gateway", "settings", "login",
  ].forEach((route) => assert.match(pagesScript, new RegExp(`(?:"${route}"|${route.replace("-", "\\-")})`)));
  assert.doesNotMatch(pagesScript, /该界面将在后续逐页梳理与实现/);
});

test("provides functional local workflows for tasks, training and gateway", () => {
  assert.match(pagesScript, /function renderTaskWizard\(\)/);
  assert.match(pagesScript, /task-wizard-submit/);
  assert.match(pagesScript, /function renderTrainingWizard\(\)/);
  assert.match(pagesScript, /training-submit/);
  assert.match(pagesScript, /verify-agent/);
  assert.match(pagesScript, /create-key/);
  assert.match(pagesScript, /download\(/);
  assert.match(dataScript, /environments:/);
  assert.match(dataScript, /gatewayAgents:/);
  assert.match(dataScript, /R-20260803-03/);
  assert.match(dataScript, /H-20260802-06/);
});

test("syncs the updated result-confirmation workflow into the task center", () => {
  assert.match(pagesScript, /function reviewEntryPanel\(\)/);
  assert.match(pagesScript, /function openReviewDialog\(\)/);
  assert.match(pagesScript, /← 返回结果确认/);
  assert.match(pagesScript, /if\(name==="back-review-dialog"\)return openReviewDialog\(\)/);
  assert.match(pagesScript, /还有 \$\{pending\.length\} 项内容待确认，暂无法生成报告/);
  assert.match(pagesScript, /if \(!pending\.length\) return ""/);
  assert.doesNotMatch(pagesScript, /继续处理/);
  assert.doesNotMatch(pagesScript, /查看已办结风险点/);
  assert.match(pagesScript, /reportReady: false/);
  assert.doesNotMatch(pagesScript, /reportsUnlocked|已完成任务尚未解锁/);
  assert.match(pagesScript, /const resultTasks = \(D\.evaluationDataTasks \|\| \[\]\)/);
  assert.match(pagesScript, /const completedItems = completedResultItems/);
  assert.doesNotMatch(pagesScript, /const visibleReports = state\.reports\.filter/);
  assert.match(pagesScript, /if\(name==="generate-report"\)/);
  assert.match(pagesScript, /if\(name==="go-report"\)return reportModal\(id\)/);
  assert.match(pagesScript, /function confirmPage\(\) \{\s*return tasksPage\(\);/);
});

test("uses the six-step RL training workflow and task-detail monitor", () => {
  assert.match(pagesScript, /const trainingHyperparameters = \[/);
  ["LR", "EPS_CLIP", "RL_EPOCH", "RL_GLOBAL_BATCH_SIZE", "RL_GROUP_SIZE", "MAX_TOKENS_PER_GPU", "SGLANG_MEM_FRACTION_STATIC", "ROLLOUT_NUM_GPUS", "ACTOR_NUM_GPUS_PER_NODE"].forEach((field) => assert.match(pagesScript, new RegExp(`\\["${field}"`)));
  assert.match(pagesScript, /const rlAlgorithms = \["GRPO", "PPO", "GSPO"\]/);
  assert.match(pagesScript, /wizardSteps\(\["基本信息", "数据与基准", "模型与算法", "资源", "超参数", "确认提交"\]/);
  assert.doesNotMatch(pagesScript, /自动补强开关|LoRA（推荐）/);
  assert.match(pagesScript, /function trainingLiveModal\(task\)/);
  assert.match(pagesScript, /modal-xwide/);
  assert.match(pagesScript, /setInterval\(\(\) =>/);
  assert.match(pagesScript, /export-training-data/);
  assert.match(pagesScript, /export-training-model/);
  assert.match(styles, /\.modal-xwide/);
  assert.match(styles, /\.steps-6/);
  assert.match(styles, /\.steps > span:not\(:last-child\)::before \{ content: "›"/);
  assert.match(styles, /top: 24px; right: 0; width: 18px; height: 25px/);
  assert.match(styles, /height: 25px; display: grid; place-items: center;[\s\S]*transform: translate\(50%, -50%\)/);
});

test("uses shared token-driven components on inner pages", () => {
  assert.match(styles, /\.app-page \{/);
  assert.match(styles, /\.content-card \{/);
  assert.match(styles, /\.modal-layer \{/);
  assert.match(styles, /\.range-grid \{/);
  assert.match(styles, /\.live-grid \{/);
  assert.match(styles, /var\(--primary\)/);
  assert.doesNotMatch(pagesScript, /#[0-9a-fA-F]{6}/);
});

test("keeps inner pages usable at 1280px desktop width", () => {
  assert.match(styles, /@media \(max-width: 1366px\)/);
  assert.match(styles, /\.is-inner-page \.side-rail \{ width: 216px; \}/);
  assert.match(styles, /\.is-inner-page \.workspace-shell \{ margin-left: 216px; \}/);
  assert.match(styles, /\.range-grid \{ grid-template-columns: repeat\(2, 1fr\); \}/);
  assert.match(styles, /\.doc-grid \{ grid-template-columns: repeat\(2, minmax\(0, 1fr\)\); \}/);
  assert.match(styles, /\.workbench-main \{ grid-template-columns: minmax\(170px,\.52fr\) minmax\(390px,2fr\) minmax\(290px,\.75fr\); gap: 10px; \}/);
  assert.match(styles, /\.modal-layer \{ padding: 18px; \}/);
  assert.match(styles, /\.table-wrap \{[^}]*overflow-x: auto/);
});

test("fits the test-task table at 1280px without low-value columns", () => {
  assert.match(pagesScript, /const tableHeads = \["任务编号", "任务 \/ 场景", "执行体", "运行状态", "判分结果", "数据产物", "操作"\]/);
  assert.match(pagesScript, /colspan="7" class="table-empty"/);
  assert.match(pagesScript, /, "task-table"\)\}\$\{pagination\}/);
  assert.match(styles, /\.task-table \{ min-width: 0; table-layout: fixed; \}/);
  assert.match(styles, /\.task-table th:nth-child\(1\) \{ width: 11%; \}[\s\S]*\.task-table th:nth-child\(2\) \{ width: 22%; \}[\s\S]*\.task-table th:nth-child\(7\) \{ width: 13%; \}/);
  assert.match(styles, /\.task-actions \{[^}]*justify-content: flex-end;[^}]*gap: 8px;/);
  assert.match(pagesScript, /<td class="row-actions"><div class="task-actions task-actions-compact">/);
  assert.match(pagesScript, /taskRunStack\(progress\(x\.progress\)/);
  assert.match(pagesScript, /taskDataStack\(dataTitle/);
  assert.match(styles, /@media \(min-width: 1240px\)/);
  assert.match(styles, /\.task-list-card \.table-wrap \{ overflow-x: hidden; \}/);
  assert.match(styles, /\.task-table td \{ height: auto; min-height: 76px; \}/);
  assert.match(styles, /white-space: normal;[\s\S]*overflow-wrap: anywhere;/);
  assert.doesNotMatch(pagesScript, /<td>\$\{esc\(x\.type\)\}<\/td><td>\$\{esc\(x\.agent\)\}<\/td><td class="mono">\$\{x\.concurrency\}/);
});

test("matches the final requirement-page logic instead of retired variants", () => {
  assert.doesNotMatch(script, /label: "实战演练场"|label: "模型中心"/);
  assert.match(script, /workbench: "测试任务 · 运行工作台"/);
  assert.doesNotMatch(script, /"range-detail": "靶场环境详情"/);
  assert.match(script, /models: "训练任务 · 模型中心"/);
  assert.match(pagesScript, /data-action="training-filter"/);
  assert.match(pagesScript, /data-input="training-query"/);
  assert.match(pagesScript, /class="training-process"/);
  assert.match(pagesScript, /从数据准备到模型产出/);
  assert.doesNotMatch(pagesScript, /data-action="pipeline"/);
  assert.match(pagesScript, /\["evaluating", "评估中"\]/);
  assert.doesNotMatch(pagesScript, /生成评测报告（剩余/);
  assert.match(styles, /\.btn:disabled[\s\S]*var\(--disabled-bg\)/);
  assert.match(pagesScript, /function workbenchPage\(\)/);
  assert.doesNotMatch(pagesScript, /function rangeDetailPage\(\)/);
  assert.match(pagesScript, /function rangeEnvironmentPreviewModal\(id\)/);
  assert.match(pagesScript, /网络靶场目录/);
  assert.match(pagesScript, /range-env-preview/);
  assert.match(pagesScript, /function modelsPage\(\)/);
  assert.match(pagesScript, /type: prefillEnv \? "range" : ""/);
  assert.match(pagesScript, /Benchmark 评测和靶场评测是同级入口/);
  assert.match(pagesScript, /Benchmark Docker 评测/);
  assert.match(pagesScript, /function renderBenchmarkWizardStep\(w\)/);
  assert.match(pagesScript, /benchmarkCreateModes/);
  assert.match(pagesScript, /按目标领域评测/);
  assert.match(pagesScript, /按评测方向评测/);
  assert.match(pagesScript, /两种入口二选一/);
  assert.match(pagesScript, /Benchmark 评测创建方式/);
  assert.match(pagesScript, /请选择一种 Benchmark 评测创建方式/);
  assert.match(pagesScript, /Benchmark 评测 · 选择入口后统一配置/);
  assert.doesNotMatch(pagesScript, /按指定 Benchmark 评测|按指定Benchmark评测/);
  assert.match(pagesScript, /漏洞发现/);
  assert.match(pagesScript, /漏洞复现/);
  assert.match(pagesScript, /漏洞利用/);
  assert.match(pagesScript, /漏洞修复/);
  assert.match(pagesScript, /benchmarkScopeCatalog/);
  assert.match(pagesScript, /data-action="benchmark-create-mode"/);
  assert.match(pagesScript, /data-action="benchmark-target-field"/);
  assert.match(pagesScript, /data-action="benchmark-eval-direction"/);
  assert.match(pagesScript, /data-action="benchmark-scope-group"/);
  assert.match(pagesScript, /data-action="benchmark-scope-item"/);
  assert.doesNotMatch(pagesScript, /data-action="benchmark-domain"/);
  assert.doesNotMatch(pagesScript, /data-action="benchmark-select"/);
  assert.doesNotMatch(pagesScript, /data-action="benchmark-difficulty-filter"/);
  assert.doesNotMatch(pagesScript, /data-action="benchmark-type-filter"/);
  assert.match(pagesScript, /data-action="benchmark-sampling"/);
  assert.doesNotMatch(pagesScript, /Label 筛题/);
  assert.doesNotMatch(pagesScript, /Benchmark 原生 Label/);
  assert.doesNotMatch(pagesScript, /全部原生 Label/);
  assert.doesNotMatch(pagesScript, /不存在的技术领域 Label 不在创建流程中模拟/);
  assert.doesNotMatch(pagesScript, /全部类型 Label/);
  assert.match(pagesScript, /nativeLabelGroups/);
  assert.match(pagesScript, /nativeDependency/);
  assert.match(pagesScript, /optionsByController/);
  assert.doesNotMatch(pagesScript, /data-label-group/);
  assert.match(pagesScript, /目标领域/);
  assert.match(pagesScript, /防护配置/);
  assert.match(pagesScript, /Stack Canary/);
  assert.match(styles, /\.benchmark-label-filter button:disabled/);
  assert.doesNotMatch(pagesScript, /难度 \/ 分级 Label/);
  assert.match(pagesScript, /抽题数量/);
  assert.match(pagesScript, /查看详情/);
  assert.doesNotMatch(pagesScript, /04 生成评测清单/);
  assert.doesNotMatch(pagesScript, /benchmark-result-section/);
  assert.match(pagesScript, /简单随机抽样/);
  assert.match(pagesScript, /全测/);
  assert.match(pagesScript, /单次任务只选择一个评测方向/);
  assert.match(pagesScript, /多方向综合评测将拆分子任务运行/);
  assert.match(pagesScript, /任务族 \+ 防护配置/);
  assert.match(pagesScript, /T5 → T1 利用能力阶梯/);
  assert.match(pagesScript, /L0 自主漏洞发现/);
  assert.match(pagesScript, /L1-L3 输入条件阶梯/);
  assert.match(pagesScript, /Severity \/ CWE \/ 漏洞家族标签/);
  assert.match(pagesScript, /CyberGym · Level 0/);
  assert.match(pagesScript, /CyberGym · Level 1-3/);
  assert.doesNotMatch(pagesScript, /Patch-only \/ E2E \+ S1-S4 验证阶段/);
  assert.match(pagesScript, /function benchmarkDetailPage\(\)/);
  assert.match(pagesScript, /#\/benchmark-detail\?id=/);
  assert.match(pagesScript, /Benchmark 简介/);
  assert.match(pagesScript, /维度介绍/);
  assert.match(pagesScript, /题目总量/);
  assert.match(pagesScript, /评分标准/);
  assert.match(pagesScript, /benchmark-intro-grid/);
  assert.match(pagesScript, /function benchmarkSampleFiles\(suite, sample, domain\)/);
  assert.match(pagesScript, /README\.md/);
  assert.match(pagesScript, /agent_tools\.yaml/);
  assert.match(pagesScript, /result_schema\.json/);
  assert.match(pagesScript, /漏洞描述 \+ Dockerfile \+ Agent 工具集 \+ 验证脚本/);
  assert.match(pagesScript, /function ticketDetailModal\(id\)/);
  assert.match(pagesScript, /function loginPage\(\)/);
  assert.doesNotMatch(pagesScript, /TEST OPERATIONS|RED VS BLUE|研发中 · 预览版/);
});
