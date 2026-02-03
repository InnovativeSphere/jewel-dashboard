// app.tsx
import "../app/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import Layout from "../components/Layout";
import { usePathname } from "next/navigation";

export default function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname?.(); 
  const noSidebar = pathname === "/";

  return (
    <Provider store={store}>
      {noSidebar ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </Provider>
  );
}
