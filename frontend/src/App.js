import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import { useEffect, useMemo } from 'react';

import useUserStore from './stores/userStore';
import Center from './components/base/Center';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Room from './pages/Room';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        user: {
          merge: (_, incoming) => incoming
        },
        room: {
          merge: (_, incoming) => incoming,
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_BACKEND_URL}/api/graphql`,
  cache,
});

function App() {
  const { darkMode } = useUserStore();

  const theme = useMemo(() => createTheme({
    palette: { mode: darkMode ? 'dark' : 'light' },
    components: {
      MuiTextField: {
        defaultProps: {
          variant: 'standard'
        },
      },
      MuiAlert: {
        defaultProps: {
          variant: 'outlined'
        },
      },
    },
  }), [darkMode]);

  useEffect(() => {
    return () => {
      client.clearStore();
    };
  });

  return (
    <ApolloProvider client={client}>    
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <BrowserRouter>
        <Center>
          <Routes>
            <Route path='/livelink/register' element={<Register/>}/>
            <Route path='/livelink/login' element={<Login/>}/>
            <Route path='/livelink' element={<Home/>}/>
          </Routes>
        </Center>
        <Routes>
          <Route path={`/livelink/room/:room`} element={<Room/>}/>
        </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
