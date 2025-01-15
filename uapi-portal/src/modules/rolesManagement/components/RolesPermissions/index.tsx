import { Fragment } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TreeItem, TreeView } from "@mui/lab";
import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";

import { RolesPermissionsProps } from "~/modules/rolesManagement/interfaces/rolepermission.interface";

const RolesPermissions = ({
  permissions,
  groupChecked,
  setChecked,
  checked,
  setGroupChecked,
  formMode,
  hasAllChecked,
  setAllChecked,
}: RolesPermissionsProps) => {
  const handleCheck = (event: any, permissionId: any) => {
    const isChecked = event.target.checked;
    setChecked((prevState: any) => {
      const newChecked = { ...prevState, [permissionId]: isChecked };

      updateGroupCheckedStates(newChecked);

      return newChecked;
    });
  };

  const handleGroupCheck = (event: any, groupName: any) => {
    const isChecked = event.target.checked;
    setGroupChecked((prevState: any) => ({
      ...prevState,
      [groupName]: { checked: isChecked, indeterminate: false },
    }));

    setChecked((prevState: any) => {
      const newChecked: any = { ...prevState };
      permissions.forEach((perm: any) => {
        if (perm.permissionGroup?.name === groupName) {
          newChecked[perm.id] = isChecked;
        }
      });

      updateAllCheckedState(newChecked);
      return newChecked;
    });
  };

  const handleAllCheck = (event: any) => {
    const isChecked = event.target.checked;
    setAllChecked(isChecked);

    setGroupChecked((prevState: any) => {
      const newGroupChecked: any = {};
      for (const group in prevState) {
        newGroupChecked[group] = { checked: isChecked, indeterminate: false };
      }
      return newGroupChecked;
    });

    setChecked((prevState: any) => {
      const newChecked: any = {};
      for (const permId in prevState) {
        newChecked[permId] = isChecked;
      }
      return newChecked;
    });
  };

  // Update group checked states based on the permissions
  const updateGroupCheckedStates = (newChecked: any) => {
    const updatedGroupChecked: any = {};

    const groupPermissions = permissions.reduce((acc: any, perm: any) => {
      const groupName = perm.permissionGroup?.name;
      if (!acc[groupName]) {
        // eslint-disable-next-line no-param-reassign
        acc[groupName] = [];
      }
      acc[groupName].push(perm);
      return acc;
    }, {});

    Object.keys(groupPermissions).forEach((groupName) => {
      const perms = groupPermissions[groupName];
      const hasAllChecked = perms.every((perm: any) => newChecked[perm.id]);
      const someChecked = perms.some((perm: any) => newChecked[perm.id]);

      updatedGroupChecked[groupName] = {
        checked: hasAllChecked,
        indeterminate: !hasAllChecked && someChecked,
      };
    });

    setGroupChecked(updatedGroupChecked);

    // Update the "Enable All" checkbox state
    updateAllCheckedState(newChecked);
  };

  const updateAllCheckedState = (newChecked: any) => {
    const allPermissionsChecked: any = permissions.every(
      (perm: any) => newChecked[perm.id]
    );
    setAllChecked(allPermissionsChecked);
  };

  const renderTreeItems = () => {
    const groupedPermissions = permissions.reduce(
      (acc: any, permission: any) => {
        const groupName = permission.permissionGroup?.name;
        if (!acc[groupName]) {
          // eslint-disable-next-line no-param-reassign
          acc[groupName] = [];
        }
        acc[groupName].push(permission);
        return acc;
      },
      {}
    );

    return Object.entries(groupedPermissions).map(([groupName, perms]: any) => (
      <TreeItem
        nodeId={groupName}
        key={groupName}
        label={
          <FormControlLabel
            control={
              <Checkbox
                checked={groupChecked[groupName]?.checked || false}
                indeterminate={groupChecked[groupName]?.indeterminate || false}
                onChange={(event) => handleGroupCheck(event, groupName)}
                disabled={formMode === "view"}
              />
            }
            label={groupName}
            style={{ marginLeft: "5px" }}
          />
        }
      >
        {perms.map((perm: any) => (
          <TreeItem
            nodeId={perm.id.toString()}
            label={
              <div>
                <Checkbox
                  checked={!!checked[perm.id]}
                  onChange={(event) => handleCheck(event, perm.id)}
                  disabled={formMode === "view"}
                />
                {perm.name}
              </div>
            }
            key={perm.id}
          />
        ))}
      </TreeItem>
    ));
  };

  return (
    <Fragment>
      <Typography color="black" variant="h2" marginBottom={1}>
        Roles and Permissions
      </Typography>
      <Card>
        <CardContent style={{ maxHeight: "350px", overflowY: "auto" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={hasAllChecked}
                onChange={handleAllCheck}
                disabled={formMode === "view"}
              />
            }
            label="Enable All"
          />
          <TreeView
            aria-label="permissions"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            {renderTreeItems()}
          </TreeView>
        </CardContent>
      </Card>
    </Fragment>
  );
};

export default RolesPermissions;
