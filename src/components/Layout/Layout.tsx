import { FC, ReactNode } from "react";
import { Box } from "@mui/material";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";
import { useStoreActions, useStoreState } from "../../hooks";
import { Helmet, HelmetProvider } from "react-helmet-async";
import useCustomIsAuthenticated from "../../hooks/useCustomIsAuthenticated";
interface ILayoutProps {
  children: ReactNode;
}

const Layout: FC<ILayoutProps> = ({ children }) => {
  const { isSidebarOpen, isSmallScreen } = useStoreState((state) => state.app);
  const { setIsSidebarOpen } = useStoreActions((action) => action.app);

  const isAuthenticated: boolean | undefined = useCustomIsAuthenticated();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
      </HelmetProvider>
      <Box
        minHeight={"100vh"}
        display="flex"
        flexDirection="column"
        alignItems="center"
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
                  py: "20px",
                  paddingRight: isSmallScreen ? "5px" : "20px",
                  minHeight: "calc(100vh - 130px)",
                  paddingLeft: isSidebarOpen
                    ? "360px"
                    : isSmallScreen
                    ? "70px"
                    : "110px",
                }
              : { width: "100%", height: "100%", py: "10px" }
          }
        >
          {children}
        </Box>
        <Footer title={"AlertHawk"} />
      </Box>
    </>
  );
};

export default Layout;
