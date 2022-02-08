import { useEffect, useState } from "react";
import "./styles.css";
import getOrLoadRemote from "./utils/getOrLoadRemote";

export default function App() {
  const [config, setConfig] = useState({});
  useEffect(() => {
    const getConfig = async () => {
      // @ts-ignore
      const factory = await getOrLoadRemote(
        "hostApp",
        "default"
      ).then((remote: any) => remote.get("./config"));
      // @ts-ignore
      const config = factory();
      setConfig(config.default);
    };
    getConfig();
  }, []);
  return (
    <div className="App">
      <h1>Hello CodeSandbox!</h1>
      <h2>Start editing to see some magic happen!</h2>
      <pre>{JSON.stringify(config)}</pre>
    </div>
  );
}
