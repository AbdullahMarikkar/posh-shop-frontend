import { useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper, Link as MuiLink,
  InputAdornment, IconButton, Alert, CircularProgress,
  Stepper, Step, StepLabel,
} from '@mui/material';
import { Visibility, VisibilityOff, StorefrontRounded } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../api/auth.service';

const steps = ['Account Details', 'Personal Info'];

export const Signup = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    mobile: '',
    country: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeStep === 0) {
      if (!formData.email || !formData.username || !formData.password) {
        setError('Please fill in all required account fields.');
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
      setError('');
      setActiveStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.country || !formData.address) {
      setError('Please fill in all personal info fields.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await AuthService.signup(formData);
      navigate('/login', { state: { signupSuccess: true } });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        px: 2,
        py: 4,
      }}
    >
      {/* Decorative panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: 380,
          minHeight: 600,
          background: 'linear-gradient(160deg, #81A6C6 0%, #AACDDC 100%)',
          borderRadius: '14px 0 0 14px',
          color: '#fff',
          p: 5,
          gap: 2,
        }}
      >
        <StorefrontRounded sx={{ fontSize: 64, opacity: 0.9 }} />
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Join Posh Shop
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ opacity: 0.85, lineHeight: 1.7 }}>
          Create your account and enjoy a premium shopping experience.
        </Typography>
      </Box>

      {/* Form panel */}
      <Paper
        elevation={0}
        sx={{
          width: { xs: '100%', md: 460 },
          minHeight: { md: 600 },
          p: { xs: 4, md: 5 },
          borderRadius: { xs: '14px', md: '0 14px 14px 0' },
          border: '1px solid #D2C4B4',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 0.5,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Already have an account?{' '}
          <MuiLink component={Link} to="/login" color="primary" sx={{ fontWeight: 600 }}>
            Sign in
          </MuiLink>
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': { fontWeight: 500 },
                  '& .MuiStepIcon-root.Mui-active': { color: 'primary.main' },
                  '& .MuiStepIcon-root.Mui-completed': { color: 'primary.main' },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Step 0: Account Details */}
        {activeStep === 0 && (
          <Box
            component="form"
            onSubmit={handleNext}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
            <TextField
              name="email"
              label="Email Address *"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              autoFocus
              autoComplete="email"
            />
            <TextField
              name="username"
              label="Username *"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              autoComplete="username"
            />
            <TextField
              name="password"
              label="Password *"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              fullWidth
              autoComplete="new-password"
              helperText="Minimum 8 characters"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((p) => !p)} edge="end" tabIndex={-1}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ py: 1.5, mt: 1 }}>
              Next
            </Button>
          </Box>
        )}

        {/* Step 1: Personal Info */}
        {activeStep === 1 && (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
            <TextField
              name="name"
              label="Full Name *"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              autoFocus
              autoComplete="name"
            />
            <TextField
              name="mobile"
              label="Mobile Number *"
              value={formData.mobile}
              onChange={handleChange}
              fullWidth
              autoComplete="tel"
            />
            <TextField
              name="country"
              label="Country *"
              value={formData.country}
              onChange={handleChange}
              fullWidth
              autoComplete="country-name"
            />
            <TextField
              name="address"
              label="Address *"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              autoComplete="street-address"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                fullWidth
                onClick={() => setActiveStep(0)}
                disabled={isLoading}
                sx={{ py: 1.5 }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={isLoading}
                sx={{ py: 1.5 }}
              >
                {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
