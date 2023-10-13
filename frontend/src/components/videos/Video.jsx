import { Tooltip, Box } from '@mui/material';
import { useState, useRef, useEffect } from 'react';

import Loader from '../base/Loader';

function Video({ name, stream, me }) {
  const [loading, setLoading] = useState(true);
  const ref = useRef();

  useEffect(() => {
    ref.current.srcObject = stream;
  }, [stream]);

  return (
    <Tooltip title={name}>
      <Box>
        {loading && <Loader/>}
        <video 
          playsInline 
          ref={ref} 
          muted={me} 
          autoPlay 
          onLoadedData={() => setLoading(false)}
          style={{ 
            width: '100%', 
            display: 'table-row',
            ...(loading && { display: 'hidden' }),
            ...(me && {transform: 'rotateY(180deg)'}), 
          }} 
        />
      </Box>
    </Tooltip>
  );
}

export default Video;
