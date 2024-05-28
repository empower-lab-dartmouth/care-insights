/* eslint-disable require-jsdoc */
import React, { useState } from 'react';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { NavLink } from 'react-router-dom';
import './navbar.css';
import logo from '../../assets/care_insights_logo.png';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import SessionTracker from '../../Tracker';
import Modal from '@mui/material/Modal';
import LogoutModal from './LogoutModal/LogoutModal';

export default function Nav() {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  return (
    <AppBar component="nav">
      <Modal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <LogoutModal closeModal={
          () => setLogoutModalOpen(false)} />
      </Modal>
      <SessionTracker />
      {/* <Toolbar> */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        spacing={2}
      >
        {/* <div className="navbar"> */}
        <img src={logo} style={{ height: '40px' }} />
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="flex-end"
          spacing={2}
          sx={{ paddingRight: '40px' }}
        >
          <NavLink to="/summaryInsights" className="nav-item">
            <Stack direction="column" justifyContent="flex-start"
              alignItems="center">
              <LiveHelpIcon />
              Care Insights
            </Stack>
          </NavLink>
          <NavLink to="/videoAnalysis" className="nav-item">
            <Stack direction="column" justifyContent="flex-start"
              alignItems="center">
              <VideoLibraryIcon />
              Video Analysis
            </Stack>
          </NavLink>
          <div
            onClick={() => setLogoutModalOpen(true)} style={{
              cursor: 'pointer'
            }}>
            <Stack direction="column"
              justifyContent="flex-start"
              alignItems="center">
              <ExitToAppIcon />
              Sign out
            </Stack>
          </div>
        </Stack>
      </Stack>
    </AppBar>
  );
}
