// Simple client-side authentication
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target[0].value;
            const password = e.target[1].value;
            
            // In a real app, you'd validate with a backend
            // For demo, we'll just store in localStorage
            localStorage.setItem('user', JSON.stringify({ email }));
            window.location.href = '../homepage/home.html';
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = e.target[0].value;
            const email = e.target[1].value;
            const password = e.target[2].value;
            
            // Store user data
            localStorage.setItem('user', JSON.stringify({ name, email }));
            window.location.href = 'home.html';
        });
    }
});

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user && !window.location.href.includes('index.html') && !window.location.href.includes('signup.html')) {
        window.location.href = 'index.html';
    }
}

checkAuth();