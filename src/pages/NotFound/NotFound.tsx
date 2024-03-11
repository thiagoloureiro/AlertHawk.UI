import { FC } from "react";
import Layout from "../../components/Layout/Layout";
import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useStoreState } from "../../hooks";

const NotFound: FC<{}> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("global");
  const { isSmallScreen } = useStoreState((state) => state.app);

  const handleRedirect = () => {
    navigate("/", { replace: true });
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>AlertHawk | {t("pageNotFound")}</title>
        </Helmet>
      </HelmetProvider>
      <Layout>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={3}
          sx={{ minHeight: "calc(100vh - 170px)" }}
        >
          {isSmallScreen ? (
            <Typography
              variant="h6"
              gutterBottom
              mb={2}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 26, fontWeight: 500 }}>404</span>
              <span>{t("pageNotFound")}</span>
            </Typography>
          ) : (
            <Typography variant="h5" gutterBottom mb={2}>
              404 | {t("pageNotFound")}
            </Typography>
          )}
          <Button variant="text" size="large" onClick={handleRedirect}>
            Go Back to Dashboard
          </Button>
        </Stack>
      </Layout>
    </>
  );
};

export default NotFound;
