import {
  Paper,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText
} from "@mui/material";
import {TShop, TShops} from "../../lib";

type TShopList = {
  shops: TShops;
  onActiveShop?: (shop: TShop) => void;
}


export const ShopList = ({shops, onActiveShop}: TShopList) => {
  return (
    <Paper square sx={{mb: '50px'}}>
      <List sx={{mb: 2}}>
        {Object.keys(shops).map((id) => {
          const {name, cash} = shops[id];
          const splitName = name.split('_');
          const first = splitName[0][0];
          const second = splitName[1]?.[0] ?? '';

          return (
            <ListItemButton key={id} onClick={() => onActiveShop?.(shops[id])}>
              <ListItemAvatar>
                <Avatar alt={name}>
                  {(first + second).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={name} secondary={`Баланс: ${cash}`}/>
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  )
}