document.addEventListener("DOMContentLoaded", () => {
  browser.runtime.sendMessage({ type: "getUserData" }).then((response) => {
    const userData = response.userData;
    const mapping = response.mapping;

    if (!userData) return;

    // Find all inputs, textareas, and selects
    const fields = document.querySelectorAll("input, textarea, select");

    // Handle multi-line address logic
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
      addressFields[0].value = fullAddress; // Single field gets full address
    } else if (addressFields.length >= 2) {
      const lines = fullAddress.split(", "); // Split on comma + space, adjust as needed
      addressFields[0].value = lines[0] || ""; // First line (street)
      addressFields[1].value = lines[1] || userData.address2 || ""; // Second line (apt/unit)
    }

    // Fill other fields
    fields.forEach((field) => {
      const attr = (field.name || field.id || "").toLowerCase();
      let labelAttr = "";

      // Check associated label’s "for" attribute
      const label = document.querySelector(`label[for="${field.id}"]`);
      if (label) {
        labelAttr = label.textContent.toLowerCase().trim();
      }

      for (const [dataKey, attrNames] of Object.entries(mapping)) {
        if (
          attrNames.some((name) => attr.includes(name)) || // Match name/id
          (labelAttr && attrNames.some((name) => labelAttr.includes(name))) // Match label
        ) {
          if (field.tagName.toLowerCase() === "select") {
            // Handle dropdowns (e.g., city, state)
            const option = Array.from(field.options).find(
              (opt) =>
                opt.value.toLowerCase() ===
                  (userData[dataKey] || "").toLowerCase() ||
                opt.text.toLowerCase() ===
                  (userData[dataKey] || "").toLowerCase(),
            );
            if (option) field.value = option.value;
          } else if (!addressFields.includes(field)) {
            // Handle text inputs (skip address fields already processed)
            field.value = userData[dataKey] || "";
          }
          break;
        }
      }
    });
  });
});
