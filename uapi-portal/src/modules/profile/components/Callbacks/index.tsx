import { Fragment, useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { useQueryClient } from "@tanstack/react-query";

import { handleErroMessage, handleSuccessMessage } from "~/utils/helper";
import { PERMISSION_COMPANY_CALLBACK_CONFIG_EDIT } from "~/utils/permissionsConstants";

import { useAppSelector } from "~/state/hooks";

import {
  useDeleteCallback,
  useGetCallbacks,
} from "~/rest/apiHooks/callbacks/useCallbacks";
import { useGetCompanyServices } from "~/rest/apiHooks/companies/useCompanies";

import CallbackModal from "~/modules/profile/components/Callbacks/components/CallbackModal";
import {
  callBacksColumns,
  getCallbackEnabledService,
} from "~/modules/profile/utils/helper";
import { labels } from "~/modules/profile/utils/labels";

import ConfirmationDailog from "~/core/components/ConfirmationDialog";
import LoadingView from "~/core/components/LoadingView";
import TableComponent from "~/core/components/Table";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";

export default function Callbacks() {
  const queryClient = useQueryClient();
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);
  const [shouldShowDialog, setShowDialog] = useState(false);
  const [isEditmode, setIsEditMode] = useState(false);
  const [shouldShowCallbackForm, setShowCallbackForm] = useState(false);
  const [selectedCallbackId, setSelectedCallbackId] = useState(0);
  const [selectedcallbackData, setSelectedCallbackData] = useState<any>();
  const [callbackList, setCallbackList] = useState<any[]>([]);
  const [companyServicesList, setCompanyServicesList] = useState<any[]>([]);
  const [isDisableBtn, setDisableBtn] = useState(false);

  const user = useAppSelector((state) => state.core.userInfo);
  const isSuperAdmin: any = user?.isSuperAdmin;

  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  const userPermissionsStrings: string[] = userPermissions.map(
    (permission) => permission as unknown as string
  );

  const hasEditHeaderPermission: boolean = userPermissionsStrings.includes(
    PERMISSION_COMPANY_CALLBACK_CONFIG_EDIT
  );

  const {
    mutateAsync: getCompanyServiceList,
    data: companyServiceData,
    isLoading: isCompanyServiceDataLoading,
  } = useGetCompanyServices();

  const { data, isLoading, isError, error } = useGetCallbacks();
  const { mutateAsync: deleteCallback, isLoading: isDeleting } =
    useDeleteCallback();

  const extractCallbackData: (array: any[]) => any[] = (array) => {
    return array.map((obj) => {
      const mergedObj: any = {
        id: obj.id,
        serviceName: obj.serviceName,
        serviceId: obj.serviceId,
        description: obj.description,
        callbackUrl: obj.callbackUrl,
        authHeaderKey: obj.authHeaderKey,
        authHeaderValue: obj.authHeaderValue,
        isActive: obj.isActive,
      };
      return mergedObj;
    });
  };

  useEffect(() => {
    if (user) {
      getCompanyServiceList(
        { companyId: user?.company.id as number },
        {
          onError: (error: any) => {
            const status =
              error?.error?.response?.status || error?.response?.status;
            if (status === 403) {
              setShowUnAuthView(true);
            }
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkIfSelectedServiceIsActive = async (
    id: number,
    name: string,
    servicesList: any[]
  ) => {
    const filteredServices = servicesList.filter(
      (data: any) => data.service.id === id
    );
    if (filteredServices.length === 0) {
      handleErroMessage(`The ${name}${labels.serviceIsDeactive}`);
      setDisableBtn(true);
    }
  };

  useEffect(() => {
    if (companyServiceData) {
      setCompanyServicesList(getCallbackEnabledService(companyServiceData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyServiceData]);

  useEffect(() => {
    if (data) {
      setCallbackList(extractCallbackData(data));
      setShowUnAuthView(false);
    }

    if (isError) {
      const errorObj: any = error;
      const status =
        errorObj?.error?.response?.status || errorObj?.response?.status;

      if (status === 403) {
        setShowUnAuthView(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError]);

  const deleteSelectedHeader = (id: number) => {
    setSelectedCallbackId(id);
    const selectedheaderData = callbackList.filter(
      (callback: any) => callback.id === id
    );
    setSelectedCallbackData(selectedheaderData[0]);
    setShowDialog(true);
  };

  const onEdit = (input: any) => {
    setSelectedCallbackData(input);
    checkIfSelectedServiceIsActive(
      input.serviceId,
      input.serviceName,
      companyServicesList
    );
    setIsEditMode(true);
    setShowCallbackForm(true);
  };

  const addCallback = () => {
    setSelectedCallbackData(undefined);
    setIsEditMode(false);
    setDisableBtn(false);
    setShowCallbackForm(true);
  };

  const handleDeleteAction = (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      setShowDialog(false);
      deleteCallback(
        { id: selectedCallbackId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["getAllCallbacks"]);
            handleSuccessMessage(
              `${labels.callbackText} '${
                `${selectedcallbackData?.callbackUrl}` ?? ""
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

  const handleCallbackFormCancel = (Status: boolean) => {
    setShowCallbackForm(Status);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      {isLoading || isCompanyServiceDataLoading ? (
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
                      {/* <Typography
                        variant="h4"
                        color="primary.blackishGray"
                        marginBottom={2}
                      >
                        {labels.customHeaderDescription}
                      </Typography> */}
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
                          onClick={addCallback}
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
                          {labels.addCallback}
                        </LoadingButton>
                      </Grid>
                    )}
                  </Grid>

                  <Grid item xs={12} paddingTop={2}>
                    <TableComponent
                      columns={callBacksColumns}
                      rows={callbackList}
                      columnHeaderHeight={48}
                      loading={isLoading}
                      deleting={isDeleting}
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
          <CallbackModal
            isEditMode={isEditmode}
            isSaveBtnEnabled={isDisableBtn}
            isOpen={shouldShowCallbackForm}
            handleCancel={handleCallbackFormCancel}
            selectedCallback={selectedcallbackData}
            servicesList={companyServicesList}
          />
          <ConfirmationDailog
            isOpen={shouldShowDialog}
            label={`${labels.callbackDeleteConfirmation}'${
              `${selectedcallbackData?.callbackUrl}` ?? ""
            }' ?`}
            handleAction={handleDeleteAction}
          />
        </Fragment>
      )}
    </Box>
  );
}
