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

function setupNavToggle() {
    const toggle = document.querySelector("#nav-toggle");
    const nav = document.querySelector("#primary-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
        });
    });
}

function setupThemeToggle() {
    const toggle = document.querySelector("#theme-toggle");
    if (!toggle) return;
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

function initCommon() {
    setupNavToggle();
    setupThemeToggle();
    setFooterInfo();
}

document.addEventListener("DOMContentLoaded", initCommon);