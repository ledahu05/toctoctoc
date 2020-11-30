import '../styles/index.css';
import { Provider } from 'react-redux';
import { useStore } from '../state/configureStore';
import { AppProps } from 'next/dist/next-server/lib/router/router';



function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
