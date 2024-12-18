<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
  <div id="app">
    <router-view/>
    <div class="full-body">
        <div class="header">
            <ul>
                <li><a href="/"> <i class="fa-solid fa-house"></i> Anasayfa </a></li>
                <li><a href="/panel"> <i class="fa-solid fa-layer-group"></i> Panel </a></li>
                <li><a href="/members"> <i class="fa-solid fa-person"></i> Üyeler </a></li>
                <li><a href="/history"> <i class="fa-solid fa-ghost"></i> Geçmiş </a></li>
                <li><a href="/settings"> <i class="fa-solid fa-user-gear"></i> Ayarlar </a></li>
                <li><a href="/exit"> <i class="fa-solid fa-door-open"></i> Çıkış </a></li>
                <abbr title="Giriş Yap">
                    <button @click="navigateToLogin()">Giriş Yap</button>
                </abbr>
                <abbr title="Kaydol">
                    <button @click="navigateToRegister()">Kaydol</button>
                </abbr>
            </ul>
        </div>
        <div class="zorluk">
            <div class="checkbox-container">
                <input type="checkbox" id="derece1" name="derece1" value="Kolay">
                <label for="derece1">Kolay</label>
            </div>
            <div class="checkbox-container">
                <input type="checkbox" id="derece2" name="derece2" value="Orta">
                <label for="derece2">Orta</label>
            </div>
            <div class="checkbox-container">
                <input type="checkbox" id="derece3" name="derece3" value="Zor">
                <label for="derece3">Zor</label>
            </div>
        </div>
        <div class="islemler">
            <div id="randomsayi1">
                <label for="ilk-sayi">İlk Sayı</label>
                <input type="number" id="first-number">
            </div>
            <div id="randomsayi2">
                <label for="ikinci-sayi">İkinci Sayı</label>
                <input type="number" id="second-number">
            </div>
            <div id="sonuc">
                <label for="sonuc">Sonuç</label>
                <input type="number" id="result">
                <div id="kontrol">
                    <abbr title="Sonucu Kontrol Et">
                        <button @click="checkResult()">Sonucu Kontrol Et</button>
                    </abbr>
                </div>
            </div>
        </div>
        <div class="footer">
            <ul>
                <li><a href=""> PROJECT DESTINY <i class="fa-regular fa-copyright"></i> All Rights Reserved</a></li>
                <li><a href="https://github.com/YigithanFirat"><i class="fa-solid fa-code"></i> Yiğithan FIRAT</a></li>
                <li><a href="">Sitenin tüm hakları saklıdır.</a></li>
            </ul> 
        </div>
     </div>
  </div>
</template>

<script>
import axios from "axios";

function generateRandomNumber()
{
    const firstnumber = Math.floor(Math.random() * 100);
    const secondnumber = Math.floor(Math.random() * 100);

    document.getElementById("first-number").value = firstnumber;
    document.getElementById("second-number").value = secondnumber;
    document.getElementById("result").value = result;
}

function checkResult()
{
    const firstnumber = parrseInt(document.getElementById("first-number").value);
    const secondnumber = parrseInt(document.getElementById("second-number").value);
    const userResult = parrseInt(document.getElementById("result").value);

    if(firstnumber + secondnumber == userResult)
    {
        alert("Doğru! Yeni sayılar üretliyor...");
        generateRandomNumber();
    }
    else alert("Hatalı sonuç! Lütfen tekrar deneyiniz!");
}

window.onload = generateRandomNumber;

export default 
{
  name: "Home",
  methods: 
  {
    navigateToLogin() 
    {
      return this.$router.push("/login");
    },

    navigateToRegister() 
    {
      return this.$router.push("/register");
    },
  }
};

</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

*
{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
}

body, html
{
    width: 100%;
    height: 100%;
}

.full-body
{
    position: relative;
    width: 100%;
    height: 100vh;
    background-image: url("/src/assets/logo.png");
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
}

.full-body .header ul
{
    list-style-type: none;
    overflow: hidden;
}

.full-body .header ul li
{
    float: left;
}

.full-body .header
{
    background-color: #112479;
}

.full-body .header ul li a
{
    display: block;
    padding: 12px 24px;
    text-decoration: none;
    font-size: 18px;
    font-family: sans-serif;
    color: #fafafa;
    letter-spacing: 1px;
}

.full-body .header abbr
{
    text-decoration: none;
    cursor: pointer;
}

.full-body .header abbr button
{
    border: 2px solid black;
    cursor: pointer;
    padding: 3px;
    box-shadow: 3px 3px 5px black;
    font-size: 14px;
    font-weight: 600;
    float: right;
    margin-top: 10px;
    margin-right: 5px;
    width: 100px;
    color: #fafafa;
    border-radius: 30px 30px;
    background-color: blue;
    outline: 0;
    letter-spacing: 1px;
}

#app 
{
    width: 100%;
    height: 100%;
}

.full-body .zorluk 
{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 300px;
}

.full-body .zorluk .checkbox-container 
{
  display: flex;
  align-items: center;
  gap: 5px;
}

.full-body .zorluk label 
{
  display: block;
  font-size: 16px;
  color: #fafafa;
  font-weight: 600;
  margin-bottom: 8px;
}

.footer
{
    background: transparent;
}

.footer ul li a
{
    text-decoration: none;
    color: black;
    font-size: 16px;
    font-weight: bold;
}

.footer ul li
{
    text-align: center;
    justify-content: center;
}

.footer ul
{
    margin-top: 250px;
}

.islemler
{
    text-align: center;
}

.islemler label
{
    color: #fafafa;
    letter-spacing: 1px;
    font-weight: bold;
}

.islemler label::after
{
    content: ":";
}

.islemler #sonuc abbr button
{
    border: 2px solid black;
    cursor: pointer;
    padding: 3px;
    box-shadow: 3px 3px 5px black;
    font-size: 14px;
    font-weight: 600;
    margin-top: 10px;
    margin-right: 5px;
    width: 100px;
    color: #fafafa;
    border-radius: 30px 30px;
    background-color: blue;
    outline: 0;
    letter-spacing: 1px;   
}

</style>