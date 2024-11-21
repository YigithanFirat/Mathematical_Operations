const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const saltRounds = 10; // bcrypt için şifreleme seviyesini belirler

// Middleware
app.use(bodyParser.json()); // JSON verisi işlemek için
app.use(cors());

// MySQL Bağlantısı
const sql = mysql.createConnection
({
    host: 'localhost',
    user: 'root',
    password: '[priadon1.5]',
    database: 'site'
});

sql.connect(function(err) 
{
    if(err) throw err;
    console.log('[MySQL]: Veritabanı bağlantısı başarıyla kuruldu!');
});

// /register endpoint'i
app.post('/register', async (req, res) => 
{
    console.log('Gelen veri:', req.body); // Gelen veriyi kontrol edin
    const { email, password, nickname } = req.body;
    if(!email || !password || !nickname) 
    {
        console.error("Gelen veri eksik:", req.body);
        return res.status(400).send("Eksik veri");
    }
    try 
    {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const sqlSorgu = 'INSERT INTO `kullanicilar` (`email`, `password`, `nickname`, `iletiSayi`) VALUES (?, ?, ?, 0)';
    
        sql.query(sqlSorgu, [email, hashedPassword, nickname], (err, result) => 
        {
            if(err) 
            {
                console.error('Veritabanı hatası:', err);
                return res.status(500).send('Veritabanı hatası');
            }
            console.log('Bir kayıt eklendi');
            res.status(201).send('Kayıt başarıyla oluşturuldu');
        });
    } 
    catch(error) 
    {
        console.error('Şifreleme hatası:', error);
        res.status(500).send('Şifreleme hatası');
    }
});

app.listen(8080, () => 
{
    console.log('[Express]: Sunucu 8080 portunda çalışıyor');
});