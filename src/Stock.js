import React from 'react';
import Plot from 'react-plotly.js';

class Stock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      API_KEY : 'HGJWFG4N8AQ66ICD',
      USDToILS:"hello",
      stockChartXValues: [],
      stockChartYValues: [],
    }
  }

  componentDidMount() {
    this.fetchExchangeRate()
    this.fetchStock();
  }

  fetchExchangeRate(){
    const pointerToThis = this;
    let exchangeRateCall = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=ILS&apikey=${this.API_KEY}`
    fetch(exchangeRateCall)
      .then(
        function(response) {
          return response.json();
        }
      )
      .then(
        function(data) {
          console.log(data);
          console.log((data["Realtime Currency Exchange Rate"])["5. Exchange Rate"]);
          pointerToThis.setState({USDToILS:data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]});
          console.log(pointerToThis.state)
        }
      )
  }

  fetchStock() {
    const pointerToThis = this;
    console.log(this.USDToILS);
    console.log(pointerToThis);
    let StockSymbol = 'ESLT';
    let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${StockSymbol}&interval=5min&outputsize=full&apikey=${this.API_KEY}`;
    let stockChartXValuesFunction = [];
    let stockChartYValuesFunction = [];

    fetch(API_Call)
      .then(
        function(response) {
          return response.json();
        }
      )
      .then(
        function(data) {
          console.log(data);

          for (var key in data['Time Series (5min)']) {
            stockChartXValuesFunction.push(key);
            stockChartYValuesFunction.push(data['Time Series (5min)'][key]['1. open']*pointerToThis.state.USDToILS);
          }

          // console.log(stockChartXValuesFunction);
          pointerToThis.setState({
            stockChartXValues: stockChartXValuesFunction,
            stockChartYValues: stockChartYValuesFunction
          });
        }
      )
  }

  render() {
    return (
      <div>
        <h1>שוק מניות אסף ברבי</h1>
        <Plot
          data={[
            {
              x: this.state.stockChartXValues,
              y: this.state.stockChartYValues,
              type: 'scatter',
              mode: 'lines+markers',
              marker: {color: 'red'},
            }
          ]}
          layout={{width: 1280, height: 720, title: 'מניית אלביט'}}
        />
      </div>
    )
  }
}

export default Stock;