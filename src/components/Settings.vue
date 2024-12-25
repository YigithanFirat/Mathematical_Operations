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
            <div class="settings">
                <p>Ayarlar Sayfası</p>
                <table border="1" cellspacing="0" cellpadding="8">
                    <thead>
                        <tr>
                            <th>Özellik</th>
                            <th>Değer</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Soru Sayısı</td>
                            <td>
                                <input id="soruSayisi" type="number" min="1" max="100" step="1" value="10">
                            </td>
                        </tr>
                        <tr>
                            <td>Zorluk Derecesi</td>
                            <td>
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
                            </td>
                        </tr>
                    </tbody>
                </table>
                <abbr title="Kaydet">
                    <button @click="Save()">Kaydet</button>
                </abbr>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default
{
    name: 'Settings',
    methods:
    {
        navigateToLogin()
        {
            return this.$router.push('/login');
        },

        navigateToRegister()
        {
            return this.$router.push('/register');
        }
    }
}
</script>

<style>

.settings
{
    text-align: center;
    justify-content: center;
    margin-top: 300px;
}

.settings table
{
    margin-left: 355px;
}

.settings p
{
    color: #fafafa;
    font-size: 24px;
    letter-spacing: 1px;
    text-align: center;
    justify-content: center;
    margin-bottom: 25px;
    font-weight: bold;
}

.settings .soru-sayisi input#soruSayisi
{
    width: 50px;
    height: 18px;
}

.settings .soru-sayisi label
{
    color: #fafafa;
    letter-spacing: 1px;
    font-weight: bold;
    font-size: 15px;
    text-align: center;
    justify-content: center;
    margin-left: 702px;
}

.settings .soru-sayisi label::after
{
    content: ":";
    color: #fafafa;
    font-size: 15px;
}

table
{
    width: 50%;
    border-collapse: collapse;
    margin-top: 10px;
    text-align: center;
    justify-content: center;
}

th, td
{
    border: 1px solid #ddd;
    padding: 8px;
}

th
{
    background-color: #5762FF;
    color: #fafafa;
    font-weight: bold;
}

input[type="number"]
{
    width: 60px;
    padding: 4px;
    font-size: 14px;
}

tbody tr td
{
    color: #fafafa;
    font-size: 16px;
    letter-spacing: 1px;
}

.checkbox-container
{
    display: flex;
    align-items: center;
    gap: 5px;
}

.settings abbr
{
    text-decoration: none;
    cursor: pointer;
}

.settings abbr button
{
    border: 2px solid black;
    cursor: pointer;
    padding: 3px;
    box-shadow: 3px 3px 5px black;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    justify-content: center;
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