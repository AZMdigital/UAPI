import { ChangeEvent } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";

import { FileBrowserButtonProps } from "~/modules/_core/components/interface";

import { getFileExtention } from "~/core/utils/helper";

const FileBrowserButton = ({
  textTitle,
  clickEvent,
  inputRef,
  setFile,
  enabled,
  isloading,
  fileType,
}: FileBrowserButtonProps) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      if (fileType.includes(getFileExtention(event.target.files[0].name))) {
        setFile(event.target.files[0]);
      }
    }
  };
  return (
    <Stack direction="row">
      <LoadingButton
        loading={isloading}
        disabled={enabled}
        onClick={clickEvent}
        sx={{
          height: 35,
          width: 72,
          paddingTop: 1,
          color: "primary.typoWhite",
          textTransform: "capitalize",
          backgroundColor: "primary.green",
          "&:hover": {
            backgroundColor: "primary.green",
          },
          "&.Mui-disabled": {
            backgroundColor: "primary.green",
            color: "primary.typoWhite",
            opacity: 0.4,
          },
        }}
      >
        {textTitle}
      </LoadingButton>
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        accept={fileType}
        onInputCapture={handleFileChange}
      />
    </Stack>
  );
};

export default FileBrowserButton;
