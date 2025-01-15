import { RoleType } from "~/rest/models/role";

// declaring the types for our state
type RolesState = {
  currentRole: RoleType | undefined;
};
const initialState: RolesState = {
  currentRole: undefined,
};
export default initialState;
