import './App.scss';
import Card from './components/Card';
import CardGrid from './components/CardGrid';
import SideNav from './components/SideNav';
import {Helmet} from 'react-helmet';
import { fetchData } from './actions/actionHandlers';
import { useEffect, useState } from 'react';


function App() {
  const [files, setFiles] = useState(null);
  useEffect(() => {
    const initializeData = async () => {
      fetchData(setFiles)
    }
    initializeData();
  }, [])
  // for (let i = 0; i < 10; i++) {
  //   cards.push({label: `Stussy Basic Hoodie ${i}`})
  // }


  return (
    <div className="App">
      {/* <Helmet>
        <style>{'body { background-color: rgba(18, 18, 18, 1); }'}</style>
            </Helmet> */}
      <SideNav navItems={["All", "Tops", "Bottoms"]}/>
      <CardGrid cards={files || []}/>
    </div>
  );
}

export default App;
