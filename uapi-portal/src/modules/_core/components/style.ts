/* eslint-disable @typescript-eslint/naming-convention */
import makeStyles from "@mui/styles/makeStyles";

export const StepperStyle = {
  "& .MuiStepConnector-line": {
    borderColor: "secondary.black",
  },
  "& .MuiStepLabel-root .Mui-completed": {
    color: "primary.cyan", //  circle color (COMPLETED)
  },
  "& .MuiSvgIcon-root:not(.Mui-completed)": {
    color: "primary.inCompleteSteps",
  },
  "& .MuiStepLabel-root .Mui-disabled": {
    color: "primary.inCompleteSteps", // circle color (disabled)
  },
  "& .MuiStepIcon-root.Mui-disabled": {
    color: "primary.inCompleteSteps", // circle color (disabled)
  },
  "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel": {
    color: "primary.blackishGray", // Just text label (COMPLETED)
  },
  "& .MuiStepLabel-root .Mui-active": {
    color: "primary.cyan", // circle color (ACTIVE)
  },
  "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel": {
    color: "primary.main", // Just text label (ACTIVE)
  },
  "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
    fill: "secondary.white", // circle's number (ACTIVE)
  },
  "& .Mui-disabled .MuiStepIcon-text": {
    fill: "grey", // circle's number (ACTIVE)
  },
};
export const MenuItemStyle = {
  fontSize: 16,
  fontWeight: 400,
};
export const tabStyle = makeStyles({
  customStyleOnTab: {
    textTransform: "none",
    fontSize: "0.97rem",
    fontWeight: 400,
    fontFamily: "SegoeUI",
    "&.MuiButtonBase-root-MuiTab-root": {
      minHeight: "36px",
      height: "36px",
    },
    "&.MuiTab-root.Mui-selected": {
      backgroundColor: "#00BABE",
      borderRadius: "4px",
    },
    "&.MuiTab-textColorPrimary": {
      color: "black",
      "&.Mui-selected": {
        color: "white",
      },
    },
  },
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 100,
      width: "100%",
      backgroundColor: "transparent",
    },
  },
  flexContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export const dataGridColumnMenuStyle = {
  "& span, & svg": { fontSize: "1rem", fontWeight: 400 },
};

export const textfieldStyle = makeStyles({
  customNumberField: {
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    '& input[type="number"]': {
      "-moz-appearance": "textfield",
    },
    "&:-webkit-autofill": {
      transitionDelay: "9999s",
      transitionProperty: "background-color, color",
    },
  },
});
