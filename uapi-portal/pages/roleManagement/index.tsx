import { Fragment } from "react";

import RolesManagement from "~/modules/rolesManagement";

import { AppHead } from "~/core/components/Apphead";
import DashboardLayout from "~/core/components/Layouts/DashboardLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const RolesManagementScreen: NextApplicationPage = () => {
  return (
    <DashboardLayout>
      <Fragment>
        <AppHead title={labels.rolesManagement} />
        <RolesManagement />
      </Fragment>
    </DashboardLayout>
  );
};
export default RolesManagementScreen;
RolesManagementScreen.requireAuth = true;
