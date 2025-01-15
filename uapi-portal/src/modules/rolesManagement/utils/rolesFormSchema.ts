/* eslint-disable prefer-destructuring */
import * as Yup from "yup";

import { labels } from "~/modules/rolesManagement/utils/labels";

export const rolesFormSchema = Yup.object().shape({
  name: Yup.string()
    .required(labels.shouldNotBeBlank)
    .test("", labels.maxRoleNameSize, (val) => val.length <= 20),

  isActive: Yup.string().required(labels.shouldNotBeBlank),
});
