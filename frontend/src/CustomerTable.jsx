import React from 'react';
import CustomerDNA from './CustomerDNA';

export default function CustomerTable({ customers, onCustomerClick }) {
  return (
    <div className="customer-table-container">
      <table className="customer-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>DNA Pattern</th>
            <th>Interactions Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="customer-row">
              <td>#{customer.id}</td>
              <td className="customer-name">{customer.name}</td>
              <td className="customer-dna-cell">
                <CustomerDNA interactions={customer.interactions} />
              </td>
              <td>{customer.interactions ? customer.interactions.length : 0}</td>
              <td>
                <button
                  className="view-details-btn"
                  onClick={() => onCustomerClick(customer)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
