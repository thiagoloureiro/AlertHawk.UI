import { Button, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useStoreState } from "../../hooks";

const NotFoundContent: FC<{}> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("global");
  const { isSmallScreen } = useStoreState((state) => state.app);

  const handleRedirect = () => {
    navigate("/", { replace: true });
  };

  return (
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
        {t("general.goBack")}
      </Button>
    </Stack>
  );
};

export default NotFoundContent;
