import React, { useState } from 'react';
import CustomerDNA from './CustomerDNA';

export default function CustomerDetailModal({ customer, onClose, onInteractionAdded }) {
  const [form, setForm] = useState({ channel: '', duration: '', content: '', file: null });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [aiGenerationStep, setAiGenerationStep] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((f) => ({ ...f, file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // AI Generation simulation steps
    const generationSteps = [
      'Analyzing interaction context...',
      'Generating content using AI...',
      'Performing sentiment analysis...',
      'Calculating escalation probability...',
      'Finalizing interaction data...'
    ];

    try {
      // Simulate AI generation with step-by-step progress
      for (let i = 0; i < generationSteps.length; i++) {
        setAiGenerationStep(generationSteps[i]);
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); // 1-3 seconds per step
      }

      const payload = {
        channel: form.channel,
        ...(form.duration && { duration: Number(form.duration) }),
        ...(form.content && { content: form.content }),
        ...(form.file && { file: { name: form.file.name, size: form.file.size, type: form.file.type } })
      };

      setAiGenerationStep('Saving interaction...');
      const res = await fetch(`http://localhost:3000/customers/${customer.id}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to add interaction');
      const data = await res.json();

      setAiGenerationStep('Complete! ✨');
      await new Promise(resolve => setTimeout(resolve, 500)); // Show completion briefly

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      onInteractionAdded(data);
      setForm({ channel: '', duration: '', content: '', file: null });
      // Reset file input
      const fileInput = document.getElementById('file');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
      setAiGenerationStep('');
    }
  };

  const getCustomerCharacteristics = (interactions) => {
    if (!interactions || interactions.length === 0) {
      return [{
        type: 'New Customer',
        description: 'No interaction history available',
        emoji: '🆕',
        color: '#6c757d'
      }];
    }

    const characteristics = [];
    const totalInteractions = interactions.length;
    const escalatedCount = interactions.filter(i => i.escalated).length;
    const escalationRate = escalatedCount / totalInteractions;
    const avgDuration = interactions.reduce((sum, i) => sum + (i.duration || 0), 0) / totalInteractions;
    const channels = [...new Set(interactions.map(i => i.channel))];
    const uniqueChannels = channels.length;

    // High Escalation Rate
    if (escalationRate > 0.5) {
      characteristics.push({
        type: 'High Risk Escalator',
        description: `${(escalationRate * 100).toFixed(0)}% escalation rate - Requires immediate attention and senior support`,
        emoji: '🚨',
        color: '#dc3545'
      });
    } else if (escalationRate > 0.3) {
      characteristics.push({
        type: 'The Escalator',
        description: `${(escalationRate * 100).toFixed(0)}% escalation rate - Tends to escalate issues frequently, handle with care`,
        emoji: '⚠️',
        color: '#fd7e14'
      });
    }

    // Channel Usage Patterns
    if (uniqueChannels > 3) {
      characteristics.push({
        type: 'Multi-Channel Switcher',
        description: `Uses ${uniqueChannels} different channels - Ensure consistent experience across all touchpoints`,
        emoji: '🔄',
        color: '#6f42c1'
      });
    } else if (uniqueChannels > 1) {
      characteristics.push({
        type: 'Channel Switcher',
        description: `Uses ${uniqueChannels} different channels - Prefers having multiple communication options`,
        emoji: '🔀',
        color: '#17a2b8'
      });
    }

    // Engagement Level
    if (avgDuration > 60) {
      characteristics.push({
        type: 'Deep Engagement',
        description: `Average ${avgDuration.toFixed(0)} minutes per interaction - Requires comprehensive, detailed support`,
        emoji: '🎯',
        color: '#28a745'
      });
    } else if (avgDuration > 45) {
      characteristics.push({
        type: 'High Engagement',
        description: `Average ${avgDuration.toFixed(0)} minutes per interaction - Appreciates thorough explanations`,
        emoji: '📈',
        color: '#20c997'
      });
    }

    // Interaction Volume
    if (totalInteractions > 10) {
      characteristics.push({
        type: 'Frequent User',
        description: `${totalInteractions} total interactions - Regular customer with ongoing needs`,
        emoji: '🔁',
        color: '#007bff'
      });
    }

    // Satisfaction Level
    if (escalationRate === 0 && totalInteractions > 3) {
      if (avgDuration < 15) {
        characteristics.push({
          type: 'Low Maintenance',
          description: `0% escalation, quick resolutions - Efficient, self-sufficient customer`,
          emoji: '✅',
          color: '#28a745'
        });
      } else {
        characteristics.push({
          type: 'Satisfied Customer',
          description: `0% escalation rate across ${totalInteractions} interactions - Highly satisfied with service`,
          emoji: '😊',
          color: '#28a745'
        });
      }
    }

    // Quick Resolution Pattern
    if (avgDuration < 10 && escalationRate < 0.2) {
      characteristics.push({
        type: 'Quick Resolver',
        description: `Average ${avgDuration.toFixed(0)} minutes per interaction - Prefers fast, efficient solutions`,
        emoji: '⚡',
        color: '#ffc107'
      });
    }

    // Default balanced customer
    if (characteristics.length === 0) {
      characteristics.push({
        type: 'Balanced Customer',
        description: 'Standard interaction patterns - Follow regular support procedures',
        emoji: '⚖️',
        color: '#6c757d'
      });
    }

    return characteristics;
  };

  if (!customer) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {customer.name}
            <span className="customer-id">#{customer.id}</span>
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Customer Characteristics Section */}
          <div className="characteristics-section">
            <h3>Customer Profile Characteristics</h3>
            <div className="characteristics-grid">
              {/* DNA Pattern Card */}
              <div className="characteristic-card dna-card" style={{ borderLeft: `4px solid #007bff` }}>
                <div className="characteristic-header">
                  <span className="characteristic-emoji">🧬</span>
                  <span className="characteristic-type" style={{ color: '#007bff' }}>
                    DNA Pattern
                  </span>
                </div>
                <div className="dna-card-content">
                  <CustomerDNA interactions={customer.interactions} />
                </div>
              </div>

              {/* Other Characteristics */}
              {getCustomerCharacteristics(customer.interactions).map((characteristic, index) => (
                <div key={index} className="characteristic-card" style={{ borderLeft: `4px solid ${characteristic.color}` }}>
                  <div className="characteristic-header">
                    <span className="characteristic-emoji">{characteristic.emoji}</span>
                    <span className="characteristic-type" style={{ color: characteristic.color }}>
                      {characteristic.type}
                    </span>
                  </div>
                  <p className="characteristic-description">{characteristic.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactions Section */}
          <div className="interactions-section">
            <h3>Interaction History ({customer.interactions ? customer.interactions.length : 0} total)</h3>
            {customer.interactions && customer.interactions.length > 0 ? (
              <div className="interactions-table-container">
                <table className="interactions-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Channel</th>
                      <th>Duration (min)</th>
                      <th>Sentiment</th>
                      <th>Escalated</th>
                      <th>Content</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.interactions.map((interaction, idx) => (
                      <tr key={idx}>
                        <td>{interaction.date ? new Date(interaction.date).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <span className={`channel-badge ${interaction.channel}`}>
                            {interaction.channel}
                          </span>
                        </td>
                        <td>{interaction.duration}</td>
                        <td>
                          <span className={`sentiment-badge ${interaction.sentiment?.replace(' ', '-')}`}>
                            {interaction.sentiment}
                          </span>
                        </td>
                        <td>
                          <span className={`escalation-badge ${interaction.escalated ? 'escalated' : 'resolved'}`}>
                            {interaction.escalated ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="content-cell">
                          <div>
                            {interaction.aiGenerated && (
                              <div className="ai-generated-badge">
                                🤖 AI Generated
                              </div>
                            )}
                            {interaction.content || 'N/A'}
                            {interaction.file && (
                              <div className="file-attachment">
                                📎 {interaction.file.name} ({Math.round(interaction.file.size / 1024)}KB)
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-interactions">No interactions recorded yet.</p>
            )}
          </div>

          {/* Add Interaction Section */}
          <div className="add-interaction-section">
            <h3>Add New Interaction</h3>
            <p className="form-description">
              🤖 AI-Powered Interaction Generator: Provide channel and duration. AI will generate realistic content, sentiment analysis, and escalation probability automatically.
            </p>
            <form className="interaction-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="channel">Channel *</label>
                  <select
                    id="channel"
                    name="channel"
                    value={form.channel}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select channel</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="chat">Chat</option>
                    <option value="social">Social</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="duration">Duration (min)</label>
                  <input
                    id="duration"
                    type="number"
                    name="duration"
                    min="1"
                    placeholder="Duration"
                    value={form.duration}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="file">File Attachment - Optional</label>
                <input
                  id="file"
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                />
                {form.file && (
                  <div className="file-preview">
                    Selected: {form.file.name} ({Math.round(form.file.size / 1024)}KB)
                  </div>
                )}
              </div>
              <div className="form-actions">
                {!submitting && !showSuccess ? (<button type="submit" disabled={submitting} className="submit-btn">
                    Add Interaction
                </button>) : null}


                {submitting && aiGenerationStep && (
                  <div className="ai-generation-progress">
                    <div className="ai-icon">🤖</div>
                    <div className="generation-step">
                      <span className="step-text">{aiGenerationStep}</span>
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                {showSuccess && (
                  <div className="success-animation">
                    <div className="success-icon">✨</div>
                    <span>Interaction generated successfully!</span>
                  </div>
                )}
              </div>
              {error && <div className="error-message">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
