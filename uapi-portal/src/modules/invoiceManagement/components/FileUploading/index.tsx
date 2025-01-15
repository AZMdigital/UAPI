/* eslint-disable @typescript-eslint/naming-convention */
import { Fragment, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CloseIcon from "@mui/icons-material/Close";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import { useUploadSlip } from "~/rest/apiHooks/invoices/useInvoices";

import {
  CompanyAttachmentProps,
  FileAttachment,
  FileStatus,
  FileUploadingProps,
} from "~/modules/invoiceManagement/utils/helper";
import { labels } from "~/modules/invoiceManagement/utils/labels";

import FileIcon from "~/public/assets/pdf-icon.svg";

const FileUploading = ({
  invoiceId,
  accountId,
  handleCloseAction,
  handleCancelAction,
  modalHeading,
}: FileUploadingProps) => {
  const {
    mutate: uploadFileAttachment,
    data,
    error,
    // isError,
    isLoading,
  } = useUploadSlip();

  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [isShowErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (data) {
      updateFileStatus(data.name, FileStatus.ISUPLOADED, data.id);
    } else if (error) {
      updateFileStatus(files[0].name, FileStatus.ISFAILEDUPLOADING, -1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error]);

  const uploadFile = () => {
    const fileData = {
      attachmentFile: files[0].file,
    } as unknown as CompanyAttachmentProps;

    // Update File Status Before Uploading
    updateFileStatus(files[0].name, FileStatus.ISUPLOADING, -1);

    // Call upload API
    uploadFileAttachment(
      {
        attachmentData: fileData,
        invoiceId: Number(invoiceId),
        accountId: Number(accountId),
      },
      {
        onSuccess: () => {
          handleCloseAction(false);
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data.error;
          setErrorMessage(errorMessage);
          setShowErrorMessage(true);
        },
      }
    );
  };

  const fileSizeValidator = (file: File) => {
    if (file.size > 1 * 1024 * 1024) {
      return {
        code: "size-too-large",
        message: labels.fileSizeText,
      };
    }
    return null;
  };

  const updateFileStatus = (
    fileName: string,
    status: FileStatus,
    uploadedId: number
  ) => {
    const fileIndex = files.findIndex((file) => file.name === fileName);
    const updatedFile = { ...files[fileIndex] };
    updatedFile.fileStatus = status;
    updatedFile.id = uploadedId;
    const newFiles = [
      ...files.slice(0, fileIndex),
      updatedFile,
      ...files.slice(fileIndex + 1),
    ];
    setFiles(newFiles);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: {
      "application/pdf": [".pdf"],
    },
    validator: fileSizeValidator,
    onDropAccepted: (acceptedFiles) => {
      acceptAndUploadFile(acceptedFiles[acceptedFiles.length - 1]);
    },
    onDropRejected: () => {
      setErrorMessage(labels.fileType);
      setShowErrorMessage(true);
    },
  });

  const acceptAndUploadFile = (acceptedFiles: File) => {
    const fileData = {} as FileAttachment;
    fileData.id = -1;
    fileData.name = acceptedFiles.name;
    fileData.file = acceptedFiles;
    fileData.fileStatus = FileStatus.ISSELECTED;

    setFiles([fileData]);
  };

  const removeFile = (index: number) => {
    if (files[index].fileStatus !== FileStatus.ISUPLOADING) {
      const updatedList = [
        ...files.slice(0, index),
        ...files.slice(index + 1, files.length),
      ];
      setFiles(updatedList);
    }
  };

  const retryUploadFile = (index: number) => {
    const fileData = files[index];
    updateFileStatus(fileData.name, FileStatus.ISUPLOADING, -1);
    uploadFile();
  };

  const previewAllFiles = files.map((file, index) => (
    <Paper
      key={file.name}
      elevation={0}
      sx={{
        width: 100,
        height: 110,
        backgroundColor: "transparent",
        padding: 1,
        position: "relative",
      }}
    >
      <Card
        elevation={1}
        sx={{
          height: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "top",
          position: "relative",
        }}
      >
        <Image
          src={FileIcon}
          alt=""
          style={{ height: 60, width: 60, paddingTop: 10 }}
        />
        <Typography
          color="black"
          variant="h6"
          id={file.name}
          sx={{
            position: "absolute",
            whiteSpace: "nowrap",
            overflow: "hidden",
            zIndex: 100,
            top: "70%",
            maxWidth: 70,
          }}
        >
          {file.name}
        </Typography>

        {file.fileStatus === FileStatus.ISUPLOADING && (
          <Fragment>
            <Box
              width="100%"
              height="100%"
              sx={{
                position: "absolute",
                backgroundColor: "grey",
                opacity: 0.8,
              }}
            />
            <CircularProgress
              color="info"
              size={30}
              style={{ color: "white" }}
              sx={{
                position: "absolute",
                left: "32%",
                top: "32%",
              }}
            />
          </Fragment>
        )}

        {file.fileStatus === FileStatus.ISFAILEDUPLOADING && (
          <Fragment>
            <Box
              width="100%"
              height="100%"
              sx={{
                position: "absolute",
                backgroundColor: "grey",
                opacity: 0.8,
              }}
            />
            <IconButton
              onClick={() => retryUploadFile(index)}
              sx={{
                position: "absolute",
                left: "20%",
                top: "20%",
              }}
            >
              <ReplayOutlinedIcon
                fontSize="large"
                style={{
                  color: "white",
                }}
              />
            </IconButton>
          </Fragment>
        )}
      </Card>

      <IconButton
        onClick={() => removeFile(index)}
        disableRipple
        sx={{
          position: "absolute",
          right: -9,
          top: -9,
        }}
      >
        <CancelRoundedIcon
          fontSize="small"
          sx={{
            color: "grey",
            backgroundColor: "white",
            borderRadius: 3,
          }}
        />
      </IconButton>
    </Paper>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.name));
  }, [files]);

  const handleSaveAction = () => {
    if (files.length > 0) {
      uploadFile();
    }
  };

  const handleErrorMessageClose = () => {
    setShowErrorMessage(false);
  };

  const handleCancelEvent = () => {
    handleCancelAction(false);
  };

  return (
    <Fragment>
      <IconButton
        aria-label="close"
        disabled={isLoading}
        onClick={handleCancelEvent}
        sx={{
          position: "absolute",
          right: 5,
          top: 6,
        }}
      >
        <CloseIcon fontSize="small" sx={{ color: "white" }} />
      </IconButton>
      <Box width={500} height={300} flexDirection="column">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="left"
          padding={2}
          sx={{ backgroundColor: "primary.cyan" }}
        >
          <Typography variant="h2" color="white">
            {modalHeading}
          </Typography>
        </Box>
        <Grid
          item
          container
          xs={12}
          sx={{
            paddingTop: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid item xs={11}>
            <Box
              {...getRootProps({ className: "dropzone" })}
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                height: 130,
                border: "1px dashed grey",
                borderRadius: 2,
                marginTop: 0,
              }}
            >
              {files.length > 0 ? (
                <Grid
                  container
                  direction="column"
                  xs={12}
                  alignItems="center"
                  sx={{
                    maxHeight: 110,
                    overflow: "hidden",
                    overflowY: "scroll",
                    paddingX: 1,
                  }}
                >
                  <Grid item container>
                    {previewAllFiles}
                  </Grid>
                </Grid>
              ) : (
                <Fragment>
                  <input id="fileInput" {...getInputProps()} />
                  <Stack direction="row" spacing={0.5}>
                    <Typography
                      color="grey"
                      variant="h2"
                      id={labels.dragFileText}
                    >
                      {labels.dragFileText}
                    </Typography>
                    <Typography
                      color="grey"
                      variant="h2"
                      onClick={open}
                      id={labels.uploadText}
                      sx={{ textDecoration: "underline" }}
                    >
                      {labels.uploadText}
                    </Typography>
                  </Stack>
                </Fragment>
              )}
            </Box>
          </Grid>

          <Grid item paddingTop={4}>
            <LoadingButton
              loading={false}
              disabled={isLoading}
              onClick={handleSaveAction}
              sx={{
                maxWidth: 50,
                color: "white",
                fontFamily: "SegoeUI",
                textTransform: "capitalize",
                backgroundColor: "primary.cyan",
                "&:hover": {
                  backgroundColor: "primary.cyan",
                },
              }}
            >
              {labels.save}
            </LoadingButton>
          </Grid>
        </Grid>
        <Snackbar
          open={isShowErrorMessage}
          autoHideDuration={5000}
          onClose={handleErrorMessageClose}
          disableWindowBlurListener
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
        >
          <Alert
            onClose={handleErrorMessageClose}
            severity="error"
            sx={{
              width: "100%",
              fontFamily: "SegoeUI",
              fontSize: "16px",
            }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Fragment>
  );
};
export default FileUploading;
