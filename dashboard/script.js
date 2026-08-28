const stage = document.querySelector(".stage");
const clock = document.getElementById("clock");
const clockDate = document.getElementById("clock-date");
const eventFeed = document.getElementById("eventFeed");
const capabilityPanel = document.querySelector(".capability-panel");
const rightColumn = document.querySelector(".right-column");

if (capabilityPanel && rightColumn) rightColumn.append(capabilityPanel);

const stageSize = { minWidth: 1920, height: 1080 };

function fitStage() {
  const viewportWidth = Math.max(window.innerWidth, 1);
  const viewportHeight = Math.max(window.innerHeight, 1);
  const scale = Math.max(
    Math.min(viewportWidth / stageSize.minWidth, viewportHeight / stageSize.height),
    0.1,
  );
  const stageWidth = Math.max(stageSize.minWidth, viewportWidth / scale);

  stage.style.setProperty("--stage-width", `${stageWidth.toFixed(2)}px`);
  stage.style.setProperty("--fit-scale", scale.toFixed(4));
}

function syncTopologyPaths() {
  const svg = document.querySelector(".flow-network");
  if (!svg) return;

  const svgRect = svg.getBoundingClientRect();
  const viewBox = (svg.getAttribute("viewBox") || "")
    .trim()
    .split(/\s+/)
    .map(Number);
  if (svgRect.width <= 0 || svgRect.height <= 0 || viewBox.length !== 4) return;

  const [viewX, viewY, viewWidth, viewHeight] = viewBox;
  const format = (value) => String(Number(value.toFixed(1)));
  const rectInViewBox = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    const left = viewX + ((rect.left - svgRect.left) / svgRect.width) * viewWidth;
    const right = viewX + ((rect.right - svgRect.left) / svgRect.width) * viewWidth;
    const top = viewY + ((rect.top - svgRect.top) / svgRect.height) * viewHeight;
    const bottom = viewY + ((rect.bottom - svgRect.top) / svgRect.height) * viewHeight;
    return {
      left,
      right,
      top,
      bottom,
      centerX: (left + right) / 2,
      centerY: (top + bottom) / 2,
    };
  };
  const side = (rect, edge) => {
    if (edge === "left") return { x: rect.left, y: rect.centerY };
    if (edge === "right") return { x: rect.right, y: rect.centerY };
    if (edge === "top") return { x: rect.centerX, y: rect.top };
    return { x: rect.centerX, y: rect.bottom };
  };
  const setPath = (id, path) => document.getElementById(id)?.setAttribute("d", path);
  const setAttackPath = (name, path) => {
    setPath(`flow${name}`, path);
    setPath(`attack${name}`, path);
  };

  const cards = {
    attacker: rectInViewBox(".external-attacker"),
    a1: rectInViewBox(".zone-public"),
    b1: rectInViewBox(".zone-business"),
    c1: rectInViewBox(".zone-gis-service"),
    c2: rectInViewBox(".zone-gis-data"),
    d1: rectInViewBox(".zone-ops"),
    d2: rectInViewBox(".zone-monitor-data"),
  };

  if (cards.a1 && cards.b1 && cards.c1 && cards.c2 && cards.d1 && cards.d2) {
    const a1Right = side(cards.a1, "right");
    const b1Left = side(cards.b1, "left");
    const b1Right = side(cards.b1, "right");
    const c1Left = side(cards.c1, "left");
    const c1Right = side(cards.c1, "right");
    const c2Left = side(cards.c2, "left");
    const d1Left = side(cards.d1, "left");
    const d1Right = side(cards.d1, "right");
    const d2Left = side(cards.d2, "left");
    const branchX = (b1Right.x + c1Left.x) / 2;

    setPath("zoneLinkA1B1", `M${format(a1Right.x)} ${format(a1Right.y)} H${format(b1Left.x)}`);
    setPath("zoneLinkB1C1", `M${format(b1Right.x)} ${format(b1Right.y)} H${format(branchX)} V${format(c1Left.y)} H${format(c1Left.x)}`);
    setPath("zoneLinkC1C2", `M${format(c1Right.x)} ${format(c1Right.y)} H${format(c2Left.x)}`);
    setPath("zoneLinkB1D1", `M${format(b1Right.x)} ${format(b1Right.y)} H${format(branchX)} V${format(d1Left.y)} H${format(d1Left.x)}`);
    setPath("zoneLinkD1D2", `M${format(d1Right.x)} ${format(d1Right.y)} H${format(d2Left.x)}`);
  }

  const icons = {
    react: rectInViewBox('[data-attack-node="react"] .device-icon'),
    dubbo: rectInViewBox('[data-attack-node="dubbo"] .device-icon'),
    geoserver: rectInViewBox('[data-attack-node="geoserver"] .device-icon'),
    postgres: rectInViewBox('[data-attack-node="postgres"] .device-icon'),
    cacti: rectInViewBox('[data-attack-node="cacti"] .device-icon'),
    neo4j: rectInViewBox('[data-attack-node="neo4j"] .device-icon'),
  };

  if (cards.attacker && Object.values(icons).every(Boolean)) {
    const attackerBottom = side(cards.attacker, "bottom");
    const reactTop = side(icons.react, "top");
    const reactRight = side(icons.react, "right");
    const dubboLeft = side(icons.dubbo, "left");
    const dubboRight = side(icons.dubbo, "right");
    const geoserverLeft = side(icons.geoserver, "left");
    const geoserverRight = side(icons.geoserver, "right");
    const postgresLeft = side(icons.postgres, "left");
    const cactiLeft = side(icons.cacti, "left");
    const cactiRight = side(icons.cacti, "right");
    const neo4jLeft = side(icons.neo4j, "left");
    const externalTurnY = attackerBottom.y + 30;
    const gisTurnX = dubboRight.x + 37;
    const dataTurnX = cards.d1.right + 32;

    setAttackPath("ExternalReact", `M${format(attackerBottom.x)} ${format(attackerBottom.y)} V${format(externalTurnY)} H${format(reactTop.x)} V${format(reactTop.y)}`);
    setAttackPath("ReactDubbo", `M${format(reactRight.x)} ${format(reactRight.y)} H${format(dubboLeft.x)}`);
    setAttackPath("DubboGis", `M${format(dubboRight.x)} ${format(dubboRight.y)} H${format(gisTurnX)} V${format(geoserverLeft.y)} H${format(geoserverLeft.x)}`);
    setAttackPath("GisData", `M${format(geoserverRight.x)} ${format(geoserverRight.y)} H${format(postgresLeft.x)}`);
    setAttackPath("DubboOps", `M${format(dubboRight.x)} ${format(dubboRight.y)} H${format(gisTurnX)} V${format(cactiLeft.y)} H${format(cactiLeft.x)}`);
    setAttackPath("OpsData", `M${format(cactiRight.x)} ${format(cactiRight.y)} H${format(dataTurnX)} V${format(neo4jLeft.y)} H${format(neo4jLeft.x)}`);
  }

  const clearClipPath = document.querySelector("#iconClearClip path");
  const iconRects = Array.from(document.querySelectorAll(".topology-zone .device-icon"))
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        left: viewX + ((rect.left - svgRect.left) / svgRect.width) * viewWidth,
        right: viewX + ((rect.right - svgRect.left) / svgRect.width) * viewWidth,
        top: viewY + ((rect.top - svgRect.top) / svgRect.height) * viewHeight,
        bottom: viewY + ((rect.bottom - svgRect.top) / svgRect.height) * viewHeight,
      };
    });
  if (clearClipPath && iconRects.length) {
    const outer = `M${format(viewX)},${format(viewY)} H${format(viewX + viewWidth)} V${format(viewY + viewHeight)} H${format(viewX)} Z`;
    const holes = iconRects.map((rect) => `M${format(rect.left)},${format(rect.top)} H${format(rect.right)} V${format(rect.bottom)} H${format(rect.left)} Z`);
    clearClipPath.setAttribute("d", [outer, ...holes].join(" "));
  }
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function tickClock() {
  const now = new Date();
  clock.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  clockDate.textContent = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function flash(el) {
  el.classList.remove("data-bump");
  void el.offsetWidth;
  el.classList.add("data-bump");
}

function formatNumber(value) {
  return Math.round(value).toLocaleString("en-US");
}

const capabilityAgents = [
  {
    name: "DoGNAVY",
    scenario: "漏洞挖掘 / 利用 / 修复",
    radar: [94, 91, 89, 92, 88],
    efficiency: { time: 2.4, token: 38, cost: 0.84, bars: [76, 83, 69] },
  },
  {
    name: "Claude Mythos Preview",
    scenario: "漏洞挖掘 / 多步规划",
    radar: [91, 88, 86, 89, 84],
    efficiency: { time: 3.1, token: 46, cost: 1.08, bars: [68, 75, 62] },
  },
  {
    name: "GPT-5.6-Sol",
    scenario: "漏洞利用 / 高成功数",
    radar: [92, 94, 90, 91, 93],
    efficiency: { time: 2.8, token: 44, cost: 0.96, bars: [72, 78, 66] },
  },
  {
    name: "OpenCode",
    scenario: "漏洞修复 / 代码补丁",
    radar: [86, 84, 80, 83, 78],
    efficiency: { time: 2.2, token: 32, cost: 0.71, bars: [81, 86, 74] },
  },
  {
    name: "GLM-5.2",
    scenario: "综合评测 / 国产模型",
    radar: [90, 87, 84, 86, 82],
    efficiency: { time: 2.6, token: 35, cost: 0.76, bars: [77, 82, 72] },
  },
];

let capabilityIndex = 0;
let benchmarkFrame = 0;

function jitter(value, spread = 1.2) {
  return Math.max(0, Math.min(100, value + randomBetween(-spread, spread)));
}

const radarCenter = { x: 120, y: 86 };
const radarMaxRadius = 70;
const radarAngles = [-90, -18, 54, 126, 198];

function radarPoint(value, angle) {
  const radius = (value / 100) * radarMaxRadius;
  const rad = (angle * Math.PI) / 180;
  return {
    x: radarCenter.x + Math.cos(rad) * radius,
    y: radarCenter.y + Math.sin(rad) * radius,
  };
}

function radarPoints(values) {
  return values
    .map((value, index) => {
      const point = radarPoint(value, radarAngles[index]);
      return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
    })
    .join(" ");
}

function updateAgentCapability(nextIndex = capabilityIndex) {
  const agent = capabilityAgents[nextIndex % capabilityAgents.length];
  capabilityIndex = nextIndex % capabilityAgents.length;

  const name = document.getElementById("capAgentName");
  const scenario = document.getElementById("capAgentScenario");
  const pager = document.getElementById("agentPager");
  const mean = document.getElementById("capLevelMean");

  if (name) name.textContent = agent.name;
  if (scenario) scenario.textContent = agent.scenario;
  if (pager) pager.textContent = `${pad(capabilityIndex + 1)} / ${pad(capabilityAgents.length)}`;

  const radarValues = agent.radar;
  document.getElementById("capRadarNow")?.setAttribute("points", radarPoints(radarValues));
  document.querySelectorAll("#capRadarDots circle").forEach((dot, index) => {
    const point = radarPoint(radarValues[index] ?? 0, radarAngles[index]);
    dot.setAttribute("cx", point.x.toFixed(1));
    dot.setAttribute("cy", point.y.toFixed(1));
  });

  document.querySelectorAll("[data-radar-score]").forEach((score) => {
    const index = Number(score.dataset.radarScore);
    const value = radarValues[index] ?? 0;
    score.textContent = Math.round(value);
  });

  if (mean) {
    const average = radarValues.reduce((sum, value) => sum + value, 0) / radarValues.length;
    mean.textContent = `平均 ${average.toFixed(1)}`;
  }

  const time = Math.max(0.1, agent.efficiency.time + randomBetween(-0.12, 0.12));
  const token = Math.max(1, Math.round(agent.efficiency.token + randomBetween(-1.5, 1.5)));
  const cost = Math.max(0.01, agent.efficiency.cost + randomBetween(-0.04, 0.04));
  const effTime = document.getElementById("effTime");
  const effToken = document.getElementById("effToken");
  const effCost = document.getElementById("effCost");
  if (effTime) effTime.textContent = `${time.toFixed(1)}s`;
  if (effToken) effToken.textContent = `${token}K`;
  if (effCost) effCost.textContent = `${cost.toFixed(2)}元`;

  document.querySelectorAll("[data-eff-bar]").forEach((row) => {
    const index = Number(row.dataset.effBar);
    const value = jitter(agent.efficiency.bars[index] ?? 0, 1.1);
    const bar = row.querySelector("i");
    const text = row.querySelector("b");
    if (bar) bar.style.width = `${value.toFixed(1)}%`;
    if (text) text.textContent = `${value.toFixed(1)}%`;
  });

  document.querySelectorAll(".agent-dots i").forEach((dot, index) => {
    dot.classList.toggle("is-active", index === capabilityIndex);
  });

}

function updateDynamicValues() {
  const values = document.querySelectorAll("[data-number], [data-percent], [data-decimal], [data-gpu]");
  values.forEach((el, index) => {
    if (Math.random() < 0.18 && index > 6) return;

    const min = Number(el.dataset.min);
    const max = Number(el.dataset.max);
    if (!Number.isFinite(min) || !Number.isFinite(max)) return;

    const value = randomBetween(min, max);
    const suffix = el.dataset.suffix || "";

    if (el.dataset.percent !== undefined) {
      el.textContent = `${value.toFixed(1)}%`;
      const inlineBar = el.closest(".train-line, .terminal-bars div, .efficiency-bars div")?.querySelector("i");
      if (inlineBar) inlineBar.style.width = el.textContent;
    } else if (el.dataset.decimal !== undefined) {
      el.textContent = `${value.toFixed(Number(el.dataset.decimal))}${suffix}`;
    } else if (el.dataset.gpu !== undefined) {
      const intValue = Math.round(value);
      el.textContent = `${intValue}%`;
      const bar = el.parentElement?.querySelector("i");
      if (bar) bar.style.width = `${intValue}%`;
    } else {
      el.textContent = `${formatNumber(value)}${suffix}`;
    }

    flash(el);
  });

  const speedValue = document.querySelector(".speed-row b[data-percent]");
  const speedBar = document.getElementById("trainSpeed");
  if (speedValue && speedBar) {
    speedBar.style.width = speedValue.textContent;
  }

  const progress = document.querySelector(".task-list li:last-child b");
  const donut = document.querySelector(".donut");
  if (progress && donut) {
    donut.style.setProperty("--done", parseFloat(progress.textContent).toFixed(1));
  }
}

function updateProbeValues() {
  document.querySelectorAll("[data-probe]").forEach((el) => {
    const min = Number(el.dataset.min);
    const max = Number(el.dataset.max);
    const value = Math.round(randomBetween(min, max));
    el.textContent = `正常 | ${value}%`;
    flash(el);
  });
}

function updateTimers() {
  const remain = document.getElementById("remainTime");
  const run = document.getElementById("runTime");
  if (!remain || !run) return;

  const parseTime = (text) => {
    const [h, m, s] = text.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };
  const renderTime = (seconds) => {
    const safe = Math.max(seconds, 0);
    const h = Math.floor(safe / 3600);
    const m = Math.floor((safe % 3600) / 60);
    const s = safe % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  remain.textContent = renderTime(parseTime(remain.textContent) - 1);
  run.textContent = renderTime(parseTime(run.textContent) + 1);
}

const sparkSets = {
  loss: Array.from({ length: 24 }, (_, i) => 0.5 - i * 0.012 + Math.sin(i / 2.6) * 0.018 + Math.random() * 0.025),
  reward: Array.from({ length: 24 }, (_, i) => 0.33 + i * 0.012 + Math.sin(i / 2.1) * 0.035 + Math.random() * 0.03),
  success: Array.from({ length: 24 }, (_, i) => 0.44 + i * 0.006 + Math.sin(i / 3) * 0.018 + Math.random() * 0.018),
  delay: Array.from({ length: 24 }, (_, i) => 0.32 + Math.sin(i / 3.2) * 0.14 + Math.random() * 0.025),
};

function renderSparkline(name) {
  const svg = document.querySelector(`[data-spark="${name}"]`);
  const line = svg?.querySelector(".spark-main");
  const referenceLine = svg?.querySelector(".spark-reference");
  const values = sparkSets[name];
  if (!line || !values) return;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const toPoints = (series, yOffset = 0) => series
    .map((rawValue, index) => {
      const value = Math.max(min, Math.min(max, rawValue));
      const x = 8 + (index / (series.length - 1)) * 80;
      const y = 28 - ((value - min) / range) * 18 + yOffset;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const reference = values.map((value, index, all) => {
    const previous = all[Math.max(0, index - 1)];
    const next = all[Math.min(all.length - 1, index + 1)];
    return (previous + value + next) / 3 - (name === "loss" ? -0.012 : 0.018);
  });

  line.setAttribute("points", toPoints(values));
  if (referenceLine) {
    referenceLine.setAttribute("points", toPoints(reference, 1.8));
  }
}

function updateSparklines() {
  Object.keys(sparkSets).forEach((name) => {
    const values = sparkSets[name];
    values.shift();
    const last = values[values.length - 1];
    const drift = name === "loss" ? -0.004 : name === "delay" ? randomBetween(-0.018, 0.018) : 0.005;
    values.push(Math.max(0.08, Math.min(0.92, last + drift + randomBetween(-0.022, 0.022))));
    renderSparkline(name);
  });
}

const events = [
  ["[INFO]", "公网接入区检测到 React 入口探测流量，峰值超出基线阈值"],
  ["[ERROR]", "业务应用区 Dubbo 服务出现疑似远程调用利用痕迹"],
  ["[WARN]", "GIS 服务区 GeoServer 节点触发异常请求防护策略"],
  ["[INFO]", "GIS 数据区 PostgreSQL 访问审计已完成，发现 1 项高危行为"],
  ["[WARN]", "运维监控区 Cacti 平台出现横向移动尝试"],
  ["[INFO]", "监控数据区 Neo4j 图数据库连接策略已同步"],
  ["[ERROR]", "公网接入区诱饵服务捕获异常凭证喷洒行为"],
];

function classForLevel(level) {
  if (level === "[WARN]") return "warn";
  if (level === "[ERROR]") return "err";
  return "";
}

function prependFeed(feed, source, limit) {
  if (!feed) return;
  const [level, message] = source[Math.floor(Math.random() * source.length)];
  const now = new Date();
  const li = document.createElement("li");
  li.className = "flash";
  li.innerHTML = `<b class="${classForLevel(level)}">${level}</b><time>${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}</time><span>${message}</span>`;
  feed.prepend(li);
  while (feed.children.length > limit) {
    feed.lastElementChild.remove();
  }
}

function setupBenchmarkLoop() {
  const track = document.querySelector(".benchmark-track");
  const set = track?.querySelector(".benchmark-set");
  const cards = set?.querySelectorAll(".benchmark-card");
  if (!track || !set || !cards?.length) return;
  syncBenchmarkLoop();
}

function syncBenchmarkLoop() {
  const track = document.querySelector(".benchmark-track");
  const viewport = document.querySelector(".benchmark-viewport");
  if (!track || !viewport) return;

  if (benchmarkFrame) {
    cancelAnimationFrame(benchmarkFrame);
    benchmarkFrame = 0;
  }

  const originalSet = Array.from(track.children).find((child) => (
    child.classList.contains("benchmark-set") && child.dataset.benchmarkClone !== "true"
  ));
  if (!originalSet) return;

  track.querySelectorAll("[data-benchmark-clone='true']").forEach((clone) => clone.remove());
  track.style.animation = "none";
  track.style.transform = "translate3d(0, 0, 0)";

  const setStyles = getComputedStyle(originalSet);
  const gap = Number.parseFloat(setStyles.rowGap || setStyles.gap) || 0;
  const viewportHeight = viewport.getBoundingClientRect().height;
  const visibleHeight = Math.max(0, viewportHeight - 18);
  const originalCards = Array.from(originalSet.children).filter((child) => (
    child.classList.contains("benchmark-card") && child.dataset.benchmarkClone !== "true"
  ));
  if (!visibleHeight || !originalCards.length) return;

  const visibleSlots = Math.min(3, originalCards.length);
  const cardHeight = Math.max(96, (visibleHeight - gap * (visibleSlots - 1)) / visibleSlots);
  track.style.setProperty("--benchmark-card-height", `${cardHeight.toFixed(3)}px`);
  const shift = originalCards.length * cardHeight + originalCards.length * gap;
  track.style.setProperty("--benchmark-shift", `${shift.toFixed(3)}px`);
  track.style.setProperty("--benchmark-duration", `${Math.max(34, shift / 10.5).toFixed(3)}s`);

  const clone = originalSet.cloneNode(true);
  clone.dataset.benchmarkClone = "true";
  clone.setAttribute("aria-hidden", "true");
  track.append(clone);

  void track.offsetHeight;
  track.style.animation = "";
}

function setupTopologyAttack() {
  const revealFrames = new WeakMap();
  const dash = 4;
  const gap = 4;
  const buildDashedReveal = (visible, total) => {
    if (visible <= 0) return `0 ${total.toFixed(1)}`;
    const parts = [];
    let remaining = visible;
    while (remaining > 0.05 && parts.length < 360) {
      const dashPart = Math.min(dash, remaining);
      parts.push(dashPart.toFixed(2));
      remaining -= dashPart;
      if (remaining <= 0.05) break;
      const gapPart = Math.min(gap, remaining);
      parts.push(gapPart.toFixed(2));
      remaining -= gapPart;
    }
    if (parts.length % 2 === 0) parts.push("0.01");
    parts.push(Math.max(total - visible + dash + gap, total).toFixed(1));
    return parts.join(" ");
  };
  const stopDashedReveal = (path) => {
    const frame = revealFrames.get(path);
    if (frame) window.cancelAnimationFrame(frame);
    revealFrames.delete(path);
  };
  const startDashedReveal = (path, length, duration) => {
    stopDashedReveal(path);
    const started = performance.now();
    const run = (now) => {
      const progress = Math.min(1, (now - started) / duration);
      path.style.strokeDasharray = buildDashedReveal(length * progress, length);
      if (progress < 1) {
        revealFrames.set(path, window.requestAnimationFrame(run));
      } else {
        revealFrames.delete(path);
      }
    };
    path.style.strokeDasharray = buildDashedReveal(0, length);
    revealFrames.set(path, window.requestAnimationFrame(run));
  };
  const nodeFlashDuration = 780;
  const postCompromisePause = 180;
  const attackTravelSpeed = 1.2;
  const resetDelay = 5000;
  const attackPlan = [
    {
      id: "react",
      flow: "flowExternalReact",
      attack: "attackExternalReact",
      arrow: "attackArrowExternalReact",
      travelDuration: 1800,
    },
    {
      id: "dubbo",
      flow: "flowReactDubbo",
      attack: "attackReactDubbo",
      arrow: "attackArrowReactDubbo",
      travelDuration: 4100,
    },
    {
      id: "geoserver",
      flow: "flowDubboGis",
      attack: "attackDubboGis",
      arrow: "attackArrowDubboGis",
      travelDuration: 3400,
    },
    {
      id: "postgres",
      flow: "flowGisData",
      attack: "attackGisData",
      arrow: "attackArrowGisData",
      travelDuration: 2900,
    },
    {
      id: "cacti",
      flow: "flowDubboOps",
      attack: "attackDubboOps",
      arrow: "attackArrowDubboOps",
      travelDuration: 4200,
    },
    {
      id: "neo4j",
      flow: "flowOpsData",
      attack: "attackOpsData",
      arrow: "attackArrowOpsData",
      travelDuration: 3400,
    },
  ];
  let sequenceCursor = 0;
  const sequence = attackPlan.map((step) => {
    const startAt = sequenceCursor;
    const hitAt = startAt + step.travelDuration / attackTravelSpeed;
    sequenceCursor = hitAt + nodeFlashDuration + postCompromisePause;
    return { ...step, startAt, hitAt };
  });
  const finalStep = sequence[sequence.length - 1];
  const cycle = finalStep.hitAt + nodeFlashDuration + resetDelay;
  const nodes = new Map(
    Array.from(document.querySelectorAll("[data-attack-node]")).map((node) => [node.dataset.attackNode, node]),
  );
  const flows = new Map(sequence.map((step) => [step.flow, document.getElementById(step.flow)]));
  const attacks = new Map(sequence.map((step) => [step.attack, document.getElementById(step.attack)]));
  const arrows = new Map(sequence.map((step) => [step.arrow, document.getElementById(step.arrow)]));
  if (!nodes.size) return;

  sequence.forEach(({ flow, attack, arrow, startAt, hitAt }) => {
    const flowPath = flows.get(flow);
    const attackPath = attacks.get(attack);
    const attackArrow = arrows.get(arrow);
    const length = flowPath?.getTotalLength?.() || attackPath?.getTotalLength?.() || 420;
    const duration = Math.max(1.5, (hitAt - startAt) / 1000);
    if (attackPath) {
      attackPath.style.setProperty("--attack-length", `${length.toFixed(1)}px`);
      attackPath.style.setProperty("--attack-duration", `${duration.toFixed(2)}s`);
      attackPath.dataset.pathLength = length.toFixed(1);
      attackPath.dataset.attackDuration = String(Math.round(duration * 1000));
    }
    const motion = attackArrow?.querySelector("animateMotion");
    if (motion) {
      motion.setAttribute("dur", `${duration.toFixed(2)}s`);
      motion.setAttribute("repeatCount", "1");
      motion.setAttribute("fill", "freeze");
    }
  });

  const runCycle = () => {
    nodes.forEach((node) => {
      node.classList.remove("is-flashing", "is-compromised");
    });
    flows.forEach((path) => path?.classList.remove("path-attacked"));
    attacks.forEach((path) => {
      if (!path) return;
      stopDashedReveal(path);
      path.classList.remove("is-active", "is-complete");
      path.style.removeProperty("stroke-dasharray");
    });
    arrows.forEach((arrow) => arrow?.classList.remove("is-active"));

    sequence.forEach(({ id, flow, attack, arrow, startAt, hitAt }) => {
      const node = nodes.get(id);
      const flowPath = flows.get(flow);
      const attackPath = attacks.get(attack);
      const attackArrow = arrows.get(arrow);
      window.setTimeout(() => {
        if (attackPath) {
          const length = Number(attackPath.dataset.pathLength || 420);
          const duration = Number(attackPath.dataset.attackDuration || 2800);
          attackPath.classList.remove("is-active", "is-complete");
          attackPath.style.removeProperty("stroke-dasharray");
          void attackPath.getBoundingClientRect();
          attackPath.classList.add("is-active");
          startDashedReveal(attackPath, length, duration);
        }
        attackArrow?.classList.add("is-active");
        attackArrow?.querySelector("animateMotion")?.beginElement();
      }, startAt);
      window.setTimeout(() => {
        if (attackPath) {
          stopDashedReveal(attackPath);
          attackPath.classList.remove("is-active");
          attackPath.style.removeProperty("stroke-dasharray");
          attackPath.classList.add("is-complete");
        }
        attackArrow?.classList.remove("is-active");
        flowPath?.classList.add("path-attacked");
        if (!node) return;
        node.classList.remove("is-compromised");
        node.classList.add("is-flashing");
        window.setTimeout(() => {
          node.classList.remove("is-flashing");
          node.classList.add("is-compromised");
        }, nodeFlashDuration);
      }, hitAt);
    });
  };

  runCycle();
  window.setInterval(runCycle, cycle);
}

function init() {
  fitStage();
  syncTopologyPaths();
  setupTopologyAttack();
  tickClock();
  updateSparklines();
  updateAgentCapability(0);

  window.addEventListener("resize", () => {
    fitStage();
    syncTopologyPaths();
    syncBenchmarkLoop();
  }, { passive: true });
  document.fonts?.ready?.then(() => {
    window.requestAnimationFrame(() => {
      syncTopologyPaths();
      syncBenchmarkLoop();
    });
  });
  setInterval(tickClock, 1000);
  setInterval(updateTimers, 1000);
  setInterval(updateDynamicValues, 1900);
  setInterval(updateProbeValues, 2600);
  setInterval(() => updateAgentCapability(capabilityIndex + 1), 4200);
  setInterval(updateSparklines, 1600);
  setInterval(() => prependFeed(eventFeed, events, 4), 3200);
}

init();
