import * as Yup from "yup";
import YupPassword from "yup-password";

import { labels } from "~/modules/auth/utils/labels";

// eslint-disable-next-line new-cap
YupPassword(Yup);

export const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email(labels.invalidEmail)
    .required(labels.shouldNotBeBlank),
  password: Yup.string().required(labels.shouldNotBeBlank),
  remember: Yup.boolean().optional(),
});

export const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email(labels.invalidEmail)
    .required(labels.shouldNotBeBlank),
});

export const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required(labels.shouldNotBeBlank)
    .min(8, labels.atLeastEightCharacter)
    .max(20, labels.maxTeventyCharacters)
    .matches(RegExp("(.*[a-z].*)"), labels.atLeastOneLowercase)
    .matches(RegExp("(.*[A-Z].*)"), labels.atLeastOneUppercase)
    .matches(RegExp("(.*\\d.*)"), labels.atLeastOneNumber)
    .matches(
      /.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-].*/,
      labels.atLeastOneSpecialCharacter
    ),
  confirmPassword: Yup.string()
    .required(labels.shouldNotBeBlank)
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});
