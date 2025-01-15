import { labels } from "~/modules/auth/utils/labels";
import { SignInSchema } from "~/modules/auth/utils/signInSchema";

import { Field } from "~/core/components/interface";

export const signInFormFields: Field[] = [
  {
    label: labels.username,
    controllerName: labels.usernameKey,
    textFieldType: "text",
  },
  {
    label: labels.passwordText,
    controllerName: labels.passwordKey,
    textFieldType: "password",
  },
];
export const signIn = {
  formSchema: SignInSchema,
};
