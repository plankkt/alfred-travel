import { routes, itinerary } from "./routes.js";
const params = new URLSearchParams(location.search);
const tripId = Object.hasOwn(routes, params.get("trip"))
  ? params.get("trip")
  : "rome";
const route = routes[tripId];
const { trip, scenarios } = itinerary(route);
const storageKey =
  tripId === "rome" ? "alfred-trip-v1" : "alfred-trip-v1-" + tripId;
const selector = document.querySelector("#destination");
for (const [id, item] of Object.entries(routes))
  selector.add(new Option(item.city + " — " + item.town, id));
selector.value = tripId;
selector.onchange = () => {
  params.set("trip", selector.value);
  location.search = params;
};
for (const link of document.querySelectorAll('a[href^="?page="]')) {
  const target = new URL(link.href);
  target.searchParams.set("trip", tripId);
  link.href = target;
}
document.querySelector(".cover-title p").textContent =
  route.country + " / Ноябрь 2026";
document.querySelector(".cover-title h1").textContent =
  route.city + " и " + route.town;
document.querySelector(".boarding strong").textContent = "SVO → " + route.code;
document.querySelector(".boarding span").textContent =
  "Москва → " + route.city + " · 12–18 ноября";
document.querySelector("#demoTitle").textContent =
  "События рейса " + route.flight;
document
  .querySelector(".hero")
  .style.setProperty("--destination-photo", `url("./assets/${tripId}.jpg")`);
const state = {
  scenario: "normal",
  online: true,
  selectedOption: null,
  queuedAlert: false,
  flightStatus: null,
};
let latestRequest = 0;
const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );

function notify(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove("visible"), 3500);
}

function formatSourceTime(value, timeZone, zoneLabel) {
  if (!value) return "нет данных";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "нет данных";
  const time = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  }).format(date);
  return `${time} ${zoneLabel}`;
}

async function loadFlightStatus(scenario) {
  // На статическом хостинге используем тот же источник, что и локальный API.
  if (location.hostname.endsWith(".github.io")) {
    const response = await fetch("./data/flight-statuses.json");
    if (!response.ok) throw new Error("Не удалось загрузить статус");
    const data = (await response.json())[tripId];
    return {
      flightId: data.flightId,
      scheduled: data.scheduled,
      ...data.scenarios[scenario],
    };
  }
  const response = await fetch(
    `/api/flight-status?trip=${tripId}&scenario=${encodeURIComponent(scenario)}`,
    { cache: "no-store" },
  );
  if (!response.ok) throw new Error("Не удалось получить статус рейса");
  const data = await response.json();
  if (data.flightId !== route.flight.replace(" ", "") + "-2026-11-12")
    throw new Error("Ответ относится к другому рейсу");
  return data;
}

function currentPlan() {
  const option = state.selectedOption;
  const plan = structuredClone(trip);
  if (!option && !state.queuedAlert) {
    if (state.scenario === "delay") plan.flight.time = "10:20–15:00";
    if (state.scenario === "cancel") plan.flight.time = "отменён";
  }
  if (!option) return plan;
  plan.flight.time = option.flightTime;
  plan.flight.title = option.flightTitle || plan.flight.title;
  plan.flight.date = option.flightDate || plan.flight.date;
  plan.transfer.time = option.transferTime;
  plan.transfer.title = option.transferTitle || plan.transfer.title;
  plan.transfer.detail = option.transferDetail || plan.transfer.detail;
  plan.transfer.date = option.transferDate || plan.transfer.date;
  plan.hotel.time = option.hotelTime;
  plan.hotel.date = option.hotelDate || plan.hotel.date;
  plan.activity.time = option.activityTime;
  plan.activity.date = option.activityDate || plan.activity.date;
  plan.activity.title = option.activityTitle;
  return plan;
}

function renderTimeline() {
  const plan = currentPlan();
  $("#timeline").innerHTML = Object.entries(plan)
    .map(
      ([key, event]) => `
    <article class="timeline-item">
      <div class="board-type">${{ flight: "Авиа", transfer: "Дорога", hotel: "Отель", activity: "Досуг" }[key]}</div>
      <div class="event-main"><strong>${escapeHtml(event.title)}</strong><p>${escapeHtml(event.detail)}</p></div>
      <div class="event-time ${state.selectedOption ? "changed" : ""}">${escapeHtml(event.time)}<small>${escapeHtml(event.date)}</small></div>
    </article>`,
    )
    .join("");
  const label = $("#planStatus");
  label.textContent = state.selectedOption
    ? "План обновлён"
    : state.queuedAlert
      ? "Ожидает подключения"
      : state.scenario === "normal"
        ? "Всё по плану"
        : "Нужен выбор";
  label.classList.toggle("changed", state.scenario !== "normal");
}

function renderAlert() {
  const section = $("#alertSection");
  if (state.scenario === "normal" || state.queuedAlert) {
    section.innerHTML = "";
    return;
  }
  const scenario = scenarios[state.scenario];
  const title = state.selectedOption
    ? "Новый вариант добавлен в план группы"
    : scenario.title;
  const message = state.selectedOption
    ? `Вы выбрали «${state.selectedOption.title}». Время трансфера, заселения и прогулки обновлено для всех участников.`
    : scenario.message;
  const sourceTime = formatSourceTime(
    state.flightStatus?.sourceUpdatedAt,
    "Europe/Moscow",
    "MSK",
  );
  const receivedTime = formatSourceTime(
    state.flightStatus?.receivedAt,
    "Europe/Moscow",
    "MSK",
  );
  section.innerHTML = `<div class="alert ${state.scenario === "cancel" ? "cancel" : ""}"><span class="alert-icon">${state.selectedOption ? "✓" : "!"}</span><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p><small>Источник обновил: ${escapeHtml(sourceTime)} · получено: ${escapeHtml(receivedTime)} · данные могут поступать с задержкой</small></div></div>`;
}

function renderOptions() {
  const container = $("#alternativesContent");
  if (state.scenario === "normal") {
    $("#optionCount").textContent = "Пока нет изменений";
    container.innerHTML =
      '<div class="empty-options">Если рейс изменится, здесь появятся проверенные варианты.</div>';
    return;
  }
  if (state.queuedAlert) {
    $("#optionCount").textContent = "Ожидает подключения";
    container.innerHTML =
      '<div class="empty-options">Нет сети. Новые варианты появятся после подключения.</div>';
    return;
  }
  const scenario = scenarios[state.scenario];
  // Время отправления указано в местной зоне Рима. Разность ISO-дат
  // даёт минуты ожидания независимо от часового пояса ноутбука.
  const departures = {
    "late-transfer": "2026-11-12T16:30:00+01:00",
    coach: "2026-11-12T18:00:00+01:00",
    train: "2026-11-12T17:20:00+01:00",
  };
  const options = scenario.options.flatMap((option) => {
    if (!departures[option.id]) return [option];
    const minutes =
      (Date.parse(departures[option.id]) -
        Date.parse(state.flightStatus?.estimatedArrival)) /
      60000;
    if (!Number.isFinite(minutes) || minutes < 60) return [];
    return [
      {
        ...option,
        checks: [
          ...option.checks.slice(0, 2),
          `До отправления: ${minutes} мин`,
        ],
      },
    ];
  });
  $("#optionCount").textContent = `Доступно: ${options.length}`;
  container.innerHTML = `<div class="option-list">${options
    .map(
      (option) => `
    <article class="option-card ${state.selectedOption?.id === option.id ? "chosen" : ""} ${option.recommended ? "recommended" : ""}">
      <div><small class="fare-kind">${escapeHtml(option.kind)}</small><div class="option-top"><strong>${escapeHtml(option.title)}</strong>${option.recommended ? '<span class="option-badge">Рекомендуем</span>' : ""}</div><p>${escapeHtml(option.details)}</p><div class="checks">${option.checks.map((check) => `<span class="check">✓ ${escapeHtml(check)}</span>`).join("")}</div></div>
      <div class="option-action"><strong>${escapeHtml(option.price)}</strong><button type="button" data-option="${escapeHtml(option.id)}" ${state.selectedOption?.id === option.id ? "disabled" : ""}>${state.selectedOption?.id === option.id ? "В плане ✓" : "В план →"}</button></div>
    </article>`,
    )
    .join("")}
    <article class="option-card rejected"><div><div class="option-top"><strong>${escapeHtml(scenario.rejected.title)}</strong><span class="check">Исключён</span></div><p>${escapeHtml(scenario.rejected.reason)}</p></div></article></div>
    <p class="activity-note">Цены и наличие мест в демо условные. Перед бронированием нужна повторная проверка у поставщика.</p>`;
}

function render() {
  renderTimeline();
  $("#coverStatus").textContent = $("#planStatus").textContent;
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    /* Хранилище может быть отключено. */
  }
  renderAlert();
  renderOptions();
  document
    .querySelectorAll("[data-scenario]")
    .forEach((button) =>
      button.classList.toggle(
        "selected",
        button.dataset.scenario === state.scenario &&
          state.scenario !== "normal",
      ),
    );
  const connectionButton = $("#connectionButton");
  connectionButton.textContent = state.online ? "● В сети" : "● Оффлайн";
  connectionButton.classList.toggle("offline", !state.online);
  connectionButton.setAttribute("aria-pressed", String(!state.online));
}

document.addEventListener("click", async (event) => {
  const scenarioButton = event.target.closest("[data-scenario]");
  if (scenarioButton) {
    const requestedScenario = scenarioButton.dataset.scenario;
    const requestId = ++latestRequest;
    document.querySelectorAll("[data-scenario]").forEach((button) => {
      button.disabled = true;
    });
    try {
      const status = await loadFlightStatus(requestedScenario);
      if (requestId !== latestRequest) return;
      state.scenario = requestedScenario;
      state.flightStatus = status;
      state.selectedOption = null;
      state.queuedAlert = !state.online && requestedScenario !== "normal";
      render();
      if (state.queuedAlert)
        notify("Уведомление сохранено и появится после подключения");
    } catch (error) {
      notify(error.message);
    } finally {
      document.querySelectorAll("[data-scenario]").forEach((button) => {
        button.disabled = false;
      });
    }
    return;
  }
  const optionButton = event.target.closest("[data-option]");
  if (optionButton) {
    state.selectedOption =
      scenarios[state.scenario].options.find(
        (option) => option.id === optionButton.dataset.option,
      ) || null;
    render();
    notify("Общий план путешествия обновлён");
  }
});

$("#connectionButton").addEventListener("click", () => {
  state.online = !state.online;
  if (state.online && state.queuedAlert) {
    state.queuedAlert = false;
    notify("Уведомление о рейсе доставлено");
  }
  render();
});

try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved && ["normal", "delay", "cancel"].includes(saved.scenario)) {
    Object.assign(state, saved);
    state.selectedOption =
      scenarios[state.scenario]?.options.find(
        (option) => option.id === saved.selectedOption?.id,
      ) || null;
  }
} catch {
  /* Повреждённый снимок не мешает открыть исходный маршрут. */
}

const pages = [...document.querySelectorAll("[data-page]")];
const requestedPage = new URLSearchParams(location.search).get("page");
const activePage =
  pages.find((page) => page.dataset.page === requestedPage) || pages[0];
for (const page of pages) page.hidden = page !== activePage;
const activeLink = document.querySelector(
  `[data-link="${activePage.dataset.page}"]`,
);
activeLink.setAttribute("aria-current", "page");
document.title = activeLink.querySelector("span").textContent + " · Альфред";

render();
