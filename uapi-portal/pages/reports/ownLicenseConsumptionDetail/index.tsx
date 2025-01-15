import { Fragment } from "react";

import OwnLicenseReport from "~/modules/reports/components/OwnLicenseReport";

import { AppHead } from "~/core/components/Apphead";
import DashboardLayout from "~/core/components/Layouts/DashboardLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const ConsumptionReportOwnLicenseScreen: NextApplicationPage = () => {
  return (
    <DashboardLayout>
      <Fragment>
        <AppHead title={labels.consumptionDetailOwnLicense} />
        <OwnLicenseReport />
      </Fragment>
    </DashboardLayout>
  );
};
export default ConsumptionReportOwnLicenseScreen;
ConsumptionReportOwnLicenseScreen.requireAuth = true;
