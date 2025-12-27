import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Box, 
  Alert,
  InputAdornment,
  IconButton,
  Grid,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, AutoGraph } from "@mui/icons-material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left Side: Branding/Visual */}
      <Grid 
        item xs={false} md={4} 
        sx={{ 
          background: 'linear-gradient(rgba(37, 99, 235, 0.8), rgba(124, 58, 237, 0.8)), url("https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          p: 6
        }}
      >
        <Box sx={{ maxWidth: 450, textAlign: 'center' }}>
          <AutoGraph sx={{ fontSize: 100, mb: 3 }} />
          <Typography variant="h2" fontWeight="800" gutterBottom sx={{ letterSpacing: -1 }}>
            Take Control of Your Wealth
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            Smart insights and predictions to help you save more and spend wiser.
          </Typography>
        </Box>
      </Grid>

      {/* Right Side: Form */}
      <Grid item xs={12} md={8} component={Paper} elevation={0} square sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f8fafc' }}>
        <Box sx={{ py: 8, px: { xs: 4, sm: 8, md: 10 }, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 550, mx: 'auto' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="800" color="primary" gutterBottom sx={{ letterSpacing: -0.5 }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Sign in to your dashboard to manage your expenses.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label={<Typography variant="body2">Remember me</Typography>}
              />
              <Link to="#" style={{ textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, color: '#2563eb' }}>
                Forgot password?
              </Link>
            </Box>

            <Button 
              fullWidth 
              variant="contained" 
              type="submit" 
              size="large"
              sx={{ 
                mt: 4, 
                mb: 3, 
                height: 56, 
                fontSize: '1.1rem',
                boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)'
              }}
            >
              Sign In
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Link to="/register" style={{ textDecoration: 'none', fontWeight: 700, color: '#2563eb' }}>
                  Create an account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}