const trip = {
  flight: {
    title: "Рейс SU 2402 · Москва → Рим",
    detail: "Шереметьево → Фьюмичино · 3 путешественника",
    time: "10:20–12:00",
    date: "12 ноября",
    icon: "✈",
  },
  transfer: {
    title: "Трансфер · Рим → Флоренция",
    detail: "Встреча у выхода B · 3 места и 3 чемодана",
    time: "13:30–16:30",
    date: "12 ноября",
    icon: "↗",
  },
  hotel: {
    title: "Заселение · Hotel Arno",
    detail: "Флоренция · бронь для 3 гостей",
    time: "с 18:00",
    date: "12 ноября",
    icon: "⌂",
  },
  activity: {
    title: "Прогулка по центру Флоренции",
    detail: "Для всей группы",
    time: "19:30",
    date: "12 ноября",
    icon: "☼",
  },
};

const scenarios = {
  delay: {
    title: "Рейс SU 2402 задерживается на 3 часа",
    message:
      "Ожидаемое прибытие в Рим — 15:00. Трансфер в 13:30 больше не подходит. Мы нашли варианты для всей группы.",
    options: [
      {
        id: "late-transfer",
        kind: "Трансфер",
        title: "Новый трансфер в 16:30",
        details: "Рим → Флоренция · прибытие около 19:30",
        price: "€165",
        recommended: true,
        checks: ["3 места", "3 чемодана", "Запас 1 ч 30 мин"],
        flightTime: "10:20–15:00",
        transferTime: "16:30–19:30",
        hotelTime: "после 19:30",
        activityTime: "10:00",
        activityDate: "13 ноября",
        activityTitle: "Прогулка по центру Флоренции · перенесена",
      },
      {
        id: "train",
        transferDetail: "Отправление с вокзала Roma Termini",
        kind: "Поезд",
        title: "Поезд через Roma Termini",
        details: "Аэропорт → вокзал → Флоренция · прибытие около 20:05",
        price: "€126",
        checks: ["3 места", "Багаж разрешён", "Запас 1 ч 10 мин"],
        flightTime: "10:20–15:00",
        transferTime: "17:20–20:05",
        transferTitle: "Поезд · Рим → Флоренция",
        hotelTime: "после 20:05",
        activityTime: "10:00",
        activityDate: "13 ноября",
        activityTitle: "Прогулка по центру Флоренции · перенесена",
      },
      {
        id: "coach",
        kind: "Автобус",
        title: "Вечерний автобус",
        details: "Фьюмичино → Флоренция · прямой маршрут",
        price: "€84 за группу",
        checks: ["3 места", "3 чемодана"],
        flightTime: "10:20–15:00",
        transferTitle: "Автобус · Рим → Флоренция",
        transferDetail: "Автостанция аэропорта · 3 билета с багажом",
        transferTime: "18:00–21:40",
        hotelTime: "после 21:40",
        activityTitle: "Прогулка у моста Понте-Веккьо",
        activityDate: "13 ноября",
        activityTime: "11:00",
      },
    ],
    rejected: {
      title: "Трансфер в 15:20",
      reason:
        "Не подходит: всего 20 минут после прилёта на паспортный контроль и получение багажа.",
    },
  },
  cancel: {
    title: "Рейс SU 2402 отменён",
    message:
      "Первоначальный маршрут больше недоступен. Мы проверили рейсы, пересадки и дальнейший план группы.",
    options: [
      {
        id: "replacement-flight",
        kind: "Рейс",
        title: "Рейс SU 2406 · вылет в 13:40",
        details: "Москва → Рим · прибытие в 16:20",
        price: "от €420 / чел.",
        recommended: true,
        checks: ["3 места", "3 чемодана", "Без транзитной визы"],
        flightTime: "13:40–16:20",
        flightTitle: "Рейс SU 2406 · Москва → Рим",
        transferTime: "18:00–21:00",
        transferTitle: "Трансфер · Рим → Флоренция",
        hotelTime: "после 21:00",
        activityTime: "10:00",
        activityDate: "13 ноября",
        activityTitle: "Прогулка по центру Флоренции · перенесена",
      },
      {
        id: "next-day",
        kind: "Рейс",
        title: "Рейс на следующее утро",
        details: "Москва → Рим · 13 ноября, прибытие в 11:15",
        price: "от €310 / чел.",
        checks: ["3 места", "3 чемодана", "Без транзитной визы"],
        flightTime: "08:50–11:15",
        flightDate: "13 ноября",
        flightTitle: "Рейс SU 2410 · Москва → Рим",
        transferTime: "13:00–16:00",
        transferDate: "13 ноября",
        hotelTime: "после 16:00",
        hotelDate: "13 ноября",
        activityTime: "10:00",
        activityDate: "14 ноября",
        activityTitle: "Прогулка по центру Флоренции · перенесена",
      },
      {
        id: "evening-flight",
        kind: "Рейс",
        title: "Вечерний вылет в Рим",
        details: "Москва → Рим · прямой рейс в тот же день",
        price: "от €355 / чел.",
        checks: ["3 места", "3 чемодана", "Без транзита"],
        flightTime: "16:00–18:30",
        flightTitle: "Рейс SU 2412 · Москва → Рим",
        transferTime: "20:00–23:00",
        hotelTime: "после 23:00",
        activityTitle: "Утренняя прогулка по Флоренции",
        activityDate: "13 ноября",
        activityTime: "11:30",
      },
    ],
    rejected: {
      title: "Рейс через Стамбул",
      reason:
        "Для указанного профиля группы требуется дополнительная проверка транзитных условий.",
    },
  },
};

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
    const data = await response.json();
    return {
      flightId: data.flightId,
      scheduled: data.scheduled,
      ...data.scenarios[scenario],
    };
  }
  const response = await fetch(
    `/api/flight-status?scenario=${encodeURIComponent(scenario)}`,
    { cache: "no-store" },
  );
  if (!response.ok) throw new Error("Не удалось получить статус рейса");
  const data = await response.json();
  if (data.flightId !== "SU2402-2026-11-12")
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
    localStorage.setItem("alfred-trip-v1", JSON.stringify(state));
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
  const saved = JSON.parse(localStorage.getItem("alfred-trip-v1"));
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
