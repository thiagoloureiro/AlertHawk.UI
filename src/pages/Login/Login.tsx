import { FC, useEffect } from "react";
import { useStoreActions } from "../../hooks";
import { resetStore } from "../../store";
import Layout from "../../components/Layout/Layout";
import { Box } from "@mui/material";
import { Helmet, HelmetProvider } from "react-helmet-async";
import LoginForm from "../../components/Forms/LoginForm";
import "./Login.css";

const Login: FC<{}> = () => {
  const { setResetUser } = useStoreActions((actions) => actions.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResetUser();
      resetStore();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <HelmetProvider>
        <Helmet>
          <title>AlertHawk | Login</title>
        </Helmet>
      </HelmetProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "calc(100vh - 170px)",
        }}
      >
        <LoginForm description="AlertHawk is a self-hosted monitoring tool that allows you keep track of service uptime" />
      </Box>
    </Layout>
  );
};

export default Login;
