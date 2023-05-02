import React from "react";
import PropertyList from "./components/PropertyList";
import { Helmet } from "react-helmet";
import './AppStyles.css';


function App() {
  return (
    <div className="App">
      <Helmet>
        <title>Acuity - Stellar MLS DEMO KEY</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="https://acghomeoffers.com/wp-content/uploads/2022/09/favicon-150x150.png"
          type="image/png"
          sizes="150x150"
        />
      </Helmet>
      <h1>Acuity - Stellar MLS DEMO KEY</h1>
      <PropertyList />
    </div>
  );
}

export default App;
