import {forwardRef, useCallback, useMemo, useState} from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  TableCell,
  TextField,
  Switch,
  IconButton,
  AppBar,
  Toolbar,
  Button
} from '@mui/material'
import {ArrowBack, Delete} from "@mui/icons-material";
import {TShop, TShopItem} from "../../lib";
import {items} from "../../items.ts";
import {ItemsTable} from "../ItemsTable";
import {TableComponents, TableVirtuoso} from "react-virtuoso";

type TDetails = {
  shop: TShop;
  onSave: (shop: TShop) => void;
  onBack: () => void;
}

type TItems = {
  shop: TShopItem;
  names: string[];
  icons: string[];
  ids: string[];
}

const VirtuosoTableComponents: TableComponents<TItems> = {
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

export const Details = ({shop, onSave, onBack}: TDetails) => {
  const [search, setSearch] = useState('');
  const [shopClone, setShop] = useState(structuredClone(shop));
  const {listings} = shopClone;

  const activeItems = useMemo(() => {
    const resultItems: TItems[] = [];

    for (const key in listings) {
      const shopItem = listings[key];
      if (resultItems.some(items => items.ids.includes(shopItem.item))) continue;

      const findItem = items.find(({ids}) => ids.includes(shopItem.item));

      resultItems.push({
        shop: shopItem,
        names: findItem?.names ?? [shopItem.item],
        icons: findItem?.icons ?? [],
        ids: findItem?.ids ?? [shopItem.item],
      })
    }

    return resultItems;
  }, [listings]);

  const onAdd = useCallback((ids: string[]) => {
    setShop(prev => {
      const shop = structuredClone(prev);

      for (const id of ids) {
        shop.listings[id] = {
          alwaysShow: true,
          available: 0,
          buybackRate: 0,
          item: id,
          price: 0,
          reselling: true,
          stock: 0,
          storeID: false
        }
      }

      return shop;
    })
  }, [])

  const onChange = useCallback((ids: string[], value: TShopItem) => {
    setShop(prev => {
      const shop = structuredClone(prev);

      for (const key of ids) {
        const newShop = structuredClone(value);
        newShop.item = key;
        shop.listings[key] = newShop;
      }

      return shop;
    })
  }, []);

  const onRemove = useCallback((ids: string[]) => {
    setShop((prev) => {
      const shop = structuredClone(prev);

      for (const key of ids) {
        delete shop.listings[key];
      }


      return shop;
    })
  }, [])

  return (
    <>
      <AppBar component="nav" position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{mr: 2}}
            onClick={onBack}
          >
            <ArrowBack/>
          </IconButton>
          <TextField size="small" value={shopClone.name} onChange={e => {
            setShop(prev => ({...prev, name: e.target.value}))
          }}/>
          <Button sx={{ml: 'auto'}} onClick={() => onSave(shopClone)}>Сохранить</Button>
        </Toolbar>
      </AppBar>
      <Paper style={{height: '40vh', width: '100%'}}>
        <TableVirtuoso
          data={activeItems.filter(item => item.names.some(name => name.toLowerCase().includes(search.toLowerCase())))}
          components={VirtuosoTableComponents}
          fixedHeaderContent={() => (
            <TableRow sx={{background: '#1e1e20'}}>
              <TableCell style={{minWidth: 160, width: 160}}>Иконка</TableCell>
              <TableCell>
                <TextField size="small" label="Предмет" value={search} onChange={e => setSearch(e.target.value)}/>
              </TableCell>
              <TableCell style={{minWidth: 120, width: 120}}>Продажа</TableCell>
              <TableCell style={{minWidth: 120, width: 120}}>Выкуп(%)</TableCell>
              <TableCell style={{minWidth: 120, width: 120}}>Количество</TableCell>
              <TableCell style={{minWidth: 120, width: 120}}>Доступно</TableCell>
              <TableCell style={{minWidth: 120, width: 120}}>Перепродажа</TableCell>
              <TableCell style={{minWidth: 150, width: 150}}>Всегда видно</TableCell>
              <TableCell style={{minWidth: 120, width: 120}}>Действия</TableCell>
            </TableRow>
          )}
          itemContent={(_, {icons, names, shop, ids}) => {
            return (
              <>
                <TableCell>
                  {icons.map((icon, iconIndex) => (
                    <img key={iconIndex} src={icon} alt={icon} width={24} height={24}/>
                  ))}
                </TableCell>
                <TableCell>
                  {names.join(', ')}
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={shop.price}
                    onChange={e => onChange(ids, {...shop, price: Number(e.target.value)})}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={shop.buybackRate}
                    onChange={e => onChange(ids, {...shop, buybackRate: Number(e.target.value)})}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={shop.stock}
                    onChange={e => onChange(ids, {...shop, stock: Number(e.target.value)})}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={shop.available}
                    onChange={e => onChange(ids, {...shop, available: Number(e.target.value)})}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={shop.reselling}
                    onChange={e => onChange(ids, {...shop, reselling: e.target.checked})}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={shop.alwaysShow}
                    onChange={e => onChange(ids, {...shop, alwaysShow: e.target.checked})}
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => onRemove(ids)}>
                    <Delete/>
                  </IconButton>
                </TableCell>
              </>
            );
          }}
        />
      </Paper>
      <ItemsTable ids={activeItems.map(item => item.ids).flat(1)} onAdd={onAdd}/>
    </>
  )
}