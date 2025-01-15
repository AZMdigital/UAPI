import PackageSelection from "~/modules/packageManagement/components/PackageSelection";

import DashboardLayout from "~/core/components/Layouts/DashboardLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";

const PackageSelectionScreen: NextApplicationPage = () => {
  return (
    <DashboardLayout>
      <PackageSelection />
    </DashboardLayout>
  );
};
export default PackageSelectionScreen;
PackageSelectionScreen.requireAuth = true;
