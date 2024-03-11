import { FC } from "react";
import VerticalTabs from "../../components/Tabs/VerticalTabs";
import { Box } from "@mui/material";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface ISettingsProps {}

const Settings: FC<ISettingsProps> = () => {
  const { t } = useTranslation("global");

  return (
    <Box>
      <HelmetProvider>
        <Helmet>
          <title>AlertHawk | {t("settings.text")}</title>
        </Helmet>
      </HelmetProvider>
      <VerticalTabs />
    </Box>
  );
};

export default Settings;
