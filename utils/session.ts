const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

// Update last active time when user interacts
const updateLastActive = () => {
  localStorage.setItem("lastActive", Date.now().toString());
};
document.addEventListener("mousemove", updateLastActive);
document.addEventListener("keydown", updateLastActive);

// Check for inactivity every minute
const checkInactivity = async () => {
  const lastActive = localStorage.getItem("lastActive");
  if (lastActive && Date.now() - parseInt(lastActive) > INACTIVITY_LIMIT) {
    await logoutUser(); // Logout user
  }
};
setInterval(checkInactivity, 60 * 1000);

// Refresh token periodically
const refreshAccessToken = async () => {
  const res = await fetch("/api/auth/refresh", { method: "GET" });
  if (res.status === 401) {
    await logoutUser();
  }
};
setInterval(refreshAccessToken, 55 * 60 * 1000); // Refresh every 55 mins

// Logout function
const logoutUser = async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  localStorage.removeItem("lastActive");
  window.location.href = "/sign-in";
};

export { checkInactivity, refreshAccessToken, logoutUser };