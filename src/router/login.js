async function loginUser()
{
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;
    try 
    {
        const response = await fetch('http://localhost:8080/login', 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nickname, password })
        });

        if(response.ok) 
        {
            const message = await response.text();
            alert(message);
        } 
        else 
        {
            const errorText = await response.text();
            alert(`Giriş başarısız: ${errorText}`);
        }
    } 
    catch(error) 
    {
        console.error('Fetch isteği sırasında hata:', error);
        alert('Giriş sırasında bir hata oluştu.');
    }
}