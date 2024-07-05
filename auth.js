const firebaseConfig = {
    // Your Firebase config details here
  };
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const resetPasswordForm = document.getElementById('reset-password-form');
    const loginSection = document.getElementById('auth');
    const signupSection = document.getElementById('signup');
    const resetPasswordSection = document.getElementById('reset-password');
    const errorMessage = document.getElementById('error-message');
  
    function toggleSections(showSection) {
      [loginSection, signupSection, resetPasswordSection].forEach(section => {
        if (section === showSection) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });
    }
  
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const email = loginForm['email'].value;
      const password = loginForm['password'].value;
  
      auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          loginForm.reset();
          errorMessage.textContent = '';
          console.log('User logged in:', userCredential.user.email);
        })
        .catch(error => {
          errorMessage.textContent = error.message;
          console.error('Login error:', error);
        });
    });
  
    signupForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const email = signupForm['new-email'].value;
      const password = signupForm['new-password'].value;
  
      auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          signupForm.reset();
          errorMessage.textContent = '';
          console.log('User signed up:', userCredential.user.email);
        })
        .catch(error => {
          errorMessage.textContent = error.message;
          console.error('Sign up error:', error);
        });
    });
  
    resetPasswordForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const email = resetPasswordForm['reset-email'].value;
  
      auth.sendPasswordResetEmail(email)
        .then(() => {
          resetPasswordForm.reset();
          errorMessage.textContent = 'Password reset email sent.';
          console.log('Password reset email sent to:', email);
        })
        .catch(error => {
          errorMessage.textContent = error.message;
          console.error('Password reset error:', error);
        });
    });
  
    function showLogin() {
      toggleSections(loginSection);
    }
  
    function showSignUp() {
      toggleSections(signupSection);
    }
  
    function showResetPassword() {
      toggleSections(resetPasswordSection);
    }
  
    VanillaTilt.init(document.querySelectorAll('button'), {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.4,
    });
  });
  