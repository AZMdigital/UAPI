import * as Yup from "yup";

import { labels } from "~/modules/profile/utils/labels";

const websiteUrlPattern =
  /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:[0-9]{1,5})?(\/[^\s]*)?$/;

export const callbackFormSchema = Yup.object().shape({
  serviceId: Yup.string().required(labels.shouldNotBeBlank),
  callbackUrl: Yup.string()
    .required(labels.shouldNotBeBlank)
    .matches(websiteUrlPattern, labels.invalidWebsitePattern),
  authHeaderKey: Yup.string().required(labels.shouldNotBeBlank),
  authHeaderValue: Yup.string().required(labels.shouldNotBeBlank),
  description: Yup.string().nullable(),
  isActive: Yup.string().required(labels.shouldNotBeBlank),
});
