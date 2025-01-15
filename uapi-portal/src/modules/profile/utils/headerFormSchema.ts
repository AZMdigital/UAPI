/* eslint-disable prefer-destructuring */
import * as Yup from "yup";

import { labels } from "~/modules/profile/utils/labels";

export const customHeaderFormSchema = Yup.object().shape({
  key: Yup.string().required(labels.shouldNotBeBlank),
  value: Yup.string().required(labels.shouldNotBeBlank),
});
