function loadSettings() {
  browser.storage.local
    .get("userData")
    .then((result) => {
      const userData = result.userData || {};
      document.getElementById("firstName").value = userData.firstName || "";
      document.getElementById("lastName").value = userData.lastName || "";
      document.getElementById("address").value = userData.address || "";
      document.getElementById("address2").value = userData.address2 || "";
      document.getElementById("city").value = userData.city || "";
      document.getElementById("state").value = userData.state || "";
      document.getElementById("zip").value = userData.zip || "";
      document.getElementById("email").value = userData.email || "";
    })
    .catch((error) => {
      console.error("Formality: Error loading settings:", error);
    });
}

function showNotification(message) {
  // Create notification if it doesn't exist
  let notification = document.querySelector(".save-notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "save-notification";
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.classList.add("show");

  // Remove the notification after 2 seconds
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

document.getElementById("userForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const userData = {};
  formData.forEach((value, key) => {
    userData[key] = value;
  });
  browser.storage.local
    .set({ userData })
    .then(() => {
      showNotification("Settings saved successfully!");
    })
    .catch((error) => {
      console.error("Formality: Error saving settings:", error);
    });
});

// Load settings when the options page opens
loadSettings();
