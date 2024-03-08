import { FC, useState, FormEvent, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MicrosoftLogoPath from "./microsoft-windows-logo.svg";
import getTheme from "../../theme";
import { loginRequest } from "../../config/authConfig";
import logging from "../../utils/logging";
import { useMsal } from "@azure/msal-react";

interface IFormProps {
  description?: string;
}

const Form: FC<IFormProps> = ({ description }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const navigate = useNavigate();
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

  const simulateLogin = () => {
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
      navigate("/dashboard");
    }, 3000);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(/\s/g, "");
    setUsername(newValue);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(/\s/g, "");
    setPassword(newValue);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (step === 1 && username) {
      setStep(2);
    } else if (step === 2 && password) {
      simulateLogin();
    }
  };

  const handleAzureADLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      logging.error(e);
    });
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
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
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            variant="outlined"
            value={username}
            onChange={handleUsernameChange}
            autoFocus
            autoComplete="off"
          />
        )}

        {step === 2 && (
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            autoFocus
            autoComplete="off"
          />
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mb: 2, color: "white", fontWeight: 700, position: "relative" }}
          disabled={step === 1 ? !username : !password || isButtonDisabled}
        >
          {isButtonDisabled && (
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
          Not have an account?{" "}
          <Link
            to="/#"
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
        Log in with Azure AD
      </Button>
    </Container>
  );
};

export default Form;
