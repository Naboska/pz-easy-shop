import {forwardRef, useState} from "react";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import {Add} from "@mui/icons-material";
import {TableComponents, TableVirtuoso} from "react-virtuoso";

import {items} from "../../items.ts";

type TGameData = {
  ids: string[];
  names: string[];
  icons: string[];
}

type TItemsTable = {
  ids: string[];
  onAdd: (item: string[]) => void;
}

const VirtuosoTableComponents: TableComponents<TGameData> = {
  Scroller: forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref}/>
  )),
  Table: (props) => (
    <Table {...props} sx={{borderCollapse: 'separate', tableLayout: 'fixed'}}/>
  ),
  TableHead,
  TableRow: ({item, ...props}) => <TableRow {...props} />,
  TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref}/>
  )),
};

export const ItemsTable = (props: TItemsTable) => {
  const {ids} = props;
  const [search, setSearch] = useState('');

  return (
    <Paper style={{height: '50vh', width: '100%'}}>
      <TableVirtuoso
        data={items
          .filter(item => !ids.some(id =>
            item.ids.includes(id)) && item.names.some(name => name.toLowerCase().includes(search.toLowerCase()))
          )}
        components={VirtuosoTableComponents}
        fixedHeaderContent={() => (
          <TableRow sx={{background: '#1e1e20'}}>
            <TableCell style={{minWidth: 160, width: 160}}>Иконка</TableCell>
            <TableCell>
              <TextField size="small" label="Предмет" value={search} onChange={e => setSearch(e.target.value)}/>
            </TableCell>
            <TableCell style={{minWidth: 160, width: 160}}>Действия</TableCell>
          </TableRow>
        )}
        itemContent={(_, row) => {
          return (
            <>
              <TableCell>
                {row.icons.map((icon, iconIndex) => (
                  <img key={iconIndex} src={icon} alt={icon} width={24} height={24}/>
                ))}
              </TableCell>
              <TableCell>
                {row.names.join(', ')}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => props.onAdd(row.ids)}>
                  <Add/>
                </IconButton>
              </TableCell>
            </>
          );
        }}
      />
    </Paper>
  )
}