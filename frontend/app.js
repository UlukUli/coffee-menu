const API_BASE = ""; // тот же домен, где сервер

let currentLang = "ru";
let categoriesCache = [];
let currentCategory = null;

// Локализация текста
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
  },
};

// DOM элементы
const screenLang = document.getElementById("screen-lang");
const screenCategories = document.getElementById("screen-categories");
const screenItems = document.getElementById("screen-items");

const categoriesTitle = document.getElementById("categories-title");
const categoriesContainer = document.getElementById("categories-container");

const itemsTitle = document.getElementById("items-title");
const itemsSubtitle = document.getElementById("items-subtitle");
const itemsContainer = document.getElementById("items-container");

const homeBtn = document.getElementById("homeBtn");
const backToLangBtn = document.getElementById("backToLang");
const backToCategoriesBtn = document.getElementById("backToCategories");

const currentLangLabel = document.getElementById("currentLangLabel");
const langTitle = document.getElementById("lang-title");

const breadcrumbRoot = document.getElementById("breadcrumb-root");
const breadcrumbSeparator = document.getElementById("breadcrumb-separator");
const breadcrumbSection = document.getElementById("breadcrumb-section");

// ===== Переключение экранов =====

function showScreen(name) {
  [screenLang, screenCategories, screenItems].forEach((s) =>
    s.classList.remove("active")
  );

  if (name === "lang") screenLang.classList.add("active");
  if (name === "categories") screenCategories.classList.add("active");
  if (name === "items") screenItems.classList.add("active");

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
  }
}

// ===== Загрузка категорий =====

async function loadCategories() {
  const res = await fetch(`/api/categories?lang=${currentLang}`);
  categoriesCache = await res.json();
  renderCategories();
}

function renderCategories() {
  const t = TEXTS[currentLang];
  categoriesTitle.textContent = t.categoriesTitle;
  categoriesContainer.innerHTML = "";

  // Жёсткая привязка фоток к категориям по индексу
  const categoryImages = [
    "/img/coffee.jpg", // 1-я категория: Кофе / Coffee
    "/img/tea.jpg", // 2-я: Чай / Tea
    "/img/dessert.jpg", // 3-я: Десерты / Desserts
  ];

  categoriesCache.forEach((cat, index) => {
    const card = document.createElement("div");
    card.className = "card card-category";

    card.dataset.id = cat.id;

    const img = document.createElement("img");
    img.src = categoryImages[index] || "/img/coffee.jpg";
    img.loading = "eager";  // загружается сразу, без задержки


    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = cat.name;

    body.appendChild(title);
    card.appendChild(img);
    card.appendChild(body);

    card.addEventListener("click", () => openCategory(cat));

    card.style.transform = "translateZ(0)"; // прогрев


    categoriesContainer.appendChild(card);
  });
}

// ===== Открытие категории и позиций =====

async function openCategory(category) {
  currentCategory = category;
  itemsTitle.textContent = category.name;

  const t = TEXTS[currentLang];
  itemsSubtitle.textContent = `${t.itemsSubtitlePrefix} ${category.name}`;

  showScreen("items");

  // ⭐ СРАЗУ очищаем экран, чтобы старые позиции не мигали
  itemsContainer.innerHTML = `
    <p class="loading-text"> ${
      currentLang === "en" ? "Loading..." : "Загрузка..."
    } </p>
  `;

  try {
    const res = await fetch(
      `/api/items?category_id=${category.id}&lang=${currentLang}`
    );
    const items = await res.json();

    // удаляем надпись "Загрузка" и рисуем карточки
    itemsContainer.innerHTML = "";
    renderItems(items);
  } catch (err) {
    console.error(err);
    itemsContainer.innerHTML = `
      <p class="loading-text">
        ${currentLang === "en" ? "Load error" : "Ошибка загрузки"}
      </p>
    `;
  }
}


function renderItems(items) {
  const t = TEXTS[currentLang];
  itemsContainer.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");

    // --- выбираем картинку для позиции по текущей категории ---
    let imgUrl = item.image_url;
    if (!imgUrl && currentCategory) {
      const name = currentCategory.name.toLowerCase();
      if (name.includes("кофе") || name.includes("coffee")) {
        imgUrl = "/img/coffee.jpg";
      } else if (name.includes("чай") || name.includes("tea")) {
        imgUrl = "/img/tea.jpg";
      } else if (name.includes("десерт") || name.includes("dessert")) {
        imgUrl = "/img/dessert.jpg";
      }
    }
    if (!imgUrl) {
      imgUrl = "/img/coffee.jpg"; // дефолт
    }

    img.src = imgUrl;
    img.loading = "eager";
    // --- конец выбора картинки ---

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

    itemsContainer.appendChild(card);
  });
}



// ===== Смена языка =====

function applyLanguageTexts() {
  const t = TEXTS[currentLang];
  currentLangLabel.textContent = t.langLabel;
  langTitle.textContent = t.langTitle;
  backToLangBtn.textContent = t.backToLang;
  backToCategoriesBtn.textContent = t.backToCategories;
  updateBreadcrumbs("lang");
}

// ===== События =====

document.querySelectorAll(".btn-lang").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    applyLanguageTexts();

    // СРАЗУ показываем экран категорий (чтоб не было задержки)
    showScreen("categories");

    // Временно показываем "Загрузка..."
    categoriesTitle.textContent =
      currentLang === "en" ? "Loading categories..." : "Загрузка категорий...";
    categoriesContainer.innerHTML = "";

    // А тут уже асинхронно тянем данные с бэка
    loadCategories().catch(console.error);
  });
});


homeBtn.addEventListener("click", () => {
  currentCategory = null;
  showScreen("lang");
});

backToLangBtn.addEventListener("click", () => {
  currentCategory = null;
  showScreen("lang");
});

backToCategoriesBtn.addEventListener("click", () => {
  showScreen("categories");
});

// Стартовое состояние
applyLanguageTexts();
showScreen("lang");

