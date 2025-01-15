import { ChangeEvent, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { CircularProgress, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

import { SearchTextFieldProps } from "~/core/components/interface";

const SearchTextField = ({
  onSearch,
  isSearchLoading,
  searchPlaceHolder,
}: SearchTextFieldProps) => {
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!onSearch) return;
    const newQuery = event.target.value;
    setInputValue(newQuery);
  };

  const handleKeyPress = (event: any) => {
    if (!onSearch) return;
    if (event.key === "Enter") {
      event.preventDefault();
      onSearch(inputValue);
    }
  };

  const handleChange = () => {
    if (!onSearch) return;

    setInputValue("");
    onSearch("");
  };

  const handleSearch = () => {
    if (!onSearch) return;
    onSearch(inputValue);
  };

  return (
    <Tooltip title={searchPlaceHolder} placement="top-start">
      <TextField
        fullWidth
        size="small"
        id="search"
        placeholder={searchPlaceHolder}
        value={inputValue}
        sx={{
          backgroundColor: "white",
          boxSizing: "inherit",
          borderColor: "black",
          borderRadius: 1,
          "&:hover": {
            backgroundColor: "white",
          },
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
            "&:has(> input:-webkit-autofill)": {
              backgroundColor: "primary.autofillbackground",
            },
          },
        }}
        InputLabelProps={{
          style: { color: "green" },
        }}
        InputProps={{
          disableUnderline: true,
          sx: {
            backgroundColor: "white",
            maxHeight: 1,
            padding: 0,
            borderRadius: 1,
            color: "secondary.black",
            "& input::placeholder": {
              opacity: 0.3,
              fontSize: "0.97rem",
            },
            fontFamily: "SegoeUI",
            fontStyle: "normal",
            fontSize: 16,
            fontWeight: 400,
          },
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                sx={{ paddingRight: 0 }}
                disableFocusRipple
                disableRipple
              >
                <SearchIcon color="disabled" onClick={handleSearch} />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isSearchLoading ? (
                <CircularProgress
                  color="inherit"
                  size={20}
                  disableShrink
                  style={{ width: "1em", height: "1em", marginRight: "13px" }}
                />
              ) : (
                <IconButton disableRipple onClick={handleChange}>
                  <CloseIcon fontSize="small" color="disabled" />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        onChange={handleInputChange}
        onKeyUp={handleKeyPress}
      />
    </Tooltip>
  );
};

export default SearchTextField;
