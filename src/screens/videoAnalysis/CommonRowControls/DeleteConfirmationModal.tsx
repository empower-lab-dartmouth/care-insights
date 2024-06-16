import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

type DeleteConfirmModalProps = {
    deleteAction: () => void
}

const DeleteConfirmModal: React.FC<
    DeleteConfirmModalProps> = ({ deleteAction }) => {
        const [open, setOpen] = React.useState(false);
        const handleOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };

        return (
            <React.Fragment>
                <Button startIcon={<DeleteIcon color='warning' />}
                    onClick={handleOpen} color='error'>Delete</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style, width: 200 }}>
                        <h2 id="child-modal-title">Are you sure
                            you want to delete?</h2>
                        <p id="child-modal-description">
                            This action cannot be undone.
                        </p>
                        <Button onClick={() => {
                            handleClose();
                            deleteAction();
                        }}>Yes</Button>
                        <Button onClick={handleClose}>No</Button>
                    </Box>
                </Modal>
            </React.Fragment>
        );
    };

export default DeleteConfirmModal;
