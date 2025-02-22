// Comprehensive mapping from HTML attribute names to user data keys
const attributeMapping = {
  firstName: [
    "firstname",
    "first_name",
    "first-name",
    "fname",
    "givenname",
    "given_name",
    "given-name",
    "first",
    "f_name",
    "f-name",
  ],
  lastName: [
    "lastname",
    "last_name",
    "last-name",
    "lname",
    "surname",
    "familyname",
    "family_name",
    "family-name",
    "last",
    "l_name",
    "l-name",
  ],
  address: [
    "address",
    "street",
    "streetaddress",
    "street_address",
    "street-address",
    "address1",
    "addr",
    "address_line1",
    "address-line1",
    "address_line_1",
    "address-line-1",
    "line1",
  ],
  address2: [
    "address2",
    "street2",
    "address_line2",
    "address-line2",
    "address_line_2",
    "address-line-2",
    "line2",
    "apt",
    "apartment",
    "unit",
    "suite",
  ],
  city: ["city", "town", "city_name", "city-name", "municipality", "locality"],
  state: [
    "state",
    "province",
    "region",
    "state_province",
    "state-province",
    "st",
    "state_code",
    "state-code",
  ],
  zip: [
    "zip",
    "zipcode",
    "postal",
    "postalcode",
    "postcode",
    "zip_code",
    "zip-code",
    "postal_code",
    "postal-code",
  ],
  email: [
    "email",
    "e-mail",
    "emailaddress",
    "email_address",
    "email-address",
    "mail",
    "em",
  ],
};
// Listen for requests from content.js
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getUserData") {
    browser.storage.local.get("userData").then((result) => {
      sendResponse({ userData: result.userData, mapping: attributeMapping });
    });
    return true; // Async response
  }
});
