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
  Grid 
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Person, AutoGraph } from "@mui/icons-material";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left Side: Branding/Visual */}
      <Grid 
        item xs={false} md={6} 
        sx={{ 
          background: 'linear-gradient(rgba(124, 58, 237, 0.8), rgba(37, 99, 235, 0.8)), url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
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
            Start Your Journey
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            Join thousands of users who are making smarter financial decisions every day.
          </Typography>
        </Box>
      </Grid>

      {/* Right Side: Form */}
      <Grid item xs={12} md={6} component={Paper} elevation={0} square sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f8fafc' }}>
        <Box sx={{ py: 8, px: { xs: 4, sm: 8, md: 10 }, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 550, mx: 'auto' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="800" color="secondary" gutterBottom sx={{ letterSpacing: -0.5 }}>
              Create Account
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Sign up to start tracking and analyzing your expenses.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />
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
            
            <Button 
              fullWidth 
              variant="contained" 
              color="secondary"
              type="submit" 
              size="large"
              sx={{ 
                mt: 4, 
                mb: 3, 
                height: 56, 
                fontSize: '1.1rem',
                boxShadow: '0 8px 16px rgba(124, 58, 237, 0.2)'
              }}
            >
              Sign Up
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none', fontWeight: 700, color: '#7c3aed' }}>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}