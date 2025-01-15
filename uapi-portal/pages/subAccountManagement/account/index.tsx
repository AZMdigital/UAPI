import SubAccountDetail from "~/modules/subAccountManagement/components/SubAccountDetail";

import DashboardLayout from "~/core/components/Layouts/DashboardLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";

const CreateSubAccount: NextApplicationPage = () => {
  return (
    <DashboardLayout>
      <SubAccountDetail />
    </DashboardLayout>
  );
};
export default CreateSubAccount;
CreateSubAccount.requireAuth = true;
