import {AppBar, Box, Fab, styled, Toolbar, Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {ImportExport} from "@mui/icons-material";

type TAddBar = {
  onAdd?: () => void;
  onExport?: () => void;
  isExportDisable?: boolean;
}

const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: '0 auto',
});

export const AddBar = ({onAdd, onExport, isExportDisable}: TAddBar) => {
  return (
    <AppBar position="fixed" color="primary" sx={{top: 'auto', bottom: 0}}>
      <Toolbar>
        <StyledFab onClick={onAdd} color="secondary" aria-label="add">
          <AddIcon />
        </StyledFab>
        <Box sx={{flexGrow: 1}}/>
        <Button onClick={onExport} color="inherit" aria-label="open drawer" disabled={isExportDisable} startIcon={<ImportExport/>}>
          Экспорт
        </Button>
      </Toolbar>
    </AppBar>
  )
}