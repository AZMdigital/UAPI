import { UserInputType } from "~/rest/models/user";

// declaring the types for our state
type UserState = {
  currentUser: UserInputType | undefined;
  userNameValidation: boolean | undefined;
  userEmailValidation: boolean | undefined;
};
const initialState: UserState = {
  currentUser: undefined,
  userNameValidation: undefined,
  userEmailValidation: undefined,
};
export default initialState;
