import { FC } from "react";
import Layout from "../../components/Layout/Layout";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Box } from "@mui/material";
import ResetPasswordForm from "../../components/Forms/ResetPasswordForm";

const ResetPassword: FC = () => {
  return (
    <Layout>
      <HelmetProvider>
        <Helmet>
          <title>AlertHawk | Reset Password</title>
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
        <ResetPasswordForm />
      </Box>
    </Layout>
  );
};

export default ResetPassword;
