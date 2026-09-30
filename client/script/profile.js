if (!localStorage.getItem("token")) {
  window.location = "login.html";
}

loadProfile();

async function loadProfile() {
  const data = await getProfile();

  if (data.success) {
    document.getElementById("profileName").value = data.user.name;
    document.getElementById("profileEmail").value = data.user.email;
  }
}

const profileForm = document.getElementById("profileForm");

profileForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = document.getElementById("profileName").value;
  const result = await updateProfile(name);
  document.getElementById("message").innerHTML = result.message;
});

const passwordForm = document.getElementById("passwordForm");

passwordForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const result = await changePassword(currentPassword, newPassword);
  document.getElementById("message").innerHTML = result.message;
  passwordForm.reset();
});
