import { useEffect, useState } from 'react';
import CustomerTable from './CustomerTable';
import CustomerDetailModal from './CustomerDetailModal';
import DNALegend from './DNALegend';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/customers')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch customers');
        return res.json();
      })
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
  };

  const handleInteractionAdded = (interaction) => {
    setCustomers(prev => prev.map(c =>
      c.id === selectedCustomer.id
        ? { ...c, interactions: [...c.interactions, interaction] }
        : c
    ));
    // Update the selected customer as well
    setSelectedCustomer(prev => ({
      ...prev,
      interactions: [...prev.interactions, interaction]
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <header className="app-header">
        <h1>Customer DNA System</h1>
        <p className="app-description">
          Track customer interactions and analyze behavior patterns through DNA visualization
        </p>
      </header>

      <DNALegend />

      <main className="main-content">
        {customers.length === 0 ? (
          <div className="no-customers">
            <p>No customers found.</p>
          </div>
        ) : (
          <CustomerTable
            customers={customers}
            onCustomerClick={handleCustomerClick}
          />
        )}
      </main>

      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={handleCloseModal}
          onInteractionAdded={handleInteractionAdded}
        />
      )}
    </div>
  );
}

export default App;
