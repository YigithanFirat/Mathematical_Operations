<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <div id="app">
        <router-view/>
        <div class="full-body">
            <div class="header">
                <ul>
                    <li><a href="/"> <i class="fa-solid fa-house"></i> Anasayfa </a></li>
                    <li><a href="/members"> <i class="fa-solid fa-person"></i> Üyeler </a></li>
                    <li><a href="/history"> <i class="fa-solid fa-ghost"></i> Geçmiş </a></li>
                    <li><a href="/settings"> <i class="fa-solid fa-user-gear"></i> Ayarlar </a></li>
                    <li><a v-if="Logged == 1" href="/" @click="logout()"> <i class="fa-solid fa-door-open"></i> Çıkış </a></li>
                    <abbr title="Giriş Yap">
                        <button 
                        v-if="Logged == 0" 
                        @click="navigateToLogin()"
                        >
                        Giriş Yap
                        </button>
                    </abbr>
                    <abbr title="Kaydol">
                        <button 
                        v-if="Logged == 0" 
                        @click="navigateToRegister()"
                        >
                        Kaydol
                        </button>
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
                                <input id="soruSayisi" v-model="soruSayisi" type="number" min="1" max="100" step="1" value="10">

                            </td>
                        </tr>
                        <tr>
                            <td>Zorluk Derecesi</td>
                                <td>
                                <div class="checkbox-container">
                                    <input type="radio" id="derece1" v-model="Zorluk" name="zorluk" value="1">
                                    <label for="derece1">Kolay</label>
                                </div>
                                <div class="checkbox-container">
                                    <input type="radio" id="derece2" v-model="Zorluk" name="zorluk" value="2">
                                    <label for="derece2">Orta</label>
                                </div>
                                <div class="checkbox-container">
                                    <input type="radio" id="derece3" v-model="Zorluk" name="zorluk" value="3">
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
    computed: 
    {
        Logged() 
        {
        return this.$store.state.Logged;
        },
    },
    data() 
    {
        return {
            soruSayisi: 10,
            zorluk: 1,
        };
    },
    methods:
    {
        navigateToLogin()
        {
            return this.$router.push('/login');
        },

        async logout() 
        {
            try 
            {
                const response = await axios.post('http://localhost:3000/logout', 
                {
                    userId: 1,
                });
                if(response.data && response.data.message === 'Çıkış işlemi başarılı.')
                {
                    alert('Başarıyla çıkış yaptınız.');
                    this.$router.push('/');
                }
                else
                {
                    alert(response.data.error || 'Çıkış işlemi başarısız. Tekrar deneyin.');
                }
            }
            catch(error) 
            {
                console.error('Hata Detayı:', error.response?.data || error.message || error);
                alert('Sunucuya bağlanırken bir hata oluştu. Lütfen tekrar deneyin.');
            }
        },

        navigateToRegister()
        {
            return this.$router.push('/register');
        },

        async Save() 
        {
            try 
            {
                const userId = 1;
                const response = await axios.post('http://localhost:3000/save', 
                {
                    soruSayisi: this.soruSayisi,
                    Zorluk: this.Zorluk,
                    id: userId,
                });
                alert(response.data.message);
            } 
            catch(error) 
            {
                console.error('Hata Detayı:', error.response?.data || error.message || error);
                alert('Bir hata oluştu, lütfen tekrar deneyiniz.');
            }
        },

        async logout()
        {
            try
            {
                const userId = 1;
                const response = await axios.post('http://localhost:3000/logout',
                {
                    id: userId,
                });
                if(response.data.success)
                {
                    alert('Başarıyla çıkış yaptınız.');
                    this.$router.push('/');
                }
                else
                {
                    alert('Çıkış işlemi tamamlanamadı, lütfen tekrar deneyiniz.');
                }
            }
            catch(error)
            {
                console.error('Hata: ', error);
                alert('Bir hata oluştu, lütfen daha sonra tekrar deneyiniz.');
            }
        }
    }
}
</script>

<style>

.settings {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
}

.settings p {
    color: #fafafa;
    font-size: 24px;
    letter-spacing: 1px;
    text-align: center;
    font-weight: bold;
    margin-bottom: 25px;
}

.settings table {
    width: 100%;
    max-width: 800px;
    border-collapse: collapse;
    text-align: center;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px;
    color: #fafafa;
    font-size: 16px;
    letter-spacing: 1px;
}

th {
    background-color: #5762FF;
    font-weight: bold;
}

input[type="number"] {
    width: 60px;
    padding: 4px;
    font-size: 14px;
}

.checkbox-container {
    display: flex;
    align-items: center;
    gap: 5px;
}

.settings abbr {
    text-decoration: none;
    cursor: pointer;
}

.settings abbr button {
    border: 2px solid black;
    cursor: pointer;
    padding: 8px;
    box-shadow: 3px 3px 5px black;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    margin-top: 10px;
    margin-right: 5px;
    width: 150px;
    color: #fafafa;
    border-radius: 30px;
    background-color: blue;
    outline: 0;
    letter-spacing: 1px;
}

.settings .soru-sayisi {
    display: flex;
    justify-content: center;
    align-items: center;
}

.settings .soru-sayisi label {
    color: #fafafa;
    letter-spacing: 1px;
    font-weight: bold;
    font-size: 15px;
    margin-right: 10px;
}

.settings .soru-sayisi input#soruSayisi {
    width: 60px;
    height: 30px;
    padding: 5px;
    font-size: 16px;
}

/* Responsive Tasarım */
@media (max-width: 768px) {
    .settings {
        margin-top: 20px;
    }

    .settings table {
        width: 90%;
    }

    .settings .soru-sayisi input#soruSayisi {
        width: 50px;
    }

    .settings abbr button {
        width: 120px;
    }

    .settings p {
        font-size: 20px;
    }
}

</style>