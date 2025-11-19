function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = { email, username: email.split('@')[0] };
    localStorage.setItem('user', JSON.stringify(user));
    
    alert('Login successful!');
    showUserInfo();
}

function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    const user = { username, email };
    localStorage.setItem('user', JSON.stringify(user));
    
    alert('Registration successful!');
    showUserInfo();
}

function logout() {
    localStorage.removeItem('user');
    location.reload();
}

function showUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('loginRegisterTabs').style.display = 'none';
        document.getElementById('loginTab').style.display = 'none';
        document.getElementById('registerTab').style.display = 'none';
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('email').textContent = user.email;
    }
}


document.addEventListener('DOMContentLoaded', showUserInfo);