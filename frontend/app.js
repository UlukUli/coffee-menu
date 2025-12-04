const API_BASE = "";

let currentLang = "ru";
let categoriesCache = [];
let currentCategory = null;

// ====== ТЕКСТЫ ======
const TEXTS = {
  ru: {
    langLabel: "RU",
    langTitle: "Выберите язык / Choose language",
    categoriesTitle: "Категории меню",
    itemsSubtitlePrefix: "Категория:",
    backToLang: "← К выбору языка",
    backToCategories: "← Назад к категориям",
    priceSuffix: "сом",
    breadcrumbRoot: "Меню",
    breadcrumbBonus: "Бонусы",
    loadingCategories: "Загрузка категорий...",
    loading: "Загрузка...",
    loadError: "Ошибка загрузки",
    getBonuses: "Получить бонусы",

    bonusTitle: "Бонус-игры",
    bonusSubtitle:
      "Выберите мини-игру, набирайте очки и получайте кофейные бонусы.",
    runnerTab: "☕ Кофе раннер",
    cookieTab: "🍪 Лови печеньку",

    timerSuffix: " c",
    totalBonusesLabel: "🎁 Бонус-коды:",
    scoreLabel: "⭐ Очки:",
    runnerHint:
      "ПК: пробел / ↑ чтобы прыгать. Телефон: тап по игровому полю.",
    cookieHint:
      "ПК: стрелки ← → или A/D. Телефон: тапни слева/справа от кружки.",
    runnerControls:
      "ПК: пробел / ↑ чтобы прыгать. Телефон: тап по зоне игры. Сессия ≈45 c.",
    cookieControls:
      "ПК: стрелки ← → или A/D. Телефон: тапни слева/справа от кружки. Сессия ≈40 c.",

    startGame: "Начать игру",
    backToMenu: "← Назад к меню",
    namePlaceholder: "Ваше имя для сохранения бонусов",

    myBonusesTitle: "Мои бонусы",
    noBonuses: "У вас пока нет бонусов.",

    noBonusMsg:
      "Спасибо за игру! В этот раз бонус не начислен, но попробуйте ещё ☕",
    dailyLimitMsg:
      "Вы уже получили максимум бонусов на сегодня. Приходите завтра ☕",

    bonusLevelNames: {
      none: "Без бонуса",
      bronze: "Бронзовый",
      silver: "Серебряный",
      gold: "Золотой",
      diamond: "Алмазный",
    },

    modalOk: "Понятно",
    modalTitleBonus: "Ваш кофейный бонус",
    modalTitleNoBonus: "Без бонуса",
    modalDailyLimitTitle: "Лимит на сегодня",
    modalDailyLimitText:
      "Вы уже получили максимум бонусов на сегодня. Приходите завтра ☕",
    modalScoreLabel: "Набрано очков",
    modalValidUntil: "Срок действия до",

    instructionTitle: "Как получить бонус",
    instructionRunner:
      "Собирайте зёрна (+1) и чашки (+3). Избегайте коробок (−5) и луж пролитого кофе (−10). " +
      "30+ очков — бронзовый бонус, 60+ — серебряный, 100+ — золотой, 150+ — алмазный.",
    instructionCookie:
      "Ловите хорошие десерты: печенька (+1), пончик (+2), круассан (+3). " +
      "Пропустили хороший десерт — −1 очко. Поймали «мусор»/горелую печеньку — −4. " +
      "30+ очков — бронза, 60+ — серебро, 100+ — золото, 150+ — алмаз.",
  },

  en: {
    langLabel: "EN",
    langTitle: "Choose language",
    categoriesTitle: "Menu categories",
    itemsSubtitlePrefix: "Category:",
    backToLang: "← Back to language",
    backToCategories: "← Back to categories",
    priceSuffix: "KGS",
    breadcrumbRoot: "Menu",
    breadcrumbBonus: "Bonuses",
    loadingCategories: "Loading categories...",
    loading: "Loading...",
    loadError: "Load error",
    getBonuses: "Get bonuses",

    bonusTitle: "Bonus games",
    bonusSubtitle: "Choose a mini game, score points and get a coffee bonus.",
    runnerTab: "☕ Coffee Runner",
    cookieTab: "🍪 Catch the Cookie",

    timerSuffix: " s",
    totalBonusesLabel: "🎁 Bonus codes:",
    scoreLabel: "⭐ Score:",
    runnerHint:
      "Desktop: Space / ↑ to jump. Mobile: tap the game field to jump.",
    cookieHint:
      "Desktop: arrows ← → or A/D. Mobile: tap left/right side of the game.",
    runnerControls:
      "Desktop: Space / ↑ to jump. Mobile: tap the game field. Session ≈45 s.",
    cookieControls:
      "Desktop: arrows ← → or A/D. Mobile: tap left/right area. Session ≈40 s.",

    startGame: "Start game",
    backToMenu: "← Back to menu",
    namePlaceholder: "Your name for saving bonuses",

    myBonusesTitle: "My bonuses",
    noBonuses: "You don't have any bonuses yet.",

    noBonusMsg: "Thanks for playing! No bonus this time, try again ☕",
    dailyLimitMsg:
      "You already got the maximum bonuses for today. Come back tomorrow ☕",

    bonusLevelNames: {
      none: "No bonus",
      bronze: "Bronze",
      silver: "Silver",
      gold: "Gold",
      diamond: "Diamond",
    },

    modalOk: "Got it",
    modalTitleBonus: "Your coffee bonus",
    modalTitleNoBonus: "No bonus this time",
    modalDailyLimitTitle: "Daily limit",
    modalDailyLimitText:
      "You already got the maximum bonuses for today. Come back tomorrow ☕",
    modalScoreLabel: "Score",
    modalValidUntil: "Valid until",

    instructionTitle: "How to earn a bonus",
    instructionRunner:
      "Collect beans (+1) and cups (+3). Avoid boxes (−5) and coffee spills (−10). " +
      "30+ points – bronze, 60+ – silver, 100+ – gold, 150+ – diamond bonus.",
    instructionCookie:
      "Catch good desserts: cookie (+1), donut (+2), croissant (+3). " +
      "Missing a good dessert gives −1 point. Catching trash/burnt cookie gives −4. " +
      "30+ points – bronze, 60+ – silver, 100+ – gold, 150+ – diamond.",
  },
};

// ===== DOM =====
const screenLang = document.getElementById("screen-lang");
const screenCategories = document.getElementById("screen-categories");
const screenItems = document.getElementById("screen-items");
const screenBonus = document.getElementById("screen-bonus");

const categoriesTitle = document.getElementById("categories-title");
const categoriesContainer = document.getElementById("categories-container");

const itemsTitle = document.getElementById("items-title");
const itemsSubtitle = document.getElementById("items-subtitle");
const itemsContainer = document.getElementById("items-container");

const homeBtn = document.getElementById("homeBtn");
const backToLangBtn = document.getElementById("backToLang");
const backToCategoriesBtn = document.getElementById("backToCategories");
const getBonusesBtn = document.getElementById("getBonusesBtn");
const backFromBonusBtn = document.getElementById("backFromBonus");

const currentLangLabel = document.getElementById("currentLangLabel");
const langTitle = document.getElementById("lang-title");
const getBonusesText = document.getElementById("getBonusesText");

const breadcrumbRoot = document.getElementById("breadcrumb-root");
const breadcrumbSeparator = document.getElementById("breadcrumb-separator");
const breadcrumbSection = document.getElementById("breadcrumb-section");

// бонус-игры
const tabRunner = document.getElementById("tab-runner");
const tabCookie = document.getElementById("tab-cookie");
const bonusTitleEl = document.getElementById("bonus-title");
const bonusSubtitleEl = document.getElementById("bonus-subtitle");
const bonusTimerBadge = document.getElementById("bonus-timer-badge");
const bonusScoreBadge = document.getElementById("bonus-score-badge");
const bonusTotalBadge = document.getElementById("bonus-total-badge");
const bonusHintEl = document.getElementById("bonus-hint");
const bonusInstructionEl = document.getElementById("bonus-instruction");
const bonusControlsCaption = document.getElementById(
  "bonus-controls-caption"
);
const bonusUserNameInput = document.getElementById("bonusUserName");
const bonusStartBtn = document.getElementById("bonusStartBtn");
const bonusStopBtn = document.getElementById("bonusStopBtn");

const gameRunnerEl = document.getElementById("game-runner");
const runnerPlayerEl = document.getElementById("runner-player");
const runnerObjectsEl = document.getElementById("runner-objects");

const gameCookieEl = document.getElementById("game-cookie");
const cookieObjectsEl = document.getElementById("cookie-objects");
const cookieTrayEl = document.getElementById("cookie-tray");

const myBonusesTitleEl = document.getElementById("my-bonuses-title");
const bonusesContainerEl = document.getElementById("bonuses-container");
const noBonusesTextEl = document.getElementById("no-bonuses-text");

// модалка
const resultModal = document.getElementById("resultModal");
const resultModalTitle = document.getElementById("resultModalTitle");
const resultModalText = document.getElementById("resultModalText");
const resultModalCodeRow = document.getElementById("resultModalCodeRow");
const resultModalCodeLabel = document.getElementById(
  "resultModalCodeLabel"
);
const resultModalCode = document.getElementById("resultModalCode");
const resultModalExtra = document.getElementById("resultModalExtra");
const resultModalClose = document.getElementById("resultModalClose");

// карусель
const carouselEl = document.getElementById("promo-carousel");
const carouselSlides = document.querySelectorAll(".carousel-slide");
const carouselDots = document.querySelectorAll(".dot");
const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");

const ALL_SCREENS = [screenLang, screenCategories, screenItems, screenBonus];

// ====== ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ ======
function showScreen(name) {
  ALL_SCREENS.forEach((s) => s && s.classList.remove("active"));

  if (name === "lang" && screenLang) screenLang.classList.add("active");
  else if (name === "categories" && screenCategories)
    screenCategories.classList.add("active");
  else if (name === "items" && screenItems)
    screenItems.classList.add("active");
  else if (name === "bonus" && screenBonus)
    screenBonus.classList.add("active");

  updateBreadcrumbs(name);
}

function updateBreadcrumbs(screenName) {
  const t = TEXTS[currentLang];
  breadcrumbRoot.textContent = t.breadcrumbRoot;

  if (screenName === "lang") {
    breadcrumbSeparator.hidden = true;
    breadcrumbSection.textContent = "";
  } else if (screenName === "categories") {
    breadcrumbSeparator.hidden = false;
    breadcrumbSection.textContent =
      currentLang === "en" ? "Categories" : "Категории";
  } else if (screenName === "items" && currentCategory) {
    breadcrumbSeparator.hidden = false;
    breadcrumbSection.textContent = currentCategory.name;
  } else if (screenName === "bonus") {
    breadcrumbSeparator.hidden = false;
    breadcrumbSection.textContent = t.breadcrumbBonus;
  }
}

// ====== КАТЕГОРИИ ======
async function loadCategories() {
  const res = await fetch(`${API_BASE}/api/categories?lang=${currentLang}`);
  categoriesCache = await res.json();
  renderCategories();
}

function renderCategories() {
  const t = TEXTS[currentLang];
  categoriesTitle.textContent = t.categoriesTitle;
  categoriesContainer.innerHTML = "";

  categoriesCache.forEach((cat, index) => {
    const card = document.createElement("div");
    card.className = "card card-category fade-in-up";
    card.dataset.id = cat.id;

    const img = document.createElement("img");
    img.src = cat.image_url || "/img/coffee.jpg";
    img.loading = "eager";

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = cat.name;

    body.appendChild(title);
    card.appendChild(img);
    card.appendChild(body);

    card.style.animationDelay = `${index * 0.06}s`;
    card.addEventListener("click", () => openCategory(cat));

    categoriesContainer.appendChild(card);
  });
}

// ====== ПОЗИЦИИ ======
async function openCategory(category) {
  currentCategory = category;
  const t = TEXTS[currentLang];

  itemsTitle.textContent = category.name;
  itemsSubtitle.textContent = `${t.itemsSubtitlePrefix} ${category.name}`;
  showScreen("items");

  itemsContainer.innerHTML = `<p class="loading-text">${t.loading}</p>`;

  try {
    const res = await fetch(
      `${API_BASE}/api/items?category_id=${category.id}&lang=${currentLang}`
    );
    const items = await res.json();
    itemsContainer.innerHTML = "";
    renderItems(items);
  } catch (e) {
    console.error(e);
    itemsContainer.innerHTML = `<p class="loading-text">${t.loadError}</p>`;
  }
}

function renderItems(items) {
  const t = TEXTS[currentLang];
  itemsContainer.innerHTML = "";

  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card card-item fade-in-up";

    const img = document.createElement("img");
    let imgUrl = item.image_url;

    if (!imgUrl && currentCategory) {
      const name = currentCategory.name.toLowerCase();
      if (name.includes("кофе") || name.includes("coffee")) {
        imgUrl = "/img/coffee.jpg";
      } else if (name.includes("чай") || name.includes("tea")) {
        imgUrl = "/img/tea.jpg";
      } else if (
        name.includes("десерт") ||
        name.includes("dessert") ||
        name.includes("milkshake") ||
        name.includes("милкшейк")
      ) {
        imgUrl = "/img/dessert.jpg";
      } else {
        imgUrl = "/img/coffee.jpg";
      }
    }
    img.src = imgUrl || "/img/coffee.jpg";
    img.loading = "eager";

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = item.name;

    const desc = document.createElement("div");
    desc.className = "card-desc";
    desc.textContent = item.description || "";

    const footer = document.createElement("div");
    footer.className = "card-footer";

    const price = document.createElement("div");
    price.className = "card-price";
    price.textContent = `${item.price} ${t.priceSuffix}`;

    const tag = document.createElement("div");
    tag.className = "card-tag";
    tag.textContent =
      currentLang === "en" ? "Popular choice" : "Рекомендуем";

    footer.appendChild(price);
    footer.appendChild(tag);

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(footer);

    card.appendChild(img);
    card.appendChild(body);

    card.style.animationDelay = `${index * 0.03}s`;

    itemsContainer.appendChild(card);
  });
}

// ====== КАРУСЕЛЬ: текст по языку ======
function updateCarouselTexts() {
  carouselSlides.forEach((slide) => {
    const caption = slide.querySelector(".carousel-caption");
    if (!caption) return;
    const h3 = caption.querySelector("h3");
    const p = caption.querySelector("p");

    const title =
      caption.dataset[currentLang === "en" ? "titleEn" : "titleRu"];
    const text =
      caption.dataset[currentLang === "en" ? "textEn" : "textRu"];

    h3.textContent = title || "";
    p.textContent = text || "";
  });
}

// ====== Применение текстов по языку ======
function applyLanguageTexts() {
  const t = TEXTS[currentLang];

  currentLangLabel.textContent = t.langLabel;
  langTitle.textContent = t.langTitle;
  getBonusesText.textContent = t.getBonuses;
  backToLangBtn.textContent = t.backToLang;
  backToCategoriesBtn.textContent = t.backToCategories;

  breadcrumbRoot.textContent = t.breadcrumbRoot;

  // бонусы
  bonusTitleEl.textContent = t.bonusTitle;
  bonusSubtitleEl.textContent = t.bonusSubtitle;
  tabRunner.textContent = t.runnerTab;
  tabCookie.textContent = t.cookieTab;
  bonusUserNameInput.placeholder = t.namePlaceholder;
  bonusStartBtn.textContent = t.startGame;
  if (backFromBonusBtn) backFromBonusBtn.textContent = t.backToMenu;
  myBonusesTitleEl.textContent = t.myBonusesTitle;
  noBonusesTextEl.textContent = t.noBonuses;

  resultModalCodeLabel.textContent =
    currentLang === "en" ? "Promo code" : "Промокод";

  updateBonusUI();
  updateBonusHintAndControls();
  updateCarouselTexts();
  renderBonusesList(); // подписи на нужном языке
}

// ====== КАРУСЕЛЬ ======
let carouselIndex = 0;
let carouselIntervalId = null;

function setCarouselSlide(index) {
  const total = carouselSlides.length;
  if (!total) return;
  const newIndex = ((index % total) + total) % total;

  carouselSlides.forEach((slide, i) => {
    slide.classList.toggle("active", i === newIndex);
  });
  carouselDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === newIndex);
  });

  carouselIndex = newIndex;
}

function nextCarouselSlide() {
  setCarouselSlide(carouselIndex + 1);
}

function prevCarouselSlide() {
  setCarouselSlide(carouselIndex - 1);
}

function startCarouselAuto() {
  stopCarouselAuto();
  carouselIntervalId = setInterval(nextCarouselSlide, 6000);
}

function stopCarouselAuto() {
  if (carouselIntervalId) {
    clearInterval(carouselIntervalId);
    carouselIntervalId = null;
  }
}

if (carouselEl) {
  updateCarouselTexts();
  setCarouselSlide(0);
  startCarouselAuto();

  if (carouselPrev) {
    carouselPrev.addEventListener("click", () => {
      prevCarouselSlide();
      startCarouselAuto();
    });
  }

  if (carouselNext) {
    carouselNext.addEventListener("click", () => {
      nextCarouselSlide();
      startCarouselAuto();
    });
  }

  carouselDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.index || 0);
      setCarouselSlide(index);
      startCarouselAuto();
    });
  });

  carouselEl.addEventListener("mouseenter", stopCarouselAuto);
  carouselEl.addEventListener("mouseleave", startCarouselAuto);
}

// ====== БОНУС-ИГРЫ (ОБЩАЯ ЛОГИКА) ======
let currentGame = "runner"; // 'runner' | 'cookie'
let isGameRunning = false;
let gameStartTime = 0;
let gameTimeLimit = 40; // секунд
let gameScore = 0;

function updateGameInstruction() {
  const t = TEXTS[currentLang];
  if (!bonusInstructionEl) return;

  const body =
    currentGame === "runner"
      ? t.instructionRunner
      : t.instructionCookie;

  // чуть красивее: разбиваем текст на строки
  const formatted = body.split(". ").join(".<br>");

  bonusInstructionEl.innerHTML =
    `<strong>${t.instructionTitle}</strong>` +
    `<span>${formatted}</span>`;
}



function updateBonusHintAndControls() {
  const t = TEXTS[currentLang];
  if (currentGame === "runner") {
    bonusHintEl.textContent = t.runnerHint;
    bonusControlsCaption.textContent = t.runnerControls;
    gameTimeLimit = 45;
  } else {
    bonusHintEl.textContent = t.cookieHint;
    bonusControlsCaption.textContent = t.cookieControls;
    gameTimeLimit = 40;
  }
  updateGameInstruction();
}

function updateBonusUI() {
  const t = TEXTS[currentLang];
  const timeNow = Date.now() / 1000;
  const elapsed = isGameRunning ? timeNow - gameStartTime : 0;
  const remaining = Math.max(0, Math.ceil(gameTimeLimit - elapsed));

  bonusTimerBadge.textContent = `⏱ ${remaining}${t.timerSuffix}`;
  bonusScoreBadge.textContent = `${t.scoreLabel} ${gameScore}`;
  bonusTotalBadge.textContent = `${t.totalBonusesLabel} ${getActiveBonusesCount()}`;
}

// ====== ЛОКАЛЬНОЕ ХРАНИЛИЩЕ БОНУСОВ ======
const BONUSES_KEY = "coffeeBonusesV1";
const BONUS_META_KEY = "coffeeBonusMetaV1";

let bonuses = [];

function loadBonusesFromStorage() {
  try {
    const raw = localStorage.getItem(BONUSES_KEY);
    if (!raw) {
      bonuses = [];
      return;
    }
    bonuses = JSON.parse(raw) || [];
  } catch (e) {
    console.error("Ошибка чтения бонусов:", e);
    bonuses = [];
  }
}

function saveBonusesToStorage() {
  try {
    localStorage.setItem(BONUSES_KEY, JSON.stringify(bonuses));
  } catch (e) {
    console.error("Ошибка сохранения бонусов:", e);
  }
}

function getActiveBonusesCount() {
  const now = Date.now();
  return bonuses.filter(
    (b) => !b.used && new Date(b.expiresAt).getTime() > now
  ).length;
}

function getTodayMeta() {
  const todayStr = new Date().toISOString().slice(0, 10);
  try {
    const raw = localStorage.getItem(BONUS_META_KEY);
    if (!raw) {
      return { date: todayStr, count: 0 };
    }
    const meta = JSON.parse(raw);
    if (meta.date !== todayStr) {
      return { date: todayStr, count: 0 };
    }
    return meta;
  } catch {
    return { date: todayStr, count: 0 };
  }
}

function saveMeta(meta) {
  try {
    localStorage.setItem(BONUS_META_KEY, JSON.stringify(meta));
  } catch (e) {
    console.error("Ошибка сохранения meta:", e);
  }
}

// ====== ОЦЕНКА РЕЗУЛЬТАТА И ГЕНЕРАЦИЯ БОНУСОВ ======
function evaluateBonusLevel(score) {
  if (score < 30) {
    return {
      level: "none",
      rarity: "common",
      descriptionRu: "",
      descriptionEn: "",
    };
  } else if (score < 60) {
    return {
      level: "bronze",
      rarity: "common",
      descriptionRu: "−5% на любой напиток.",
      descriptionEn: "5% off any drink.",
    };
  } else if (score < 100) {
    return {
      level: "silver",
      rarity: "rare",
      descriptionRu: "−10% на кофе и чай.",
      descriptionEn: "10% off coffee and tea.",
    };
  } else if (score < 150) {
    return {
      level: "gold",
      rarity: "epic",
      descriptionRu: "−15% на весь заказ или десерт в подарок.",
      descriptionEn: "15% off the whole order or free dessert with coffee.",
    };
  } else {
    return {
      level: "diamond",
      rarity: "legendary",
      descriptionRu:
        "Бесплатный маленький американо при любом заказе или −20% на всё меню.",
      descriptionEn:
        "Free small Americano with any order or 20% off the whole menu.",
    };
  }
}

function generatePromoCode(level) {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let tail = "";
  for (let i = 0; i < 4; i++) {
    tail += letters[Math.floor(Math.random() * letters.length)];
  }

  const isEn = currentLang === "en";

  const levelPrefixMapRu = {
    bronze: "КАФЕ-БРОНЗА",
    silver: "КАФЕ-СЕРЕБРО",
    gold: "КАФЕ-ЗОЛОТО",
    diamond: "КАФЕ-ДИАМОНД",
    none: "КАФЕ-ИГРА",
  };

  const levelPrefixMapEn = {
    bronze: "CAFE-BRONZE",
    silver: "CAFE-SILVER",
    gold: "CAFE-GOLD",
    diamond: "CAFE-DIAMOND",
    none: "CAFE-GAME",
  };

  const map = isEn ? levelPrefixMapEn : levelPrefixMapRu;
  const base = map[level] || (isEn ? "CAFE-BONUS" : "КАФЕ-БОНУС");

  return `${base}-${tail}`;
}

function createBonusObject(gameId, score) {
  const evaluation = evaluateBonusLevel(score);
  const now = new Date();
  const createdAt = now.toISOString();
  const expires = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 дня

  const id = `B-${now.getTime()}`;
  const code =
    evaluation.level === "none"
      ? generatePromoCode("none")
      : generatePromoCode(evaluation.level);

  return {
    id,
    code,
    gameId,
    level: evaluation.level,
    rarity: evaluation.rarity,
    descriptionRu: evaluation.descriptionRu,
    descriptionEn: evaluation.descriptionEn,
    score,
    createdAt,
    expiresAt: expires.toISOString(),
    used: false,
  };
}

// ====== МОДАЛКА ======
function openResultModal({ title, text, code, extra }) {
  resultModalTitle.textContent = title;
  resultModalText.textContent = text || "";

  if (code) {
    resultModalCodeRow.style.display = "flex";
    resultModalCode.textContent = code;
  } else {
    resultModalCodeRow.style.display = "none";
  }

  resultModalExtra.textContent = extra || "";

  const card = resultModal.querySelector(".modal-card");
  if (card) {
    card.classList.remove("animate");
    void card.offsetWidth;
    card.classList.add("animate");
  }

  resultModal.classList.add("visible");
}

function closeResultModal() {
  resultModal.classList.remove("visible");
}

if (resultModalClose) {
  resultModalClose.addEventListener("click", closeResultModal);
}
if (resultModal) {
  resultModal.addEventListener("click", (e) => {
    if (e.target === resultModal) {
      closeResultModal();
    }
  });
}

// ====== Завершение игры ======
function finishGame(gameId, score) {
  const t = TEXTS[currentLang];

  gameScore = score;
  updateBonusUI();

  const evaluation = evaluateBonusLevel(score);

  if (evaluation.level === "none") {
    const extra = `${t.modalScoreLabel}: ${score}`;
    openResultModal({
      title: t.modalTitleNoBonus,
      text: t.noBonusMsg,
      code: null,
      extra,
    });
    return;
  }

  // Проверка лимита на сегодня
  const meta = getTodayMeta();
  const MAX_PER_DAY = 3;
  if (meta.count >= MAX_PER_DAY) {
    const extra = `${t.modalScoreLabel}: ${score}`;
    openResultModal({
      title: t.modalDailyLimitTitle,
      text: t.modalDailyLimitText,
      code: null,
      extra,
    });
    return;
  }

  const bonus = createBonusObject(gameId, score);
  bonuses.unshift(bonus);
  saveBonusesToStorage();

  const todayStr = new Date().toISOString().slice(0, 10);
  saveMeta({ date: todayStr, count: meta.count + 1 });

  renderBonusesList(true);
  updateBonusUI();

  const levelName =
    TEXTS[currentLang].bonusLevelNames[bonus.level] || "";
  const description =
    currentLang === "en" ? bonus.descriptionEn : bonus.descriptionRu;

  const expiresDate = new Date(bonus.expiresAt);
  const expiresStr = expiresDate.toLocaleDateString(
    currentLang === "en" ? "en-GB" : "ru-RU"
  );

  const text =
    description ||
    (currentLang === "en"
      ? "Small thank you bonus from Coffee House."
      : "Небольшой бонус от Coffee House.");
  const extra =
    `${t.modalScoreLabel}: ${score} · ${levelName}` +
    ` · ${t.modalValidUntil}: ${expiresStr}`;

  openResultModal({
    title: t.modalTitleBonus,
    text,
    code: bonus.code,
    extra,
  });
}

// ====== РЕНДЕР СПИСКА БОНУСОВ ======
function renderBonusesList(highlightFirst = false) {
  bonusesContainerEl.innerHTML = "";

  if (!bonuses.length) {
    const p = document.createElement("p");
    p.id = "no-bonuses-text";
    p.className = "no-bonuses-text";
    p.textContent = TEXTS[currentLang].noBonuses;
    bonusesContainerEl.appendChild(p);
    return;
  }

  const now = Date.now();

  bonuses.forEach((b, index) => {
    const card = document.createElement("div");
    card.className = "bonus-card";
    if (highlightFirst && index === 0) {
      card.classList.add("new");
    }

    const main = document.createElement("div");
    main.className = "bonus-main";

    const code = document.createElement("div");
    code.className = "bonus-code";
    code.textContent = b.code;

    const desc = document.createElement("div");
    desc.className = "bonus-description";
    let text =
      currentLang === "en" ? b.descriptionEn : b.descriptionRu;
    if (!text) {
      text =
        currentLang === "en"
          ? "Small thank you bonus from Coffee House."
          : "Небольшой бонус от Coffee House.";
    }

    desc.textContent = text;

    const meta = document.createElement("div");
    meta.className = "bonus-meta";

    const createdDate = new Date(b.createdAt);
    const expiresDate = new Date(b.expiresAt);
    const createdStr = createdDate.toLocaleDateString(
      currentLang === "en" ? "en-GB" : "ru-RU"
    );
    const expiresStr = expiresDate.toLocaleDateString(
      currentLang === "en" ? "en-GB" : "ru-RU"
    );
    const isExpired = expiresDate.getTime() <= now;

    const gameName =
      b.gameId === "runner"
        ? currentLang === "en"
          ? "Coffee Runner"
          : "Кофе раннер"
        : currentLang === "en"
        ? "Catch the Cookie"
        : "Лови печеньку";

    meta.textContent =
      (currentLang === "en"
        ? `Game: ${gameName} • Score: ${b.score} • `
        : `Игра: ${gameName} • Очки: ${b.score} • `) +
      (currentLang === "en"
        ? `Got: ${createdStr} • `
        : `Получен: ${createdStr} • `) +
      (isExpired
        ? currentLang === "en"
          ? "Expired"
          : "Истёк"
        : (currentLang === "en"
            ? "Valid until: "
            : "Действителен до: ") + expiresStr);

    main.appendChild(code);
    main.appendChild(desc);
    main.appendChild(meta);

    const badge = document.createElement("div");
    badge.className = `bonus-badge ${b.rarity}`;
    const levelName =
      TEXTS[currentLang].bonusLevelNames[b.level] || "";
    badge.textContent = levelName.toUpperCase();

    card.appendChild(main);
    card.appendChild(badge);

    bonusesContainerEl.appendChild(card);
  });
}

// ====== ИГРА: COFFEE RUNNER ======
let runnerObjects = [];
let runnerLastSpawn = 0;

// координаты по оси Y (bottom в CSS)
const RUNNER_GROUND_Y = 36;
const RUNNER_MAX_Y = 160;

// физика (px / сек)
let runnerY = RUNNER_GROUND_Y;
let runnerVelY = 0;
const RUNNER_JUMP_VELOCITY = 520; // начальная скорость прыжка
const RUNNER_GRAVITY = 1800; // притяжение
const RUNNER_OBJECT_SPEED = 260; // скорость объектов (px/сек)

function resetRunnerGame() {
  runnerObjects = [];
  runnerLastSpawn = 0;
  runnerY = RUNNER_GROUND_Y;
  runnerVelY = 0;
  if (runnerPlayerEl) {
    runnerPlayerEl.style.bottom = `${RUNNER_GROUND_Y}px`;
  }
  if (runnerObjectsEl) {
    runnerObjectsEl.innerHTML = "";
  }
}

function spawnRunnerObject() {
  if (!gameRunnerEl) return;

  const rand = Math.random();
  let type;
  if (rand < 0.45) type = "bean";
  else if (rand < 0.7) type = "cup";
  else if (rand < 0.85) type = "box";
  else type = "spill";

  const obj = {
    id: "r" + Math.random().toString(36).slice(2),
    type,
    x: gameRunnerEl.clientWidth + 40,
  };

  const el = document.createElement("div");
  el.className = `runner-object ${type}`;
  el.dataset.id = obj.id;
  if (type === "bean") el.textContent = "●";
  if (type === "cup") el.textContent = "☕";

  obj.el = el;
  runnerObjectsEl.appendChild(el);
  runnerObjects.push(obj);
}

function updateRunner(dt) {
  if (!gameRunnerEl) return;

  const playerX = 80;
  const playerWidth = 48;
  const playerHeight = 48;

  // физика прыжка
  runnerVelY += -RUNNER_GRAVITY * dt;
  runnerY += runnerVelY * dt;

  if (runnerY < RUNNER_GROUND_Y) {
    runnerY = RUNNER_GROUND_Y;
    runnerVelY = 0;
  }
  if (runnerY > RUNNER_MAX_Y) {
    runnerY = RUNNER_MAX_Y;
    if (runnerVelY > 0) runnerVelY = 0;
  }

  runnerPlayerEl.style.bottom = `${runnerY}px`;

  // спавн объектов
  const now = performance.now();
  if (now - runnerLastSpawn > 900) {
    runnerLastSpawn = now;
    spawnRunnerObject();
  }

  // движение объектов
  runnerObjects.forEach((obj) => {
    obj.x -= RUNNER_OBJECT_SPEED * dt;
    if (obj.el) {
      obj.el.style.left = `${obj.x}px`;
      obj.el.style.bottom = obj.type === "spill" ? "26px" : "32px";
    }
  });

  // столкновения и удаление
  const newList = [];
  runnerObjects.forEach((obj) => {
    if (obj.x < -80) {
      if (obj.el) obj.el.remove();
      return;
    }

    const objWidth = obj.type === "spill" ? 60 : 32;
    const objHeight = obj.type === "spill" ? 16 : 32;
    const objY = obj.type === "spill" ? 26 : 32;

    const dx =
      Math.abs(playerX - obj.x) <= (playerWidth + objWidth) / 2;
    const dy =
      Math.abs(runnerY - objY) <= (playerHeight + objHeight) / 2;

    if (dx && dy) {
      if (obj.type === "bean") {
        gameScore += 1;
      } else if (obj.type === "cup") {
        gameScore += 3;
      } else if (obj.type === "box") {
        gameScore = Math.max(0, gameScore - 5);
      } else if (obj.type === "spill") {
        gameScore = Math.max(0, gameScore - 10);
      }
      if (obj.el) obj.el.remove();
    } else {
      newList.push(obj);
    }
  });
  runnerObjects = newList;

  updateBonusUI();
}

function runnerJump() {
  if (!isGameRunning || currentGame !== "runner") return;
  if (runnerY <= RUNNER_GROUND_Y + 1) {
    runnerVelY = RUNNER_JUMP_VELOCITY;
  }
}

// ====== ИГРА: COOKIE CATCH ======
let cookieItems = [];
let cookieLastSpawn = 0;
let cookieTrayX = 0;
let cookieMoveDirection = 0; // -1 / 0 / 1

// настройки: баланс сложности
const COOKIE_TRAY_SPEED = 420;          // скорость подноса при стрелках/A/D
const COOKIE_FALL_MIN = 80;             // минимальная скорость падения
const COOKIE_FALL_MAX = 140;            // максимальная скорость падения
const COOKIE_SPAWN_INTERVAL = 1100;     // как часто падают объекты (мс)

function resetCookieGame() {
  cookieItems = [];
  cookieLastSpawn = 0;
  cookieMoveDirection = 0;

  if (cookieObjectsEl) {
    cookieObjectsEl.innerHTML = "";
  }

  if (!gameCookieEl || !cookieTrayEl) return;

  const width = gameCookieEl.clientWidth || 700;
  cookieTrayX = width / 2;
  updateTrayPosition();
}

function spawnCookieItem() {
  if (!gameCookieEl || !cookieObjectsEl) return;

  const width = gameCookieEl.clientWidth || 700;
  const minX = 35;
  const maxX = width - 35;

  const rand = Math.random();
  let type;
  if (rand < 0.55) type = "good1";
  else if (rand < 0.8) type = "good2";
  else if (rand < 0.9) type = "good3";
  else type = "bad";

  const x = minX + Math.random() * (maxX - minX);

  const el = document.createElement("div");
  el.className = `cookie-item ${type}`;

  if (type === "good1") el.textContent = "🍪";
  else if (type === "good2") el.textContent = "🍩";
  else if (type === "good3") el.textContent = "🥐";
  else el.textContent = "🔥";

  const speed =
    COOKIE_FALL_MIN +
    Math.random() * (COOKIE_FALL_MAX - COOKIE_FALL_MIN);

  const item = {
    id: "c" + Math.random().toString(36).slice(2),
    type,
    x,
    y: -24,
    speed,
    el,
  };

  cookieObjectsEl.appendChild(el);
  cookieItems.push(item);
}

function updateTrayPosition() {
  if (!gameCookieEl || !cookieTrayEl) return;

  const width = gameCookieEl.clientWidth || 700;
  const trayWidth = cookieTrayEl.offsetWidth || 120;

  const minX = trayWidth / 2 + 6;
  const maxX = width - trayWidth / 2 - 6;

  cookieTrayX = Math.max(minX, Math.min(maxX, cookieTrayX));
  cookieTrayEl.style.left = `${cookieTrayX}px`;
}

function updateCookie(dt) {
  if (!gameCookieEl || !cookieTrayEl) return;

  // спавн падающих объектов
  const now = performance.now();
  if (now - cookieLastSpawn > COOKIE_SPAWN_INTERVAL) {
    cookieLastSpawn = now;
    spawnCookieItem();
  }

  // движение подноса (стрелки / A / D)
  if (cookieMoveDirection !== 0) {
    cookieTrayX += cookieMoveDirection * COOKIE_TRAY_SPEED * dt;
    updateTrayPosition();
  }

  const containerHeight = gameCookieEl.clientHeight || 400;
  const trayWidth = cookieTrayEl.offsetWidth || 120;
  const trayHeight = cookieTrayEl.offsetHeight || 30;

  // поднос в css: bottom: 26px;
  const trayBottomFromBottom = 26;
  const trayBottomY = containerHeight - trayBottomFromBottom;
  const trayTopY = trayBottomY - trayHeight;

  const newItems = [];
  cookieItems.forEach((item) => {
    // падение
    item.y += item.speed * dt;

    if (item.el) {
      item.el.style.left = `${item.x}px`;
      item.el.style.top = `${item.y}px`;
    }

    const itemSize = 28;
    const centerY = item.y + itemSize / 2;
    const centerX = item.x;

    // вертикальное пересечение: центр объекта внутри диапазона подноса
    const hitVertical = centerY >= trayTopY && centerY <= trayBottomY;

    // горизонтальное пересечение: даем немного "прощения"
    const hitHorizontal =
      Math.abs(centerX - cookieTrayX) <= (trayWidth * 0.6);

    if (hitVertical && hitHorizontal) {
      // поймали объект
      if (item.type === "good1") gameScore += 1;
      else if (item.type === "good2") gameScore += 2;
      else if (item.type === "good3") gameScore += 3;
      else if (item.type === "bad") {
        gameScore = Math.max(0, gameScore - 4);
      }

      if (item.el) item.el.remove();
    } else if (item.y > containerHeight + 40) {
      // объект улетел вниз
      if (
        item.type === "good1" ||
        item.type === "good2" ||
        item.type === "good3"
      ) {
        // пропустили хороший десерт — -1 очко
        gameScore = Math.max(0, gameScore - 1);
      }
      if (item.el) item.el.remove();
    } else {
      newItems.push(item);
    }
  });

  cookieItems = newItems;
  updateBonusUI();
}

// управление подносом мышкой/тачем (без телепорта — только направление)
function handleCookiePointerDown(event) {
  if (!isGameRunning || currentGame !== "cookie" || !gameCookieEl || !cookieTrayEl) {
    return;
  }

  const rect = gameCookieEl.getBoundingClientRect();
  const x =
    event.touches && event.touches.length
      ? event.touches[0].clientX
      : event.clientX;
  const relativeX = x - rect.left;
  const center = rect.width / 2;

  // если клик левее центра — едем влево, если правее — вправо
  cookieMoveDirection = relativeX < center ? -1 : 1;

  cookieTrayEl.style.transform =
    "translateX(-50%) translateY(0) scale(1.02)";
}

function handleCookiePointerUp() {
  cookieMoveDirection = 0;
  if (cookieTrayEl) {
    cookieTrayEl.style.transform = "translateX(-50%)";
  }
}


// ====== IDLE-АНИМАЦИИ ======
function updateIdleState() {
  if (runnerPlayerEl) {
    runnerPlayerEl.classList.toggle(
      "idle",
      !isGameRunning && currentGame === "runner"
    );
  }
  if (cookieTrayEl) {
    cookieTrayEl.classList.toggle(
      "idle",
      !isGameRunning && currentGame === "cookie"
    );
  }
}

// ====== СТАРТ / СТОП ИГРЫ + ЛУП ======
let lastFrameTime = null;

function startGame() {
  if (isGameRunning) return;

  gameScore = 0;
  updateBonusHintAndControls();

  if (currentGame === "runner") {
    resetRunnerGame();
    if (gameRunnerEl && gameCookieEl) {
      gameRunnerEl.classList.add("active");
      gameCookieEl.classList.remove("active");
    }
  } else {
    resetCookieGame();
    if (gameRunnerEl && gameCookieEl) {
      gameCookieEl.classList.add("active");
      gameRunnerEl.classList.remove("active");
    }
  }

  isGameRunning = true;
  gameStartTime = Date.now() / 1000;
  updateBonusUI();
  updateIdleState();

  requestAnimationFrame(gameLoop);
}

function stopGame() {
  isGameRunning = false;
  updateIdleState();
}

function abortGame() {
  if (!isGameRunning) return;
  stopGame();
  gameScore = 0;
  updateBonusUI();
}

function gameLoop(timestamp) {
  if (!isGameRunning) {
    lastFrameTime = null;
    return;
  }

  if (!lastFrameTime) lastFrameTime = timestamp;
  const dt = (timestamp - lastFrameTime) / 1000;
  lastFrameTime = timestamp;

  const elapsed = Date.now() / 1000 - gameStartTime;
  if (elapsed >= gameTimeLimit) {
    stopGame();
    finishGame(currentGame, gameScore);
    return;
  }

  if (currentGame === "runner") {
    updateRunner(dt);
  } else {
    updateCookie(dt);
  }

  updateBonusUI();
  requestAnimationFrame(gameLoop);
}

// ====== ОБРАБОТКА ВВОДА ======
document.addEventListener("keydown", (e) => {
  // ESC — немедленно остановить игру
  if (e.code === "Escape") {
    abortGame();
    return;
  }

  if (!isGameRunning) return;

  if (currentGame === "runner") {
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      runnerJump();
    }
  } else if (currentGame === "cookie") {
    if (e.code === "ArrowLeft" || e.key === "a" || e.key === "A") {
      cookieMoveDirection = -1;
    } else if (
      e.code === "ArrowRight" ||
      e.key === "d" ||
      e.key === "D"
    ) {
      cookieMoveDirection = 1;
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (!isGameRunning) return;
  if (currentGame === "cookie") {
    if (
      e.code === "ArrowLeft" ||
      e.code === "ArrowRight" ||
      e.key.toLowerCase() === "a" ||
      e.key.toLowerCase() === "d"
    ) {
      cookieMoveDirection = 0;
      if (cookieTrayEl) {
        cookieTrayEl.style.transform = "translateX(-50%)";
      }
    }
  }
});

// мышь/тач для runner (прыжок)
if (gameRunnerEl) {
  gameRunnerEl.addEventListener("mousedown", () => {
    runnerJump();
  });
  gameRunnerEl.addEventListener("touchstart", (e) => {
    e.preventDefault();
    runnerJump();
  });
}

// мышь/тач для cookie
if (gameCookieEl) {
  gameCookieEl.addEventListener("mousedown", handleCookiePointerDown);
  gameCookieEl.addEventListener("mouseup", handleCookiePointerUp);
  gameCookieEl.addEventListener("mouseleave", handleCookiePointerUp);
  gameCookieEl.addEventListener("touchstart", (e) => {
    e.preventDefault();
    handleCookiePointerDown(e);
  });
  gameCookieEl.addEventListener("touchend", (e) => {
    e.preventDefault();
    handleCookiePointerUp();
  });
}

// ====== СОБЫТИЯ НАВИГАЦИИ ======
document.querySelectorAll(".btn-lang").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    applyLanguageTexts();

    const t = TEXTS[currentLang];
    showScreen("categories");
    categoriesTitle.textContent = t.loadingCategories;
    categoriesContainer.innerHTML = "";
    loadCategories().catch(console.error);
  });
});

if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    currentCategory = null;
    showScreen("lang");
  });
}

if (backToLangBtn) {
  backToLangBtn.addEventListener("click", () => {
    currentCategory = null;
    showScreen("lang");
  });
}

if (backToCategoriesBtn) {
  backToCategoriesBtn.addEventListener("click", () => {
    showScreen("categories");
  });
}

if (getBonusesBtn) {
  getBonusesBtn.addEventListener("click", () => {
    showScreen("bonus");
  });
}

if (backFromBonusBtn) {
  backFromBonusBtn.addEventListener("click", () => {
    if (categoriesCache.length) {
      showScreen("categories");
    } else {
      showScreen("lang");
    }
  });
}

// переключение игр
function setGameTab(gameId) {
  if (currentGame === gameId) return;

  // стоп текущей
  stopGame();
  resetRunnerGame();
  resetCookieGame();

  currentGame = gameId;
  tabRunner.classList.toggle("active", gameId === "runner");
  tabCookie.classList.toggle("active", gameId === "cookie");

  if (gameRunnerEl && gameCookieEl) {
    if (gameId === "runner") {
      gameRunnerEl.classList.add("active");
      gameCookieEl.classList.remove("active");
    } else {
      gameCookieEl.classList.add("active");
      gameRunnerEl.classList.remove("active");
    }
  }

  gameScore = 0;
  updateBonusHintAndControls();
  updateBonusUI();
  updateIdleState();
}

if (tabRunner) {
  tabRunner.addEventListener("click", () => setGameTab("runner"));
}
if (tabCookie) {
  tabCookie.addEventListener("click", () => setGameTab("cookie"));
}

// старт / стоп кнопки
if (bonusStartBtn) {
  bonusStartBtn.addEventListener("click", () => {
    const name = bonusUserNameInput.value.trim();
    if (name) {
      try {
        localStorage.setItem("coffeeUserName", name);
      } catch {}
    }
    startGame();
  });
}

if (bonusStopBtn) {
  bonusStopBtn.addEventListener("click", () => {
    abortGame();
  });
}

// ====== ИНИЦИАЛИЗАЦИЯ ======
loadBonusesFromStorage();
applyLanguageTexts();
renderBonusesList(false);
updateBonusHintAndControls();
updateIdleState();
showScreen("lang");

try {
  const savedName = localStorage.getItem("coffeeUserName");
  if (savedName) bonusUserNameInput.value = savedName;
} catch {}
