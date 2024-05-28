import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { AuthContext } from '../../../state/context/auth-context';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

type LogalModalProps = {
    closeModal: () => void,
}

const LogoutModal: React.FC<LogalModalProps> = (props) => {
    const { closeModal } = props;
    const { currentUser } = React.useContext(AuthContext);
    return (
        <>
            <Box sx={{ ...style, width: 400 }}>
                <Paper elevation={1}>
                    <h2> Logout? </h2>
                    <Typography variant='body1' sx={{ paddingBottom: '5px' }}>
          You are signed in now as: {currentUser?.email}</Typography>
                    <NavLink to="/" className="nav-item">
                        <Button
                            variant='contained'
                            sx={{
                                width: '100%'
                            }}>Yes, log out</Button>
                    </NavLink >
                    <Button onClick={closeModal}
                        variant='outlined'
                        sx={{
                            width: '100%'
                        }}>Stay logged in</Button>
                </ Paper>
            </Box>
        </>
    );
};

export default LogoutModal;
