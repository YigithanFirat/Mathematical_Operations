<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <div id="app">
        <router-view />
        <div class="full-body">
            <div class="header">
                <ul>
                    <li><a href="/"> <i class="fa-solid fa-house"></i> Anasayfa </a></li>
                    <li><a href="/panel"> <i class="fa-solid fa-layer-group"></i> Panel </a></li>
                    <li><a href="/members"> <i class="fa-solid fa-person"></i> Üyeler </a></li>
                    <li><a href="/history"> <i class="fa-solid fa-ghost"></i> Geçmiş </a></li>
                    <li><a href="/settings"> <i class="fa-solid fa-user-gear"></i> Ayarlar </a></li>
                    <li><a href="/" @click="logout()"> <i class="fa-solid fa-door-open"></i> Çıkış </a></li>
                    <abbr title="Giriş Yap">
                        <button @click="navigateToLogin()">Giriş Yap</button>
                    </abbr>
                    <abbr title="Kaydol">
                        <button @click="navigateToRegister()">Kaydol</button>
                    </abbr>
                </ul>
            </div>
            <span class="history-table">
                <table>
                    <thead>
                        <tr>
                            <th>Zorluk</th>
                            <th>Tarih</th>
                            <th>Soru Sayısı</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="entry in historyData" :key="entry.id">
                            <td>{{ entry.difficulty }}</td>
                            <td>{{ entry.date }}</td>
                            <td>{{ entry.questionCount }}</td>
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
    data() 
    {
        return {
            historyData: [], // Tabloyu dolduracak veriler
        };
    },
    methods: 
    {
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
        navigateToLogin() 
        {
            return this.$router.push('/login');
        },

        navigateToRegister() 
        {
            return this.$router.push('/register');
        },

        logout() 
        {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userId");
            this.$router.push("/");
            alert("Çıkış yaptınız.");
        },

        async fetchHistory() 
        {
            try 
            {
                const response = await axios.get('/api/user/history');
                this.historyData = response.data;
            } 
            catch (error) 
            {
                console.error('Veriler alınamadı:', error);
            }
        },
    },
    mounted() 
    {
        this.fetchHistory(); // Bileşen yüklendiğinde verileri al
    },
};
</script>

<style>

.history-table table 
{
    width: 100%;
    border-collapse: collapse;
}

.history-table table th, .history-table table td 
{
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
}

.history-table table th 
{
    background-color: #2641FE;
    color: white;
}

.history-table table tr:nth-child(even) 
{
    background-color: #f2f2f2;
}

.history-table table tr:hover 
{
    background-color: #ddd;
}

.history-table table tr td 
{
    background-color: #5762FF;
    text-align: center;
    color: #fafafa;
    font-weight: bold;
}
</style>
