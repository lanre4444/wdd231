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

async function initDirectory() {
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

document.addEventListener("DOMContentLoaded", initDirectory);