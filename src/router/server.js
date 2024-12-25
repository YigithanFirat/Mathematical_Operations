const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const saltRounds = 10;
const port = 8080;

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

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
    const sqlSorgu = 'INSERT INTO kullanicilar (email, Administrator, password, nickname, Puan, Zorluk, SoruSayisi, Login) VALUES (?, 0, ?, ?, 0, 0, 20, 0)';
    sql.query(sqlSorgu, [email, hashedPassword, nickname], (err, result) => {
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

app.post('/login', (req, res) => 
{
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

    res.status(200).send('Giriş başarılı');
  });
});

app.listen(port, () => 
{
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});