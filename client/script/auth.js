// Requires config.js + api.js to be loaded first

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!validateRegister(name, email, password)) return;

    const message = document.getElementById("message");

    try {
      const result = await registerUser({ name, email, password });

      if (result.success) {
        message.style.color = "green";
        message.textContent = result.message;
        registerForm.reset();

        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      } else {
        message.style.color = "red";
        message.textContent = result.message;
      }
    } catch (error) {
      console.error(error);
      message.style.color = "red";
      message.textContent = "Unable to connect to server.";
    }
  });
}

// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!validateLogin(email, password)) return;

    const message = document.getElementById("message");

    try {
      const result = await loginUser({ email, password });

      if (result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        message.style.color = "green";
        message.textContent = "Login successful";

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      } else {
        message.style.color = "red";
        message.textContent = result.message;
      }
    } catch (error) {
      console.error(error);
      message.style.color = "red";
      message.textContent = "Unable to connect to server.";
    }
  });
}

function isLoggedIn() {
  return !!getToken();
}

function protectPage() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}
