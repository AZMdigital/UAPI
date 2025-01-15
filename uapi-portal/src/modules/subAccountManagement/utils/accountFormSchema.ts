import * as Yup from "yup";

import { labels } from "~/modules/subAccountManagement/utils/labels";

import "yup-phone-lite";

export const isValidEmail = (email: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};
export const subAccountSchema = Yup.object().shape({
  companyName: Yup.string()
    .required(labels.shouldNotBeBlank)
    .matches(/^[A-Za-z ]*$/, labels.mustBeTextOnly)
    .max(20, labels.maxCompanyName),
  subAccountDescription: Yup.string()
    .required(labels.shouldNotBeBlank)
    .test("", labels.maxCompanyDescription, (val) => val.length <= 30),
  isActive: Yup.string().required(labels.shouldNotBeBlank),
  user: Yup.object({
    firstName: Yup.string()
      .required(labels.shouldNotBeBlank)
      .test("", labels.maxFirstName, (val) => val.length <= 10),
    lastName: Yup.string()
      .required(labels.shouldNotBeBlank)
      .test("", labels.maxLastName, (val) => val.length <= 10),
    nationalId: Yup.string()
      .required(labels.shouldNotBeBlank)
      .typeError(labels.nationalIdShouldNumeric)
      .test("", labels.nationalIdLimit, (val) => val.toString().length === 10),
    username: Yup.string()
      .required(labels.shouldNotBeBlank)
      .test("", labels.usernameLimit, (val) => val.toString().length <= 50),
    email: Yup.string()
      .email(labels.invalidEmail)
      .required(labels.shouldNotBeBlank)
      .test("companyEmail", labels.invalidEmail, isValidEmail)
      .test("", labels.emailLimit, (val) => val.toString().length <= 50),
    contactNo: Yup.string()
      .phone("SA", labels.invalidContact)
      .required(labels.shouldNotBeBlank)
      .test("", labels.contactPattern, (val) =>
        val.toString().startsWith("05")
      ),
  }),
});
