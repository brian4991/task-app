import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../styles/globals.css';

interface AppProps {
  Component: React.ComponentType;
  pageProps: any;
}

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Component {...pageProps} />
    </DndProvider>
  );
};

export default MyApp;