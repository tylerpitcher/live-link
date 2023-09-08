import { ThemeProvider, CssBaseline, createTheme, Grid } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import { useMemo, useEffect } from 'react';

import useUserStore from './stores/userStore';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        room: {
          merge: (_, incoming) => incoming,
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: '/api/graphql',
  cache,
});

function App() {
  const { user, darkMode } = useUserStore();

  const theme = useMemo(() => createTheme({
    palette: { mode: darkMode ? 'dark' : 'light' },
  }));

  useEffect(() => {
    client.clearStore();
  }, [user]);

  return (
    <ApolloProvider client={client}>    
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <BrowserRouter>
        <Grid position='fixed' justifyContent='center' alignItems='center' sx={{ height: 1 }} container>
          <Grid md={5} sm={8} xs={11} item>
            <Routes>
              <Route path='/register' element={<Register/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/' element={<Home/>}/>
            </Routes>
          </Grid>
        </Grid>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
