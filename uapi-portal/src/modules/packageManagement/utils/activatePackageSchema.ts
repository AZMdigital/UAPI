/* eslint-disable prefer-destructuring */
import * as Yup from "yup";

import { labels } from "~/modules/profile/utils/labels";

export const activatePackageFormSchema = Yup.object().shape({
  activationDate: Yup.string().required(labels.shouldNotBeBlank),
});
