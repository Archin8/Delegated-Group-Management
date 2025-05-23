import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { GroupMember, Role } from '../types';
import { groupService } from '../services/groupService';

interface MemberManagementProps {
  groupId: string;
  canManageMembers: boolean;
}

export default function MemberManagement({ groupId, canManageMembers }: MemberManagementProps) {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    roleId: '',
  });

  useEffect(() => {
    loadData();
  }, [groupId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [membersData, rolesData] = await Promise.all([
        groupService.getMembers(groupId),
        groupService.getRoles(groupId),
      ]);
      setMembers(membersData);
      setRoles(rolesData);
      setError('');
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    try {
      await groupService.addMember(groupId, {
        email: formData.email,
        roleId: formData.roleId,
      });
      setSuccess('Member added successfully');
      setAddDialogOpen(false);
      loadData();
      resetForm();
    } catch (err) {
      setError('Failed to add member');
    }
  };

  const handleUpdateMemberRole = async () => {
    if (!selectedMember) return;

    try {
      await groupService.updateMemberRole(groupId, selectedMember.id, formData.roleId);
      setSuccess('Member role updated successfully');
      setEditDialogOpen(false);
      loadData();
      resetForm();
    } catch (err) {
      setError('Failed to update member role');
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;

    try {
      await groupService.removeMember(groupId, selectedMember.id);
      setSuccess('Member removed successfully');
      setDeleteDialogOpen(false);
      loadData();
    } catch (err) {
      setError('Failed to remove member');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      roleId: '',
    });
    setSelectedMember(null);
  };

  const openEditDialog = (member: GroupMember) => {
    setSelectedMember(member);
    setFormData({
      email: member.user.email,
      roleId: member.role.id,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (member: GroupMember) => {
    setSelectedMember(member);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Member Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Member
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
          {members.map((member) => (
            <ListItem
              key={member.id}
              secondaryAction={
                <Box>
                  <IconButton edge="end" onClick={() => openEditDialog(member)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => openDeleteDialog(member)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={member.user.email}
                secondary={`Role: ${member.role.name}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Add Member Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add Member</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.roleId}
              onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
              label="Role"
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMember} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Member Role</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.roleId}
              onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
              label="Role"
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateMemberRole} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Member Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Remove Member</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove this member from the group? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRemoveMember} color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 