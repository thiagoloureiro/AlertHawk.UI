import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IResetPassword } from "../../interfaces/requests/user/IResetPassword";
import UserService from "../../services/UserService";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { showSnackbar } from "../../utils/snackbarHelper";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";

const ResetPasswordForm: FC<{}> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IResetPassword>();
  const navigate = useNavigate();
  const { t } = useTranslation("global");

  const onSubmit: SubmitHandler<IResetPassword> = async (data) => {
    try {
      await UserService.resetPassword(data.email);
      navigate("/", { replace: true });
      showSnackbar(
        "Please check your inbox for an email we just sent you",
        "success"
      );
    } catch (error) {
      const defaultErrorMessage = t(
        "snackbar.general.somethingWentWrongPleaseTryAgain"
      );

      if (error instanceof AxiosError && error.response?.status === 400) {
        const errorMessage = error.response.data.content || defaultErrorMessage;
        showSnackbar(errorMessage, "error");
      } else {
        console.error("Password reset failed:", error);
        showSnackbar(defaultErrorMessage, "error");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" gutterBottom>
          <span style={{ fontWeight: 500 }}>Alert</span>Hawk
        </Typography>
        <Typography fontWeight="bold" variant="h5" gutterBottom>
          Reset password
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email",
              },
            })}
            fullWidth
            label="E-mail address"
            margin="normal"
            variant="outlined"
            autoComplete="off"
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : null}
            sx={{ mb: 0 }}
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ my: 2, color: "white", fontWeight: 700, position: "relative" }}
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
          Reset Password
        </Button>
      </form>
    </Container>
  );
};

export default ResetPasswordForm;
