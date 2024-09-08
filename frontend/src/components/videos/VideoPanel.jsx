import { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import io from 'socket.io-client';
import Peer from 'simple-peer';

import Video from './Video';
import useUserStore from '../../stores/userStore';

var socket;

function callNewUser(me, myStream, newUser, setMedia) {
  const peer = new Peer({ initiator: true, trickle: false, stream: myStream });
  if (me && me.name === newUser.name) return;

  socket.on('accept', (signal) => peer.signal(signal));

  peer.on('signal', (signal) => socket.emit('call', {
    to: newUser.id,
    signal,
  }));

  peer.on('stream', (stream) => setMedia((videos) => ({
    ...videos,
    [newUser.name]: <Video key={newUser.name} name={newUser.name} stream={stream}/>,
  })));
}

function acceptNewCall(myStream, details, setMedia) {
  const peer = new Peer({ initiator: false, trickle: false, stream: myStream });

  peer.on('signal', (signal) => {
    socket.emit('accept', { signal, to: details.from });
  });

  peer.on('stream', (stream) => setMedia((videos) => ({
    ...videos,
    [details.caller]: <Video key={details.caller} name={details.caller} stream={stream}/>,
  })));

  peer.signal(details.signal);
}

function disconnectCall(name, setMedia) {
  setMedia((prev) => Object.entries(prev).reduce((final, [key, value]) => {
    if (key !== name) return { ...final, [key]: value };
    return final;
  }, {}));
}

function VideoPanel({ roomName }) {
  const { user } = useUserStore();
  const [myStream, setMyStream] = useState({});
  const [media, setMedia] = useState({});

  useEffect(() => {
    socket = io.connect(process.env.REACT_APP_BACKEND_URL, { path: '/socket' });

    var myStream;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      myStream = stream;
      setMyStream({
        stream,
        video: <Video name={user?.name || 'You'} stream={stream} me/>,
      });

      socket.emit('join', roomName, user?.token);

      socket.on('newUser', (newUser) => callNewUser(user, myStream, newUser, setMedia));
      socket.on('call', (caller) => acceptNewCall(myStream, caller, setMedia));
      socket.on('exit', (name) => disconnectCall(name, setMedia));
    });

    return () => {
      myStream?.getTracks().forEach((track) => track.stop());
      socket.disconnect();
    };
  }, [roomName, user]);

  return (
    <Grid position='fixed' sx={{ overflow: 'scroll', height: 1 }} container>
      <Grid xs={4} item>
        {myStream.video}
      </Grid>
      {Object.values(media).map((video, i) => (
        <Grid key={i} xs={4} item>
          {video}
        </Grid>
      ))}
    </Grid>
  );
}

export default VideoPanel;
