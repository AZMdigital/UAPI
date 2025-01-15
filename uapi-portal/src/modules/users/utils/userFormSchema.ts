/* eslint-disable prefer-destructuring */
import * as Yup from "yup";

import { isValidEmail } from "~/utils/helper";

import { labels } from "~/modules/users/utils/labels";

import "yup-phone-lite";

export const userFormSchema = Yup.object().shape({
  firstName: Yup.string()
    .required(labels.shouldNotBeBlank)
    .test("", labels.maxFirstName, (val) => val.length <= 10),
  lastName: Yup.string()
    .required(labels.shouldNotBeBlank)
    .test("", labels.maxLastName, (val) => val.length <= 10),
  nationalId: Yup.string()
    .required(labels.shouldNotBeBlank)
    .matches(/^[0-9]+$/, labels.nationalIdShouldContainOnlyDigits)
    .typeError(labels.nationalIdShouldNumeric)
    .test("", labels.nationalIdLimit, (val) => val.toString().length === 10),
  username: Yup.string()
    .required(labels.shouldNotBeBlank)
    .test("", labels.usernameLimit, (val) => val.toString().length <= 50),
  email: Yup.string()
    .email(labels.invalidEmail)
    .required(labels.shouldNotBeBlank)
    .test("email", labels.invalidEmail, isValidEmail)
    .test("", labels.emailLimit, (val) => val.toString().length <= 50),
  roleId: Yup.number()
    .required(labels.shouldNotBeBlank)
    .test("", labels.shouldNotBeBlank, (val) => val !== -101),

  contactNo: Yup.string()
    .phone("SA", labels.invalidContact)
    .required(labels.shouldNotBeBlank)
    .test("", labels.contactPattern, (val) => val.toString().startsWith("05")),
});
