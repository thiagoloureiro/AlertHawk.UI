import { FC, useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import MicrosoftLogoPath from "./microsoft-windows-logo.svg";
import { loginRequest } from "../../config/authConfig";
import logging from "../../utils/logging";
import { useMsal } from "@azure/msal-react";
import { Link } from "react-router-dom";
import getTheme from "../../theme";
import { Controller, useForm } from "react-hook-form";
import { showSnackbar } from "../../utils/snackbarHelper";
import { IUserLogin } from "../../interfaces/requests/user/IUserLogin";
import UserService from "../../services/UserService";

interface IFormProps {
  description?: string;
}

const Form: FC<IFormProps> = ({ description }) => {
  const {
    control,
    handleSubmit: onSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<IUserLogin>();
  const [step, setStep] = useState<number>(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  // const navigate = useNavigate();
  const { instance } = useMsal();

  useEffect(() => {
    let timer: number | undefined;
    if (isButtonDisabled) {
      timer = setTimeout(() => {
        setIsButtonDisabled(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isButtonDisabled]);

  const handleFormSubmit = (data: IUserLogin) => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      handleNonADUserLogin(data);
    }
  };

  const handleNonADUserLogin = async (data: IUserLogin) => {
    setIsButtonDisabled(true);
    try {
      const result = await UserService.login(data);
      localStorage.removeItem("jwtToken");
      localStorage.setItem("accessToken", result.token);
      localStorage.setItem("username", data.username);
      showSnackbar("Account created successfully", "success");
      reset();
    } catch (error) {
      showSnackbar("Something went wrong. Please try again.", "error");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const handleAzureADLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      logging.error(e);
    });
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={onSubmit(handleFormSubmit)}>
        <Typography variant="h4" gutterBottom>
          <span style={{ fontWeight: 500 }}>Alert</span>Hawk
        </Typography>
        <Typography fontWeight="bold" variant="h5" gutterBottom>
          Keep an eye on your infrastructure
        </Typography>
        {description && (
          <Typography fontWeight={500} variant="body2" sx={{ mb: 4 }}>
            <b>{description}</b>
          </Typography>
        )}
        {step === 1 && (
          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{
              required: "Username is required",
              minLength: {
                value: 6,
                message: "Username must be at least 6 characters",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                autoFocus
                autoComplete="off"
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
        )}

        {step === 2 && (
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                autoFocus
                autoComplete="off"
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mb: 2, color: "white", fontWeight: 700, position: "relative" }}
          disabled={isSubmitting || isButtonDisabled}
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
          {step === 1 ? "Next Step" : "Sign In"}
        </Button>

        <Typography variant="body2" sx={{ textAlign: "center", mb: 2 }}>
          Not have an account yet?{" "}
          <Link
            to="/register"
            style={{
              color: getTheme("light").palette.primary.light,
              fontWeight: 700,
            }}
          >
            Register
          </Link>
        </Typography>
      </form>
      <div
        style={{
          width: "100%",
          backgroundColor: "gray",
          height: "1px",
          margin: "32px 0",
        }}
      />
      <Button
        fullWidth
        variant="contained"
        size="large"
        sx={{ mb: 2, color: "white", fontWeight: 700, position: "relative" }}
        color="info"
        onClick={handleAzureADLogin}
      >
        <img
          src={MicrosoftLogoPath}
          width="20px"
          style={{ marginRight: "12px" }}
        />
        Log in with Microsoft Account
      </Button>
    </Container>
  );
};

export default Form;
