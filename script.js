const weekGrid = document.getElementById("weekGrid");
const monthYear = document.getElementById("monthYear");
const weekLabel = document.getElementById("weekLabel");
const STORAGE_PREFIX = "fullmoon.pocketplanner.weeklog";
const WEEK_TITLE_PREFIX = "fullmoon.pocketplanner.weeklog.title";
const weekTitleEl = document.getElementById("weekTitle");


function getStorageKey(date, weekday) {
  const year = date.getFullYear();
  const week = getISOWeekNumber(date);
  return `${STORAGE_PREFIX}-${year}-W${week}-${weekday}`;
}



function getWeekTitleKey(date) {
  const year = date.getFullYear();
  const week = getISOWeekNumber(date);
  return `${WEEK_TITLE_PREFIX}-${year}-W${week}`;
}


let currentDate = new Date();

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return d;
}


weekTitleEl.addEventListener("input", () => {
  const start = startOfWeek(currentDate);
  const key = getWeekTitleKey(start);
  localStorage.setItem(key, weekTitleEl.textContent.trim());
});

weekTitleEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    weekTitleEl.blur();
  }
});


function renderWeek() {
  weekGrid.innerHTML = "";

  const start = startOfWeek(currentDate);
  const today = new Date();

  monthYear.textContent = start.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  const weekNumber = getISOWeekNumber(start);
weekLabel.textContent = `Week ${weekNumber}`;


const titleKey = getWeekTitleKey(start);
const savedTitle = localStorage.getItem(titleKey);

weekTitleEl.textContent = savedTitle || "Week Log";

  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

days.forEach((label, i) => {
  const date = new Date(start);
  date.setDate(start.getDate() + i);

  const isToday =
    date.toDateString() === today.toDateString();

  const row = document.createElement("div");
  row.className = "day" + (isToday ? " today" : "");

  const storageKey = getStorageKey(date, label);
  const savedText = localStorage.getItem(storageKey) || "";

  const textarea = document.createElement("textarea");
  textarea.className = "day-content";
  textarea.spellcheck = false;
  textarea.value = savedText;

  // ✅ SAVE ON INPUT
  textarea.addEventListener("input", () => {
    localStorage.setItem(storageKey, textarea.value);
  });

  row.innerHTML = `
    <div class="day-label">
      <span class="weekday">${label}</span>
      <span class="date-num">${date.getDate()}</span>
    </div>
  `;

  row.appendChild(textarea);
  weekGrid.appendChild(row);
});


}

function getISOWeekNumber(date) {
  const d = new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ));

  // Set to nearest Thursday
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  // Year start
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}


document.getElementById("prevWeek").onclick = () => {
  currentDate.setDate(currentDate.getDate() - 7);
  renderWeek();
};

document.getElementById("nextWeek").onclick = () => {
  currentDate.setDate(currentDate.getDate() + 7);
  renderWeek();
};

document.getElementById("todayBtn").onclick = () => {
  currentDate = new Date();
  renderWeek();
};

renderWeek();

