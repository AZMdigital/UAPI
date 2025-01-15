import { Fragment } from "react";

import Users from "~/modules/users";

import { AppHead } from "~/core/components/Apphead";
import DashboardLayout from "~/core/components/Layouts/DashboardLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const UsersPage: NextApplicationPage = () => {
  return (
    <DashboardLayout>
      <Fragment>
        <AppHead title={labels.users} />
        <Users />
      </Fragment>
    </DashboardLayout>
  );
};
export default UsersPage;
UsersPage.requireAuth = true;
