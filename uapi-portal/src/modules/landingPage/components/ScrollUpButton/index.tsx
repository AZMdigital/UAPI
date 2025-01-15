import { useEffect, useState } from "react";
import ArrowUpwardSharpIcon from "@mui/icons-material/ArrowUpwardSharp";
import Fab from "@mui/material/Fab";
import { styled } from "@mui/material/styles";

const ScrollToTopFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(8),
  right: theme.spacing(6),
  backgroundColor: "#00BABE",
  color: "#ffffff",
  borderRadius: "8px",
  width: "50px",
  height: "50px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "display 0.3s ease-in-out, background-color 0.3s",
  zIndex: 1000,
  "&:hover": {
    backgroundColor: "#08aaae",
  },
}));

const ScrollUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsVisible(scrollTop > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <ScrollToTopFab
      color="primary"
      onClick={scrollToTop}
      style={{ display: isVisible ? "flex" : "none" }}
    >
      <ArrowUpwardSharpIcon />
    </ScrollToTopFab>
  );
};

export default ScrollUpButton;
