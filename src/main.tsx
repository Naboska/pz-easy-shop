import React from 'react'
import ReactDOM from 'react-dom/client'
import {Global, css} from "@emotion/react";
import {App} from './App.tsx'
import {CssBaseline, ThemeProvider} from "@mui/material";

import {theme} from "./theme.ts";

import './reset.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {SnackbarProvider} from "notistack";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Global styles={css`
        body {
          background: ${theme.palette.background.default};
        }
      `}/>
      <SnackbarProvider anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}>
        <App/>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
