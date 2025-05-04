document.getElementById('signupForm')
    .addEventListener('submit', async e => {
        e.preventDefault();
        const payload = {
            userId:       document.getElementById('userId').value,
            password:     document.getElementById('password').value,
            email:        document.getElementById('email').value,
            companyName:  document.getElementById('companyName').value,
            phoneNumber:  document.getElementById('phoneNumber').value
        };

        const url = '/api/auth/signup/company';

        const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('가입 성공!');
            location.href = 'companyLogin.html';
        } else {
            alert('가입 실패…');
        }
    });
