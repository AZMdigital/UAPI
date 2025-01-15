import UserForm from "~/modules/users/components/UserForm";

import DashboardLayout from "~/core/components/Layouts/DashboardLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";

const CreateUser: NextApplicationPage = () => {
  return (
    <DashboardLayout>
      <UserForm />
    </DashboardLayout>
  );
};
export default CreateUser;
CreateUser.requireAuth = true;
