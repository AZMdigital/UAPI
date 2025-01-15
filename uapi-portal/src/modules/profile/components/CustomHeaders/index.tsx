import { Fragment, useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";

import { handleSuccessMessage } from "~/utils/helper";
import { PERMISSION_CUSTOM_HEADER_EDIT } from "~/utils/permissionsConstants";

import { useAppSelector } from "~/state/hooks";

import {
  useAddUpdateHeaders,
  useGetCustomHeader,
} from "~/rest/apiHooks/customHeaders";

import CustomHeaderModal from "~/modules/profile/components/CustomHeaders/componets/CustomHeaderModal";
import { cutomHeaderColumns } from "~/modules/profile/utils/helper";
import { labels } from "~/modules/profile/utils/labels";

import ConfirmationDailog from "~/core/components/ConfirmationDialog";
import LoadingView from "~/core/components/LoadingView";
import TableComponent from "~/core/components/Table";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";

export default function CustomHeaders() {
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.core.userInfo);
  const isSuperAdmin: any = user?.isSuperAdmin;

  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  const userPermissionsStrings: string[] = userPermissions.map(
    (permission) => permission as unknown as string
  );

  const hasEditHeaderPermission: boolean = userPermissionsStrings.includes(
    PERMISSION_CUSTOM_HEADER_EDIT
  );

  const [isShowUnAuthView, setShowUnAuthView] = useState(false);
  const [headerList, setHeaderList] = useState<any[]>([]);
  const [selectedHeaderData, setSelectedHeadeData] = useState<any>();
  const [selectedHeaderId, setSelectedHeaderId] = useState(0);
  const [isEditmode, setIsEditMode] = useState(false);
  const [shouldShowDialog, setShowDialog] = useState(false);
  const [shouldShowHeaderForm, setShowHeaderForm] = useState(false);
  const [shouldTriggerRefetch, setTriggerRefetch] = useState(false);
  const {
    mutateAsync: getAllCustomHeaders,
    data,
    isLoading,
    error,
    isError,
  } = useGetCustomHeader();
  const { mutateAsync: deleteHeaders } = useAddUpdateHeaders();

  useEffect(() => {
    if (user) {
      getAllCustomHeaders({ companyId: user.company.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldTriggerRefetch]);

  useEffect(() => {
    if (data) {
      setHeaderList(data);
      setShowUnAuthView(false);
    } else {
      setShowUnAuthView(false);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      const errorObj: any = error;
      const status =
        errorObj?.error?.response?.status || errorObj?.response?.status;
      if (status === 403) {
        setShowUnAuthView(true);
        setHeaderList([]);
      }
    }
  }, [error, isError]);

  const handleHeaderFormCancel = (Status: boolean) => {
    setShowHeaderForm(Status);
  };

  const handleUpdateList = () => {
    setTriggerRefetch((value) => !value);
  };

  const deleteSelectedHeader = (headerId: number) => {
    setSelectedHeaderId(headerId);
    const selectedheaderData = headerList.filter(
      (header: any) => header.id === headerId
    );
    setSelectedHeadeData(selectedheaderData[0]);
    setShowDialog(true);
  };

  const onEdit = (input: any) => {
    setSelectedHeadeData(input);
    setIsEditMode(true);
    setShowHeaderForm(true);
  };

  const getHeaderListForDeleteOperation = () => {
    const selectedheaderData = headerList.filter(
      (header: any) => header.id !== selectedHeaderId
    );
    return selectedheaderData;
  };

  const handleDeleteAction = (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      setShowDialog(false);
      deleteHeaders(
        { list: getHeaderListForDeleteOperation() },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["getAllCustomHeaders"]);
            setTriggerRefetch((value) => !value);
            handleSuccessMessage(
              `${labels.headertext} '${
                `${selectedHeaderData?.key} : ${selectedHeaderData?.value}` ??
                ""
              }'`,
              labels.deleted
            );
          },
          onError: (error: any) => {
            const status =
              error?.error?.response?.status || error?.response?.status;
            if (status === 403) {
              // handleErroMessage(labels.forbiddenText);
            }
          },
        }
      );
    } else {
      setShowDialog(false);
    }
  };

  const addCustomHeader = () => {
    setSelectedHeadeData(undefined);
    setIsEditMode(false);
    setShowHeaderForm(true);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      {isLoading ? (
        <LoadingView height="70vh" />
      ) : (
        <Fragment>
          {isShowUnAuthView ? (
            <UnAuthorizeView />
          ) : (
            <Box width="100%">
              <Card elevation={0} sx={{ height: "70vh" }}>
                <CardContent>
                  <Grid container xs={12} display="flex">
                    <Grid item xs={10}>
                      <Typography
                        variant="h4"
                        color="primary.blackishGray"
                        marginBottom={2}
                      >
                        {labels.customHeaderDescription}
                      </Typography>
                    </Grid>

                    {(isSuperAdmin || hasEditHeaderPermission) && (
                      <Grid
                        item
                        xs={2}
                        display="flex"
                        justifyContent="end"
                        alignItems="top"
                      >
                        <LoadingButton
                          onClick={addCustomHeader}
                          sx={{
                            marginBottom: "auto",
                            paddingX: 2,
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
                          {labels.addHeader}
                        </LoadingButton>
                      </Grid>
                    )}
                  </Grid>

                  <Grid item xs={12} paddingTop={2}>
                    <TableComponent
                      columns={cutomHeaderColumns}
                      rows={headerList}
                      columnHeaderHeight={48}
                      loading={isLoading}
                      deleting={false}
                      showDeleteButton={isSuperAdmin || hasEditHeaderPermission}
                      onDelete={deleteSelectedHeader}
                      showEditButton={isSuperAdmin || hasEditHeaderPermission}
                      onEdit={onEdit}
                      actions={isSuperAdmin || hasEditHeaderPermission}
                      showActionTitle
                      defaultPageSize={10}
                    />
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
          <CustomHeaderModal
            isEditMode={isEditmode}
            isOpen={shouldShowHeaderForm}
            handleCancel={handleHeaderFormCancel}
            selectedHeader={selectedHeaderData}
            headersList={headerList}
            handleUpdate={handleUpdateList}
          />
          <ConfirmationDailog
            isOpen={shouldShowDialog}
            label={`${labels.headerDeleteConfirmation}'${
              `${selectedHeaderData?.key} : ${selectedHeaderData?.value}` ?? ""
            }' ?`}
            handleAction={handleDeleteAction}
          />
        </Fragment>
      )}
    </Box>
  );
}
