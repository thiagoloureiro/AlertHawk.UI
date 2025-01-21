import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeleteAccount: React.FC = () => {
  const { t } = useTranslation('global');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (!jwtToken) {
      navigate('/'); // Redirect to login if not authenticated
    }
  }, [navigate]);

  const handleDeleteAccount = async () => {
    const apiUrl = `${import.meta.env.VITE_APP_AUTH_API_URL}/user/delete`;
    const jwtToken = localStorage.getItem('jwtToken');

    try {
      await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });
      setMessage(t('deleteAccount.successMessage'));
      // Log out the user
      localStorage.removeItem('jwtToken');
      navigate('/'); // Redirect to login or home page
    } catch (error) {
      setMessage(t('deleteAccount.errorMessage'));
      console.error('Error deleting account:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5">{t('deleteAccount.title')}</Typography>
      <Typography variant="body1">
        {t('deleteAccount.info')}
      </Typography>
      <Button
        variant="contained"
        color="error"
        onClick={handleDeleteAccount}
        fullWidth
        sx={{ mt: 2 }}
      >
        {t('deleteAccount.deleteButton')}
      </Button>
      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default DeleteAccount; 