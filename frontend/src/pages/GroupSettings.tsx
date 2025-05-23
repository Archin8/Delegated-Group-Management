import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
} from '@mui/material';
import PermissionManager from '../components/PermissionManager';
import MemberManagement from '../components/MemberManagement';
import GeneralSettings from '../components/GeneralSettings';

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
      id={`group-settings-tabpanel-${index}`}
      aria-labelledby={`group-settings-tab-${index}`}
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

export default function GroupSettings() {
  const { groupId } = useParams<{ groupId: string }>();
  const [activeTab, setActiveTab] = useState(0);

  if (!groupId) {
    return <Typography color="error">Group ID is required</Typography>;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Group Settings
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="group settings tabs"
        >
          <Tab label="General" />
          <Tab label="Members" />
          <Tab label="Roles & Permissions" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <GeneralSettings groupId={groupId} />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <MemberManagement groupId={groupId} canManageMembers={true} />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <PermissionManager groupId={groupId} />
        </TabPanel>
      </Paper>
    </Box>
  );
} 