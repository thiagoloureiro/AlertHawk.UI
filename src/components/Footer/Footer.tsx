import { Box } from "@mui/material";
import { FC } from "react";

interface IFooterProps {
  title: string;
  isYearVisible?: boolean;
}
const Footer: FC<IFooterProps> = ({ title, isYearVisible = true }) => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "50px",
        py: 2,
      }}
    >
      <small>
        {title} &copy; {isYearVisible && new Date().getFullYear()}
      </small>
    </Box>
  );
};

export default Footer;
