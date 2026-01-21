import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import '../styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <Head>
                <link rel="icon" href="/favicon.png" />
                <title>Smart Code Reviewer</title>
            </Head>
            <Component {...pageProps} />
        </Provider>
    );
}
