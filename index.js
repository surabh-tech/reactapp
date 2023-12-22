import React, { useState, useEffect } from 'react';

const TransactionsTable = () => {
  const [month, setMonth] = useState('03'); // Default to March
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/transactions?month=${month}&search=${search}&page=${currentPage}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const loadNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const loadPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [month, search, currentPage]);

  return (
    <div>
      <label htmlFor="month">Select Month:</label>
      <select id="month" onChange={handleMonthChange} value={month}>
        {/* Options here */}
      </select>

      <input type="text" placeholder="Search transaction" value={search} onChange={handleSearchChange} />

      <button onClick={fetchTransactions}>Load Transactions</button>

      <table>
        {/* Table headers */}
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        {/* Table body */}
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.price}</td>
              {/* Add more columns as needed */}
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={loadPreviousPage}>Previous</button>
        <button onClick={loadNextPage}>Next</button>
      </div>
    </div>
  );
};

export default TransactionsTable;
