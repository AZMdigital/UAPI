import { Fragment } from "react";

import CallbackLogs from "~/modules/callbackLogs";

import { AppHead } from "~/core/components/Apphead";
import DashboardLayout from "~/core/components/Layouts/DashboardLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const CallbackLogsScreen: NextApplicationPage = () => {
  return (
    <DashboardLayout>
      <Fragment>
        <AppHead title={labels.callbackLogs} />
        <CallbackLogs />
      </Fragment>
    </DashboardLayout>
  );
};
export default CallbackLogsScreen;
CallbackLogsScreen.requireAuth = true;
