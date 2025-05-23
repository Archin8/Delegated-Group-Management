import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Alert,
} from '@mui/material';
import { JoinRequest } from '../types';
import { groupService } from '../services/groupService';

interface JoinRequestManagementProps {
  groupId: string;
  canApproveRequests: boolean;
}

export default function JoinRequestManagement({ groupId, canApproveRequests }: JoinRequestManagementProps) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadRequests();
  }, [groupId]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await groupService.getJoinRequests(groupId);
      setRequests(data);
      setError('');
    } catch (err) {
      setError('Failed to load join requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      await groupService.approveJoinRequest(groupId, requestId);
      setSuccess('Join request approved');
      loadRequests();
    } catch (err) {
      setError('Failed to approve request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await groupService.rejectJoinRequest(groupId, requestId);
      setSuccess('Join request rejected');
      loadRequests();
    } catch (err) {
      setError('Failed to reject request');
    }
  };

  const handleRequestJoin = async () => {
    try {
      await groupService.createJoinRequest(groupId);
      setSuccess('Join request sent');
      loadRequests();
    } catch (err) {
      setError('Failed to send join request');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Join Requests</Typography>
        {!canApproveRequests && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleRequestJoin}
          >
            Request to Join
          </Button>
        )}
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
          {requests.map((request) => (
            <ListItem key={request.id}>
              <ListItemText
                primary={`Request from User ID: ${request.userId}`}
                secondary={`Status: ${request.status} - ${new Date(request.createdAt).toLocaleDateString()}`}
              />
              {canApproveRequests && request.status === 'PENDING' && (
                <ListItemSecondaryAction>
                  <Button
                    color="success"
                    onClick={() => handleApprove(request.id)}
                    sx={{ mr: 1 }}
                  >
                    Approve
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleReject(request.id)}
                  >
                    Reject
                  </Button>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
          {requests.length === 0 && (
            <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              No join requests
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
} 