const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const http = require('http');
const path = require('path');
const util = require('util');
const { Date } = require('core-js');

const app = express();
app.use(express.json());
const saltRounds = 10;
const port = 3000;

const server = http.createServer(app);
server.maxHeadersCount = 1000;
server.headersTimeout = 60000;

const allowedOrigins = ['http://localhost:8080', 'https://myapp.com'];
app.use(cors
({
  origin: (origin, callback) => 
  {
    if(!origin || allowedOrigins.includes(origin)) 
    {
      callback(null, true);
    } 
    else 
    {
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());

app.use((err, req, res, next)  => 
{
  console.log('Gelen Başlıklar:', req.headers);
  console.error('Beklenmeyen Hata:', err.message);
  res.status(500).json({ error: 'Beklenmeyen bir hata oluştu.' });
  next();
});

const sql = mysql.createConnection
({
  host: 'localhost',
  user: 'root',
  password: '[priadon1.5]',
  database: 'site',
  connectTimeout: 10000,
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

sql.query = util.promisify(sql.query);

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
  const { soruSayisi, id, Zorluk, nickname } = req.body;
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
  if(!nickname || typeof nickname !== 'string' || nickname.trim() === '') 
  {
    return res.status(400).json({ error: 'Geçerli bir kullanıcı adı belirtilmelidir.' });
  }
  const query = 'UPDATE kullanicilar SET SoruSayisi = ?, Zorluk = ?, nickname = ? WHERE id = ?';
  sql.query(query, [soruSayisi, Zorluk, nickname, id], (err, results) => 
  {
    if(err) 
    {
      console.error('Veritabanı güncelleme hatası:', err.message);
      return res.status(500).json({ error: 'Veritabanı hatası: ' + err.message });
    }
    console.log('Güncelleme Sonucu: ', results);
    res.status(200).json({ message: 'Soru sayısı, zorluk ve kullanıcı adı başarıyla güncellendi!' });
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
      });
    });
  });
});

app.post('/logout', async (req, res) => 
{
  console.log('Gelen Veri: ', req.body);
  const { userId } = req.body;

  if(!userId) 
  {
    return res.status(400).json({ error: 'Kullanıcı ID belirtilmedi.' });
  }
  try 
  {
    const query = 'UPDATE kullanicilar SET Login = 0 WHERE id = ?';
    const results = sql.query(query, [userId]);
    if(results.affectedRows === 0) 
    {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı veya zaten çıkış yapmış.' });
    }
    console.log('Logout işlemi başarılı: ', results);
    res.status(200).json({ message: 'Çıkış işlemi başarılı.' });
  }
  catch(error)
  {
    console.error('Veritabanı hatası:', error.message);
    res.status(500).json({ error: 'Veritabanı hatası: ' + error.message });
  }
});

app.post('/checkResult', async (req, res) => 
{
  const { userId, points, zorlukSeviyesi, nickname, sorusayisi, tarih} = req.body;
  const now = new Date();
  const dateOnly = now.toISOString().split("T")[0];
  if(!userId || !Number.isInteger(userId)) 
  {
    return res.status(400).json({ error: 'Geçersiz veya eksik kullanıcı ID!' });
  }
  if(points === undefined || typeof points !== 'number') 
  {
    return res.status(400).json({ error: 'Geçersiz veya eksik puan!' });
  }
  if(sorusayisi === undefined || typeof sorusayisi !== 'number') 
  {
    return res.status(400).json({ error: 'Geçersiz veya eksik soru sayısı!' });
  }
  if(!nickname || typeof nickname !== 'string') 
  {
    return res.status(400).json({ error: 'Geçersiz veya eksik nickname!' });
  }
  if(!zorlukSeviyesi || typeof zorlukSeviyesi !== 'string') 
  {
    return res.status(400).json({ error: 'Geçersiz veya eksik zorluk seviyesi!' });
  }
  try
  {
    const results = await sql.query
    (
      'UPDATE kullanicilar SET Puan = Puan + ? WHERE id = ?',
      [points, userId],
    );
    const sorgu = await sql.query
    (
      'INSERT INTO backup (zorluk, tarih, sorusayisi, nickname, puan) VALUES(?, ?, ?, ?, ?)',
      [zorlukSeviyesi, dateOnly, sorusayisi, nickname, points]
    );
    if(!results || results.affectedRows === 0) 
    {
      return res.status(404).json
      ({
        error: 'Kullanıcı bulunamadı veya Login durumu aktif değil.',
      });
    }
    res.status(200).json({ message: 'Puan başarıyla eklendi!' });
  } 
  catch(error) 
  {
    console.error('Hata:', error.message || error);
    res.status(500).json
    ({
      error: 'Sunucu hatası. Lütfen tekrar deneyin.',
      details: error.message,
    });
  }
});

app.get('/api/user/history', async (req, res) => 
  {
      try 
      {
          const history = await sql.query('SELECT * FROM backup');
          console.log('Veritabanından gelen veri:', history.rows);
          res.json(history.rows);
      } 
      catch(error) 
      {
          console.error('Veritabanı bağlantı hatası:', error);
          res.status(500).json({ error: 'Veritabanı bağlantısı başarısız.' });
      }
  });  

app.get('/history', async (req, res) => 
{
  try 
  {
    const result = await sql.query('SELECT * FROM backup ORDER BY tarih DESC');
    res.json(result.rows);
  } 
  catch(error) 
  {
    console.error('Veri çekme hatası:', error);
    res.status(500).json({ error: 'Veritabanı hatası' });
  }
});

app.listen(port, () => 
{
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});