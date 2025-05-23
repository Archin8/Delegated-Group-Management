import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Grid,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Group } from '../types';
import { groupService } from '../services/groupService';

interface GeneralSettingsProps {
  groupId: string;
}

export default function GeneralSettings({ groupId }: GeneralSettingsProps) {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
  });

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  const loadGroup = async () => {
    try {
      setLoading(true);
      const groupData = await groupService.getGroup(groupId);
      setGroup(groupData);
      setFormData({
        name: groupData.name,
        description: groupData.description || '',
        isPrivate: groupData.isPrivate,
      });
      setError('');
    } catch (err) {
      setError('Failed to load group data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await groupService.updateGroup(groupId, formData);
      setSuccess('Group settings updated successfully');
      loadGroup();
    } catch (err) {
      setError('Failed to update group settings');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!group) {
    return <Typography color="error">Group not found</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        General Settings
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

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Group Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPrivate}
                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                  />
                }
                label="Private Group"
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
} 