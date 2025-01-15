import { useState } from "react";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useRouter } from "next/router";

import { handleToastMessage } from "~/utils/helper";
import { labels } from "~/utils/labels";

import { useAppSelector } from "~/state/hooks";

import { useSubscribeCompanyService } from "~/rest/apiHooks/companies/useCompanies";

import ConfirmationDialog from "~/core/components/ConfirmationDialog";
import { paths } from "~/core/utils/helper";

const AugmentingLayout = ({ children }: { children: React.ReactNode }) => {
  const logo = localStorage.getItem("logo");
  const logoName = localStorage.getItem("logoName");
  const isSvg = logoName?.endsWith(".svg");

  const data = localStorage.getItem("swaggerPath")!;
  const isSubscribed = localStorage.getItem("isSubscribed") === "true";
  const serviceHeadId = localStorage.getItem("serviceHeadId");
  const { heading } = JSON.parse(data);

  const user = useAppSelector((state) => state.core.userInfo);

  const [shouldShowDialog, setShowDialog] = useState(false);
  const { mutateAsync: subscribeCompanyService } = useSubscribeCompanyService();
  const router = useRouter();

  const handleSubscription = async (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      try {
        await subscribeCompanyService({
          companyId: user?.company.id as number,
          serviceHeadId: serviceHeadId as unknown as number,
        });
        // setTriggerRefetch((prev) => !prev);
        localStorage.setItem("isSubscribed", JSON.stringify(true));
        handleToastMessage(labels.serviceSubscribedSuccessfully);
        router.push(paths.swaggerPage);
      } catch (error: any) {
        const status = error?.response?.status || 500;
        if (status === 401) {
          // handleErrorMessage(labels.serviceSubscribedFailed);
        }
      }
    }
    setShowDialog(false);
  };

  const showConfirmationDialog = () => {
    setShowDialog(true);
  };

  return (
    <Box
      sx={{ width: "100%" }}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {/* Header Section */}
      <Box
        sx={{
          width: "100%",
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          backgroundColor: "#f8f9fb",
          borderRadius: "8px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Logo and Header Content */}
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          marginTop="12px"
        >
          {/* Logo */}
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(248, 249, 252, 1)",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              border: "6px solid white",
              marginBottom: "-35px", // Adjusted to move the box up
              marginTop: "20px", // Adjusted to move the box up
              position: "relative", // Allows the box to be positioned relative to its normal flow
              zIndex: 10, // Ensure it's on top of the bottom div
            }}
          >
            <Image
              src={`data:image/${isSvg ? "svg+xml" : "*"};base64,${logo}`}
              alt="No Uploaded Logo"
              width={100}
              height={100}
            />
          </Box>

          {/* Service Name and Breadcrumbs */}
          <Box
            sx={{
              flex: 1,
              marginLeft: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {/* Breadcrumbs */}
            <Breadcrumbs
              separator="/"
              aria-label="breadcrumb"
              sx={{ marginBottom: "-4px" }}
            >
              <Link underline="hover" color="black" href="/home">
                Home
              </Link>
              <Link underline="hover" color="black" href="/services">
                Services
              </Link>
              <Typography color="rgba(0, 185, 190, 1)">Explore API</Typography>
            </Breadcrumbs>

            {/* Service Name */}
            <Typography
              fontSize="32px"
              fontWeight="900"
              fontFamily="SegoeUI"
              color="black"
              marginBottom="-50px"
            >
              {heading}
            </Typography>
          </Box>

          {/* Actions: Dropdowns and Button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Version Selector */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                border: "1px solid #D1D5DB", // Light gray border
                borderRadius: "8px",
                overflow: "hidden",
                height: "30px",
                minWidth: "150px",
                marginBottom: "-80px",
              }}
            >
              {/* Label */}
              <Box
                sx={{
                  backgroundColor: "#F8F9FB", // Light background for label
                  padding: "0 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#6B7280", // Gray text
                  borderRight: "1px solid #D1D5DB", // Divider
                }}
              >
                Version
              </Box>

              {/* Dropdown */}
              <Select
                defaultValue="V1.0-KSA"
                sx={{
                  flex: 1,
                  border: "none",
                  boxShadow: "none",
                  padding: "0 8px",
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  ".MuiOutlinedInput-notchedOutline": { border: "none" }, // Remove default border
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  ".MuiSelect-select": {
                    padding: "8px 12px",
                    fontSize: "14px",
                    fontWeight: "400",
                    color: "#111827", // Darker text color
                  },
                }}
              >
                <MenuItem value="V1.0-KSA">V1.0-KSA</MenuItem>
              </Select>
            </Box>

            {/* Subscribe Button */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: isSubscribed ? "#e0e0e0" : "#00bcd4", // Change color when disabled
                color: "white",
                textTransform: "capitalize",
                padding: "8px 16px",
                fontSize: "14px",
                height: "30px",
                "&:hover": {
                  backgroundColor: isSubscribed ? "#e0e0e0" : "#00acc1", // Adjust hover color
                },
                marginBottom: "-80px",
              }}
              onClick={showConfirmationDialog}
              disabled={isSubscribed} // Disable the button when isSubscribed is true
            >
              Subscribe
            </Button>

            <ConfirmationDialog
              isOpen={shouldShowDialog}
              label={labels.subscribeService}
              handleAction={handleSubscription}
            />
          </Box>
        </Box>
      </Box>

      {/* Children Content */}
      {children}
    </Box>
  );
};

export default AugmentingLayout;
