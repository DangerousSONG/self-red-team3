"use strict";

const navigationGroups = [
  {
    name: null,
    items: [{ route: "dashboard", label: "态势感知", icon: "layout-dashboard" }],
  },
  {
    name: "操作中心",
    items: [
      { route: "tasks", label: "测试任务", icon: "clipboard-list" },
      { route: "training", label: "训练任务", icon: "cpu" },
    ],
  },
  {
    name: "资源中心",
    items: [
      { route: "data", label: "数据中心", icon: "database" },
      { route: "range-hall", label: "靶场大厅", icon: "boxes" },
      { route: "gateway", label: "接入网关", icon: "cable" },
      { route: "settings", label: "用户设置", icon: "user-cog" },
    ],
  },
];

const iconShapes = {
  "layout-dashboard": '<rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect>',
  "clipboard-list": '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path>',
  boxes: '<path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"></path><path d="m7 16.5-4.74-2.85"></path><path d="m7 16.5 5-3"></path><path d="M7 16.5v5.17"></path><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"></path><path d="m17 16.5-5-3"></path><path d="m17 16.5 4.74-2.85"></path><path d="M17 16.5v5.17"></path><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"></path><path d="M12 8 7.26 5.15"></path><path d="m12 8 4.74-2.85"></path><path d="M12 13.5V8"></path>',
  "badge-check": '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m9 12 2 2 4-4"></path>',
  "brain-circuit": '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M9 13a4.5 4.5 0 0 0 3-4"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M12 13h4"></path><path d="M12 18h6a2 2 0 0 1 2 2v1"></path><path d="M12 8h8"></path><path d="M16 8V5a2 2 0 0 1 2-2"></path><circle cx="16" cy="13" r=".5"></circle><circle cx="18" cy="3" r=".5"></circle><circle cx="20" cy="21" r=".5"></circle><circle cx="20" cy="8" r=".5"></circle>',
  cpu: '<rect width="16" height="16" x="4" y="4" rx="2"></rect><rect width="6" height="6" x="9" y="9" rx="1"></rect><path d="M15 2v2"></path><path d="M15 20v2"></path><path d="M2 15h2"></path><path d="M2 9h2"></path><path d="M20 15h2"></path><path d="M20 9h2"></path><path d="M9 2v2"></path><path d="M9 20v2"></path>',
  activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path>',
  cable: '<path d="M17 19a1 1 0 0 1-1-1v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1z"></path><path d="M17 21v-2"></path><path d="M19 14V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V10"></path><path d="M21 21v-2"></path><path d="M3 5V3"></path><path d="M4 10a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2z"></path><path d="M7 5V3"></path>',
  "user-cog": '<path d="M10 15H6a4 4 0 0 0-4 4v2"></path><path d="m14.305 16.53.923-.382"></path><path d="m15.228 13.852-.923-.383"></path><path d="m16.852 12.228-.383-.923"></path><path d="m16.852 17.772-.383.924"></path><path d="m19.148 12.228.383-.923"></path><path d="m19.53 18.696-.382-.924"></path><path d="m20.772 13.852.924-.383"></path><path d="m20.772 16.148.924.383"></path><circle cx="18" cy="15" r="3"></circle><circle cx="9" cy="7" r="4"></circle>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>',
};

function iconMarkup(name, className = "menu-icon") {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconShapes[name]}</svg>`;
}

const navigationItems = navigationGroups.flatMap((group) => group.items.flatMap((item) => (
  item.children ? item.children : [item]
)));

const routeLabels = {
  ...Object.fromEntries(navigationItems.map((item) => ([item.route, item.pageLabel || item.label]))),
  workbench: "测试任务 · 运行工作台",
  confirm: "测试任务 · 结果确认",
  "training-live": "训练任务 · 实时监控",
  "range-detail": "靶场环境详情",
  models: "训练任务 · 模型中心",
  login: "SSO 登录",
};

const app = document.querySelector("#app");
const brandSymbol = document.querySelector("#brand-symbol");
const navRoot = document.querySelector("#main-nav");
const pageRoot = document.querySelector("#page-root");

function renderNavigation() {
  navRoot.innerHTML = navigationGroups.map((group) => `
    <section class="nav-section" aria-label="${group.name || "主导航"}">
      ${group.name ? `<span class="nav-caption">${group.name}</span>` : ""}
      ${group.items.map((item) => item.children ? `
        <section class="nav-tree" data-menu="${item.id}" aria-label="${item.label}">
          <a class="nav-parent" href="#/${item.children[0].route}" aria-label="${item.label}" data-parent-route="${item.children[0].route}" data-tooltip="${item.label}">
            ${iconMarkup(item.icon)}
            <span>${item.label}</span>
            <span class="nav-caret" aria-hidden="true">▾</span>
          </a>
          <div class="nav-children">
            ${item.children.map((child) => `
              <a class="nav-child" href="#/${child.route}" data-route="${child.route}" aria-label="${child.pageLabel || child.label}">
                <span>${child.label}</span>
                ${child.count ? `<b>${child.count}</b>` : ""}
              </a>
            `).join("")}
          </div>
        </section>
      ` : `
        <a class="${item.nested ? "nav-child" : ""}" href="#/${item.route}" data-route="${item.route}" aria-label="${item.pageLabel || item.label}" data-tooltip="${item.label}">
          ${iconMarkup(item.icon)}
          <span>${item.label}</span>
          ${item.count ? `<b>${item.count}</b>` : ""}
        </a>
      `).join("")}
    </section>
  `).join("");
}

function dashboardPage() {
  return `
    <section class="dashboard-screen" aria-label="态势感知总览">
      <iframe
        class="dashboard-frame"
        src="dashboard/index.html"
        title="靶场实时攻防态势总览"
        loading="eager"
      ></iframe>
    </section>
  `;
}

function currentRoute() {
  const requested = (window.location.hash.replace(/^#\/?/, "") || "dashboard").split("?")[0];
  return routeLabels[requested] ? requested : "dashboard";
}

function renderRoute() {
  const route = currentRoute();
  const dashboard = route === "dashboard";
  const navRoute = route === "workbench" || route === "confirm" ? "tasks" : route === "range-detail" ? "range-hall" : route === "training-live" || route === "models" ? "training" : route;

  app.classList.toggle("is-dashboard", dashboard);
  app.classList.toggle("is-inner-page", !dashboard);
  app.classList.toggle("is-auth", route === "login");
  document.title = `${routeLabels[route]} · 网安攻防演练场`;
  if (dashboard) pageRoot.innerHTML = dashboardPage();
  else window.RangePages.render(route, pageRoot);

  navRoot.querySelectorAll("[data-route]").forEach((link) => {
    const active = link.dataset.route === navRoute;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  navRoot.querySelectorAll(".nav-tree").forEach((tree) => {
    tree.classList.toggle("has-active-child", Boolean(tree.querySelector("[data-route].active")));
  });

  window.scrollTo({ top: 0, behavior: "auto" });
}

brandSymbol.innerHTML = iconMarkup("shield", "brand-icon");
renderNavigation();
renderRoute();
requestAnimationFrame(() => {
  requestAnimationFrame(() => app.classList.remove("is-booting"));
});
window.addEventListener("hashchange", renderRoute);
document.querySelector(".account-block button")?.addEventListener("click", () => {
  window.location.hash = "#/settings";
});
