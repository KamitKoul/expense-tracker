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
      {/* Left Side: Branding/Visual (30%) */}
      <Grid 
        item xs={false} sm={3.5} md={3} 
        sx={{ 
          background: 'linear-gradient(rgba(37, 99, 235, 0.9), rgba(124, 58, 237, 0.9)), url("https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: { xs: 'none', sm: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          p: 4,
          borderRight: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <AutoGraph sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h3" fontWeight="800" gutterBottom sx={{ letterSpacing: -1 }}>
            WalletWise
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 200, mx: 'auto' }}>
            Smart insights for your financial freedom.
          </Typography>
        </Box>
      </Grid>

      {/* Right Side: Form (70%) */}
      <Grid item xs={12} sm={8.5} md={9} component={Paper} elevation={0} square sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f8fafc' }}>
        <Box sx={{ py: 8, px: { xs: 4, sm: 10, md: 15 }, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 800, mx: 'auto' }}>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h3" fontWeight="900" color="primary" gutterBottom sx={{ letterSpacing: -1.5 }}>
              Sign In
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 400 }}>
              Enter your details to access your personalized expense dashboard.
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
                label={<Typography variant="body1">Keep me signed in</Typography>}
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
                height: 64, 
                fontSize: '1.2rem',
                borderRadius: 3,
                boxShadow: '0 12px 24px rgba(37, 99, 235, 0.2)'
              }}
            >
              Access Dashboard
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                New to WalletWise?{' '}
                <Link to="/register" style={{ textDecoration: 'none', fontWeight: 800, color: '#2563eb' }}>
                  Create an account now
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
