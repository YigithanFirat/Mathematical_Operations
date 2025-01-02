const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
const saltRounds = 10;
const port = 3000;

app.use(bodyParser.json());
const http = require('http');
const server = http.createServer(app);
server.maxHeadersCount = 1000;
server.headersTimeout = 60000;

app.use(cors
({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use((req, res, next) =>
{
  console.log('Gelen Başlıklar:', req.headers);
  next();
});

const sql = mysql.createConnection
({
  host: 'localhost',
  user: 'root',
  password: '[priadon1.5]',
  database: 'site'
});

sql.connect(function(err) 
{
  if(err) 
  {
    console.error('[MySQL]: Veritabanı bağlantısı başarısız:', err);
    process.exit(1);
  }
  console.log('[MySQL]: Veritabanı bağlantısı başarıyla kuruldu!');
});

app.get('/', (req, res) => 
{
  res.send('[HOME]: Backend API çalışıyor!');
});

app.get('/history', (req, res) => 
{
  res.send('[HISTORY]: Backend API çalışıyor!');
});

app.get('/login', (req, res) => 
{
  res.send('[LOGIN]: Backend API çalışıyor!');
});

app.get('/members', (req, res) => 
{
  res.send('[MEMBERS]: Backend API çalışıyor!');
});

app.get('/register', (req, res) => 
{
  res.send('[REGISTER]: Backend API çalışıyor!');
});

app.get('/settings', (req, res) =>
{
  res.send('[SETTINGS]: Backend API çalışıyor!');
});

app.post('/register', async (req, res) => 
{
  const { email, password, nickname } = req.body;
  if(!email || !password || !nickname) 
  {
    return res.status(400).send('Eksik veri');
  }
  try 
  {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const sqlSorgu = 'INSERT INTO kullanicilar (email, Administrator, password, nickname, Puan, Zorluk, SoruSayisi, Login) VALUES (?, 0, ?, ?, 0, 1, 20, 0)';
    sql.query(sqlSorgu, [email, hashedPassword, nickname], (err, result) => 
    {
      if(err) 
      {
          console.error('Veritabanı hatası:', err);
          return res.status(500).send('Veritabanı hatası');
      }
      res.status(201).send('Kayıt başarıyla oluşturuldu');
    });
  }
  catch(error) 
  {
    console.error('Şifreleme hatası:', error);
    res.status(500).send('Şifreleme hatası');
  }
});

app.post('/save', (req, res) => 
{
  const { soruSayisi, id, Zorluk } = req.body;
  console.log('Gelen Veri: ', req.body);
  if(!soruSayisi || isNaN(soruSayisi) || soruSayisi <= 0) 
  {
    return res.status(400).json({ error: 'Geçerli bir soru sayısı girilmelidir.' });
  }
  if(!Zorluk || ![1, 2, 3].includes(Number(Zorluk))) 
  {
    return res.status(400).json({ error: 'Geçerli bir zorluk değeri seçilmelidir.' });
  }
  if(!id) 
  {
    return res.status(400).json({ error: 'Geçerli bir kullanıcı ID\'si belirtilmelidir.' });
  }
  const query = 'UPDATE kullanicilar SET SoruSayisi = ?, Zorluk = ? WHERE id = ?';
  sql.query(query, [soruSayisi, Zorluk, id], (err, results) => {
  if(err) 
  {
    console.error('Veritabanı güncelleme hatası:', err.message);
    return res.status(500).json({ error: 'Veritabanı hatası: ' + err.message });
  }
  console.log('Güncelleme Sonucu: ', results);
  res.status(200).json({ message: 'Soru sayısı ve zorluk başarıyla güncellendi!' });
  });
});

app.post('/login', (req, res) => 
{
  console.log(req.body);
  const { nickname, password } = req.body;
  if(!nickname || !password) 
  {
    return res.status(400).send('Nickname ve şifre gereklidir');
  }
  const sqlSorgu = 'SELECT * FROM kullanicilar WHERE nickname = ?';
  sql.query(sqlSorgu, [nickname], async (err, results) => 
  {
    if(err) 
    {
      console.error('Veritabanı hatası: ', err);
      return res.status(500).send('Veritabanı hatası');
    }
    if(results.length === 0) 
    {
        return res.status(401).send('Kullanıcı bulunamadı');
    }
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) 
    {
      return res.status(401).send('Şifre hatalı');
    }
    const updateLoginSorgu = 'UPDATE kullanicilar SET Login = 1 WHERE id = ?';
    sql.query(updateLoginSorgu, [user.id], (updateErr, updateResults) => 
    {
      if(updateErr) 
      {
        console.error('Login durumunu güncelleme hatası: ', updateErr);
        return res.status(500).send('Login durumunu güncellerken bir hata oluştu.');
      }
      console.log('Login durumu başarıyla güncellendi: ', updateResults);
      res.status(200).json
      ({
        message: 'Giriş başarılı ve Login durumu güncellendi.',
        userId: user.id,
        login: true,
      });
    });
  });
});

app.post('/logout', (req, res) => 
{
  const { id } = req.body;
  if(!id) 
  {
    return res.status(400).send("Kullanıcı ID'si gereklidir.");
  }
  const sqlSorgu = 'UPDATE kullanicilar SET Login = 0 WHERE id = ?';
  sql.query(sqlSorgu, [id], (err, results) => 
  {
    if(err) 
    {
      console.error("Veritabanı hatası:", err);
      return res.status(500).send("Veritabanı hatası.");
    }
    if(results.affectedRows === 0) 
    {
      return res.status(404).send("Kullanıcı bulunamadı.");
    }
    console.log("Kullanıcı başarıyla çıkış yaptı:", results);
    res.status(200).send("Kullanıcı başarıyla çıkış yaptı.");
  });
});


app.get('/getCurrentUser', (req, res) => 
{
  const token = req.headers.authorization;
  if(!token) 
  {
    return res.status(401).send("Kullanıcı oturumu geçersiz.");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;
  const sqlSorgu = 'SELECT id FROM kullanicilar WHERE id = ? AND Login = 1';
  sql.query(sqlSorgu, [userId], (err, results) => 
  {
    if(err) 
    {
      console.error("Veritabanı hatası:", err);
      return res.status(500).send("Veritabanı hatası.");
    }
    if(results.length === 0) 
    {
      return res.status(404).send("Kullanıcı bulunamadı.");
    }
    res.status(200).json({ userId: results[0].id });
  });
});

app.listen(port, () => 
{
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});