import {
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import getTheme from "../../../../theme";
import { useStoreState } from "../../../../hooks";
import { IUpdatePassword } from "../../../../interfaces/requests/user/IUpdatePassword";
import { SubmitHandler, useForm } from "react-hook-form";
import UserService from "../../../../services/UserService";
import { showSnackbar } from "../../../../utils/snackbarHelper";
import { AxiosError } from "axios";

interface IUpdatePasswordForm {
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
}

const Account: FC<{}> = () => {
  const { t } = useTranslation("global");
  const { isDarkMode } = useStoreState((state) => state.app);
  const theme = getTheme(isDarkMode ? "dark" : "light");
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<IUpdatePasswordForm>();

  const onSubmit: SubmitHandler<IUpdatePassword> = async (formData) => {
    const { currentPassword, newPassword } = formData;
    const data: IUpdatePassword = {
      currentPassword,
      newPassword,
    };

    try {
      await UserService.updatePassword(data);
      showSnackbar(t("account.passwordHasBeenUpdatedSuccessfully"), "success");
    } catch (error) {
      const defaultErrorMessage = t(
        "snackbar.general.somethingWentWrongPleaseTryAgain"
      );

      if (error instanceof AxiosError && error.response?.status === 400) {
        let errorMessage;

        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data && error.response.data.content) {
          errorMessage = error.response.data.content;
        } else {
          errorMessage = defaultErrorMessage;
        }
        showSnackbar(errorMessage, "error");
      } else {
        console.error("Password update failed:", error);
        showSnackbar(defaultErrorMessage, "error");
      }
    }
  };

  const password = watch("newPassword");

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="start"
      spacing={1}
      width="100%"
    >
      <Typography variant="h6" sx={{ pb: 2 }}>
        {t("account.text")}
      </Typography>
      <Typography variant="body2" fontWeight={500} fontSize={16}>
        {t("account.changePassword")}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          spacing={0.5}
          direction="column"
          alignItems="start"
          style={!isMediumScreen ? { width: "75%" } : { width: "100%" }}
        >
          <Grid container item spacing={1}>
            <Grid item xs={12} md={6}>
              <TextField
                {...register("currentPassword", {
                  required: t("account.currentPasswordIsRequired"),
                })}
                fullWidth
                type="password"
                margin="normal"
                label={t("account.currentPassword")}
                variant="outlined"
                autoComplete="off"
                error={!!errors.currentPassword}
                helperText={
                  errors.currentPassword ? errors.currentPassword.message : null
                }
                size="small"
              />
            </Grid>
          </Grid>

          <Grid container item spacing={1}>
            <Grid item xs={12} md={6}>
              <TextField
                id="newPassword"
                {...register("newPassword", {
                  required: t("account.passwordIsRequired"),
                  minLength: {
                    value: 6,
                    message: t("account.passwordMustBeAtLeast6Characters"),
                  },
                })}
                fullWidth
                type="password"
                margin="normal"
                label={t("account.newPassword")}
                variant="outlined"
                autoComplete="off"
                error={!!errors.newPassword}
                helperText={
                  errors.newPassword ? errors.newPassword.message : null
                }
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="repeatPassword"
                {...register("repeatPassword", {
                  required: t("account.pleaseRepeatThePassword"),
                  validate: (value) =>
                    value === password || t("account.thePasswordsDoNotMatch"),
                })}
                fullWidth
                label={t("account.repeatPassword")}
                type="password"
                margin="normal"
                variant="outlined"
                autoComplete="off"
                error={!!errors.repeatPassword}
                helperText={
                  errors.repeatPassword ? errors.repeatPassword.message : null
                }
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  my: 2,
                  color: "white",
                  fontWeight: 700,
                  position: "relative",
                }}
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: "primary.dark",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
                {t("account.changePassword")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
};

export default Account;
