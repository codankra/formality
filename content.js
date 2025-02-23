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
  fields.forEach((field) => {
    const attr = (field.name || field.id || "").toLowerCase();
    let labelAttr = "";
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) {
      labelAttr = label.textContent.toLowerCase().trim();
    }
    console.log(`Formality: Checking field ${attr} with label '${labelAttr}'`);

    let filled = false;
    for (const [dataKey, attrNames] of Object.entries(mapping)) {
      const isMatch = attrNames.some((name) =>
        name.length > 2
          ? attr.includes(name) || labelAttr.includes(name)
          : attr === name || labelAttr === name,
      );
      // Block lastName if it’s a substring of a fullName-like field
      let isBlocked = false;
      if (dataKey === "lastName") {
        const sysFullNameAttrs = mapping.fullNameSys;
        isBlocked = sysFullNameAttrs.some(
          (fullAttr) =>
            attr.includes(fullAttr) &&
            attr !== fullAttr &&
            attr.endsWith("lname"),
        );
        if (isBlocked) {
          console.log(
            `Formality: Blocked lastName match for ${attr} due to fullName overlap`,
          );
          continue;
        }
      }
      if (isMatch) {
        let value = userData[dataKey];
        if (dataKey === "fullName" && !value) {
          value =
            `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
        }
        if (field.tagName.toLowerCase() === "select") {
          const option = Array.from(field.options).find(
            (opt) =>
              opt.value.toLowerCase() === (value || "").toLowerCase() ||
              opt.text.toLowerCase() === (value || "").toLowerCase(),
          );
          if (option) {
            field.value = option.value;
            console.log(
              `Formality: Filled select ${attr} with ${option.value} (key: ${dataKey})`,
            );
            filled = true;
          }
        } else if (!addressFields.includes(field)) {
          field.value = value || "";
          console.log(
            `Formality: Filled ${attr} with '${value}' (key: ${dataKey})`,
          );
          filled = true;
        }
        if (filled) break; // Exit loop after filling
      }
    }
  });
}

browser.runtime
  .sendMessage({ type: "getUserData" })
  .then((response) => {
    const userData = response.userData;
    const mapping = response.mapping;

    if (!userData) {
      console.log("Formality: No user data found, skipping.");
      return;
    }

    fillForms(userData, mapping); // Initial run

    const observer = new MutationObserver(() => {
      console.log("Formality: Detected DOM change, checking for new forms.");
      fillForms(userData, mapping);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Stop after 10 seconds
    setTimeout(() => {
      observer.disconnect();
      console.log("Formality: Stopped observing after 10 seconds.");
    }, 10000);
  })
  .catch((error) => {
    console.error("Formality: Error fetching user data:", error);
  });
