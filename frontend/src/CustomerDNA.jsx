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

        // Generate Behavioral DNA (sentiment and duration patterns) - limited to 4 interactions
        for (let i = 0; i < Math.min(totalInteractions, 4); i++) {
            const interaction = interactions[i];

            // Sentiment-based icons only
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
                            tooltip: `Interaction ${i + 1}: ${interaction.sentiment} sentiment (${interaction.duration}min via ${interaction.channel})`
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
                            tooltip: `Interaction ${i + 1}: ${interaction.sentiment} sentiment (${interaction.duration}min via ${interaction.channel})`
                        });
                        break;
                    case 'confused':
                    case 'curious':
                        behavioralDNA.push({
                            emoji: '🟨',
                            tooltip: `Interaction ${i + 1}: ${interaction.sentiment} - customer needed clarification (${interaction.duration}min via ${interaction.channel})`
                        });
                        break;
                    default:
                        behavioralDNA.push({
                            emoji: '🟦',
                            tooltip: `Interaction ${i + 1}: ${interaction.sentiment || 'neutral'} sentiment (${interaction.duration}min via ${interaction.channel})`
                        });
                }
            } else {
                behavioralDNA.push({
                    emoji: '🟦',
                    tooltip: `Interaction ${i + 1}: neutral sentiment (${interaction.duration}min via ${interaction.channel})`
                });
            }
        }

        // Generate Communication DNA (top 2 channels only)
        const sortedChannels = Object.entries(channelCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 2); // Only top 2 channels

        sortedChannels.forEach(([channel, count]) => {
            if (count > 1) { // Only if used more than once
                switch (channel) {
                    case 'email':
                        communicationDNA.push({
                            emoji: '✉️',
                            tooltip: `Email: ${count} interactions (${((count / totalInteractions) * 100).toFixed(0)}% of total) - prefers written communication`
                        });
                        break;
                    case 'phone':
                        communicationDNA.push({
                            emoji: '📞',
                            tooltip: `Phone: ${count} calls (${((count / totalInteractions) * 100).toFixed(0)}% of total) - prefers voice communication`
                        });
                        break;
                    case 'chat':
                        communicationDNA.push({
                            emoji: '💬',
                            tooltip: `Chat: ${count} sessions (${((count / totalInteractions) * 100).toFixed(0)}% of total) - likes instant messaging`
                        });
                        break;
                    case 'social':
                        communicationDNA.push({
                            emoji: '📱',
                            tooltip: `Social: ${count} interactions (${((count / totalInteractions) * 100).toFixed(0)}% of total) - uses social media for support`
                        });
                        break;
                }
            }
        });

        // Generate simplified pattern indicators
        if (escalationRate > 0.3) {
            patternDNA.push({
                emoji: '⚠️',
                tooltip: `High escalation rate: ${(escalationRate * 100).toFixed(0)}% of interactions escalated - requires careful handling`
            });
        }

        if (avgDuration > 45) {
            patternDNA.push({
                emoji: '🕐',
                tooltip: `High engagement: Average ${avgDuration.toFixed(0)} minutes per interaction - appreciates detailed support`
            });
        }

        if (escalationRate === 0 && totalInteractions > 2) {
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
                escalationRate: (escalationRate * 100).toFixed(0),
                avgDuration: avgDuration.toFixed(0),
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
        <div className="dna-container mini">
            <div className="customer-dna mini">
                <div className="dna-compact">
                    {renderDNASequence(dnaComponents.behavioral, 'behavioral')}
                    {dnaComponents.communication.length > 0 && (
                        <>
                            <span className="dna-separator">|</span>
                            {renderDNASequence(dnaComponents.communication, 'communication')}
                        </>
                    )}
                    {dnaComponents.patterns.length > 0 && (
                        <>
                            <span className="dna-separator">|</span>
                            {renderDNASequence(dnaComponents.patterns, 'patterns')}
                        </>
                    )}
                </div>
            </div>

            <div className="dna-mini-stats">
                <div className="stats-primary">
                    {dnaComponents.analysis.totalInteractions} interactions • {dnaComponents.analysis.escalationRate}% escalation • {dnaComponents.analysis.avgDuration}min avg
                </div>
                <div className="stats-secondary">
                    {dnaComponents.analysis.uniqueChannels} channels • {dnaComponents.analysis.dominantSentiment} sentiment
                    {dnaComponents.analysis.channelBreakdown.length > 0 && (
                        <span className="channel-summary">
                            {' • '}{dnaComponents.analysis.channelBreakdown
                                .map(({channel, percentage}) => `${channel} ${percentage}%`)
                                .join(', ')}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
