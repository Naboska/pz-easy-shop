import {useCallback, useRef} from "react";
import {Button, Dialog, DialogActions, DialogContent, TextField} from "@mui/material";
import {useToggle} from "react-use";
import {enqueueSnackbar} from "notistack";
import {luaToJs, TShops} from "../../lib";

type TLuaParser = {
  onParse?: (data: TShops) => void;
}

export const LuaParser = ({onParse}: TLuaParser) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, onToggle] = useToggle(false);

  const handleParse = useCallback(() => {
    try {
      const parsedData = luaToJs(textAreaRef.current?.value ?? '');
      onParse?.(parsedData);
      onToggle();
    } catch (e) {
      enqueueSnackbar((e as Error).message);
    }
  }, [onParse]);

  return <>
    <Button onClick={onToggle}>Загрузить конфигурацию</Button>
    <Dialog open={isOpen} onClose={onToggle} maxWidth="xs" fullWidth>
      <DialogContent>
        <TextField label="Конфигурация" inputRef={textAreaRef} multiline maxRows={4} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleParse} autoFocus>
          Загрузить
        </Button>
      </DialogActions>
    </Dialog>
  </>
}