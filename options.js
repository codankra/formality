document.getElementById("userForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const userData = {};
  formData.forEach((value, key) => {
    userData[key] = value;
  });
  browser.storage.local.set({ userData }).then(() => {
    alert("Settings saved!");
  });
});
