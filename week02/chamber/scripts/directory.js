const TIER_LABELS = {
  3: "Gold Member",
  2: "Silver Member",
  1: "Member",
};

async function getMembers() {
  const response = await fetch("data/members.json");
  const data = await response.json();
  return data.members;
}

function memberCardMarkup(member) {
  const tierLabel = TIER_LABELS[member.membership] ?? "Member";

  return `
    <article class="member-card" data-tier="${member.membership}">
      <div class="card-head">
        <div class="card-icon-name">
          <img src="images/${member.image}" alt="" width="36" height="36" loading="lazy" />
          <div>
            <h3 class="member-name">${member.name}</h3>
            <p class="member-tagline">${member.tagline}</p>
          </div>
        </div>
        <span class="tier-badge" data-tier="${member.membership}">${tierLabel}</span>
      </div>
      <div class="card-body">
        <img class="card-photo" src="images/${member.image}" alt="${member.name} logo" width="64" height="64" loading="lazy" />
        <dl class="card-details">
          <div><dt>Address:</dt> <dd>${member.address}</dd></div>
          <div><dt>Phone:</dt> <dd>${member.phone}</dd></div>
          <div><dt>Email:</dt> <dd><a href="mailto:${member.email}">${member.email}</a></dd></div>
          <div><dt>Website:</dt> <dd><a href="${member.website}" target="_blank" rel="noopener">${member.website.replace(/^https?:\/\//, "")}</a></dd></div>
        </dl>
      </div>
    </article>
  `;
}

function renderMembers(members) {
  const directory = document.querySelector("#directory");
  directory.innerHTML = members.map(memberCardMarkup).join("");
}

function setupViewToggle() {
  const directory = document.querySelector("#directory");
  const gridBtn = document.querySelector("#grid-view-btn");
  const listBtn = document.querySelector("#list-view-btn");

  function setView(view) {
    const isGrid = view === "grid";
    directory.classList.toggle("list-view", !isGrid);
    gridBtn.setAttribute("aria-pressed", String(isGrid));
    listBtn.setAttribute("aria-pressed", String(!isGrid));
    localStorage.setItem("chamber-view", view);
  }

  gridBtn.addEventListener("click", () => setView("grid"));
  listBtn.addEventListener("click", () => setView("list"));

  const savedView = localStorage.getItem("chamber-view") || "grid";
  setView(savedView);
}

function setupNavToggle() {
  const toggle = document.querySelector("#nav-toggle");
  const nav = document.querySelector("#primary-nav");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function setupThemeToggle() {
  const toggle = document.querySelector("#theme-toggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
    localStorage.setItem("chamber-theme", theme);
  }

  const saved = localStorage.getItem("chamber-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));

  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

function setFooterInfo() {
  const yearSpan = document.querySelector("#current-year");
  const modifiedSpan = document.querySelector("#last-modified");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
  if (modifiedSpan) {
    modifiedSpan.textContent = document.lastModified;
  }
}

async function init() {
  setupNavToggle();
  setupThemeToggle();
  setFooterInfo();

  try {
    const members = await getMembers();
    renderMembers(members);
    document.querySelector("#result-count").textContent =
      `${members.length} member businesses`;
  } catch (error) {
    document.querySelector("#directory").innerHTML =
      "<p>We couldn't load the member directory right now. Please try again shortly.</p>";
    console.error("Failed to load members:", error);
  }

  setupViewToggle();
}

document.addEventListener("DOMContentLoaded", init);
