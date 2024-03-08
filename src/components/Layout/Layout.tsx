import { FC, ReactNode } from "react";
import { Box } from "@mui/material";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";
import { useIsAuthenticated } from "@azure/msal-react";
import { useStoreActions, useStoreState } from "../../hooks";

interface ILayoutProps {
  children: ReactNode;
}

const Layout: FC<ILayoutProps> = ({ children }) => {
  const { isSidebarOpen } = useStoreState((state) => state.app);
  const { setIsSidebarOpen } = useStoreActions((action) => action.app);

  const isAuthenticated: boolean = useIsAuthenticated();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box
      height={"100vh"}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <Header title={"AlertHawk"} isOpen={isSidebarOpen} />
      {isAuthenticated && (
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      )}
      <Box
        component="section"
        sx={
          isAuthenticated
            ? {
                width: "100%",
                height: "100%",
                py: "20px",
                paddingRight: "20px",
                paddingLeft: isSidebarOpen ? "330px" : "80px",
              }
            : { width: "100%", height: "100%", py: "10px" }
        }
      >
        {children}
      </Box>
      <Footer title={"AlertHawk"} />
    </Box>
  );
};

export default Layout;
