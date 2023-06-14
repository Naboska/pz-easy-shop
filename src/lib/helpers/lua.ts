import { v4 as uuidv4 } from 'uuid';

export type TShopItem = {
  alwaysShow: boolean;
  available: number;
  buybackRate: number;
  item: string;
  price: number;
  reselling: boolean;
  stock: number;
  storeID: boolean;
}

export type TShop = {
  ID: string;
  cash: number;
  listings: Record<string, TShopItem>;
  managerIDs: Record<string, unknown>;
  name: string;
  nextRestock: number;
  restockHrs: number;
}

export type TShops = Record<string, TShop>

export const createLuaShop = (): TShop => ({
  ID: uuidv4(),
  cash: 0,
  listings: {},
  managerIDs: {},
  name: 'new shop',
  nextRestock: 0,
  restockHrs: 0,
});

export const luaToJs = (data: string): TShops => {
  const cleanedData = data.replace(/\[|\]/g, '');
  const jsonData = cleanedData.replace(/=/g, ':');
  const fixedJsonData = jsonData.replace(/,\s*}/g, '}');

  return JSON.parse(fixedJsonData) as TShops;
}

export const jsToLua = (jsonData: Record<string, unknown>, next = 0) => {
  const tab = Array.from({length: next}, () => '  ').join('');
  let luaTable = "{\n";

  for (const key in jsonData) {
    const value = jsonData[key];

    if (typeof value === 'object' && !Array.isArray(value)) {
      luaTable += `${tab}["${key}"] = ${jsToLua(value as Record<string, unknown>, next + 1)},\n`;
    } else if (Array.isArray(value)) {
      let luaArray = "[";

      for (let i = 0; i < value.length; i++) {
        luaArray += jsToLua(value[i], next + 1);

        if (i < value.length - 1) {
          luaArray += ", ";
        }
      }

      luaArray += "]";
      luaTable += `${tab}["${key}"] = ${luaArray},\n`;
    } else {
      luaTable += `${tab}["${key}"] = ${JSON.stringify(value)},\n`;
    }
  }

  luaTable += tab + "}";
  return luaTable;
}