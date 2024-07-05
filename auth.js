document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle login
    alert('Login form submitted');
});

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Sign up form submitted');
});

document.getElementById('reset-password-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Reset password form submitted');
});

function showLogin() {
    document.getElementById('auth').style.display = 'block';
    document.getElementById('signup').style.display = 'none';
    document.getElementById('reset-password').style.display = 'none';
}

function showSignUp() {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('signup').style.display = 'block';
    document.getElementById('reset-password').style.display = 'none';
}

function showResetPassword() {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('signup').style.display = 'none';
    document.getElementById('reset-password').style.display = 'block';
}
