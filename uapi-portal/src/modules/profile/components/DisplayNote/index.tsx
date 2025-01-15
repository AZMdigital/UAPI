import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { DisplayNoteProps } from "~/modules/_core/components/interface";

const DisplayNote = ({ title, message }: DisplayNoteProps) => {
  return (
    <Grid item minWidth={360}>
      <Box
        sx={{
          backgroundColor: "secondary.main",
          borderRadius: "4px",
        }}
        flexDirection="column"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "primary.green",
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
          }}
        >
          <Typography
            sx={{
              paddingX: 2.5,
              paddingY: 2,
              color: "white",
            }}
          >
            {title}
          </Typography>
        </Box>

        <Typography
          sx={{
            padding: 2.5,
            color: "grey",
          }}
        >
          {message}
        </Typography>
      </Box>
    </Grid>
  );
};

export default DisplayNote;
