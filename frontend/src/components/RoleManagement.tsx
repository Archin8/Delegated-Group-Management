import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Role, Permission, SystemRole } from '../types';
import { groupService } from '../services/groupService';

interface RoleManagementProps {
  groupId: string;
  canManageRoles: boolean;
}

export default function RoleManagement({ groupId, canManageRoles }: RoleManagementProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    permissions: [] as Permission[],
    priority: 0,
    parentRoleId: '',
  });

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await groupService.getRoles(groupId);
      setRoles(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [groupId]);

  const handleOpenDialog = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        permissions: role.permissions,
        priority: role.priority,
        parentRoleId: role.parentRoleId || '',
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: '',
        permissions: [],
        priority: 0,
        parentRoleId: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRole(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await groupService.updateRole(groupId, editingRole.id, formData);
      } else {
        await groupService.createRole(groupId, formData);
      }
      fetchRoles();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save role');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await groupService.deleteRole(groupId, roleId);
        fetchRoles();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete role');
      }
    }
  };

  if (!canManageRoles) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Roles
        </Typography>
        <Typography color="error">
          You don't have permission to manage roles
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Roles</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Role
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingRole ? 'Edit Role' : 'Create Role'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Role Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Parent Role</InputLabel>
              <Select
                value={formData.parentRoleId}
                onChange={(e) => setFormData({ ...formData, parentRoleId: e.target.value })}
                label="Parent Role"
              >
                <MenuItem value="">None</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Priority"
              type="number"
              fullWidth
              required
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
            />
            <FormControl component="fieldset" margin="dense">
              <Typography variant="subtitle1" gutterBottom>
                Permissions
              </Typography>
              <FormGroup>
                {Object.values(Permission).map((permission) => (
                  <FormControlLabel
                    key={permission}
                    control={
                      <Checkbox
                        checked={formData.permissions.includes(permission)}
                        onChange={(e) => {
                          const newPermissions = e.target.checked
                            ? [...formData.permissions, permission]
                            : formData.permissions.filter((p) => p !== permission);
                          setFormData({ ...formData, permissions: newPermissions });
                        }}
                      />
                    }
                    label={permission}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingRole ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <List>
        {roles.map((role) => (
          <ListItem key={role.id}>
            <ListItemText
              primary={role.name}
              secondary={`Priority: ${role.priority} | Permissions: ${role.permissions.join(', ')}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleOpenDialog(role)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => handleDeleteRole(role.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
} 