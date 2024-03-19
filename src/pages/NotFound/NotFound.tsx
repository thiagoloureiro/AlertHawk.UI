import { FC } from "react";
import Layout from "../../components/Layout/Layout";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import NotFoundContent from "../../components/NotFoundContent/NotFoundContent";

const NotFound: FC<{}> = () => {
  const { t } = useTranslation("global");

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>AlertHawk | {t("pageNotFound")}</title>
        </Helmet>
      </HelmetProvider>
      <Layout>
        <NotFoundContent />
      </Layout>
    </>
  );
};

export default NotFound;
