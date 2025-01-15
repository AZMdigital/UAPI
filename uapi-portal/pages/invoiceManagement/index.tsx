import { Fragment } from "react";

import InvoiceManagement from "~/modules/invoiceManagement";

import { AppHead } from "~/core/components/Apphead";
import DashboardLayout from "~/core/components/Layouts/DashboardLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const InvoiceManagementScreen: NextApplicationPage = () => {
  return (
    <DashboardLayout>
      <Fragment>
        <AppHead title={labels.invoiceManagement} />
        <InvoiceManagement />
      </Fragment>
    </DashboardLayout>
  );
};
export default InvoiceManagementScreen;
InvoiceManagementScreen.requireAuth = true;
