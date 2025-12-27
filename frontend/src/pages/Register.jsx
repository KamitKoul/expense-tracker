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
      {/* Left Side: Branding/Visual (30%) */}
      <Grid 
        item xs={false} sm={3.5} md={3} 
        sx={{ 
          background: 'linear-gradient(rgba(124, 58, 237, 0.9), rgba(37, 99, 235, 0.9)), url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
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
            The smarter way to manage your wealth.
          </Typography>
        </Box>
      </Grid>

      {/* Right Side: Form (70%) */}
      <Grid item xs={12} sm={8.5} md={9} component={Paper} elevation={0} square sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f8fafc' }}>
        <Box sx={{ py: 8, px: { xs: 4, sm: 10, md: 15 }, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 800, mx: 'auto' }}>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h3" fontWeight="900" color="secondary" gutterBottom sx={{ letterSpacing: -1.5 }}>
              Join WalletWise
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 400 }}>
              Start your journey towards better financial habits today.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        size="large"
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
                </Grid>
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
            
            <Button 
              fullWidth 
              variant="contained" 
              color="secondary"
              type="submit" 
              size="large"
              sx={{ 
                mt: 5, 
                mb: 3, 
                height: 64, 
                fontSize: '1.2rem',
                borderRadius: 3,
                boxShadow: '0 12px 24px rgba(124, 58, 237, 0.2)'
              }}
            >
              Create My Account
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none', fontWeight: 800, color: '#7c3aed' }}>
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
