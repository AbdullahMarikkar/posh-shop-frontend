import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  StorefrontRounded,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../api/auth.service";
import { useAuthStore } from "../store/useAuthStore";
import { UserService } from "../api/user.service";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email && !formData.username) {
      setError("Please enter your email or username.");
      return;
    }
    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const tokens = await AuthService.login({
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });

      // Fetch user profile and store in auth state
      const user = await UserService.getUserByEmail(formData.email);
      login(user, tokens.access_token, tokens.refresh_token);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        px: 2,
      }}
    >
      {/* Decorative left panel */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: 400,
          minHeight: 560,
          background: "linear-gradient(160deg, #81A6C6 0%, #AACDDC 100%)",
          borderRadius: "14px 0 0 14px",
          color: "#fff",
          p: 5,
          gap: 2,
        }}
      >
        <StorefrontRounded sx={{ fontSize: 64, opacity: 0.9 }} />
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Welcome Back
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          sx={{ opacity: 0.85, lineHeight: 1.7 }}
        >
          Sign in to explore our curated collection of premium products.
        </Typography>
      </Box>

      {/* Form panel */}
      <Paper
        elevation={0}
        sx={{
          width: { xs: "100%", md: 420 },
          minHeight: { md: 560 },
          p: { xs: 4, md: 5 },
          borderRadius: { xs: "14px", md: "0 14px 14px 0" },
          border: "1px solid #D2C4B4",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 0.5,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
        >
          Sign In
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Don't have an account?{" "}
          <MuiLink
            component={Link}
            to="/signup"
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            Create one
          </MuiLink>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          <TextField
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            autoComplete="email"
            autoFocus
          />
          <TextField
            name="username"
            label="Username (optional)"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            autoComplete="username"
          />
          <TextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((p) => !p)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={isLoading}
            sx={{ py: 1.5, mt: 1, fontSize: "1rem" }}
          >
            {isLoading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
