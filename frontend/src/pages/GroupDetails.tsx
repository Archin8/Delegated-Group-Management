import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Alert,
  Button,
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { Group, Permission, GroupMember } from '../types';
import { groupService } from '../services/groupService';
import RoleManagement from '../components/RoleManagement';
import MemberManagement from '../components/MemberManagement';
import JoinRequestManagement from '../components/JoinRequestManagement';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`group-tabpanel-${index}`}
      aria-labelledby={`group-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function GroupDetails() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);

  const fetchGroup = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      const [groupData, membersData] = await Promise.all([
        groupService.getGroup(groupId),
        groupService.getMembers(groupId)
      ]);
      
      setGroup(groupData);
      
      // Find current user's role and permissions
      const currentUser = membersData.find((member: GroupMember) => member.user.id === localStorage.getItem('userId'));
      if (currentUser) {
        setUserPermissions(currentUser.role.permissions);
      }
      
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch group details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!group) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Group not found</Alert>
      </Box>
    );
  }

  const canManageRoles = userPermissions.includes(Permission.MANAGE_ROLES);
  const canManageMembers = userPermissions.includes(Permission.MANAGE_MEMBERS);
  const canApproveRequests = userPermissions.includes(Permission.APPROVE_REQUESTS);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {group.name}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<SettingsIcon />}
          onClick={() => navigate(`/groups/${groupId}/settings`)}
        >
          Settings
        </Button>
      </Box>
      <Typography variant="body1" color="text.secondary" paragraph>
        {group.description}
      </Typography>

      <Paper sx={{ width: '100%', mt: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Overview" />
          <Tab label="Members" />
          <Tab label="Roles" />
          <Tab label="Join Requests" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Group Information
              </Typography>
              <Typography variant="body1">
                Created by: {group.ownerId}
              </Typography>
              <Typography variant="body1">
                Created at: {new Date(group.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <MemberManagement
            groupId={group.id}
            canManageMembers={canManageMembers}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <RoleManagement
            groupId={group.id}
            canManageRoles={canManageRoles}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <JoinRequestManagement
            groupId={group.id}
            canApproveRequests={canApproveRequests}
          />
        </TabPanel>
      </Paper>
    </Box>
  );
} 