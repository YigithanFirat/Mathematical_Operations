const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const http = require('http');
const util = require('util');
const jwt = require("jsonwebtoken"); // Şu an kullanılmıyor ama saklıyorum.

const app = express();
app.use(express.json());
const saltRounds = 10;
const port = 3000;

// HTTP server ayarları
const server = http.createServer(app);
server.maxHeadersCount = 1000;
server.headersTimeout = 60000;

// CORS ayarları
const allowedOrigins = ['http://localhost:8080', 'https://myapp.com'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS politikası: Köken izin vermiyor'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors());

// Hata yakalama middleware'i
app.use((err, req, res, next) => {
  console.error('Beklenmeyen Hata:', err.message);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'Beklenmeyen bir hata oluştu.' });
});

// MySQL bağlantısı
const sql = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'site',
  connectTimeout: 10000,
});

sql.connect(err => {
  if (err) {
    console.error('[MySQL]: Veritabanı bağlantısı başarısız:', err);
    process.exit(1);
  }
  console.log('[MySQL]: Veritabanı bağlantısı başarıyla kuruldu!');
});
sql.query = util.promisify(sql.query);

// REGISTER
app.post('/register', async (req, res) => {
  const { email, password, nickname, birthdate } = req.body;

  if (!email || !password || !nickname) {
    return res.status(400).send('Eksik veri: email, password ve nickname gerekli.');
  }

  if (birthdate && !/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
    return res.status(400).send('Geçersiz doğum tarihi formatı. YYYY-MM-DD olmalı.');
  }

  try {
    const existingUsers = await sql.query(
      'SELECT id FROM kullanicilar WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).send('Bu email zaten kayıtlı.');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sqlSorgu = `
      INSERT INTO kullanicilar 
      (email, administrator, password, nickname, puan, zorluk, soru_sayisi, login, birthdate) 
      VALUES (?, 0, ?, ?, 0, 1, 0, 0, ?)
    `;

    await sql.query(sqlSorgu, [
      email,
      hashedPassword,
      nickname,
      birthdate ?? null
    ]);

    res.status(201).send('Kayıt başarıyla oluşturuldu.');
  } catch (error) {
    console.error('Register hatası:', error.message);
    res.status(500).send('Sunucu hatası: ' + error.message);
  }
});

// SAVE user settings
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
    const query = 'UPDATE kullanicilar SET SoruSayisi = ?, Zorluk = ?, nickname = ? WHERE id = ?';
    await sql.query(query, [soruSayisi, Zorluk, nickname, id]);
    res.status(200).json({ message: 'Bilgiler güncellendi.' });
  } catch (err) {
    console.error('Veritabanı güncelleme hatası:', err.message);
    res.status(500).json({ error: 'Veritabanı hatası: ' + err.message });
  }
});

// LOGIN ENDPOINT
app.post('/login', async (req, res) => {
  const { nickname, password } = req.body;

  // 1. Girdi kontrolü
  if (!nickname || !password) {
    return res.status(400).json({ error: 'Nickname ve şifre gereklidir' });
  }

  try {
    // 2. Kullanıcıyı veritabanından çek
    const results = await sql.query('SELECT * FROM kullanicilar WHERE nickname = ?', [nickname]);

    if (!results || results.length === 0) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    }

    const user = results[0];

    // 3. Şifre kontrolü
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Şifre hatalı' });
    }

    // 4. Giriş başarılı, kullanıcı durumu güncelleniyor
    await sql.query('UPDATE kullanicilar SET Login = 1 WHERE id = ?', [user.id]);

    // 5. Başarılı dönüş
    res.status(200).json({
      message: 'Giriş başarılı ve Login durumu güncellendi.',
      userId: user.id,
    });

  } catch (err) {
    console.error('Login hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// ADMIN LOGIN
app.post('/loginAdmin', async (req, res) => {
  const { nickname, password } = req.body;
  if (!nickname || !password) {
    return res.status(400).send('Nickname ve şifre gereklidir');
  }
  try {
    const results = await sql.query('SELECT * FROM kullanicilar WHERE nickname = ?', [nickname]);
    if (results.length === 0) return res.status(401).send('Kullanıcı bulunamadı');

    const user = results[0];
    if (user.Administrator !== 1) {
      return res.status(403).send('Yönetici yetkiniz yok');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Şifre hatalı');

    await sql.query('UPDATE kullanicilar SET Login = 1 WHERE id = ?', [user.id]);
    res.status(200).json({ message: 'Yönetici girişi başarılı.', id: user.id });
  } catch (err) {
    console.error('Admin login hatası:', err);
    res.status(500).send('Sunucu hatası');
  }
});

// LOGOUT
app.post('/logout', async (req, res) => {
  const { userId } = req.body;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: 'Geçerli bir kullanıcı ID belirtilmedi.' });
  }

  try {
    const results = await sql.query('UPDATE kullanicilar SET Login = 0 WHERE id = ?', [userId]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı veya zaten çıkış yapmış.' });
    }
    res.status(200).json({ message: 'Çıkış başarılı.' });
  } catch (err) {
    console.error('Logout hatası:', err.message);
    res.status(500).json({ error: 'Sunucu hatası: ' + err.message });
  }
});

// SAVE RESULTS
app.post("/saveResults", async (req, res) => {
  const { zorluk, sorusayisi, nickname, puan, toplamSure } = req.body;

  if (!zorluk || !sorusayisi || !nickname || !puan || !toplamSure) {
    return res.status(400).json({ message: "Eksik veri gönderildi." });
  }

  try {
    const result = await sql.query(
      `INSERT INTO kullanici_stats (zorluk, sorusayisi, nickname, puan, toplamSure) VALUES (?, ?, ?, ?, ?)`,
      [zorluk, sorusayisi, nickname, puan, toplamSure]
    );
    res.status(200).json({ message: "Sonuç başarıyla kaydedildi.", id: result.insertId });
  } catch (err) {
    console.error("Veritabanına ekleme hatası:", err);
    res.status(500).json({ message: "Veritabanına eklenirken hata oluştu." });
  }
});

// CHECK RESULT
app.post('/checkResult', async (req, res) => {
  const { userId, points, zorlukSeviyesi, nickname, sorusayisi, toplamSure } = req.body;
  const dateOnly = new Date().toISOString().split("T")[0];

  if (!userId || typeof points !== 'number' || typeof sorusayisi !== 'number' ||
      !nickname || !zorlukSeviyesi || typeof toplamSure !== 'number') {
    return res.status(400).json({ error: 'Eksik veya geçersiz veri gönderildi!' });
  }

  try {
    const updateResult = await sql.query('UPDATE kullanicilar SET Puan = Puan + ? WHERE id = ?', [points, userId]);
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    await sql.query(
      'INSERT INTO kullanici_stats (zorluk, tarih, sorusayisi, nickname, puan, toplamSure) VALUES (?, ?, ?, ?, ?, ?)',
      [zorlukSeviyesi, dateOnly, sorusayisi, nickname, points, toplamSure]
    );

    res.status(200).json({ message: 'Puan ve sonuç kaydedildi.' });
  } catch (error) {
    console.error('checkResult hatası:', error.message);
    res.status(500).json({ error: 'Sunucu hatası: ' + error.message });
  }
});

// GET HISTORY
app.get('/history/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const results = await sql.query('SELECT * FROM kullanici_stats WHERE id = ?', [userId]);
    if (!results.length) return res.status(404).json({ error: 'Kayıt bulunamadı' });
    res.status(200).json({ data: results });
  } catch (err) {
    console.error('history hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// CHECK ADMIN
app.get("/api/check-admin", async (req, res) => {
  try {
    const rows = await sql.query("SELECT * FROM kullanicilar WHERE Administrator = 1");
    if (!rows || rows.length === 0) {
      return res.json({ isAdmin: false, message: "Administrator bulunamadı." });
    }
    return res.json({ isAdmin: true, message: "Administrator bulundu.", admins: rows });
  } catch (error) {
    console.error("Veritabanı hatası:", error);
    return res.status(500).json({ error: "Sunucu hatası. Lütfen tekrar deneyin." });
  }
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});