// const signUpBtn = document.getElementById("sign-up-btn");
// const signInBtn = document.getElementById("sign-in-btn");
// const container = document.querySelector(".container");
// const signupForm = document.getElementById("signup-form");
// const loginForm = document.getElementById("login-form");

// signUpBtn.addEventListener("click", () => {
//   container.classList.add("sign-up-mode");
// });

// signInBtn.addEventListener("click", () => {
//   container.classList.remove("sign-up-mode");
// });

// // Handle Sign Up
// signupForm.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const email = document.getElementById("signup-email").value;
//   const username = document.getElementById("signup-username").value;
//   const phone = document.getElementById("signup-phone").value;
//   const password = document.getElementById("signup-password").value;

//   fetch("/signup/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "X-CSRFToken": getCSRFToken(),
//     },
//     body: JSON.stringify({ email, username, phone, password }),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         return response.json().then((data) => {
//           throw new Error(
//             data.error || "Error during sign up. Please try again."
//           );
//         });
//       }
//       return response.json();
//     })
//     .then((data) => {
//       if (data.success) {
//         alert("Sign up successful! You can now log in.");
//         signupForm.reset();
//       } else {
//         throw new Error(
//           data.error || "Error during sign up. Please try again."
//         );
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       alert(error.message);
//     });
// });

// // Handle Login
// loginForm.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const username = document.getElementById("login-username").value;
//   const password = document.getElementById("login-password").value;

//   fetch("/login/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "X-CSRFToken": getCSRFToken(),
//     },
//     body: JSON.stringify({ username, password }),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         return response.json().then((data) => {
//           throw new Error(
//             data.error || "Error during login. Please try again."
//           );
//         });
//       }
//       return response.json();
//     })
//     .then((data) => {
//       if (data.success) {
//         localStorage.setItem("name", username);
//         localStorage.setItem("done", "true");
//         window.location.href = "/query/";
//       } else {
//         throw new Error(
//           data.error || "Invalid username or password. Please try again."
//         );
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       alert(error.message);
//     });
// });

// // Function to retrieve CSRF token from cookies (necessary for Django)
// function getCSRFToken() {
//   let csrfToken = null;
//   const cookies = document.cookie.split(";");
//   cookies.forEach((cookie) => {
//     const [name, value] = cookie.trim().split("=");
//     if (name === "csrftoken") csrfToken = value;
//   });
//   return csrfToken;
// }



// Clear any existing login state when loading login page
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('currentUser');
}

const signUpBtn = document.getElementById("sign-up-btn");
const signInBtn = document.getElementById("sign-in-btn");
const container = document.querySelector(".container");
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");

// Toggle between sign-up and login modes
signUpBtn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

signInBtn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Handle Sign Up
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("signup-email").value.trim();
  const username = document.getElementById("signup-username").value.trim();
  const phone = document.getElementById("signup-phone").value.trim();
  const password = document.getElementById("signup-password").value;

  // For debugging - show first and last character of password
  console.log("Signup password starts with:", password[0]);
  console.log("Signup password ends with:", password[password.length - 1]);

  // Create user object
  const newUser = {
    email,
    username,
    phone,
    password
  };

  // Get existing users array or create new one
  let users = [];
  if (localStorage.getItem('users')) {
    users = JSON.parse(localStorage.getItem('users'));
  }
  
  // Add new user to array
  users.push(newUser);
  
  // Save back to localStorage
  localStorage.setItem('users', JSON.stringify(users));
  
  // Save the password separately for verification
  localStorage.setItem('lastPassword', password);
  
  console.log("Sign up successful!");
  
  // Show a confirmation with the exact credentials to use
  const confirmMessage = `
    Sign up successful! Please make note of your exact credentials:
    Username: ${username}
    Password: ${password}
    
    Please use these exact credentials to log in.
  `;
  alert(confirmMessage);
  
  signupForm.reset();
  container.classList.remove("sign-up-mode");
});

// Handle Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const loginUsername = document.getElementById("login-username").value.trim();
  const loginPassword = document.getElementById("login-password").value;

  // Debug information
  console.log("Login attempt details:");
  console.log("Username:", loginUsername);
  console.log("Login password starts with:", loginPassword[0]);
  console.log("Login password ends with:", loginPassword[loginPassword.length - 1]);

  // Get users from localStorage
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Find matching user
  const user = users.find(u => u.username === loginUsername);
  
  if (user) {
    console.log("Found matching username");
    console.log("Stored password starts with:", user.password[0]);
    console.log("Stored password ends with:", user.password[user.password.length - 1]);
    
    // Compare passwords character by character
    let mismatchFound = false;
    for(let i = 0; i < Math.max(user.password.length, loginPassword.length); i++) {
      if(user.password[i] !== loginPassword[i]) {
        console.log(`Mismatch at position ${i}: Expected '${user.password[i]}', got '${loginPassword[i]}'`);
        mismatchFound = true;
        break;
      }
    }

    if (!mismatchFound) {
      console.log("Login successful!");
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      alert("Login successful!");
      window.location.href = '../homepage/home.html';
    } else {
      alert("Invalid password. Please check your password and try again.");
    }
  } else {
    alert("Username not found. Please check your username or sign up.");
  }
});

// On page load, show current stored data
window.addEventListener('load', () => {
  console.clear(); // Clear the console
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  console.log("Currently stored usernames:", users.map(u => u.username));
});