function getToken() {
  return localStorage.getItem("token");
}

function saveToken(token) {
  localStorage.setItem("token", token);
}

function removeToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("loggedInUser");
}

function saveUser(user) {
  localStorage.setItem("loggedInUser", JSON.stringify(user));
}

function getUser() {
  const userText = localStorage.getItem("loggedInUser");
  return userText ? JSON.parse(userText) : null;
}

function authHeader() {
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`
  };
}

function requireLogin() {
  if (!getToken()) {
    alert("You must log in first.");
    window.location.href = "/login";
  }
}

function logout() {
  removeToken();
  alert("Logged out successfully.");
  window.location.href = "/login";
}

function showMessage(elementId, text, type) {
  const box = document.getElementById(elementId);
  box.textContent = text;
  box.className = `message ${type}`;
  box.style.display = "block";
}