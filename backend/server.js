const express = require("express"); 
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
// Путь к фронтенду (index.html, admin.html, admin-login.html, стили, скрипты)
const frontendPath = path.join(__dirname, "..", "frontend");

// Раздаём всё содержимое папки frontend как статику
app.use(express.static(frontendPath));


const dbPath = path.join(__dirname, "menu.db");
const db = new sqlite3.Database(dbPath);

app.use(cors());
app.use(express.json());

// ================== ИНИЦИАЛИЗАЦИЯ БАЗЫ ==================
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_ru TEXT NOT NULL,
      name_en TEXT NOT NULL,
      image_url TEXT
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      name_ru TEXT NOT NULL,
      name_en TEXT NOT NULL,
      description_ru TEXT,
      description_en TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )`
  );

  db.get("SELECT COUNT(*) AS count FROM categories", (err, row) => {
    if (err) {
      console.error("Ошибка проверки категорий:", err);
      return;
    }

    if (row.count === 0) {
      console.log("База пустая, вставляем стартовые данные...");

      // 5 категорий
      db.run(
        `INSERT INTO categories (name_ru, name_en, image_url)
         VALUES
         ('Кофе', 'Coffee', '/img/coffee.jpg'),
         ('Чай', 'Tea', '/img/tea.jpg'),
         ('Десерты', 'Desserts', '/img/dessert.jpg'),
         ('Милкшейки', 'Milkshakes', '/img/milkshake.jpg'),
         ('Сэндвичи', 'Sandwiches', '/img/sandwhich.jpg')`,
        function (err) {
          if (err) {
            console.error("Ошибка вставки категорий:", err);
            return;
          }

          // Наполняем позициями
          db.run(
            `INSERT INTO items
            (category_id, name_ru, name_en, description_ru, description_en, price, image_url)
            VALUES
            -- КОФЕ (1)
            (1, 'Эспрессо', 'Espresso',
              'Крепкий черный кофе в маленькой чашке.',
              'Strong black coffee in a small cup.',
              120, '/img/items/espresso.jpg'),

            (1, 'Капучино', 'Cappuccino',
              'Эспрессо с молоком и густой пенкой.',
              'Espresso with milk and rich foam.',
              180, '/img/items/cappuccino.jpg'),

            (1, 'Латте', 'Latte',
              'Мягкий кофейный напиток с большим количеством молока.',
              'Soft coffee drink with plenty of milk.',
              190, '/img/items/latte.jpg'),

            (1, 'Американо', 'Americano',
              'Эспрессо, разбавленный горячей водой.',
              'Espresso diluted with hot water.',
              150, '/img/items/americano.jpg'),

            (1, 'Флэт уайт', 'Flat white',
              'Двойной эспрессо с бархатистой молочной пенкой.',
              'Double espresso with silky milk foam.',
              210, '/img/items/flatWhite.jpg'),

            (1, 'Макиато', 'Macchiato',
              'Эспрессо с небольшим количеством молочной пенки.',
              'Espresso marked with a bit of milk foam.',
              170, '/img/items/machiatto.jpg'),

            (1, 'Мокко', 'Mocha',
              'Кофе с шоколадом, молоком и взбитыми сливками.',
              'Coffee with chocolate, milk and whipped cream.',
              220, '/img/items/mocha.jpg'),

            -- ЧАЙ (2)
            (2, 'Черный чай', 'Black tea',
              'Классический черный чай.',
              'Classic black tea.',
              90, '/img/items/black_tea.jpg'),

            (2, 'Зеленый чай', 'Green tea',
              'Легкий освежающий зеленый чай.',
              'Light refreshing green tea.',
              100, '/img/items/grean_tea.jpg'),

            (2, 'Травяной чай', 'Herbal tea',
              'Ароматный травяной сбор без кофеина.',
              'Aromatic herbal blend without caffeine.',
              110, '/img/items/herbal_tea.jpg'),

            (2, 'Улун', 'Oolong tea',
              'Полуферментированный чай с мягким вкусом.',
              'Semi-fermented tea with a gentle taste.',
              130, '/img/items/oolong.jpg'),

            (2, 'Белый чай', 'White tea',
              'Нежный чай из молодых почек.',
              'Delicate tea made from young buds.',
              150, '/img/items/whiteTea.jpg'),

            (2, 'Пуэр', 'Pu-erh tea',
              'Выдержанный чай с насыщенным вкусом.',
              'Aged tea with a rich, deep flavour.',
              170, '/img/items/puerh.jpg'),

            -- ДЕСЕРТЫ (3)
            (3, 'Чизкейк', 'Cheesecake',
              'Нежный сырный десерт на хрустящей основе.',
              'Creamy cheesecake on a crunchy base.',
              260, '/img/items/cheesecake.jpg'),

            (3, 'Шоколадный торт', 'Chocolate cake',
              'Торт с насыщенным шоколадным вкусом.',
              'Cake with rich chocolate flavour.',
              280, '/img/items/choko_cake.jpg'),

            (3, 'Круассан', 'Croissant',
              'Слоёный французский круассан.',
              'Flaky French croissant.',
              150, '/img/items/croissant.jpg'),

            (3, 'Пончики', 'Donuts',
              'Набор пончиков с разной глазурью.',
              'Assorted donuts with different glazes.',
              220, '/img/items/donuts.jpg'),

            (3, 'Брауни', 'Brownie',
              'Плотный шоколадный пирожок с орехами.',
              'Dense chocolate brownie with nuts.',
              230, '/img/items/brownie.jpg'),

            (3, 'Тирамису', 'Tiramisu',
              'Классический итальянский десерт с кофе.',
              'Classic Italian coffee dessert.',
              270, '/img/items/tiramisu.jpg'),

            (3, 'Пахлава', 'Baklava',
              'Слоёное восточное пирожное с орехами и мёдом.',
              'Layered dessert with nuts and honey.',
              240, '/img/items/baklava.jpg'),

            (3, 'Макарон', 'Macarons',
              'Французские миндальные пирожные.',
              'French almond cookies.',
              250, '/img/items/macaron.jpg'),

            (3, 'Крем-брюле', 'Crème brûlée',
              'Ванильный крем под хрустящей корочкой карамели.',
              'Vanilla cream under a crunchy caramel crust.',
              260, '/img/items/cremeBrulee.jpg'),

            (3, 'Пудинг', 'Pudding',
              'Нежный молочный пудинг.',
              'Soft milk pudding.',
              200, '/img/items/pudding.jpg'),

            -- МИЛКШЕЙКИ (4)
            (4, 'Шоколадный милкшейк', 'Chocolate milkshake',
              'Классический молочный коктейль с шоколадным сиропом.',
              'Classic milkshake with chocolate syrup.',
              230, '/img/items/chocolateMilkshake.jpg'),

            (4, 'Клубничный милкшейк', 'Strawberry milkshake',
              'Молочный коктейль с клубничным пюре.',
              'Milkshake with strawberry puree.',
              230, '/img/items/sMilkshake.jpg'),

            (4, 'Ванильный милкшейк', 'Vanilla milkshake',
              'Нежный ванильный молочный коктейль.',
              'Gentle vanilla milkshake.',
              220, '/img/items/vMilkshake.jpg'),

            (4, 'Банановый милкшейк', 'Banana milkshake',
              'Сытный коктейль с бананом и молоком.',
              'Rich banana and milk shake.',
              230, '/img/items/bMilkshake.jpg'),

            (4, 'Карамельный милкшейк', 'Caramel milkshake',
              'Молочный коктейль с карамельным соусом.',
              'Milkshake with caramel sauce.',
              240, '/img/items/cMilkshake.jpg'),

            -- СЭНДВИЧИ (5)
            (5, 'Клубный сэндвич', 'Club sandwich',
              'Сэндвич с курицей, беконом, сыром и овощами.',
              'Sandwich with chicken, bacon, cheese and vegetables.',
              320, '/img/items/clubS.jpg'),

            (5, 'BLT-сэндвич', 'BLT sandwich',
              'Бекон, салат, томаты и соус.',
              'Bacon, lettuce, tomato and sauce.',
              300, '/img/items/bltS.jpg'),

            (5, 'Сэндвич с тунцом', 'Tuna sandwich',
              'Тунец с майонезом и свежими овощами.',
              'Tuna with mayo and fresh veggies.',
              310, '/img/items/tunaS.jpg'),

            (5, 'Сэндвич с ветчиной и сыром', 'Ham & cheese sandwich',
              'Классический сэндвич с ветчиной и сыром.',
              'Classic ham and cheese sandwich.',
              290, '/img/items/hcs.jpg'),

            (5, 'Сэндвич с яйцом и беконом', 'Egg & bacon sandwich',
              'Жареное яйцо, бекон и сыр в тосте.',
              'Fried egg, bacon and cheese in toasted bread.',
              310, '/img/items/ebs.jpg')`
          );
        }
      );
    }
  });
});

// ================== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ==================
function getLangField(lang, ruField, enField) {
  return lang === "en" ? enField : ruField;
}

// ================== API ==================

// все категории
app.get("/api/categories", (req, res) => {
  const lang = (req.query.lang || "ru").toLowerCase();

  db.all("SELECT * FROM categories", [], (err, rows) => {
    if (err) {
      console.error("Ошибка чтения категорий:", err);
      return res.status(500).json({ error: "DB error" });
    }

    const result = rows.map((row) => ({
      id: row.id,
      name: getLangField(lang, row.name_ru, row.name_en),
      image_url: row.image_url,
    }));

    res.json(result);
  });
});

// позиции по категории
app.get("/api/items", (req, res) => {
  const lang = (req.query.lang || "ru").toLowerCase();
  const categoryId = req.query.category_id;

  if (!categoryId) {
    return res.status(400).json({ error: "category_id is required" });
  }

  db.all(
    "SELECT * FROM items WHERE category_id = ?",
    [categoryId],
    (err, rows) => {
      if (err) {
        console.error("Ошибка чтения позиций:", err);
        return res.status(500).json({ error: "DB error" });
      }

      const result = rows.map((row) => ({
        id: row.id,
        name: getLangField(lang, row.name_ru, row.name_en),
        description: getLangField(
          lang,
          row.description_ru || "",
          row.description_en || ""
        ),
        price: row.price,
        image_url: row.image_url,
      }));

      res.json(result);
    }
  );
});

// (опционально) добавление категорий
app.post("/api/categories", (req, res) => {
  const { name_ru, name_en, image_url } = req.body;
  if (!name_ru || !name_en) {
    return res.status(400).json({ error: "name_ru and name_en required" });
  }

  db.run(
    `INSERT INTO categories (name_ru, name_en, image_url)
     VALUES (?, ?, ?)`,
    [name_ru, name_en, image_url || null],
    function (err) {
      if (err) {
        console.error("Ошибка добавления категории:", err);
        return res.status(500).json({ error: "DB error" });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// (опционально) удаление категории
app.delete("/api/categories/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM categories WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("Ошибка удаления категории:", err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json({ deleted: this.changes });
  });
});

// (опционально) добавление позиции
app.post("/api/items", (req, res) => {
  const {
    category_id,
    name_ru,
    name_en,
    description_ru,
    description_en,
    price,
    image_url,
  } = req.body;

  if (!category_id || !name_ru || !name_en || price == null) {
    return res
      .status(400)
      .json({ error: "category_id, names and price required" });
  }

  db.run(
    `INSERT INTO items
     (category_id, name_ru, name_en, description_ru, description_en, price, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      category_id,
      name_ru,
      name_en,
      description_ru || "",
      description_en || "",
      price,
      image_url || null,
    ],
    function (err) {
      if (err) {
        console.error("Ошибка добавления позиции:", err);
        return res.status(500).json({ error: "DB error" });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// (опционально) удаление позиции
app.delete("/api/items/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM items WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("Ошибка удаления позиции:", err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json({ deleted: this.changes });
  });
});

// статика фронтенда
app.use("/", express.static(path.join(__dirname, "..", "frontend")));
// ===== Страницы админки =====

// Страница логина администратора
app.get("/admin-login", (req, res) => {
  res.sendFile(path.join(frontendPath, "admin-login.html"));
});

// Основная страница админ-панели
app.get("/admin", (req, res) => {
  res.sendFile(path.join(frontendPath, "admin.html"));
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


