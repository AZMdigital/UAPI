import { Fragment } from "react";

import PackageManagement from "~/modules/packageManagement";

import { AppHead } from "~/core/components/Apphead";
import DashboardLayout from "~/core/components/Layouts/DashboardLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const PackageManagementScreen: NextApplicationPage = () => {
  return (
    <DashboardLayout>
      <Fragment>
        <AppHead title={labels.packageManagement} />
        <PackageManagement />
      </Fragment>
    </DashboardLayout>
  );
};
export default PackageManagementScreen;
PackageManagementScreen.requireAuth = true;
