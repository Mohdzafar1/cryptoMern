import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { FaCoins, FaChartLine, FaArrowUp, FaChartBar } from "react-icons/fa";

// const socket = io("http://localhost:8080")
const socket=io('https://crypto-mern.vercel.app')

const App = () => {
    const [cryptoData, setCryptoData] = useState([]);
  
    useEffect(() => {
        socket.on("crypto", (data) => {
          console.log("Received Data:", data?.data?.ticker); 
      
          // Extract the first 4 symbols from the data
          const updatedData = data?.data?.ticker?.slice(0, 4) || [];
      
          // Sort the data alphabetically by the `symbol` field
          const sortedData = updatedData.sort((a, b) => a.symbol.localeCompare(b.symbol));
      
          setCryptoData(sortedData); // Set the sorted data
        });
      
        return () => {
          socket.off("crypto");
        };
      }, []);
    return (
      <div className="container mt-5">
        <h1 className="text-center text-white mb-4">Real-Time Crypto Data</h1>
        <div className="row">
          {cryptoData.length > 0 ? (
            cryptoData.map((crypto, index) => (
              <div key={index} className="col-md-3 d-flex justify-content-center mb-4">
                <div className="card text-white bg-dark shadow w-100" style={{ minHeight: "250px" }}>
                  <div className="card-header d-flex align-items-center">
                    <FaCoins className="me-2" size={20} />
                    <strong>{crypto.symbol}</strong>
                  </div>
                  <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="card-title d-flex align-items-center">
                      <FaChartLine className="me-2 text-success"/>
                      Last Price: ${crypto.last}
                    </h5>
                    <p className="card-text d-flex align-items-center">
                      <FaArrowUp className="me-2 text-warning" />
                      Change Rate: {crypto.changeRate}%
                    </p>
                    <p className="card-text d-flex align-items-center">
                      <FaChartBar className="me-2 text-info" />
                      Volume: {crypto.vol}
                    </p>
                    <p className="card-text">
                      High: {crypto.high} | Low: {crypto.low}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">Loading crypto data...</p>
          )}
        </div>

      <div className="container mt-5 pb-5">
      <h1 className="text-center text-white mb-4">Real-Time Crypto Data</h1>
      {cryptoData.length > 0 ? (
        <table className="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">
                <FaCoins className="me-2" />
                Symbol
              </th>
              <th scope="col">
                <FaChartLine className="me-2 text-success" />
                Last Price
              </th>
              <th scope="col">
                <FaArrowUp className="me-2 text-warning" />
                Change Rate
              </th>
              <th scope="col">
                <FaChartBar className="me-2 text-info" />
                Volume
              </th>
              <th scope="col">High</th>
              <th scope="col">Low</th>
            </tr>
          </thead>
          <tbody>
            {cryptoData.map((crypto, index) => (
              <tr key={index}>
                <td>{crypto.symbol}</td>
                <td>${crypto.last}</td>
                <td>{crypto.changeRate}%</td>
                <td>{crypto.vol}</td>
                <td>{crypto.high}</td>
                <td>{crypto.low}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-muted">Loading crypto data...</p>
      )}
    </div>
      </div>
    );
  };
  
  export default App;