import { FC } from "react";
import Layout from "../../components/Layout/Layout";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Box } from "@mui/material";
import RegisterForm from "../../components/Forms/RegisterForm";

const Register: FC<{}> = () => {
  return (
    <Layout>
      <HelmetProvider>
        <Helmet>
          <title>AlertHawk | Register</title>
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
        <RegisterForm />
      </Box>
    </Layout>
  );
};

export default Register;
