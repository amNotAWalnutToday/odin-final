import React from 'react';
import Header from './components/Header';
import MainSidebar from './components/MainSidebar';
import Page from './components/Page';

export default function App() {
  return (
    <div className="App">
      <Header />
      <MainSidebar />
      <Page />
    </div>
  );
}
