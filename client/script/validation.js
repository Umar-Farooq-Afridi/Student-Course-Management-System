function validateRegister(name, email, password) {
  if (name.trim() === "") {
    alert("Name is required");
    return false;
  }

  if (email.trim() === "") {
    alert("Email is required");
    return false;
  }

  if (!email.includes("@")) {
    alert("Invalid email");
    return false;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return false;
  }

  return true;
}

function validateLogin(email, password) {
  if (email.trim() === "") {
    alert("Email is required");
    return false;
  }

  if (password.trim() === "") {
    alert("Password is required");
    return false;
  }

  return true;
}
