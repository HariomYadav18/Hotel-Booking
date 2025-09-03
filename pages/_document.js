// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';
import Document from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Add custom fonts, meta tags, favicons here */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
