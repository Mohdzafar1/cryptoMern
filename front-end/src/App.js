import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8080"); // Change to your backend URL in production

const App = () => {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    socket.on("crypto", (data) => {
      console.log("Received Data:", data?.data?.ticker); // Debugging
      setCryptoData(data?.data?.ticker || []);
    });

    return () => {
      socket.off("crypto");
    };
  }, []);

  // Define the columns to show
  const tableHeaders = ["symbol", "last", "changeRate", "high", "low", "vol"];

  return (
    <div className="min-h-screen bg-gray-900 text-black p-5">
      <h1 className="text-3xl font-bold mb-4">Real-Time Crypto Data</h1>
      <div className="overflow-auto max-h-[80vh]">
        <table className="w-full border border-gray-700 text-left text-sm">
          <thead>
            <tr className="bg-gray-800">
              {tableHeaders.map((header) => (
                <th key={header} className="p-2 border border-gray-700 capitalize">
                  {header.replace(/([A-Z])/g, " $1")} {/* Convert camelCase to readable format */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cryptoData.length > 0 ? (
              cryptoData.slice(0, 15).map((item, index) => (
                <tr key={index} className="border border-gray-700 hover:bg-gray-800 transition">
                  {tableHeaders.map((header) => (
                    <td key={header} className="p-2 text-center">
                      {typeof item[header] === "boolean"
                        ? item[header].toString()
                        : item[header] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center p-4 text-gray-400">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
