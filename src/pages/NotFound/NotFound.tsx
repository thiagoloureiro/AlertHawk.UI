import { FC } from "react";
import Layout from "../../components/Layout/Layout";
import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound: FC<{}> = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/", { replace: true });
  };

  return (
    <Layout>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        height={"100%"}
      >
        <Typography variant="h5" gutterBottom mb={2}>
          404 | Page Not Found
        </Typography>
        <Button variant="text" size="large" onClick={handleRedirect}>
          Go Back to Dashboard
        </Button>
      </Stack>
    </Layout>
  );
};

export default NotFound;
