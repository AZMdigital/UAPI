import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useRouter } from "next/router";

import forbiddenLogo from "~/public/assets/forbiddenIcon.svg";

import FormLoadingButton from "~/core/components/Buttons/FormLoadingButton";
import NoAuthlayout from "~/core/components/Layouts/NoAuthLayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { paths } from "~/core/utils/helper";
import { labels } from "~/core/utils/labels";

const UnAuthrizedPage: NextApplicationPage = () => {
  const router = useRouter();
  const backToHome = () => {
    router.replace(paths.homePage);
  };

  return (
    <NoAuthlayout>
      <Box
        height="70vh"
        display="flex"
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
      >
        <Image src={forbiddenLogo} alt="" width={400} />
        <Stack
          direction="column"
          spacing={2}
          display="contents"
          justifyContent="center"
        >
          <Typography
            color="primary.main"
            variant="caption"
            sx={{
              color: "primary.cyan",
            }}
          >
            {labels.accessDenied}
          </Typography>
          <Typography variant="body1">{labels.forbiddenText}</Typography>
          <Grid xs={2}>
            <FormLoadingButton
              onClickEvent={backToHome}
              buttonVariant="contained"
              fullwidth
              color="primary.typoWhite"
              backgroundColor="primary.green"
            >
              {labels.backToLogin}
            </FormLoadingButton>
          </Grid>
        </Stack>
      </Box>
    </NoAuthlayout>
  );
};
export default UnAuthrizedPage;
UnAuthrizedPage.requireAuth = false;
