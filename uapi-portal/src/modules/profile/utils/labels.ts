export const labels = {
  shouldNotBeBlank: "This field cannot be left blank",
  generateToken: "Generate Token",
  token: "y34trevdhbfkhshfurgjhrbcksnnckrehuyeggr436t4ugkhffDGtJKGD",
  createdAt: "Created at:",
  date: "06/07/2023",
  name: "Name",
  email: "Email",
  address: "Address",
  contact: "Contact No",
  company: "Company",
  status: "Status",
  role: "Role",
  country: "Jaddah, Saudi Arabia",
  save: "Save",
  cancel: "Cancel",
  accountKey: "Account Key",
  apiKey: "API Key",
  generateApiKey: "Generate API Key",
  reGenerateApiKey: "Regenerate API Key",
  appId: "App Id",
  username: "Username",
  password: "Password",
  serviceCredentials: "Service credentials",
  digitalSignatureEnabled: "Digital signature",
  certificateUploaded: "Ceritficate ",
  uploaded: "uploaded",
  disabled: "disabled",
  saved: "saved",
  enabled: "enabled",
  companyUser: "Company User",
  azmSupportUser: "Azm Support User",
  accountKeyCopied: "Account key copied to ",
  apiKeyCopied: "API key copied to ",
  clipBoard: "clipboard!",
  revokeToken: "Revoke Token",
  browse: "Browse",
  mutualAuthentication: "Mutual Authentication",
  noPemFileError:
    "To enable digital signatures, users must upload their public key (.pem, .crt, .cer, .cert, .csr file ) for proper functionality.",
  noClientCertificateError:
    "For mutual authentication, users must upload their certificate authority (.crt file) for proper functionality.",
  certificateLabel: "public-key.pem",
  clientCertificateLabel: "client-certificate.crt",
  confirmationDialogText: "Are you sure you want to delete this file?",
  mutualAuthenticationText:
    "Enhance the security and authentication on our portal through mutual authentication. With this feature, you'll strengthen the verification process by ensuring that clients send their certificates while calling the API. You can manage your Certificate Authority preferences in our application, allowing us to authenticate your requests using the certificates provided. Once mutual authentication is enabled, clients will be required to include their certificates in the requests.",
  digitalSignationNormalPart1:
    "Enhance your security and authentication on our portal by enabling digital signature. Sign your requests using your private key with the ",
  digitalSignationBoldPart1: "SHA256withRSA encryption algorithm. ",
  digitalSignationNormalPart2:
    "You can also manage your signature preferences and upload your public key for added protection, So that we can verify the signature using your public key. Once it's enabled you need to pass the respective request signature in every request in Header parameter as ",
  digitalSignationBoldPart2: "X-Signature.",
  somethingWrong: "Something went wrong!",

  confirmationDialogGenerateApiKey:
    "Are you sure you want to regenerate the API key? Please be aware that the existing functionality will cease to work once the key is regenerated. Proceed with caution?",

  accountKeyDescriptionText:
    "Please include your Account ID in the `ACCOUNT-KEY` header when making API requests.",
  apiKeyDescriptionText:
    "Please include your API Key in the `API KEY` header when making API requests to ensure authentication.",

  useMyCredentailsText: "Use my credentials.",
  forbiddenText:
    "Access denied! Sorry, you do not have permission to perform this operation.",

  keyText: "Key",
  valueText: "Value",
  headerDeleteConfirmation: "Are you sure you want to delete this header ",
  callbackDeleteConfirmation:
    "Are you sure you want to delete this callback URL ",
  editHeader: "Edit Header",
  addHeader: "Add header",
  editCallack: "Edit Callback",
  headertext: "Header",
  callbackText: "Callback",
  deleted: "deleted",
  updated: "updated",
  added: "added",
  customHeader: "Custom Header",
  customHeaderDescription:
    "Custom headers can be configured to enhance the security of the APIs. Once these custom headers are defined on this page, they will be mandatory for all API requests. This means that every client interacting with the APIs must include these headers in their requests; otherwise, the API will reject the request.",
  addCallback: "Add Callback",
  serviceName: "Service Name",
  callbackDescription: "Callback Description",
  callbackUrl: "Callback URL",
  customHeaderKey: "Custom Header Key",
  customHeaderValue: "Custom Header Value",

  callbackUrlText: "Callback URL",
  authHeaderKeyText: "Auth Header Key",
  authHeaderValueText: "Auth Header Value",
  descriptionText: "Description",
  serviceText: "Service",
  invalidWebsitePattern: "Invalid URL pattern",
  selectService: "Select Service",
  serviceIsDeactive:
    " service is either inactive or not authorized to configure any callbacks at the moment!",
  enableStoplightElements: "Enable New API Documentation UI",
  enableStoplightElementsDescription:
    "Toggle to enable or disable the New API Documentation UI (Stoplight Element) on the Service - Explore API page.",
  bearerToken: "Bearer Token",
};
