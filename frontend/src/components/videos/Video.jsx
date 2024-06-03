import { Tooltip, Box, Skeleton } from '@mui/material';
import { useState, useRef, useEffect } from 'react';

function Video({ name, stream, me }) {
  const [loading, setLoading] = useState(true);
  const ref = useRef();

  useEffect(() => {
    ref.current.srcObject = stream;
  }, [stream]);

  return (
    <Tooltip title={name}>
      <Box>
        {loading && <Skeleton variant='rectangular' sx={{ paddingTop: '56.25%' }}/>}
        <video 
          playsInline 
          ref={ref} 
          muted={me} 
          autoPlay 
          onLoadedData={() => setLoading(false)}
          style={{ 
            width: '100%', 
            display: 'table-row',
            objectFit: 'cover', 
            aspectRatio: '16 / 9',
            ...(loading && { display: 'hidden' }),
            ...(me && {transform: 'rotateY(180deg)'}), 
          }} 
        />
      </Box>
    </Tooltip>
  );
}

export default Video;
