function fillForms(userData, mapping) {
  console.log("Formality: Attempting to fill forms with data:", userData); // Debug

  const fields = document.querySelectorAll("input, textarea, select");

  // Handle multi-line address
  const addressFields = Array.from(fields).filter(
    (field) =>
      mapping.address.some(
        (attr) =>
          field.name?.toLowerCase().includes(attr) ||
          field.id?.toLowerCase().includes(attr),
      ) ||
      mapping.address2.some(
        (attr) =>
          field.name?.toLowerCase().includes(attr) ||
          field.id?.toLowerCase().includes(attr),
      ),
  );
  const fullAddress = userData.address || "";
  if (addressFields.length === 1) {
    addressFields[0].value = fullAddress;
  } else if (addressFields.length >= 2) {
    const lines = fullAddress.split(", ");
    addressFields[0].value = lines[0] || "";
    addressFields[1].value = lines[1] || userData.address2 || "";
  }

  // Fill other fields
  fields.forEach((field) => {
    const attr = (field.name || field.id || "").toLowerCase();
    let labelAttr = "";
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) {
      labelAttr = label.textContent.toLowerCase().trim();
    }

    for (const [dataKey, attrNames] of Object.entries(mapping)) {
      if (
        attrNames.some((name) => attr.includes(name)) ||
        (labelAttr && attrNames.some((name) => labelAttr.includes(name)))
      ) {
        if (field.tagName.toLowerCase() === "select") {
          const option = Array.from(field.options).find(
            (opt) =>
              opt.value.toLowerCase() ===
                (userData[dataKey] || "").toLowerCase() ||
              opt.text.toLowerCase() ===
                (userData[dataKey] || "").toLowerCase(),
          );
          if (option) {
            field.value = option.value;
            console.log(
              `Formality: Filled select ${attr} with ${option.value}`,
            ); // Debug
          }
        } else if (!addressFields.includes(field)) {
          field.value = userData[dataKey] || "";
          console.log(`Formality: Filled ${attr} with ${userData[dataKey]}`); // Debug
        }
        break;
      }
    }
  });
}

// Initial run and dynamic updates
browser.runtime
  .sendMessage({ type: "getUserData" })
  .then((response) => {
    const userData = response.userData;
    const mapping = response.mapping;

    if (!userData) {
      console.log("Formality: No user data found, skipping.");
      return;
    }

    // Fill forms immediately
    fillForms(userData, mapping);

    // Watch for dynamically added forms
    const observer = new MutationObserver(() => {
      console.log("Formality: Detected DOM change, checking for new forms.");
      fillForms(userData, mapping);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  })
  .catch((error) => {
    console.error("Formality: Error fetching user data:", error);
  });
