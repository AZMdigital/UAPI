/* eslint-disable @typescript-eslint/naming-convention */
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

export const DividerSection = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      height={20}
      position="relative"
    >
      <Divider sx={{ width: "100%", position: "relative" }} />

      <Stack
        direction="row"
        sx={{
          width: "100%",
          height: 20,
          backgroundColor: "transparent",
          position: "absolute",
          top: -12,
          justifyContent: "space-between",
          paddingX: 35,
        }}
      >
        {Array.from({ length: 3 }).map((_data, index) => (
          <Box
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            sx={{
              width: "50px",
              display: "flex",
              backgroundColor: "white",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                backgroundColor: "#f8f9fc66",
                border: "1px solid #d3d3d3",
              }}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
