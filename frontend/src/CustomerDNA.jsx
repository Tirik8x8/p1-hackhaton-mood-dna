import React from 'react';

export default function CustomerDNA({ interactions }) {
    const generateDNA = (interactions) => {
        if (!interactions || interactions.length === 0) {
            return {
                behavioral: [{ emoji: '🔷', tooltip: 'New customer with no interaction history' }],
                communication: [],
                patterns: [],
                analysis: {
                    totalInteractions: 0,
                    escalationRate: 0,
                    avgDuration: 0,
                    uniqueChannels: 0,
                    dominantSentiment: 'None'
                }
            };
        }

        const behavioralDNA = [];
        const communicationDNA = [];
        const patternDNA = [];

        // Analyze patterns
        const totalInteractions = interactions.length;
        const escalatedCount = interactions.filter(i => i.escalated).length;
        const escalationRate = escalatedCount / totalInteractions;

        // Calculate average duration
        const avgDuration = interactions.reduce((sum, i) => sum + (i.duration || 0), 0) / totalInteractions;

        // Count sentiment patterns
        const sentimentCounts = interactions.reduce((acc, i) => {
            const sentiment = i.sentiment || 'neutral';
            acc[sentiment] = (acc[sentiment] || 0) + 1;
            return acc;
        }, {});

        // Count channel usage
        const channels = interactions.map(i => i.channel);
        const uniqueChannels = [...new Set(channels)];
        const channelCounts = channels.reduce((acc, channel) => {
            acc[channel] = (acc[channel] || 0) + 1;
            return acc;
        }, {});

        // Find dominant sentiment
        const dominantSentiment = Object.entries(sentimentCounts)
            .sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral';

        // Generate Behavioral DNA (sentiment and duration patterns)
        for (let i = 0; i < Math.min(totalInteractions, 6); i++) {
            const interaction = interactions[i];
            const interactionNum = i + 1;

            // Sentiment-based icons
            if (interaction.sentiment) {
                switch (interaction.sentiment) {
                    case 'very positive':
                    case 'positive':
                    case 'slightly positive':
                    case 'satisfied':
                    case 'excited':
                    case 'grateful':
                        behavioralDNA.push({
                            emoji: '🟩',
                            tooltip: `Interaction ${interactionNum}: ${interaction.sentiment} sentiment (${interaction.duration}min via ${interaction.channel})`
                        });
                        break;
                    case 'very negative':
                    case 'negative':
                    case 'slightly negative':
                    case 'angry':
                    case 'frustrated':
                    case 'disappointed':
                        behavioralDNA.push({
                            emoji: '🟥',
                            tooltip: `Interaction ${interactionNum}: ${interaction.sentiment} sentiment (${interaction.duration}min via ${interaction.channel})`
                        });
                        break;
                    case 'confused':
                    case 'curious':
                        behavioralDNA.push({
                            emoji: '🟨',
                            tooltip: `Interaction ${interactionNum}: ${interaction.sentiment} - customer needed clarification (${interaction.duration}min via ${interaction.channel})`
                        });
                        break;
                    default:
                        behavioralDNA.push({
                            emoji: '🟦',
                            tooltip: `Interaction ${interactionNum}: ${interaction.sentiment || 'neutral'} sentiment (${interaction.duration}min via ${interaction.channel})`
                        });
                }
            } else {
                behavioralDNA.push({
                    emoji: '🟦',
                    tooltip: `Interaction ${interactionNum}: neutral sentiment (${interaction.duration}min via ${interaction.channel})`
                });
            }

            // Duration-based patterns
            if (interaction.duration > 60) {
                behavioralDNA.push({
                    emoji: '🟪',
                    tooltip: `Long conversation: ${interaction.duration} minutes - customer needed extensive support`
                });
            } else if (interaction.duration < 10) {
                behavioralDNA.push({
                    emoji: '🟫',
                    tooltip: `Quick interaction: ${interaction.duration} minutes - simple query resolved fast`
                });
            }
        }

        // Generate Communication DNA (channel preferences)
        const sortedChannels = Object.entries(channelCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4); // Top 4 most used channels

        sortedChannels.forEach(([channel, count]) => {
            if (count > 0) {
                const percentage = ((count / totalInteractions) * 100).toFixed(0);
                switch (channel) {
                    case 'email':
                        communicationDNA.push({
                            emoji: '✉️',
                            tooltip: `Email: ${count} interactions (${percentage}% of total) - prefers written communication`
                        });
                        break;
                    case 'phone':
                        communicationDNA.push({
                            emoji: '📞',
                            tooltip: `Phone: ${count} calls (${percentage}% of total) - prefers voice communication`
                        });
                        break;
                    case 'chat':
                        communicationDNA.push({
                            emoji: '💬',
                            tooltip: `Chat: ${count} sessions (${percentage}% of total) - likes instant messaging`
                        });
                        break;
                    case 'social':
                        communicationDNA.push({
                            emoji: '📱',
                            tooltip: `Social: ${count} interactions (${percentage}% of total) - uses social media for support`
                        });
                        break;
                    default:
                        communicationDNA.push({
                            emoji: '🔗',
                            tooltip: `${channel}: ${count} interactions (${percentage}% of total)`
                        });
                }
            }
        });

        // Generate Pattern DNA (behavioral indicators)
        if (escalationRate > 0.5) {
            patternDNA.push({
                emoji: '⚠️',
                tooltip: `High escalation rate: ${(escalationRate * 100).toFixed(0)}% of interactions escalated - requires careful handling`
            });
        }

        if (uniqueChannels.length > 3) {
            patternDNA.push({
                emoji: '🔄',
                tooltip: `Channel switcher: Uses ${uniqueChannels.length} different channels - ensure consistent experience`
            });
        }

        if (avgDuration > 45) {
            patternDNA.push({
                emoji: '🎯',
                tooltip: `High engagement: Average ${avgDuration.toFixed(0)} minutes per interaction - appreciates detailed support`
            });
        }

        if (escalationRate === 0 && totalInteractions > 3) {
            patternDNA.push({
                emoji: '✅',
                tooltip: `Satisfied customer: ${totalInteractions} interactions with 0% escalation rate - low maintenance`
            });
        }

        return {
            behavioral: behavioralDNA,
            communication: communicationDNA,
            patterns: patternDNA,
            analysis: {
                totalInteractions,
                escalationRate: (escalationRate * 100).toFixed(1),
                avgDuration: avgDuration.toFixed(1),
                uniqueChannels: uniqueChannels.length,
                dominantSentiment,
                channelBreakdown: sortedChannels.map(([channel, count]) => ({
                    channel,
                    count,
                    percentage: ((count / totalInteractions) * 100).toFixed(0)
                }))
            }
        };
    };

    const getDNADescription = (interactions) => {
        if (!interactions || interactions.length === 0) {
            return 'New customer - no interaction history';
        }

        const totalInteractions = interactions.length;
        const escalatedCount = interactions.filter(i => i.escalated).length;
        const escalationRate = escalatedCount / totalInteractions;
        const avgDuration = interactions.reduce((sum, i) => sum + (i.duration || 0), 0) / totalInteractions;
        const channels = [...new Set(interactions.map(i => i.channel))];

        // Determine customer type
        if (escalationRate > 0.3) {
            return 'The Escalator - Tends to escalate issues frequently';
        } else if (avgDuration > 45) {
            return 'High Engagement - Prefers detailed conversations';
        } else if (channels.length > 2) {
            return 'Channel Switcher - Uses multiple communication channels';
        } else if (escalationRate === 0 && avgDuration < 20) {
            return 'Low Maintenance - Quick, satisfied interactions';
        } else {
            return 'Balanced Customer - Standard interaction patterns';
        }
    };

    const dnaComponents = generateDNA(interactions);
    const description = getDNADescription(interactions);

    const renderDNASequence = (dnaArray, sectionClass) => {
        return dnaArray.map((item, index) => (
            <span
                key={index}
                className={`dna-emoji ${sectionClass}-emoji`}
                title={item.tooltip}
                data-tooltip={item.tooltip}
            >
                {item.emoji}
            </span>
        ));
    };

    return (
        <div className="dna-container">


            {/* Detailed Analysis Section */}
            <div className="dna-analysis">
                <div className="analysis-summary">
                    <strong>Analysis:</strong> {dnaComponents.analysis.totalInteractions} interactions,
                    {dnaComponents.analysis.escalationRate}% escalation rate,
                    {dnaComponents.analysis.avgDuration}min avg duration
                </div>
                {dnaComponents.analysis.channelBreakdown.length > 0 && (
                    <div className="channel-breakdown">
                        <strong>Channels:</strong> {
                            dnaComponents.analysis.channelBreakdown
                                .map(({ channel, percentage }) => `${channel} (${percentage}%)`)
                                .join(', ')
                        }
                    </div>
                )}
                <div className="sentiment-info">
                    <strong>Dominant Sentiment:</strong> {dnaComponents.analysis.dominantSentiment}
                </div>
            </div>

            <div
                className="customer-dna"
                style={{
                    cursor: 'default',
                    display: 'inline-block'
                }}
            >
                <div className="dna-section behavioral-dna" title="Behavioral Patterns">
                    <span className="dna-label">Behavior:</span>
                    <span className="dna-sequence">
                        {renderDNASequence(dnaComponents.behavioral, 'behavioral')}
                    </span>
                </div>
                {dnaComponents.communication.length > 0 && (
                    <div className="dna-section communication-dna" title="Communication Channels">
                        <span className="dna-label">Channels:</span>
                        <span className="dna-sequence">
                            {renderDNASequence(dnaComponents.communication, 'communication')}
                        </span>
                    </div>
                )}
                {dnaComponents.patterns.length > 0 && (
                    <div className="dna-section patterns-dna" title="Special Patterns">
                        <span className="dna-label">Patterns:</span>
                        <span className="dna-sequence">
                            {renderDNASequence(dnaComponents.patterns, 'patterns')}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
