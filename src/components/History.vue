<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"/>
    <div id="app">
        <router-view />
        <div class="full-body">
            <div class="header">
                <ul>
                    <li><a href="/"> <i class="fa-solid fa-house"></i> Anasayfa </a></li>
                    <li><a v-if="isLogged == 1" href="/history"> <i class="fa-solid fa-ghost"></i> Geçmiş </a></li>
                    <li><a v-if="isLogged == 1" href="/settings"> <i class="fa-solid fa-user-gear"></i> Ayarlar </a></li>
                    <li><a v-if="isLogged == 1" href="/" @click="logout()"> <i class="fa-solid fa-door-open"></i> Çıkış </a></li>
                    <abbr title="Giriş Yap">
                        <button v-if="isLogged == 0" @click="navigateToLogin"> Giriş Yap </button>
                    </abbr>
                    <abbr title="Kaydol">
                        <button v-if="isLogged == 0" @click="navigateToRegister"> Kaydol </button>
                    </abbr>
                </ul>
            </div>
            <span v-if="isLogged == 1" class="history-table">
                <table>
                    <thead>
                        <tr>
                            <th>Zorluk</th>
                            <th>Tarih</th>
                            <th>Soru Sayısı</th>
                            <th>Nickname</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="entry in historyData" :key="entry.id">
                            <td>{{ entry.zorluk }}</td>
                            <td>{{ entry.tarih }}</td>
                            <td>{{ entry.sorusayisi }}</td>
                            <td>{{ entry.nickname }}</td>
                        </tr>
                    </tbody>
                </table>
            </span>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default 
{
    name: 'History',
    computed: 
    {
        isLogged() 
        {
            return this.$store.getters.isLogged;
        },
    },
    data() 
    {
        return {
            historyData:
            []
        };
    },

    methods: 
    {
        async logout() 
        {
            try 
            {
                const response = await axios.post("http://localhost:3000/logout", 
                {
                    userId: 1,
                });
                if(response.data && response.data.message === "Çıkış işlemi başarılı.") 
                {
                    alert("Başarıyla çıkış yaptınız.");
                    this.$store.dispatch("logout");
                } 
                else 
                {
                    alert(response.data.error || "Çıkış işlemi başarısız. Tekrar deneyin.");
                }
            } 
            catch(error) 
            {
                console.error("Hata Detayı:", error.response?.data || error.message || error);
                alert("Sunucuya bağlanırken bir hata oluştu. Lütfen tekrar deneyin.");
            }
        },

        navigateToLogin() 
        {
            return this.$router.push('/login');
        },

        navigateToRegister() 
        {
            return this.$router.push('/register');
        },

        async fetchHistory() 
        {
            try 
            {
                const response = await axios.get('http://localhost:3000/api/user/history');
                this.historyData = response.data;
            } 
            catch(error) 
            {
                console.error('Veriler alınamadı:', error);
            }
        },
    },
    mounted() 
    {
        this.fetchHistory();
    },
};

</script>

<style>

.history-table table 
{
    width: 100%;
    border-collapse: collapse;
}

.history-table table th,
.history-table table td 
{
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
}

.history-table table th 
{
    background-color: #2641FE;
    color: white;
    text-transform: uppercase;
    font-weight: bold;
}


.history-table table tr:nth-child(even) 
{
    background-color: #f2f2f2;
}

.history-table table tr:hover 
{
    background-color: #4a63f3;
    cursor: pointer;
}


.history-table table tr td 
{
    background-color: #5762FF;
    text-align: center;
    color: #fafafa;
    font-weight: bold;
}

</style>
