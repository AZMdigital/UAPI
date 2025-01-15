import { Fragment } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppDispatch } from "~/state/hooks";

import { ConatinerLayoutInterface } from "~/core/components/interface";
import { toggleModal } from "~/core/state/coreSlice";
import { FormModes } from "~/core/utils/helper";

const ContainerLayout = ({
  children,
  buttonLabel,
  breadCrumbs,
  showButton,
  buttonAction,
  id,
}: ConatinerLayoutInterface) => {
  const dispatch = useAppDispatch();
  return (
    <Fragment>
      <Box
        sx={{
          height: 47.5,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <Stack direction="row" spacing={0.2} alignItems="center">
          {breadCrumbs.map((item, index, array) => (
            <Fragment key={item}>
              <Typography
                fontWeight={700}
                fontSize={20}
                color={
                  index === array.length - 1 ? "primary" : "primary.greyText"
                }
                fontFamily="SegoeUI"
                lineHeight="18.88px"
              >
                {item}
              </Typography>
              {index !== array.length - 1 ? (
                <Box paddingTop={1.2}>
                  <KeyboardArrowRightIcon color="disabled" />
                </Box>
              ) : null}
            </Fragment>
          ))}
        </Stack>

        {showButton && (
          <Button
            disableElevation
            sx={{
              paddingX: 3,
              paddingY: 1,
              textTransform: "capitalize",
              fontSize: "16px",
              fontWeight: 400,
              fontFamily: "SegoeUI",
              backgroundColor: "primary.cyan",
              "&:hover": {
                backgroundColor: "primary.cyan",
              },
            }}
            id={id}
            variant="contained"
            onClick={() => {
              dispatch(
                toggleModal({ title: buttonLabel, formMode: FormModes.CREATE })
              );
              if (buttonAction) {
                buttonAction();
              }
            }}
          >
            {buttonLabel}
          </Button>
        )}
      </Box>
      <Box
        sx={{
          backgroundColor: "secondary.white",
          width: "100%",
        }}
      >
        <Grid container direction="column" spacing={2} padding={2}>
          {children}
        </Grid>
      </Box>
    </Fragment>
  );
};

export default ContainerLayout;
