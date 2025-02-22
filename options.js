// Add this at the top of the file
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
  browser.storage.local.set({ userData }).then(() => {
    showNotification("Settings saved successfully!");
  });
});

/* Add these styles at the end of your CSS file */
