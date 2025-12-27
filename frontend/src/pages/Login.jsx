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
    <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* Left Side: Form (Approx 33%) - Aligned Extreme Left */}
      <Grid item xs={12} md={4} component={Paper} elevation={0} square sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', zIndex: 1 }}>
        <Box sx={{ py: 8, px: { xs: 4, sm: 6, md: 8 }, display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                <Box sx={{ p: 0.5, bgcolor: '#2563eb', borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1 }}>₹</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                    WalletWise
                </Typography>
            </Box>
            <Typography variant="h4" fontWeight="900" color="primary" gutterBottom sx={{ letterSpacing: -1 }}>
              Sign In
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Welcome back! Please enter your details.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

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
                fontSize: '1rem',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
              }}
            >
              Sign In
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Link to="/register" style={{ textDecoration: 'none', fontWeight: 800, color: '#2563eb' }}>
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Right Side: Branding/Visual (Approx 66%) - Text pushed to ABSOLUTE right */}
      <Grid 
        item xs={false} md={8} 
        sx={{ 
          background: 'linear-gradient(rgba(37, 99, 235, 0.7), rgba(124, 58, 237, 0.7)), url("https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-end', 
          color: 'white',
          p: 4, // Reduced overall padding
          pr: 6  // Reduced right padding significantly to touch extreme right
        }}
      >
        <Box sx={{ maxWidth: '90%', textAlign: 'right' }}> {/* Uses 90% of available width, aligned right */}
          <AutoGraph sx={{ fontSize: 120, mb: 3 }} />
          <Typography variant="h2" fontWeight="900" gutterBottom sx={{ letterSpacing: -2 }}>
            Master your finances
          </Typography>
          <Typography variant="h4" sx={{ opacity: 0.9, fontWeight: 400, lineHeight: 1.4 }}>
            Predict your spending and optimize your wealth with our powerful financial engine.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
