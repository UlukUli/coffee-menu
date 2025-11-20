
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Подключаемся к базе (файл menu.db создастся сам, если его нет)
const dbPath = path.join(__dirname, 'menu.db');
const db = new sqlite3.Database(dbPath);

// Чтобы фронт мог общаться с бэком и чтобы работать с JSON
app.use(cors());
app.use(express.json());

// ====== ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ ======
db.serialize(() => {
  // Таблица категорий
  db.run(
    `CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_ru TEXT NOT NULL,
      name_en TEXT NOT NULL,
      image_url TEXT
    )`
  );

  // Таблица позиций
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

  // Заполняем тестовыми данными, если таблица категорий пустая
  db.get('SELECT COUNT(*) AS count FROM categories', (err, row) => {
    if (err) {
      console.error('Ошибка проверки категорий:', err);
      return;
    }

    if (row.count === 0) {
      console.log('База пустая, добавляем стартовые данные...');

      db.run(
        `INSERT INTO categories (name_ru, name_en, image_url)
         VALUES 
         ('Кофе', 'Coffee', 'https://via.placeholder.com/300x200?text=Coffee'),
         ('Чай', 'Tea', 'https://via.placeholder.com/300x200?text=Tea'),
         ('Десерты', 'Desserts', 'https://via.placeholder.com/300x200?text=Dessert')`
      );

           db.run(
        `INSERT INTO items 
        (category_id, name_ru, name_en, description_ru, description_en, price, image_url)
        VALUES
        -- КОФЕ (категория 1)
        (1, 'Эспрессо', 'Espresso', 'Крепкий черный кофе', 'Strong black coffee', 120, '/img/items/espresso.jpg'),
        (1, 'Капучино', 'Cappuccino', 'Эспрессо, молоко, густая пенка', 'Espresso, milk, foam', 180, '/img/items/cappuccino.jpg'),
        (1, 'Латте', 'Latte', 'Кофе с большим количеством молока', 'Coffee with milk', 190, '/img/items/latte.jpg'),
        (1, 'Американо', 'Americano', 'Эспрессо, вода', 'Espresso, water', 150, '/img/items/americano.jpg'),


        -- ЧАЙ (категория 2)
        (2, 'Черный чай', 'Black tea', 'Классический черный чай', 'Classic black tea', 90, '/img/items/black_tea.jpg'),
        (2, 'Зеленый чай', 'Green tea', 'Легкий освежающий зеленый чай', 'Light refreshing green tea', 100, '/img/items/grean_tea.jpg'),
        (2, 'Травяной чай', 'Herbal tea', 'Ароматный микс трав без кофеина', 'Herbal mix without caffeine', 110, '/img/items/herbal_tea.jpg'),

        -- ДЕСЕРТЫ (категория 3)
        (3, 'Чизкейк', 'Cheesecake', 'Нежный сырный десерт', 'Soft cream-cheese dessert', 260, '/img/items/cheesecake.jpg'),
        (3, 'Шоколадный торт', 'Chocolate cake', 'Торт с насыщенным шоколадным вкусом', 'Rich chocolate cake', 280, '/img/items/choko_cake.jpg'),
        (3, 'Круассан', 'Croissant', 'Слоеный круассан, свежая выпечка', 'Flaky fresh croissant', 150, '/img/items/croissant.jpg')`
      );



    }
  });
});

// ====== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ЯЗЫКА ======
function getLangField(lang, ruField, enField) {
  return lang === 'en' ? enField : ruField;
}

// ====== API ======

// Получить все категории
app.get('/api/categories', (req, res) => {
  const lang = (req.query.lang || 'ru').toLowerCase();

  db.all('SELECT * FROM categories', [], (err, rows) => {
    if (err) {
      console.error('Ошибка чтения категорий:', err);
      return res.status(500).json({ error: 'DB error' });
    }

    const result = rows.map(row => ({
      id: row.id,
      name: getLangField(lang, row.name_ru, row.name_en),
      image_url: row.image_url
    }));

    res.json(result);
  });
});

// Получить позиции по категории
app.get('/api/items', (req, res) => {
  const lang = (req.query.lang || 'ru').toLowerCase();
  const categoryId = req.query.category_id;

  if (!categoryId) {
    return res.status(400).json({ error: 'category_id is required' });
  }

  db.all(
    'SELECT * FROM items WHERE category_id = ?',
    [categoryId],
    (err, rows) => {
      if (err) {
        console.error('Ошибка чтения позиций:', err);
        return res.status(500).json({ error: 'DB error' });
      }

      const result = rows.map(row => ({
        id: row.id,
        name: getLangField(lang, row.name_ru, row.name_en),
        description: getLangField(lang, row.description_ru, row.description_en),
        price: row.price,
        image_url: row.image_url
      }));

      res.json(result);
    }
  );
});

// Добавить категорию
app.post('/api/categories', (req, res) => {
  const { name_ru, name_en, image_url } = req.body;

  if (!name_ru || !name_en) {
    return res.status(400).json({ error: 'name_ru and name_en required' });
  }

  db.run(
    `INSERT INTO categories (name_ru, name_en, image_url)
     VALUES (?, ?, ?)`,
    [name_ru, name_en, image_url || null],
    function (err) {
      if (err) {
        console.error('Ошибка добавления категории:', err);
        return res.status(500).json({ error: 'DB error' });
      }

      res.status(201).json({ id: this.lastID });
    }
  );
});


// Удалить категорию
app.delete('/api/categories/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM categories WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Ошибка удаления категории:', err);
      return res.status(500).json({ error: 'DB error' });
    }

    res.json({ deleted: this.changes });
  });
});

// Добавить позицию
app.post('/api/items', (req, res) => {
  const {
    category_id,
    name_ru,
    name_en,
    description_ru,
    description_en,
    price,
    image_url
  } = req.body;

  if (!category_id || !name_ru || !name_en || price == null) {
    return res.status(400).json({ error: 'category_id, names and price required' });
  }

  db.run(
    `INSERT INTO items 
     (category_id, name_ru, name_en, description_ru, description_en, price, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [category_id, name_ru, name_en, description_ru || '', description_en || '', price, image_url || null],
    function (err) {
      if (err) {
        console.error('Ошибка добавления позиции:', err);
        return res.status(500).json({ error: 'DB error' });
      }

      res.status(201).json({ id: this.lastID });
    }
  );
});

// Удалить позицию
app.delete('/api/items/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM items WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Ошибка удаления позиции:', err);
      return res.status(500).json({ error: 'DB error' });
    }

    res.json({ deleted: this.changes });
  });
});

// Отдаём фронтенд как статику
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

// Страница админ-панели
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

