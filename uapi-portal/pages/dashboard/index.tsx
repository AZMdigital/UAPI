import { Fragment } from "react";

import Dashboard from "~/modules/dashboard";

import { AppHead } from "~/core/components/Apphead";
import DashboardLayout from "~/core/components/Layouts/DashboardLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const DashboardScreen: NextApplicationPage = () => {
  return (
    <DashboardLayout>
      <Fragment>
        <AppHead title={labels.dashboard} />
        <Dashboard />
      </Fragment>
    </DashboardLayout>
  );
};
export default DashboardScreen;
DashboardScreen.requireAuth = true;
