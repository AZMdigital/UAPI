import ResetPassword from "~/modules/auth/components/ResetPassword";

import { AppHead } from "~/core/components/Apphead";
import CenteredLayout from "~/core/components/Layouts/CenteredLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const ResetPasswordPage: NextApplicationPage = () => {
  return (
    <CenteredLayout>
      <AppHead title={labels.resetPassword} />
      <ResetPassword />
    </CenteredLayout>
  );
};
export default ResetPasswordPage;
ResetPasswordPage.requireAuth = false;
