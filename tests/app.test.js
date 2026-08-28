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
  assert.match(script, /name: "资源中心",[\s\S]*?route: "data", label: "数据中心"[\s\S]*?route: "range-hall", label: "靶场大厅"[\s\S]*?route: "gateway", label: "接入网关"/);
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
    "tasks", "range-hall", "confirm", "training", "training-live",
    "data", "gateway", "settings", "login",
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
  assert.match(pagesScript, /const visibleReports = state\.reports\.filter/);
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
  assert.match(pagesScript, /const tableHeads = \["任务编号", "任务 \/ 场景", "执行体", "进度", "状态", ""\]/);
  assert.match(pagesScript, /colspan="6" class="table-empty"/);
  assert.match(pagesScript, /, "task-table"\)\}\$\{pagination\}/);
  assert.match(styles, /\.task-table \{ min-width: 0; table-layout: fixed; \}/);
  assert.match(styles, /\.task-table th:nth-child\(1\) \{ width: 15%; \}[\s\S]*\.task-table th:nth-child\(2\) \{ width: 24%; \}[\s\S]*\.task-table th:nth-child\(6\) \{ width: 18%; \}/);
  assert.match(styles, /\.task-actions \{[^}]*justify-content: flex-end;[^}]*gap: 8px;/);
  assert.match(pagesScript, /<td class="row-actions"><div class="task-actions">/);
  assert.match(styles, /@media \(min-width: 1240px\)/);
  assert.match(styles, /\.task-list-card \.table-wrap \{ overflow-x: hidden; \}/);
  assert.match(styles, /\.task-table td \{ height: 64px; \}/);
  assert.match(styles, /white-space: normal;[\s\S]*overflow-wrap: anywhere;/);
  assert.doesNotMatch(pagesScript, /<td>\$\{esc\(x\.type\)\}<\/td><td>\$\{esc\(x\.agent\)\}<\/td><td class="mono">\$\{x\.concurrency\}/);
});

test("matches the final requirement-page logic instead of retired variants", () => {
  assert.doesNotMatch(script, /label: "实战演练场"|label: "模型中心"/);
  assert.match(script, /workbench: "测试任务 · 运行工作台"/);
  assert.match(script, /"range-detail": "靶场环境详情"/);
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
  assert.match(pagesScript, /function rangeDetailPage\(\)/);
  assert.match(pagesScript, /环境拓扑渲染区/);
  assert.match(pagesScript, /class="realtime-stage topology-placeholder"/);
  assert.match(pagesScript, /function modelsPage\(\)/);
  assert.match(pagesScript, /type: prefillEnv \? "range" : null/);
  assert.match(pagesScript, /type="radio" name="task-question"/);
  assert.match(pagesScript, /if\(w\.type==="eval"\)/);
  assert.match(pagesScript, /function ticketDetailModal\(id\)/);
  assert.match(pagesScript, /function loginPage\(\)/);
  assert.doesNotMatch(pagesScript, /TEST OPERATIONS|RED VS BLUE|研发中 · 预览版/);
});
