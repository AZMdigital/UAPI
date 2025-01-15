import { Fragment } from "react";

import LogsReports from "~/modules/reports/components/LogsReports";

import { AppHead } from "~/core/components/Apphead";
import DashboardLayout from "~/core/components/Layouts/DashboardLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const LogReports: NextApplicationPage = () => {
  return (
    <DashboardLayout>
      <Fragment>
        <AppHead title={labels.logReports} />
        <LogsReports />
      </Fragment>
    </DashboardLayout>
  );
};
export default LogReports;
LogReports.requireAuth = true;
