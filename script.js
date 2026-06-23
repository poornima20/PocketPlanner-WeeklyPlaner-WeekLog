const weekGrid = document.getElementById("weekGrid");
const monthYear = document.getElementById("monthYear");
const weekLabel = document.getElementById("weekLabel");
const STORAGE_PREFIX = "fullmoon.pocketplanner.weeklog";

function getStorageKey(date, weekday) {
  const year = date.getFullYear();
  const week = getISOWeekNumber(date);
  return `${STORAGE_PREFIX}-${year}-W${week}-${weekday}`;
}

let currentDate = new Date();

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return d;
}

function renderWeek() {
  weekGrid.innerHTML = "";

  const start = startOfWeek(currentDate);
  const today = new Date();

  monthYear.textContent = start.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

const end = new Date(start);
end.setDate(start.getDate() + 6);

const startMonth = start.toLocaleDateString("en-US", {
  month: "short"
});

const endMonth = end.toLocaleDateString("en-US", {
  month: "short"
});

weekLabel.textContent =
  `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  days.forEach((label, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    const isToday = date.toDateString() === today.toDateString();

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
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );

  // Set to nearest Thursday
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  // Year start
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

weekLabel.onclick = () => {
  currentDate = new Date();
  renderWeek();
};

document.getElementById("prevWeek").onclick = () => {
  currentDate.setDate(currentDate.getDate() - 7);
  renderWeek();
};

document.getElementById("nextWeek").onclick = () => {
  currentDate.setDate(currentDate.getDate() + 7);
  renderWeek();
};



renderWeek();
