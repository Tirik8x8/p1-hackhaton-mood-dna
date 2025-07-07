import React, { useState } from 'react';
import CustomerDNA from './CustomerDNA';

export default function CustomerCard({ customer, onInteractionAdded }) {
  const [form, setForm] = useState({ channel: '', duration: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/customers/${customer.id}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: form.channel,
          duration: Number(form.duration),
          content: form.content,
        }),
      });
      if (!res.ok) throw new Error('Failed to add interaction');
      const data = await res.json();
      onInteractionAdded(data);
      setForm({ channel: '', duration: '', content: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="customer-card">
      <h2>
        {customer.name} <span style={{ fontSize: '0.8em', color: '#888' }}>#{customer.id}</span>
        <span style={{ marginLeft: '1em', fontSize: '1.2em' }}>
          <CustomerDNA interactions={customer.interactions} />
        </span>
      </h2>
      <h3>Interactions:</h3>
      {customer.interactions && customer.interactions.length > 0 ? (
        <table className="interactions-table">
          <thead>
            <tr>
              <th>Channel</th>
              <th>Duration (min)</th>
              <th>Sentiment</th>
              <th>Escalated</th>
            </tr>
          </thead>
          <tbody>
            {customer.interactions.map((i, idx) => (
              <tr key={idx}>
                <td>{i.channel}</td>
                <td>{i.duration}</td>
                <td>{i.sentiment}</td>
                <td>{i.escalated ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No interactions.</p>
      )}
      <form className="interaction-form" onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <h4>Add Interaction</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <select name="channel" value={form.channel} onChange={handleChange} required>
            <option value="">Select channel</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="chat">Chat</option>
            <option value="social">Social</option>
          </select>
          <input
            type="number"
            name="duration"
            min="1"
            placeholder="Duration (min)"
            value={form.duration}
            onChange={handleChange}
            required
            style={{ width: '120px' }}
          />
          <input
            type="text"
            name="content"
            placeholder="Interaction content"
            value={form.content}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={submitting} style={{ minWidth: '120px' }}>
            {submitting ? 'Adding...' : 'Add'}
          </button>
        </div>
        {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
      </form>
    </div>
  );
}
