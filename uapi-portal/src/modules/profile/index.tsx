import { Fragment, SyntheticEvent, useLayoutEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { useAppSelector } from "~/state/hooks";

import { TabListInterface } from "~/modules/profile/interface/profile";
import { profileTabArray } from "~/modules/profile/utils/helper";

import LoadingView from "~/core/components/LoadingView";
import TabPanel from "~/core/components/Tabpanel";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";
import { getProfileTabListByRole } from "~/core/utils/helper";

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const Profile = () => {
  const user = useAppSelector((state) => state.core.userInfo);
  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );
  const [profileTabs, setProfileTabs] = useState<TabListInterface[]>([]);
  const [value, setValue] = useState(0);
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);

  useLayoutEffect(() => {
    if (userPermissions && user) {
      const profileTabsList: TabListInterface[] = getProfileTabListByRole(
        profileTabArray,
        userPermissions,
        user.isSuperAdmin
      );
      if (profileTabsList.length > 0) {
        setProfileTabs(profileTabsList);
      } else {
        setShowUnAuthView(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        paddingX: "57px",
        paddingY: "40px",
        backgroundColor: "primary.background",
      }}
    >
      <Fragment>
        {isShowUnAuthView ? (
          <UnAuthorizeView />
        ) : (
          <Fragment>
            {profileTabs.length > 0 ? (
              <Fragment>
                <Tabs
                  value={value}
                  TabIndicatorProps={{ sx: { display: "none" } }}
                  onChange={handleChange}
                  textColor="secondary"
                >
                  {profileTabs?.map((item, index) => {
                    return (
                      <Tab
                        key={item.name}
                        label={item.name}
                        sx={{
                          "&.MuiButtonBase-root": {
                            minHeight: 35,
                            paddingY: 0,
                            paddingX: 3,
                          },
                          textTransform: "capitalize",
                          fontWeight: 500,
                          fontSize: 16,
                          fontFamily: "SegoeUI",
                          backgroundColor:
                            value === index ? "primary.green" : "",
                          borderRadius: 1.25,
                          paddingX: 5,
                          color:
                            value === index
                              ? "primary.typoWhite"
                              : "primary.typoBlack", // Apply green color to the selected tab
                        }}
                        {...a11yProps(index)}
                      />
                    );
                  })}
                </Tabs>
                <TabPanel value={value} index={value}>
                  {profileTabs[value].view}
                </TabPanel>{" "}
              </Fragment>
            ) : (
              <LoadingView />
            )}
          </Fragment>
        )}
      </Fragment>
      {/* )} */}
    </Box>
  );
};
export default Profile;
