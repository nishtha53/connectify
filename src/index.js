import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom";

import { ChakraProvider } from '@chakra-ui/react'


import { makeServer } from "./server";
import { AuthProvider } from './context/auth-context';
import { UsersProvider } from './context/user-context';
import { PostsProvider } from './context/post-context';

// Call make Server
makeServer();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
    <ChakraProvider>
      <AuthProvider>
        <UsersProvider>
          <PostsProvider>
        <App />
        </PostsProvider>
        </UsersProvider>
      </AuthProvider>
    </ChakraProvider>
    </Router>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
