import {AppBar, Box, Toolbar, Typography} from '@mui/material';
import {ReactNode} from "react";

type TLayout = {
  headerActions: ReactNode;
  children: ReactNode;
}

export const Layout = ({headerActions, children}: TLayout) => {
  return (
    <>
      <AppBar component="nav" position="sticky">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}}}
          >
            PZ-EASY-SHOP
          </Typography>
          <Box sx={{display: {xs: 'none', sm: 'block'}}}>
            {headerActions}
          </Box>
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
}