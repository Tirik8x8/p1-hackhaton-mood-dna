import React from 'react';

export default function DNALegend() {
  return (
    <div className="dna-legend">
      <div className="dna-legend-title">Customer DNA Legend</div>

      <div className="legend-section">
        <h4 className="legend-section-title">Behavioral Patterns</h4>
        <div className="legend-items">
          <div className="dna-legend-item">🟩 Positive sentiment</div>
          <div className="dna-legend-item">🟥 Negative sentiment</div>
          <div className="dna-legend-item">🟨 Confused/Curious</div>
          <div className="dna-legend-item">🟦 Neutral sentiment</div>
          <div className="dna-legend-item">🟪 Long conversations (60+ min)</div>
          <div className="dna-legend-item">🟫 Very short interactions (&lt;10 min)</div>
        </div>
      </div>

      <div className="legend-section">
        <h4 className="legend-section-title">Communication Channels</h4>
        <div className="legend-items">
          <div className="dna-legend-item">✉️ Email interactions</div>
          <div className="dna-legend-item">📞 Phone calls</div>
          <div className="dna-legend-item">💬 Live chat</div>
          <div className="dna-legend-item">📱 Social media</div>
        </div>
      </div>

      <div className="legend-section">
        <h4 className="legend-section-title">Special Patterns</h4>
        <div className="legend-items">
          <div className="dna-legend-item">⚠️ High escalation rate (&gt;50%)</div>
          <div className="dna-legend-item">🔄 Channel switcher (3+ channels)</div>
          <div className="dna-legend-item">🎯 Focused interactions (45+ min avg)</div>
          <div className="dna-legend-item">✅ Satisfied customer (no escalations)</div>
        </div>
      </div>
    </div>
  );
}
