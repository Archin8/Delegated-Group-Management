import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Permission, Role } from '../types';
import { groupService } from '../services/groupService';

interface PermissionManagerProps {
  groupId: string;
}

export default function PermissionManager({ groupId }: PermissionManagerProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    permissions: [] as Permission[],
    priority: 0,
  });

  useEffect(() => {
    loadRoles();
  }, [groupId]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await groupService.getRoles(groupId);
      setRoles(data);
      setError('');
    } catch (err) {
      setError('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      await groupService.createRole(groupId, formData);
      setSuccess('Role created successfully');
      setCreateDialogOpen(false);
      loadRoles();
      resetForm();
    } catch (err) {
      setError('Failed to create role');
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedRole) return;

    try {
      await groupService.updateRole(groupId, selectedRole.id, formData);
      setSuccess('Role updated successfully');
      setEditDialogOpen(false);
      loadRoles();
      resetForm();
    } catch (err) {
      setError('Failed to update role');
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    try {
      await groupService.deleteRole(groupId, selectedRole.id);
      setSuccess('Role deleted successfully');
      setDeleteDialogOpen(false);
      loadRoles();
    } catch (err) {
      setError('Failed to delete role');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      permissions: [],
      priority: 0,
    });
    setSelectedRole(null);
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      permissions: role.permissions,
      priority: role.priority,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (role: Role) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  const handlePermissionChange = (permission: Permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const renderPermissionCheckboxes = () => {
    return Object.values(Permission).map(permission => (
      <FormControlLabel
        key={permission}
        control={
          <Checkbox
            checked={formData.permissions.includes(permission)}
            onChange={() => handlePermissionChange(permission)}
          />
        }
        label={permission.replace(/_/g, ' ')}
      />
    ));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Role Management</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Role
        </Button>
      </Box>

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

      <Paper sx={{ p: 2 }}>
        <List>
          {roles.map((role) => (
            <ListItem
              key={role.id}
              secondaryAction={
                <Box>
                  <IconButton edge="end" onClick={() => openEditDialog(role)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => openDeleteDialog(role)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={role.name}
                secondary={`Priority: ${role.priority} | Permissions: ${role.permissions.length}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Create Role Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Create Role</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Role Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Priority"
            type="number"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
            margin="normal"
          />
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Permissions
          </Typography>
          <FormGroup>
            {renderPermissionCheckboxes()}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateRole} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Role Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Priority"
            type="number"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
            margin="normal"
          />
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Permissions
          </Typography>
          <FormGroup>
            {renderPermissionCheckboxes()}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateRole} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Role Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Role</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this role? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteRole} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 