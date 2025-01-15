import ForgetPassword from "~/modules/auth/components/ForgetPassword";

import { AppHead } from "~/core/components/Apphead";
import CenteredLayout from "~/core/components/Layouts/CenteredLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const ForgotPasswordPage: NextApplicationPage = () => {
  return (
    <CenteredLayout>
      <AppHead title={labels.forgetPassword} />
      <ForgetPassword />
    </CenteredLayout>
  );
};
export default ForgotPasswordPage;
