import { Modal, TextField, Chip, Stack, Box } from '@mui/material';
import { useMutation } from '@apollo/client';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';

import { getContext, CREATE_ROOM, USER_ROOMS } from '../../operations';
import useUserStore from '../../stores/userStore';
import StyledAlert from '../base/StyledAlert';
import StyledForm from '../base/StyledForm';
import Center from '../base/Center';

function CreateRoomModal({ hide }) {
  const { user, darkMode } = useUserStore();

  const [name, setName] = useState('');
  const [input, setInput] = useState('');
  const [guests, setGuests] = useState([]);
  const [error, setError] = useState();

  const [createRoom] = useMutation(CREATE_ROOM, {
    variables: { name, guests },
    ...getContext(user?.token),
    refetchQueries: [{ 
      query: USER_ROOMS,
      ...getContext(user?.token),
    }],
  });

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
    
    createRoom({ variables: { name, guests } })
      .then(() => hide())
      .catch((error) => setError(error.message));
  };

  return (
    <Modal open>
      <Box>
        <Center>
          <StyledForm title='Create Room' hide={hide} handleSubmit={handleSubmit}>
            {error
              ? <StyledAlert severity='error'>{error}</StyledAlert>
              : <StyledAlert severity='info'>Create a room with a unique name.</StyledAlert>
            }
            <TextField 
              name='name'
              value={name}  
              placeholder='Name' 
              onChange={(event) => setName(event.target.value)}
            />
            <Box>
              <TextField
                sx={{ width: 1, mb: '2.5vh' }}
                value={input}
                placeholder='Guest'
                helperText='Enter a name and press space'
                onChange={handleChange}
              />
              <Stack direction='row' flexWrap='wrap' spacing={1}>
                {guests.map((guest, i) => <Chip key={guest} label={guest} onDelete={() => handleDelete(i)}/>)}
              </Stack>
            </Box>
          
            <LoadingButton
              type='submit'
              variant={darkMode ? 'outlined' : 'contained'} 
            >
              Create
            </LoadingButton>
          </StyledForm>
        </Center>
      </Box>
    </Modal>
  );
}

export default CreateRoomModal;
