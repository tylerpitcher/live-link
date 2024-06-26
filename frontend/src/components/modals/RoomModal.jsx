import { Modal, TextField, Chip, Stack, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';

import useUserStore from '../../stores/userStore';
import StyledAlert from '../base/StyledAlert';
import StyledForm from '../base/StyledForm';
import Center from '../base/Center';

function RoomModal({ modify, title, msg, severity, room, mutation, hide }) {
  const { user, darkMode } = useUserStore();

  const [name, setName] = useState(room?.name || '');
  const [input, setInput] = useState('');
  const [guests, setGuests] = useState(room?.guests.map((guest) => guest.name) || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const handleChange = (event) => {
    const value = event.target.value;

    if (value.endsWith(' ')) {
      setGuests((prev) => prev.concat(input));
      return setInput('');
    }

    setInput(value);
  };

  const handleDelete = (i) => {
    setGuests((prev) => prev.filter((_, index) => index !== i));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name) return;
    
    setLoading(true);
    mutation({ variables: { name: modify ? room.name : name, guests: user ? guests: [] } })
      .then(() => { setLoading(false); hide() })
      .catch((error) => { setLoading(false); setError(error.message) });
  };

  return (
    <Modal open>
      <Box>
        <Center>
          <StyledForm title={title} hide={hide} handleSubmit={handleSubmit}>
            {error
              ? <StyledAlert severity='error'>{error}</StyledAlert>
              : <StyledAlert severity={severity}>{msg}</StyledAlert>
            }
            <TextField 
              name='name'
              value={name}  
              placeholder='Name' 
              onChange={(event) => setName(event.target.value)}
              disabled={loading || modify}
            />
            <Box>
              <TextField
                sx={{ width: 1, mb: '3vh' }}
                value={input}
                placeholder='Guest'
                helperText={user ? 'Enter a name and press space' : 'Must be logged in to add guests'}
                onChange={handleChange}
                disabled={loading || !user}
              />
              <Stack direction='row' flexWrap='wrap' spacing={1}>
                {guests.length
                  ? guests.map((guest, i) => <Chip 
                    key={guest} 
                    label={guest} 
                    disabled={loading} 
                    onDelete={() => handleDelete(i)}
                  />) : <Chip label={'Anyone Can Join'}/>}
              </Stack>
            </Box>
          
            <LoadingButton
              type='submit'
              variant={darkMode ? 'outlined' : 'contained'} 
              loading={loading}
            >
              {title}
            </LoadingButton>
          </StyledForm>
        </Center>
      </Box>
    </Modal>
  );
}

export default RoomModal;
