import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const EmailWorkOrderModal = ({ open, onClose, onSubmit }) => {
  const [emails, setEmails] = useState('');

  const handleSubmit = () => {
    onSubmit(emails); 
    setEmails(''); 
    onClose();  
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter recipient emails (separated by comma):</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Recipient Emails"
          type="email"
          fullWidth
          variant="outlined"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          helperText="Separate multiple emails with commas"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailWorkOrderModal;
