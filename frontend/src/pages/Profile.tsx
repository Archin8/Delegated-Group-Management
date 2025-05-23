import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import { useAuthStore } from '../stores/authStore';
import { userService } from '../services/userService';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data);
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await userService.updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.newPassword !== password.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await userService.changePassword({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });
      setSuccess('Password changed successfully');
      setPassword({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError('Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteAccount();
      logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to delete account');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Box component="form" onSubmit={handleProfileUpdate}>
            <TextField
              fullWidth
              label="First Name"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              value={profile.email}
              disabled
              margin="normal"
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Update Profile
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <Box component="form" onSubmit={handlePasswordChange}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={password.currentPassword}
              onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={password.newPassword}
              onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={password.confirmPassword}
              onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
              margin="normal"
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Change Password
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="error">
            Danger Zone
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Once you delete your account, there is no going back. Please be certain.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Account
          </Button>
        </Paper>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete your account? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteAccount} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
} 