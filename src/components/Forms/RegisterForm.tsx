import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import getTheme from "../../theme";
import { IUserRegister } from "../../interfaces/requests/user/IUserRegister";
import UserService from "../../services/UserService";
import { showSnackbar } from "../../utils/snackbarHelper";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

const RegisterForm: FC<{}> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<IUserRegister>();
  const navigate = useNavigate();
  const { t } = useTranslation("global");

  const onSubmit: SubmitHandler<IUserRegister> = async (userData) => {
    try {
      await UserService.register(userData);
      navigate("/", { replace: true });
      showSnackbar(
        "Your account has been created successfully. Please sign in.",
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
        console.error("Registration failed:", error);
        showSnackbar(defaultErrorMessage, "error");
      }
    }
  };
  const password = watch("password");

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" gutterBottom>
          <span style={{ fontWeight: 500 }}>Alert</span>Hawk
        </Typography>
        <Typography fontWeight="bold" variant="h5" gutterBottom>
          Create an account
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            })}
            fullWidth
            label="Username"
            margin="normal"
            variant="outlined"
            autoFocus
            autoComplete="off"
            error={!!errors.username}
            helperText={errors.username ? errors.username.message : null}
            sx={{ mb: 0 }}
          />

          <TextField
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            variant="outlined"
            autoComplete="off"
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : null}
            sx={{ mb: 0 }}
          />

          <TextField
            {...register("repeatPassword", {
              required: "Please repeat the password",
              validate: (value) =>
                value === password || "The passwords do not match",
            })}
            fullWidth
            label="Repeat Password"
            type="password"
            margin="normal"
            variant="outlined"
            autoComplete="off"
            error={!!errors.repeatPassword}
            helperText={
              errors.repeatPassword ? errors.repeatPassword.message : null
            }
            sx={{ mb: 0 }}
          />

          <TextField
            {...register("userEmail", {
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
            error={!!errors.userEmail}
            helperText={errors.userEmail ? errors.userEmail.message : null}
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
          Register
        </Button>

        <Typography variant="body2" sx={{ textAlign: "center", mb: 2 }}>
          Already have an account?{" "}
          <Link
            to="/"
            style={{
              color: getTheme("light").palette.primary.light,
              fontWeight: 700,
            }}
          >
            Sign in
          </Link>
        </Typography>
      </form>
    </Container>
  );
};

export default RegisterForm;
