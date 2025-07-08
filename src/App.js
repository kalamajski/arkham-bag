import './App.css';
import { useState } from 'react';
import { tokens } from './tokens.js'

function App() {
  const [availableTokens, setAvailableTokens] = useState(tokens);
  const [tokensInBag, setTokensInBag] = useState([]);

  console.log(availableTokens); 

  function handleTokenClick(token) {
    setAvailableTokens(current => current.filter(item => item.id !== token.id));
    setTokensInBag(current => {
      const sortedTokens = [...current, token].sort((a,b) => a.id-b.id);
      return sortedTokens;
    });
  }
  
  function handleBagClick(token) {
    setTokensInBag(current => current.filter(item => item.id !== token.id));
    setAvailableTokens(current => {
      const sortedTokens = [...current, token].sort((a, b) => a.id - b.id);
      return sortedTokens;
    });
  }

  function getRandomObject(tokensInBag) {
    if (tokensInBag.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * tokensInBag.length);
    return tokensInBag[randomIndex];
  };

  return (
    <div className="App">
     <Instructions />
     <AvailableTokens availableTokens={availableTokens} handleTokenClick={handleTokenClick} />
     <BagContent tokensInBag={tokensInBag} handleBagClick={handleBagClick} />
     <Lottery handleBagClick={handleBagClick} tokensInBag={tokensInBag} getRandomObject={getRandomObject} />
    </div>
  );
}

function Instructions() {
  return (
    <div className="Instructions">
      <h3>Available Tokens pool contains all tokens from the core set, Innsmouth Conspiracy, and Edge Of The Earth</h3>
      <h3>Click any Available Token to add it to the Chaos Bag. Click on the text to toggle token pool visibility</h3>
      <h3>Click any token in the Chaos Bag to remove and return it to the Available Token pool</h3>
      <h3>Click on the <em>Draw Token!</em> button to draw a token from the bag</h3>
      <h4>Tokens from the Innsmouth Conspiracy expansion will be removed automatically after being drawn - just add them back again if you have that power!</h4>
    </div>
  )
}

function AvailableTokens({ availableTokens, handleTokenClick }) {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div className="AvailableTokens">
    <h2 onClick={() => setIsVisible(!isVisible)}>Available Tokens</h2>
    {isVisible ?
    <div className="tokenList">
    {availableTokens.map((token) => (
      <img key={token.id} src={token.imageURL} height={50} width={50} alt={token.id} onClick={() => handleTokenClick(token)} /> ))
    }
    </div> : null }
    </div>
  );
}

function BagContent({ tokensInBag, handleBagClick }) {
  return (
    <div className="TokensInBag">
      <h2>Chaos Bag</h2>
    <div className="tokenList">
    {tokensInBag.map((token) => (
    <img key={token.id} src={token.imageURL} height={50} width={50} alt={token.id} onClick={() => handleBagClick(token)}/> ))
}
    </div>
    </div>
  );
}

function Lottery({ tokensInBag, getRandomObject, handleBagClick }) {
  const [drawnToken, setDrawnToken] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInnsmouth, setIsInnsmouth] = useState(false);

  function handleDraw() {
    setIsInnsmouth(false);
    const newDraw = getRandomObject(tokensInBag);
    setDrawnToken(newDraw);
    setIsAnimating(true);
    setTimeout(() => { 
      setIsAnimating(false);
      if (newDraw.innsmouth === true) {
        handleBagClick(newDraw);
        setIsInnsmouth(true);
      }
    }, 2000);
  }

  return (
    <div className="Lottery moving-gradient">
    <button className={isAnimating || (tokensInBag.length === 0) ? 'button hidden' : 'button button-glass'} onClick={handleDraw}>Draw Token!</button>
    <div className="drawnToken">
      {drawnToken && (
    <img src={drawnToken.imageURL}
         width={200} 
         height={200} 
         className={isAnimating ? 'animate' : ''}
      />
      )}
      </div>
      {isInnsmouth && (
        <div>
      <h3>Token removed</h3>
      </div>
      )}
    
    </div>
  );
}

export default App;
