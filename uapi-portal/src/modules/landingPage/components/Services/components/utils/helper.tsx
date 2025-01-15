import makeStyles from "@mui/styles/makeStyles";

export const tabStyle = makeStyles({
  customStyleOnTab: {
    textTransform: "none",

    fontFamily: "SegoeUI",
    "&.MuiTab-root.Mui-selected": {},
    "&.MuiTab-textColorPrimary": {
      color: "Grey",
      fontSize: "1rem",
      fontWeight: 700,
      "&.Mui-selected": {
        color: "Black",
        fontSize: "1rem",
        fontWeight: 900,
      },
    },
  },
});
