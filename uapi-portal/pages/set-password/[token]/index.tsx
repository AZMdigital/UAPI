import SetPassword from "~/modules/auth/components/SetPassword";

import { AppHead } from "~/core/components/Apphead";
import CenteredLayout from "~/core/components/Layouts/CenteredLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const SetPasswordPage: NextApplicationPage = () => {
  return (
    <CenteredLayout>
      <AppHead title={labels.setPassword} />
      <SetPassword />
    </CenteredLayout>
  );
};
export default SetPasswordPage;
SetPasswordPage.requireAuth = false;
