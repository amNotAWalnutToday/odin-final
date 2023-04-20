import Header from './components/Header';
import MainSidebar from './components/MainSidebar';
import Page from './components/Page';

type Props = {
  pageType: string,
}

export default function App({pageType}: Props) {
  return (
    <div className="App">
      <Header />
      <MainSidebar />
      <Page pageType={pageType} />
    </div>
  );
}
