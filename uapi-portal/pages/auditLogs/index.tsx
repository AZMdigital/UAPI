import { Fragment } from "react";

import AuditLogs from "~/modules/auditLogs";

import { AppHead } from "~/core/components/Apphead";
import DashboardLayout from "~/core/components/Layouts/DashboardLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const AuditLogsScreen: NextApplicationPage = () => {
  return (
    <DashboardLayout>
      <Fragment>
        <AppHead title={labels.auditLogs} />
        <AuditLogs />
      </Fragment>
    </DashboardLayout>
  );
};
export default AuditLogsScreen;
AuditLogsScreen.requireAuth = true;
