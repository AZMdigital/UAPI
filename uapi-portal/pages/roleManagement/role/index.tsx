import RolesForm from "~/modules/rolesManagement/components/RolesForm";

import DashboardLayout from "~/core/components/Layouts/DashboardLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";

const RoleFormScreen: NextApplicationPage = () => {
  return (
    <DashboardLayout>
      <RolesForm />
    </DashboardLayout>
  );
};
export default RoleFormScreen;
RoleFormScreen.requireAuth = true;
