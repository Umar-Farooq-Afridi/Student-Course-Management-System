// Requires config.js to be loaded first (defines API_URL)

async function registerUser(user) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  return response.json();
}

async function loginUser(user) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  return response.json();
}

function getToken() {
  return localStorage.getItem("token");
}

async function getCourses() {
  const response = await fetch(`${API_URL}/courses`);
  return response.json();
}

async function enrollCourse(courseId) {
  const response = await fetch(`${API_URL}/courses/enroll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
    body: JSON.stringify({
      courseId,
    }),
  });

  return response.json();
}

async function getMyCourses() {
  const response = await fetch(`${API_URL}/courses/my`, {
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });

  return response.json();
}

async function dropCourse(courseId) {
  const response = await fetch(`${API_URL}/courses/drop/${courseId}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });

  return response.json();
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

async function getProfile() {
  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });

  return response.json();
}

async function updateProfile(name) {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
    body: JSON.stringify({
      name,
    }),
  });

  return response.json();
}

async function changePassword(currentPassword, newPassword) {
  const response = await fetch(`${API_URL}/auth/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  return response.json();
}
