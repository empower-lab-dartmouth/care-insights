import React, { useContext, useState } from 'react';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { NavLink } from 'react-router-dom';
import './navbar.css';
import logo from '../../assets/care_insights_logo_heart.png';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import SessionTracker from '../../Tracker';
import Modal from '@mui/material/Modal';
import LogoutModal from './LogoutModal/LogoutModal';
import { AuthContext } from '../../state/context/auth-context';
import { Typography } from '@mui/material';
import Diversity1Icon from '@mui/icons-material/Diversity1';

export default function Nav() {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  return (
    <AppBar component='nav'>
      <Modal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <LogoutModal closeModal={() => setLogoutModalOpen(false)} />
      </Modal>
      <SessionTracker />
      {/* <Toolbar> */}
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='flex-end'
        spacing={2}
      >
        {/* <div className="navbar"> */}
        <img src={logo} style={{ height: '40px' }} />
        <Typography variant='body1' sx={{ paddingBottom: '5px' }}>
          {currentUser?.email}
        </Typography>
        <Stack
          direction='row'
          justifyContent='flex-end'
          alignItems='flex-end'
          spacing={2}
          sx={{ paddingRight: '40px' }}
        >
          <NavLink to='/summaryInsights' className='nav-item'>
            <Stack
              direction='column'
              justifyContent='flex-start'
              alignItems='center'
            >
              <LiveHelpIcon />
              Care Insights
            </Stack>
          </NavLink>
          <NavLink to='/videoAnalysis' className='nav-item'>
            <Stack
              direction='column'
              justifyContent='flex-start'
              alignItems='center'
            >
              <VideoLibraryIcon />
              Program events
            </Stack>
          </NavLink>
          <NavLink to='/careTeam' className='nav-item'>
            <Stack
              direction='column'
              justifyContent='flex-start'
              alignItems='center'
            >
              <Diversity1Icon />
              Care team
            </Stack>
          </NavLink>
          <div
            onClick={() => setLogoutModalOpen(true)}
            style={{
              cursor: 'pointer',
            }}
          >
            <Stack
              direction='column'
              justifyContent='flex-start'
              alignItems='center'
            >
              <ExitToAppIcon />
              Sign out
            </Stack>
          </div>
        </Stack>
      </Stack>
    </AppBar>
  );
}
