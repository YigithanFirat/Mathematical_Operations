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
    // Eğer origin yoksa (örneğin Postman), izin ver.
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

// Hata yakalama middleware'i (en son middleware olarak olmalı)
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

// Promisify query fonksiyonu (async/await kullanmak için)
sql.query = util.promisify(sql.query);

// REGISTER
app.post('/register', async (req, res) => {
  const { email, password, nickname } = req.body;
  if (!email || !password || !nickname) {
    return res.status(400).send('Eksik veri');
  }
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const sqlSorgu = `INSERT INTO kullanicilar 
      (email, Administrator, password, nickname, Puan, Zorluk, SoruSayisi, Login) 
      VALUES (?, 0, ?, ?, 0, 1, 20, 0)`;
    await sql.query(sqlSorgu, [email, hashedPassword, nickname]);
    res.status(201).send('Kayıt başarıyla oluşturuldu');
  } catch (error) {
    console.error('Register hatası:', error);
    res.status(500).send('Sunucu hatası');
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
    const results = await sql.query(query, [soruSayisi, Zorluk, nickname, id]);
    res.status(200).json({ message: 'Soru sayısı, zorluk ve kullanıcı adı başarıyla güncellendi!' });
  } catch (err) {
    console.error('Veritabanı güncelleme hatası:', err.message);
    res.status(500).json({ error: 'Veritabanı hatası: ' + err.message });
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  const { nickname, password } = req.body;
  if (!nickname || !password) {
    return res.status(400).send('Nickname ve şifre gereklidir');
  }
  try {
    const results = await sql.query('SELECT * FROM kullanicilar WHERE nickname = ?', [nickname]);
    if (results.length === 0) return res.status(401).send('Kullanıcı bulunamadı');

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Şifre hatalı');

    await sql.query('UPDATE kullanicilar SET Login = 1 WHERE id = ?', [user.id]);
    res.status(200).json({ message: 'Giriş başarılı ve Login durumu güncellendi.' });
  } catch (err) {
    console.error('Login hatası:', err);
    res.status(500).send('Sunucu hatası');
  }
});

// LOGIN ADMIN (aynı login fonksiyonu gibi, farklı sadece)
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
    res.status(200).json({ message: 'Yönetici girişi başarılı ve Login durumu güncellendi.' });
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
    res.status(200).json({ message: 'Çıkış işlemi başarılı.' });
  } catch (err) {
    console.error('Logout sırasında hata:', err.message);
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
    const query = `INSERT INTO backup (zorluk, sorusayisi, nickname, puan, toplamSure) VALUES (?, ?, ?, ?, ?)`;
    const values = [zorluk, sorusayisi, nickname, puan, toplamSure];
    const result = await sql.query(query, values);
    res.status(200).json({ message: "Sonuç başarıyla kaydedildi.", id: result.insertId });
  } catch (err) {
    console.error("Veritabanına ekleme hatası:", err);
    res.status(500).json({ message: "Veritabanına eklenirken bir hata oluştu." });
  }
});

// CHECK RESULT (puan güncelleme ve backup tablosuna ekleme)
app.post('/checkResult', async (req, res) => {
  const { userId, points, zorlukSeviyesi, nickname, sorusayisi, toplamSure } = req.body;
  const now = new Date();
  const dateOnly = now.toISOString().split("T")[0];

  if (!userId || !Number.isInteger(userId)) {
    return res.status(400).json({ error: 'Geçersiz veya eksik kullanıcı ID!' });
  }
  if (typeof points !== 'number') {
    return res.status(400).json({ error: 'Geçersiz veya eksik puan!' });
  }
  if (typeof sorusayisi !== 'number') {
    return res.status(400).json({ error: 'Geçersiz veya eksik soru sayısı!' });
  }
  if (!nickname || typeof nickname !== 'string') {
    return res.status(400).json({ error: 'Geçersiz veya eksik nickname!' });
  }
  if (!zorlukSeviyesi || typeof zorlukSeviyesi !== 'string') {
    return res.status(400).json({ error: 'Geçersiz veya eksik zorluk seviyesi!' });
  }
  if (!toplamSure || typeof toplamSure !== 'number') {
    return res.status(400).json({ error: 'Geçersiz veya eksik toplam süre!' });
  }

  try {
    const updateResult = await sql.query('UPDATE kullanicilar SET Puan = Puan + ? WHERE id = ?', [points, userId]);
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı veya Login durumu aktif değil.' });
    }

    const insertBackup = await sql.query(
      'INSERT INTO backup (zorluk, tarih, sorusayisi, nickname, puan, toplamSure) VALUES (?, ?, ?, ?, ?, ?)',
      [zorlukSeviyesi, dateOnly, sorusayisi, nickname, points, toplamSure]
    );

    res.status(200).json({ message: 'Puan başarıyla eklendi!' });
  } catch (error) {
    console.error('Hata:', error.message || error);
    res.status(500).json({
      error: 'Sunucu hatası. Lütfen tekrar deneyin.',
      details: error.message,
    });
  }
});

// GET HISTORY
app.get('/history/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const results = await sql.query('SELECT * FROM backup WHERE userId = ?', [userId]);
    if (!results.length) return res.status(404).json({ error: 'Kayıt bulunamadı' });
    res.status(200).json({ data: results });
  } catch (err) {
    console.error('history hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

app.get("/api/check-admin", async (req, res) => {
  try {
    const rows = await sql.query("SELECT * FROM kullanicilar WHERE Administrator = 1");
    // sql.query promisify edilmiş, doğrudan sonuç döner
    if (!rows || rows.length === 0) {
      return res.json({ isAdmin: false, message: "Administrator bulunamadı." });
    }
    return res.json({ isAdmin: true, message: "Administrator bulundu.", admins: rows });
  } catch (error) {
    console.error("Veritabanı hatası:", error);
    return res.status(500).json({ error: "Sunucu hatası. Lütfen tekrar deneyin." });
  }
});

app.listen(port, () =>
{
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});