// // role 변경에 따라 기업 필드 보이기/숨기기
// document.getElementById('role')
//     .addEventListener('change', e => {
//         document.getElementById('companyFields')
//             .classList.toggle('hidden', e.target.value !== 'COMPANY');
//     });


document.getElementById('signupForm')
    .addEventListener('submit', async e => {
        e.preventDefault();
        // const role = document.getElementById('role').value;
        const payload = {
            userId:       document.getElementById('userId').value,
            password:     document.getElementById('password').value,
            username:     document.getElementById('username').value,
            age:          parseInt(document.getElementById('age').value),
            gender:       document.getElementById('gender').value,
            nickName:     document.getElementById('nickName').value,
            email:        document.getElementById('email').value,
            // companyName:  role === 'COMPANY' ? document.getElementById('companyName').value : null,
            // phoneNumber:  role === 'COMPANY' ? document.getElementById('phoneNumber').value : null
        };

        // const url = role === 'COMPANY'
        //     ? '/api/auth/signup/company'
        //     : '/api/auth/signup/user';

        const url = '/api/auth/signup/user';

        const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('가입 성공!');
            location.href = 'userLogin.html';
        } else {
            alert('가입 실패…');
        }
    });
