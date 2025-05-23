import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import CreateGroupDialog from '../components/CreateGroupDialog';

interface Group {
  id: string;
  name: string;
  description: string;
}

export default function GroupList() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const authStorage = localStorage.getItem('auth-storage');
      const authState = authStorage ? JSON.parse(authStorage) : null;
      const token = authState?.state?.token;
      const response = await axios.get('/api/groups/user/groups', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGroups(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateSuccess = () => {
    fetchGroups();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Groups</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Group
        </Button>
      </Box>

      <CreateGroupDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <Paper>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <List>
            {groups.length === 0 ? (
              <ListItem>
                <ListItemText primary="No groups found" />
              </ListItem>
            ) : (
              groups.map((group) => (
                <ListItem
                  key={group.id}
                  button
                  onClick={() => navigate(`/groups/${group.id}`)}
                >
                  <ListItemText
                    primary={group.name}
                    secondary={group.description}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Will handle edit
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            )}
          </List>
        )}
      </Paper>
    </Box>
  );
}