import { FC, useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
} from "@mui/material";
import MicrosoftLogoPath from "./microsoft-windows-logo.svg";
import { loginRequest } from "../../config/authConfig";
import logging from "../../utils/logging";
import { useMsal } from "@azure/msal-react";

interface IFormProps {
  description?: string;
}

const Form: FC<IFormProps> = ({ description }) => {
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

  const handleAzureADLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      logging.error(e);
    });
  };

  return (
    <Container maxWidth="sm">
      <form>
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
