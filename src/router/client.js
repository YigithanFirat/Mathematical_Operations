async function registerUser()
{
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const nickname = document.getElementById('nickname').value;
    try 
    {
        const response = await fetch('http://localhost:5500/register', 
        { // URL'yi doğrulayın
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, nickname })
        });
        console.log('Yanıt durumu:', response.status); // Yanıt durum kodunu kontrol edin
        if(response.ok) 
        {
            console.log('Kayıt başarılı');
            alert('Kayıt başarılı!');
        } 
        else 
        {
            const errorText = await response.text();
            console.error('Sunucu hatası:', errorText); // Detaylı hata mesajı
            alert(`Kayıt sırasında bir hata oluştu: ${errorText}`);
        }
    } 
    catch(error) 
    {
        console.error('Fetch isteği sırasında hata:', error); // İstemci tarafında hata
        alert('İstemci tarafında bir hata oluştu.');
    }
}