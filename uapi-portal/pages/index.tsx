import { Fragment } from "react";

import { NextApplicationPage } from "~/modules/_core/interfaces/app.interface";
import SignIn from "~/modules/auth/components/signin";

import { AppHead } from "~/core/components/Apphead";
import { labels } from "~/core/utils/labels";

const SignInPage: NextApplicationPage = () => {
  return (
    <Fragment>
      <AppHead title={labels.signIn} />
      <SignIn />
    </Fragment>
  );
};
export default SignInPage;
