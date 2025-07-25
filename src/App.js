import './App.css';
import { useState, useRef } from 'react';
import { tokens } from './tokens.js'

function getRandomObject(tokensInBag) {
  if (tokensInBag.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * tokensInBag.length);
  return tokensInBag[randomIndex];
};

export default function App() {
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

  return (
    <div className="App">
     <Instructions tokensInBag={tokensInBag} setTokensInBag={setTokensInBag}/>
     <AvailableTokens availableTokens={availableTokens} handleTokenClick={handleTokenClick} />
     <BagContent tokensInBag={tokensInBag} handleBagClick={handleBagClick} />
     <Lottery handleBagClick={handleBagClick} tokensInBag={tokensInBag} setTokensInBag={setTokensInBag} getRandomObject={getRandomObject} />
    </div>
  );
}

function Instructions({ tokensInBag, setTokensInBag }) {
  const [showAlert, setShowAlert] = useState(false);
  const [storageMessage, setStorageMessage] = useState("NADA");

  function CustomAlert({ message, onClose }) {
    return (
    <div className="alert-overlay fade-in">
      <div className="alert-box">
        <p>{message}</p>
        <button className="button" onClick={onClose}>OK</button>
      </div>
    </div>
    );
  };

  function handleLoadButton() {
    const storedArray = localStorage.getItem('chaosArray');
    if (storedArray) {
      try {
        setTokensInBag(JSON.parse(storedArray));
        setStorageMessage("Your Chaos Bag was loaded successfully!");
      } catch (error) {
        setStorageMessage("Failed to fetch the bag array!");
      } 
    } else {
      setStorageMessage("No array found in local storage!");
      }
      setShowAlert(true);
    }
  
    function saveBag() {
      localStorage.setItem('chaosArray', JSON.stringify(tokensInBag));
      setStorageMessage("Your Chaos Bag was saved successfully!")
      setShowAlert(true);
    }

  return (
    <div className="Instructions">
      <h1>Welcome to Arkham Chaos Bag!</h1>
      {showAlert && 
      <CustomAlert message={storageMessage} onClose={() => setShowAlert(false)} />
      }
      <h3 style={{color: "orange"}}>Available Tokens pool contains all tokens from the core set, Innsmouth Conspiracy, and Edge Of The Earth.</h3>
      <h3>Click any <b>Available Token</b> to add it to the Chaos Bag. Click on <b>Available Token</b> text to toggle token pool visibility.</h3>
      <h3 style={{color: "orange"}}>Click any token in the Chaos Bag to remove and return it to the Available Token pool.</h3>
      <h3>Click on the <em>Draw Token!</em> button to draw a token from the bag.</h3>
      <h3 style={{color: "orange"}}>Make 1 sec long-click / long-touch to make consecutive draws without returning tokens to the bag. Thus-drawn tokens will then appear at the bottom of the screen with an option to return those tokens back to the Chaos Bag.</h3>
      <h3>Bless/Curse tokens from the Innsmouth Conspiracy expansion will be automatically moved to Available Tokens pool after being drawn - just add them back again if you have that power!</h3>
      <h3 style={{color: "orange"}}>Lastly - this is just a test version, but I have implemented an option to save and load your Chaos Bag - use the buttons below. I am using localStorage for that, and am not sure it will work for everyone, but please give me feedback about that!</h3>
      <h3>Click here: <button className="button button-glass" onClick={handleLoadButton}>LOAD My Chaos Bag</button> to <b>LOAD</b> your saved bag</h3>
      <h3>To <b>SAVE</b> your current bag, click here: <button className="button button-glass" onClick={saveBag}>SAVE My Chaos Bag</button></h3>
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

function Lottery({ tokensInBag, setTokensInBag, getRandomObject, handleBagClick }) {
  const [drawnToken, setDrawnToken] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInnsmouth, setIsInnsmouth] = useState(false);
  const [extraBag, setExtraBag] = useState([]);
  const timeoutRef = useRef(null);
  const wasLongPress = useRef(false);

  function handleLongPress() {
    wasLongPress.current = true;
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
      setTokensInBag( current => current.filter(item => item.id !== newDraw.id));
      if (newDraw.innsmouth === false) { 
        setExtraBag(current => {
        return [...current, newDraw];
      });
    }
    }, 2000);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }

  function cancelPressTimer() {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    wasLongPress.current = false;
  }
  
  function handlePressTimer(event) {
    event.preventDefault();
    timeoutRef.current = setTimeout(() => {
      handleLongPress();
    }, 1000);
  }

  function handleDraw() {
    if (wasLongPress.current) {
      wasLongPress.current = false;
      return;
    }
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

  function handleReturn() {
    if (extraBag.length === 0) return; 
    setTokensInBag( current => {
      const sortedTokens = [...current, ...extraBag].sort((a, b) => a.id - b.id);
      return sortedTokens;
    });
    setExtraBag(current => []);
  }

  return (
    <div className="Lottery moving-gradient">
    <button className={isAnimating || (tokensInBag.length === 0) ? 'button hidden' : 'button button-glass'} 
    onClick={handleDraw} onMouseDown={handlePressTimer} onMouseUp={cancelPressTimer}
     onMouseLeave={cancelPressTimer}
    onTouchStart={handlePressTimer}
    onTouchEnd={cancelPressTimer}>Draw Token!</button>
    <div className="drawnToken">
    <div className="drawnTokenWrapper">
      {drawnToken && (
        <>
    <img src={drawnToken.imageURL}
         width={200} 
         height={200} 
         className={isAnimating ? 'animate' : ''}
      />
      {(isInnsmouth) && (
      <div className="overlayText">
        <h2>Token removed</h2>
      </div>
      )}
      </>
      )}
      </div>
      </div>
      {(extraBag.length !== 0) && <div>
      <button className="button button-glass extra-button" onClick={handleReturn}>Click here to return the tokens to the bag</button>
      <div className="tokenList">
      {extraBag.map((token) => (
    <img key={token.id} src={token.imageURL} height={50} width={50} alt={token.id}/>
    ))
      }
      </div>
    </div>
    }
    </div>
  );
}
