import { Fragment } from "react";

import SubAccountManagement from "~/modules/subAccountManagement";

import { AppHead } from "~/core/components/Apphead";
import DashboardLayout from "~/core/components/Layouts/DashboardLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const SubAccountManagementScreen: NextApplicationPage = () => {
  return (
    <DashboardLayout>
      <Fragment>
        <AppHead title={labels.subAccountManagement} />
        <SubAccountManagement />
      </Fragment>
    </DashboardLayout>
  );
};
export default SubAccountManagementScreen;
SubAccountManagementScreen.requireAuth = true;
