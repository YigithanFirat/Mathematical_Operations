const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const util = require('util');

const app = express();
app.use(express.json());

const saltRounds = 10;
const port = 3000;

// CORS ayarları
const allowedOrigins = ['http://localhost:8080', 'https://myapp.com'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS politikası: Köken izin vermiyor'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.options('*', cors());

// Hata yakalama middleware'i (express error handler)
app.use((err, req, res, next) => {
  console.error('Beklenmeyen Hata:', err.message);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'Beklenmeyen bir hata oluştu.' });
});

// MySQL bağlantısı
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'site',
  connectTimeout: 10000,
});

db.connect(err => {
  if (err) {
    console.error('[MySQL]: Veritabanı bağlantısı başarısız:', err);
    process.exit(1);
  }
  console.log('[MySQL]: Veritabanı bağlantısı başarıyla kuruldu!');
});

db.query = util.promisify(db.query);

// REGISTER
app.post('/register', async (req, res) => {
  const { email, password, nickname, birthdate } = req.body;

  if (!email || !password || !nickname) {
    return res.status(400).json({ error: 'Eksik veri: email, password ve nickname gerekli.' });
  }

  if (birthdate && !/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
    return res.status(400).json({ error: 'Geçersiz doğum tarihi formatı. YYYY-MM-DD olmalı.' });
  }

  try {
    const existingUsers = await db.query('SELECT id FROM kullanicilar WHERE email = ?', [email]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Bu email zaten kayıtlı.' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertQuery = `
      INSERT INTO kullanicilar 
      (email, administrator, password, nickname, puan, zorluk, soru_sayisi, login, birthdate) 
      VALUES (?, 0, ?, ?, 0, 1, 0, 0, ?)
    `;

    await db.query(insertQuery, [email, hashedPassword, nickname, birthdate ?? null]);

    res.status(201).json({ message: 'Kayıt başarıyla oluşturuldu.' });
  } catch (error) {
    console.error('Register hatası:', error.message);
    res.status(500).json({ error: 'Sunucu hatası: ' + error.message });
  }
});

// SAVE USER SETTINGS
app.post('/save', async (req, res) => {
  const { soruSayisi, id, Zorluk, nickname } = req.body;

  if (!soruSayisi || isNaN(soruSayisi) || soruSayisi <= 0) {
    return res.status(400).json({ error: 'Geçerli bir soru sayısı girilmelidir.' });
  }
  if (!Zorluk || ![1, 2, 3].includes(Number(Zorluk))) {
    return res.status(400).json({ error: 'Geçerli bir zorluk değeri seçilmelidir.' });
  }
  if (!id) {
    return res.status(400).json({ error: 'Geçerli bir kullanıcı ID\'si belirtilmelidir.' });
  }
  if (!nickname || typeof nickname !== 'string' || nickname.trim() === '') {
    return res.status(400).json({ error: 'Geçerli bir kullanıcı adı belirtilmelidir.' });
  }

  try {
    const query = 'UPDATE kullanicilar SET soru_sayisi = ?, zorluk = ?, nickname = ? WHERE id = ?';
    await db.query(query, [soruSayisi, Zorluk, nickname, id]);
    res.status(200).json({ message: 'Bilgiler güncellendi.' });
  } catch (err) {
    console.error('Veritabanı güncelleme hatası:', err.message);
    res.status(500).json({ error: 'Veritabanı hatası: ' + err.message });
  }
});

// LOGIN ENDPOINT
app.post('/login', async (req, res) => {
  const { nickname, password } = req.body;

  if (!nickname || !password) {
    return res.status(400).json({ error: 'Nickname ve şifre gereklidir.' });
  }

  try {
    const users = await db.query('SELECT * FROM kullanicilar WHERE nickname = ?', [nickname]);

    if (!users.length) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Şifre hatalı.' });
    }

    await db.query('UPDATE kullanicilar SET login = 1 WHERE id = ?', [user.id]);

    res.status(200).json({
      message: 'Giriş başarılı ve Login durumu güncellendi.',
      userId: user.id,
    });
  } catch (err) {
    console.error('Login hatası:', err.message);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// ADMIN LOGIN
app.post('/loginAdmin', async (req, res) => {
  const { nickname, password } = req.body;

  if (!nickname || !password) {
    return res.status(400).json({ error: 'Nickname ve şifre gereklidir.' });
  }

  try {
    const users = await db.query('SELECT * FROM kullanicilar WHERE nickname = ?', [nickname]);

    if (!users.length) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı.' });
    }

    const user = users[0];

    if (user.administrator !== 1) {
      return res.status(403).json({ error: 'Yönetici yetkiniz yok.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Şifre hatalı.' });
    }

    await db.query('UPDATE kullanicilar SET login = 1 WHERE id = ?', [user.id]);

    res.status(200).json({ message: 'Yönetici girişi başarılı.', id: user.id });
  } catch (err) {
    console.error('Admin login hatası:', err.message);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// LOGOUT
app.post('/logout', async (req, res) => {
  const { userId } = req.body;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: 'Geçerli bir kullanıcı ID belirtilmedi.' });
  }

  try {
    const result = await db.query('UPDATE kullanicilar SET login = 0 WHERE id = ?', [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı veya zaten çıkış yapmış.' });
    }

    res.status(200).json({ message: 'Çıkış başarılı.' });
  } catch (err) {
    console.error('Logout hatası:', err.message);
    res.status(500).json({ error: 'Sunucu hatası: ' + err.message });
  }
});

app.post('/saveResults', async (req, res) => {
  const { zorluk, sorusayisi, nickname, puan, toplamSure, islem } = req.body;

  console.log('Gelen veriler:', req.body);

  if (!zorluk || !sorusayisi || !nickname || !puan || !toplamSure || !islem) {
    return res.status(400).json({ error: 'Eksik veri gönderildi.' });
  }

  try {
    const result = await db.query(
      `INSERT INTO kullanici_stats (\`zorluk\`, \`sorusayisi\`, \`nickname\`, \`puan\`, \`toplamSure\`, \`islem\`) VALUES (?, ?, ?, ?, ?, ?)`,
      [zorluk, sorusayisi, nickname, puan, toplamSure, islem]
    );

    res.status(200).json({
      message: 'Sonuç başarıyla kaydedildi.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Veritabanına ekleme hatası:', err.message);
    res.status(500).json({ error: 'Veritabanına eklenirken hata oluştu.' });
  }
});

app.post('/checkResult', async (req, res) => {
  const { userId, points, zorlukSeviyesi, nickname, sorusayisi, toplamSure, islem } = req.body;

  // Tarih kısmını sadece YYYY-MM-DD olarak alıyoruz
  const dateOnly = new Date().toISOString().split('T')[0];

  // Veri kontrolü
  if (
    !userId ||
    typeof points !== 'number' ||
    typeof sorusayisi !== 'number' ||
    !nickname ||
    !zorlukSeviyesi ||
    typeof toplamSure !== 'number'
  ) {
    return res.status(400).json({ error: 'Eksik veya geçersiz veri gönderildi!' });
  }

  try {
    // Kullanıcının puanını güncelle
    const updateResult = await db.query(
      'UPDATE kullanicilar SET puan = puan + ? WHERE id = ?',
      [points, userId]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    // Sonucu kaydet
    // Eğer islem alanı varsa, sorguya ekle
    const insertQuery = islem
      ? 'INSERT INTO kullanici_stats (zorluk, tarih, sorusayisi, nickname, puan, toplamSure, islem) VALUES (?, ?, ?, ?, ?, ?, ?)'
      : 'INSERT INTO kullanici_stats (zorluk, tarih, sorusayisi, nickname, puan, toplamSure) VALUES (?, ?, ?, ?, ?, ?)';

    const insertValues = islem
      ? [zorlukSeviyesi, dateOnly, sorusayisi, nickname, points, toplamSure, islem]
      : [zorlukSeviyesi, dateOnly, sorusayisi, nickname, points, toplamSure];

    await db.query(insertQuery, insertValues);

    res.status(200).json({ message: 'Puan ve sonuç başarıyla kaydedildi.' });
  } catch (error) {
    console.error('checkResult hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası: ' + error.message });
  }
});

// HISTORY GET
app.get('/history/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const users = await db.query('SELECT login, nickname FROM kullanicilar WHERE id = ?', [userId]);

    if (!users.length) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı.' });
    }

    const user = users[0];

    if (!user.login) {
      return res.status(403).json({ error: 'Giriş yapmamış.' });
    }

    const history = await db.query(
      `
      SELECT islem, DATE_FORMAT(tarih, '%Y-%m-%d %H:%i:%s') AS tarih,
             sorusayisi, nickname, puan, toplamSure
      FROM kullanici_stats
      WHERE nickname = ?
      ORDER BY tarih DESC
      `,
      [user.nickname]
    );

    if (!history.length) {
      return res.status(404).json({ error: 'Geçmiş bulunamadı.' });
    }

    res.json({ data: history });
  } catch (err) {
    console.error('GET /history hata:', err.message);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// CHECK ADMIN
app.get('/api/check-admin', async (req, res) => {
  try {
    const admins = await db.query('SELECT * FROM kullanicilar WHERE administrator = 1');

    if (!admins.length) {
      return res.json({ isAdmin: false, message: 'Administrator bulunamadı.' });
    }

    res.json({ isAdmin: true, message: 'Administrator bulundu.', admins });
  } catch (error) {
    console.error('Veritabanı hatası:', error.message);
    res.status(500).json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.' });
  }
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});