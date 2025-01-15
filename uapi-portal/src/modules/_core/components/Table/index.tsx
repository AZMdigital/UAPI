import { Fragment, useState } from "react";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DataGrid, gridClasses, GridPagination } from "@mui/x-data-grid";

import { pageSizeOptions } from "~/config/appConfig";

import {
  ActionCriteria,
  PopupType,
  TableInterface,
} from "~/modules/_core/components/interface";

import PopoverComponent from "~/core/components/Popover";
import TableFooterPagination from "~/core/components/TableFooterPagination";
import { labels } from "~/core/utils/labels";

export default function TableComponent({
  columnGrouping,
  columns,
  rows,
  rowCount,
  onDelete,
  onEdit,
  onCustomAction,
  loading,
  deleting,
  actions,
  showActionTitle,
  customActionTitle,
  showViewButton,
  showDeleteButton,
  showEditButton,
  showCustomActionButton,
  showFooterRow,
  onView,
  footerView,
  paginationMode,
  paginationModel,
  onPaginationModelChange,
  columnHeaderHeight,
  showHeaderView,
  headerName,
  defaultPageSize,
  actionCriteria,
}: TableInterface) {
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const [row, setRow] = useState<any | undefined>(undefined);
  const handleTogglePopOver = (
    anchorEL: any,
    id?: number,
    row?: PopupType | any
  ) => {
    setAnchorEl(anchorEL);
    setIsOpen(!isOpen);

    setId(id || null);
    setRow(row);
  };

  const footerRow = (props: any) => {
    return (
      <Stack direction="column">
        <Box>{footerView}</Box>
        <GridPagination ActionsComponent={TableFooterPagination} {...props} />
      </Stack>
    );
  };

  const getSlots = (showFooter: boolean) => {
    if (showFooter) {
      return {
        footer: footerRow,
      };
    } else {
      return {};
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      if (id) onDelete(id);
      if (!deleting) handleTogglePopOver(null);
    }
  };
  const handleEdit = async () => {
    if (onEdit) {
      onEdit(row);
      handleTogglePopOver(null);
    }
  };

  const handleView = async () => {
    if (onView) {
      onView(row);
      handleTogglePopOver(null);
    }
  };

  const handleCustomAction = async () => {
    if (onCustomAction) {
      onCustomAction(row);
      handleTogglePopOver(null);
    }
  };

  const checkActionCreteria = (creteria: ActionCriteria) => {
    if (row) {
      if (creteria.key in row) {
        if (row[creteria.key] === creteria.value) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  };

  const dataGridSx = {
    display: "grid",
    fontFamily: "SegoeUI",
    fontSize: "1rem",
    fontWeight: 400,
    border: 0,

    hideRightSeparator: {
      "& > .MuiDataGrid-columnSeparator": {
        visibility: "hidden",
      },
    },

    "& .MuiDataGrid-cell": {
      border: 0,
      color: "primary.blackishGray",
    },

    "& .MuiDataGrid-columnHeaders": {
      color: "secondary.white",
      textAlign: "center",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      whiteSpace: "break-spaces",
      lineHeight: 1.5,
    },
    "&.MuiDataGrid-root .MuiDataGrid-container--top [role=row] ": {
      backgroundColor: "primary.cyan",
    },
    "& .MuiDataGrid-root .MuiDataGrid-columnHeaderTitleContainer": {
      borderColor: "yellow",
      display: "flex",
      justifyContent: "right",
    },
    "&.MuiDataGrid-root .MuiDataGrid-columnHeader--alignRight .MuiDataGrid-columnHeaderTitleContainer":
      {
        paddingLeft: 1,
      },
    "& .MuiDataGrid-columnSeparator": {
      display: "none",
    },
    "& .MuiDataGrid-menuIconButton": {
      opacity: 0.4,
      color: "secondary.white",
    },
    "& .MuiDataGrid-sortIcon": {
      color: "secondary.white",
    },
    "& .MuiDataGrid-row:nth-child(even)": {
      backgroundColor: "primary.tableOddRowColor",
    },
    [`& .${gridClasses.columnHeaderTitleContainer}`]: {
      // justifyContent: "center",
      borderColor: "white",
    },
  };
  if (actions) {
    // eslint-disable-next-line no-param-reassign
    columns = [
      ...columns,
      {
        headerName: showActionTitle ? "Action" : "",
        field: "actions",
        flex: 0.5,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,

        renderCell: ({ row }) => {
          return (
            <Fragment key={row?.id}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <MoreHoriz
                  onClick={(event) =>
                    handleTogglePopOver(event.currentTarget, row?.id, row)
                  }
                  sx={{ cursor: "pointer", color: "black", marginLeft: 1 }}
                />
              </Box>
            </Fragment>
          );
        },
      },
    ];
  }
  return (
    <Fragment>
      {showHeaderView && (
        <Grid
          container
          xs={12}
          paddingX={1.2}
          height={45}
          alignItems="center"
          justifyContent="center"
          sx={{ backgroundColor: "#F3F3F3" }}
        >
          <Grid
            item
            xs={12}
            paddingLeft={1}
            display="flex"
            justifyContent="center"
          >
            <Typography variant="h1" display="inline" textAlign="center" noWrap>
              {headerName}
            </Typography>
          </Grid>
        </Grid>
      )}
      <DataGrid
        disableColumnSelector
        loading={loading || deleting}
        rows={rows || {}}
        columns={columns}
        sx={{
          ...dataGridSx,
          overflowX: "hidden",
        }}
        columnGroupingModel={columnGrouping}
        columnHeaderHeight={columnHeaderHeight}
        rowHeight={45}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: defaultPageSize ? defaultPageSize : 10,
            },
          },
        }}
        pageSizeOptions={pageSizeOptions}
        rowSelection={false}
        slots={getSlots(showFooterRow!)}
        // New Options
        rowCount={rowCount}
        paginationMode={paginationMode || "client"}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
      />
      <PopoverComponent
        open={isOpen}
        anchorEL={anchorEl}
        handleTogglePopOver={handleTogglePopOver}
        key={row?.id}
      >
        <List
          sx={{
            width: 160,
            bgcolor: "background.paper",
          }}
          disablePadding
        >
          {showViewButton && (
            <Fragment>
              <ListItemButton onClick={handleView}>
                <ListItemText
                  primary={
                    <Typography variant="h5" color="grey">
                      {labels.view}
                    </Typography>
                  }
                />
              </ListItemButton>
              <Divider />
            </Fragment>
          )}

          {showEditButton && (
            <Fragment>
              <ListItemButton onClick={handleEdit}>
                <ListItemText
                  primary={
                    <Typography variant="h5" color="grey">
                      {labels.edit}
                    </Typography>
                  }
                />
              </ListItemButton>
              <Divider />
            </Fragment>
          )}

          {showDeleteButton && (
            <Fragment>
              <ListItemButton onClick={handleDelete}>
                <ListItemText
                  primary={
                    <Typography variant="h5" color="grey">
                      {labels.delete}
                    </Typography>
                  }
                />
              </ListItemButton>
              <Divider />
            </Fragment>
          )}

          {showCustomActionButton && checkActionCreteria(actionCriteria!) && (
            <ListItemButton onClick={handleCustomAction}>
              <ListItemText
                primary={
                  <Typography variant="h5" color="grey">
                    {customActionTitle}
                  </Typography>
                }
              />
            </ListItemButton>
          )}
        </List>
      </PopoverComponent>
    </Fragment>
  );
}
