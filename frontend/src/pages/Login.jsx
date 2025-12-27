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
      {/* Left Side: Form (50%) - Aligned Extreme Left */}
      <Grid item xs={12} md={6} component={Paper} elevation={0} square sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white' }}>
        <Box sx={{ py: 8, px: { xs: 4, sm: 8, md: 12 }, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 650 }}>
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                <Box sx={{ p: 0.5, bgcolor: '#2563eb', borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1 }}>₹</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                    WalletWise
                </Typography>
            </Box>
            <Typography variant="h3" fontWeight="900" color="primary" gutterBottom sx={{ letterSpacing: -1.5 }}>
              Sign In
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 400 }}>
              Welcome back! Please enter your details.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        size="large"
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
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        size="large"
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
                </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label={<Typography variant="body1">Remember for 30 days</Typography>}
              />
              <Link to="#" style={{ textDecoration: 'none', fontWeight: 600, color: '#2563eb' }}>
                Forgot password?
              </Link>
            </Box>

            <Button 
              fullWidth 
              variant="contained" 
              type="submit" 
              size="large"
              sx={{ 
                mt: 5, 
                mb: 3, 
                height: 60, 
                fontSize: '1.1rem',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
              }}
            >
              Sign In
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body1" color="textSecondary">
                Don't have an account?{' '}
                <Link to="/register" style={{ textDecoration: 'none', fontWeight: 800, color: '#2563eb' }}>
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Right Side: Branding/Visual (50%) */}
      <Grid 
        item xs={false} md={6} 
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
            Control your wealth
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            Join thousands of users managing their finances with WalletWise.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}