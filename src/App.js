import React, { Component } from 'react';
import logo from './Bitcoin_logo.svg';
import './App.css';
import debugout from './debugout.js';

const ccxt = require('ccxt')

const bitfinex = new ccxt.bitfinex();
const bittrex = new ccxt.bittrex();
const southxchange = new ccxt.southxchange();
const cex = new ccxt.cex();
const bleutrade = new ccxt.bleutrade();
const kraken = new ccxt.kraken();
const kucoin = new ccxt.kucoin();
const binance = new ccxt.binance();

binance.proxy = 'https://cors-anywhere.herokuapp.com/';
bitfinex.proxy = 'https://cors-anywhere.herokuapp.com/';
kucoin.proxy = 'https://cors-anywhere.herokuapp.com/';
bittrex.proxy = 'https://cors-anywhere.herokuapp.com/';
southxchange.proxy = 'https://cors-anywhere.herokuapp.com/';
cex.proxy = 'https://cors-anywhere.herokuapp.com/';
bleutrade.proxy = 'https://cors-anywhere.herokuapp.com/';
kraken.proxy = 'https://cors-anywhere.herokuapp.com/';

// binance.fetchBalance().then(res => console.log('balance binance   ----> ',res));
// kucoin.fetchBalance().then(res => console.log('balance kucoin  ----> ',res));

const bugout = new debugout();

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      bitfinex: {ask: 0, bid: 0},
      binance: {ask: 0, bid: 0},
      kucoin: {ask: 0, bid: 0},
      bittrex: {ask: 0, bid: 0},
      southxchange: {ask: 0, bid: 0},
      cex: {ask: 0, bid: 0},
      bleutrade: {ask: 0, bid: 0},
      kraken: {ask: 0, bid: 0},
      opportunity: null,
      spread: null
    };
    this.timeInterval();

  }

  prova = async () => {
    let binance_prices = await binance.fetchTicker('BTC/USDT');
    let kucoin_prices = await kucoin.fetchTicker('BTC/USDT');
    let bittrex_prices = await bittrex.fetchTicker('BTC/USDT');
    let bleutrade_prices = await bleutrade.fetchTicker('BTC/USDT');
    let bitfinex_prices = await bitfinex.fetchTicker('BTC/USD');
    let southxchange_prices = await southxchange.fetchTicker('BTC/USD');
    let cex_prices = await cex.fetchTicker('BTC/USD');
    let kraken_prices = await kraken.fetchTicker('BTC/USD');
    this.setState((state) => {
      return {
        bitfinex: {ask: bitfinex_prices.ask, bid: bitfinex_prices.bid},
        binance: {ask: binance_prices.ask, bid: binance_prices.bid},
        kucoin: {ask: kucoin_prices.ask, bid: kucoin_prices.bid},
        bittrex: {ask: bittrex_prices.ask, bid: bittrex_prices.bid},
        southxchange: {ask: southxchange_prices.ask, bid: southxchange_prices.bid},
        cex: {ask: cex_prices.ask, bid: cex_prices.bid},
        bleutrade: {ask: bleutrade_prices.ask, bid: bleutrade_prices.bid},
        kraken: {ask: kraken_prices.ask, bid: kraken_prices.bid},
      }
    });
    if ((this.state.binance.ask > this.state.bitfinex.bid * 1.01) || (this.state.bitfinex.ask > this.state.binance.bid * 1.01)) {
      this.setState((state) => {
        return {opportunity: true}
      });
      this.calculateProfit();
    }
    else this.setState((state) => {
      return {opportunity: false, spread: null}
    });
  };

  calculateProfit = () => {
    const spread = this.state.binance.ask > this.state.bitfinex.bid ? 
    (((this.state.binance.ask - this.state.bitfinex.bid) / this.state.bitfinex.bid) * 100) :
    (((this.state.bitfinex.ask - this.state.binance.bid) / this.state.binance.bid) * 100)
    this.setState((state) => {
      return {spread: spread}
    });
    bugout.log(this.state)
    bugout.log(new Date())
    bugout.log('--------------')
  }

  timeInterval = () => {
    setInterval(this.prova, 300000);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        <button type="button" style={{'marginBottom': '60px'}} onClick={() => bugout.downloadLog()}>Download logs</button>
          <img src={logo} style={{height: '40px'}} className="App-logo" alt="logo" />
          <h4>Ask</h4>
          <ul style={{'textAlign': 'left', 'color': 'grey', fontSize: '18px'}}>
            <li className="tether">Binance: {this.state.binance.ask} usdt</li>
            <li className="tether">Kucoin: {this.state.kucoin.ask.toFixed(2)} usdt</li>
            <li className="tether">bittrex: {this.state.bittrex.ask.toFixed(2)} usdt</li>
            <li className="tether">bleutrade: {this.state.bleutrade.ask.toFixed(2)} usdt</li>
            <li className="dolar">Bitfinex: {this.state.bitfinex.ask} usd</li>
            <li className="dolar">southxchange: {this.state.southxchange.ask.toFixed(2)} usd</li>
            <li className="dolar">cex: {this.state.cex.ask.toFixed(2)} usd</li>
            <li className="dolar">kraken: {this.state.kraken.ask.toFixed(2)} usd</li>
          </ul>
          <h4>Bid</h4>
          <ul style={{'textAlign': 'left', 'color': 'grey', fontSize: '18px'}}>
            <li className="tether">Binance: {this.state.binance.bid} usdt</li>
            <li className="tether">Kucoin: {this.state.kucoin.bid.toFixed(2)} usdt</li>
            <li className="tether">bittrex: {this.state.bittrex.bid.toFixed(2)} usdt</li>
            <li className="tether">bleutrade: {this.state.bleutrade.bid.toFixed(2)} usdt</li>
            <li className="dolar">Bitfinex: {this.state.bitfinex.bid} usd</li>
            <li className="dolar">southxchange: {this.state.southxchange.bid.toFixed(2)} usd</li>
            <li className="dolar">cex: {this.state.cex.bid.toFixed(2)} usd</li>
            <li className="dolar">kraken: {this.state.kraken.bid.toFixed(2)} usd</li>
          </ul>
          {this.state.opportunity && this.state.spread && <p>Opportunity found! {this.state.spread.toFixed(2)} %</p>}
        </header>
      </div>
    );
  }
}

export default App;
