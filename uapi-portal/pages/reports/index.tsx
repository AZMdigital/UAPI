import { Fragment } from "react";

import Reports from "~/modules/reports";

import { AppHead } from "~/core/components/Apphead";
import DashboardLayout from "~/core/components/Layouts/DashboardLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const ReportsManagement: NextApplicationPage = () => {
  return (
    <DashboardLayout>
      <Fragment>
        <AppHead title={labels.reports} />
        <Reports />
      </Fragment>
    </DashboardLayout>
  );
};
export default ReportsManagement;
ReportsManagement.requireAuth = true;
