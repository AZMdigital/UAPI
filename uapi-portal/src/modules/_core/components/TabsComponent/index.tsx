import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import {
  TabInterface,
  TabsComponentProps,
} from "~/modules/_core/components/interface";
import { tabStyle } from "~/modules/_core/components/style";

const TabsComponent = ({
  tabArray,
  currentActiveStep,
  setCurrentTab,
}: TabsComponentProps) => {
  const classes = tabStyle();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        paddingX: 1,
        paddingTop: 1,
        paddingBottom: 0.5,
        backgroundColor: "primary.tabBackground",
        justifyContent: "center",
        borderRadius: "4px",
      }}
    >
      <Tabs
        value={currentActiveStep}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        classes={{
          flexContainer: classes.flexContainer,
          indicator: classes.indicator,
        }}
        TabIndicatorProps={{
          children: <span />,
        }}
      >
        {tabArray?.map((steps: TabInterface) => (
          <Tab
            sx={{
              minHeight: 36,
              height: 36,
              marginTop: 0.5,
            }}
            key={steps.label}
            label={steps.label}
            disabled={steps.disabled}
            className={classes.customStyleOnTab}
          />
        ))}
      </Tabs>
    </Box>
  );
};
export default TabsComponent;
