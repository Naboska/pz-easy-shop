import {useCallback, useState} from "react";
import {AddBar, Details, Layout, LuaParser, ShopList} from "./components";
import {createLuaShop, jsToLua, TShop, TShops} from "./lib";
import {enqueueSnackbar} from "notistack";

export const App = () => {
  const [data, setData] = useState<TShops | null>(null);
  const [activeShop, setActiveShop] = useState<TShop | null>(null);

  const handleParse = useCallback((shops: TShops) => {
    setData(shops);
    setActiveShop(null);
  }, [])

  const handleExport = useCallback(async () => {
    const result = data ? jsToLua(data) : '';

    await navigator.clipboard.writeText(result);

    enqueueSnackbar('Скопировано в буфер обмена');
  }, [data])

  const handleAdd = useCallback(() => {
    const newShop = createLuaShop();
    setData(prev => ({...prev, [newShop.ID]: newShop}))
    setActiveShop(newShop);
  }, [])

  const handleSave = useCallback((shop: TShop) => {
    setData(prev => ({...prev, [shop.ID]: shop}));
    setActiveShop(null);
  }, []);

  if (activeShop) {
    return <Details shop={activeShop} onSave={handleSave} onBack={() => setActiveShop(null)}/>;
  }

  return (
    <Layout headerActions={<LuaParser onParse={handleParse}/>}>
      {data && <ShopList onActiveShop={setActiveShop} shops={data}/>}
      <AddBar onAdd={handleAdd} onExport={handleExport} isExportDisable={!data}/>
    </Layout>
  )
}