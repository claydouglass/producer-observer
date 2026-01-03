import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, MicOff, Send, Volume2, VolumeX, Bot, User, Loader } from 'lucide-react';

// Simulated VP responses based on context
const generateVPResponse = (message, retailer, rep, territory) => {
  const lowerMessage = message.toLowerCase();

  // Retailer-specific queries
  if (retailer) {
    if (lowerMessage.includes('what should i know') || lowerMessage.includes('brief me')) {
      const points = [];
      if (retailer.isUrgent) {
        points.push(`URGENT: ${retailer.name} is overdue for an order. They usually order every ${retailer.orderFrequencyDays} days, but it's been ${retailer.daysSinceOrder} days.`);
      }
      if (retailer.healthTrend === 'declining') {
        points.push(`Their relationship health is trending down - currently at ${retailer.healthScore}/100. Worth investigating what's changed.`);
      }
      if (retailer.performance) {
        const declining = Object.entries(retailer.performance.categories)
          .filter(([_, d]) => d.trend < -10)
          .map(([cat, _]) => cat);
        if (declining.length > 0) {
          points.push(`${declining.join(' and ')} sales are declining here. Might be worth asking why.`);
        }
      }
      if (retailer.contacts?.[0]) {
        points.push(`Your contact is ${retailer.contacts[0].name}, the ${retailer.contacts[0].role}. They prefer ${retailer.contacts[0].preferredTime} visits.`);
      }
      if (retailer.lastVisit?.notes) {
        points.push(`Last visit note: "${retailer.lastVisit.notes}" - good to follow up on this.`);
      }
      return points.length > 0
        ? `Here's what you need to know about ${retailer.name}:\n\n${points.map((p, i) => `${i + 1}. ${p}`).join('\n\n')}`
        : `${retailer.name} looks healthy at ${retailer.healthScore}/100. Standard restock visit - their average order is $${retailer.avgOrderValue}. Any specific questions?`;
    }

    if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return `${retailer.name} has a solid payment history. They've consistently paid within terms. YTD they've generated $${(retailer.ytdWholesale / 1000).toFixed(1)}k in wholesale value for us.`;
    }

    if (lowerMessage.includes('issue') || lowerMessage.includes('problem') || lowerMessage.includes('concern')) {
      if (retailer.healthScore < 60) {
        return `Yes, there are some concerns. ${retailer.name}'s health score is ${retailer.healthScore}/100 and ${retailer.healthTrend}. They may be pulling back - worth having a direct conversation about what's happening.`;
      }
      return `Nothing major flagged for ${retailer.name}. Health score is solid at ${retailer.healthScore}/100. The relationship looks stable.`;
    }

    if (lowerMessage.includes('selling') || lowerMessage.includes('performance') || lowerMessage.includes('product')) {
      if (retailer.performance) {
        const cats = Object.entries(retailer.performance.categories)
          .sort((a, b) => b[1].units - a[1].units)
          .slice(0, 3);
        const types = Object.entries(retailer.performance.types)
          .sort((a, b) => b[1].share - a[1].share);
        return `At ${retailer.name}, here's what's moving:\n\nTop categories: ${cats.map(([c, d]) => `${c} (${d.units} units, ${d.trend > 0 ? '+' : ''}${d.trend}%)`).join(', ')}\n\nType preference: ${types.map(([t, d]) => `${t} ${d.share}%`).join(', ')}\n\n${types[0][0]} is their favorite - lean into that.`;
      }
      return `I don't have detailed performance data for ${retailer.name} yet. Would need more order history.`;
    }

    if (lowerMessage.includes('competitor') || lowerMessage.includes('competition')) {
      return `I don't have direct competitor intel for ${retailer.name} in my data. But if their health is declining, that's often a sign of competitor activity. Worth asking directly what other brands they're bringing in.`;
    }
  }

  // Territory-wide queries
  if (lowerMessage.includes('territory') || lowerMessage.includes('accounts') || lowerMessage.includes('week')) {
    return `Your ${territory} territory is looking solid, ${rep.split(' ')[0]}. You've got several accounts that could use attention this week.\n\nI'd prioritize:\n1. Any urgent accounts (overdue orders)\n2. Declining health scores\n3. Growing accounts ready for upsell\n\nWant me to pull up specifics on any of these?`;
  }

  if (lowerMessage.includes('at risk') || lowerMessage.includes('declining') || lowerMessage.includes('trouble')) {
    return `Let me pull up accounts that need attention in ${territory}. Look for the "At Risk" tab - those are the ones where relationship health has dropped below 40. For declining accounts, watch for the yellow flags.\n\nThe key patterns I see are usually: longer gaps between orders, shrinking order sizes, or categories going to zero. Any of those are early warnings.`;
  }

  if (lowerMessage.includes('prioritize') || lowerMessage.includes('focus') || lowerMessage.includes('important')) {
    return `Here's my recommendation for priorities:\n\n1. **Urgent first** - Accounts overdue for orders lose us money every day they wait\n2. **At-risk second** - These relationships can still be saved with attention\n3. **Champions third** - Keep your best advocates happy\n4. **Growth opportunities** - Accounts where we can expand categories\n\nThe route builder can help sequence these efficiently. Want me to suggest a route?`;
  }

  // General/greeting
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Hey ${rep.split(' ')[0]}! I'm your VP - ready to help you crush it today. What do you need? I can brief you on accounts, help plan your route, or dig into performance data.`;
  }

  // Default helpful response
  return `I can help with:\n\n• **Account briefings** - "What should I know about [account]?"\n• **Performance data** - "What's selling at [account]?"\n• **Territory overview** - "How's my territory looking?"\n• **Priority planning** - "What should I focus on today?"\n• **Issue investigation** - "Any concerns with [account]?"\n\nWhat would you like to know?`;
};

export default function VPChat({ retailer, rep, territory, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial greeting
  useEffect(() => {
    const greeting = retailer
      ? `Hey ${rep.split(' ')[0]}! I see you're looking at ${retailer.name}. Their health score is ${retailer.healthScore}/100${retailer.isUrgent ? ' - and they\'re flagged as urgent!' : ''}. What would you like to know?`
      : `Hey ${rep.split(' ')[0]}! Ready to help you navigate ${territory} today. What do you need?`;

    setMessages([{ role: 'vp', content: greeting }]);
  }, [retailer, rep, territory]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Simulate VP thinking
    setIsTyping(true);
    setTimeout(() => {
      const response = generateVPResponse(userMessage, retailer, rep, territory);
      setMessages(prev => [...prev, { role: 'vp', content: response }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In production, this would connect to speech-to-text
    if (!isListening) {
      // Simulate voice input after 2 seconds
      setTimeout(() => {
        setInput("What should I know before this visit?");
        setIsListening(false);
      }, 2000);
    }
  };

  const speakMessage = (text) => {
    // In production, this would use text-to-speech
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <div className="font-semibold text-white">Your VP</div>
              <div className="text-xs text-blue-200">
                {retailer ? `Briefing: ${retailer.name}` : `${territory} Territory`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSpeaking(!isSpeaking)}
              className={`p-2 rounded-full transition-colors ${
                isSpeaking ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              {isSpeaking ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'vp' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {msg.role === 'vp' ? (
                  <Bot size={16} className="text-blue-600" />
                ) : (
                  <User size={16} className="text-gray-600" />
                )}
              </div>
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.role === 'vp'
                    ? 'bg-gray-100 text-gray-800 rounded-tl-sm'
                    : 'bg-blue-600 text-white rounded-tr-sm'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                {msg.role === 'vp' && (
                  <button
                    onClick={() => speakMessage(msg.content)}
                    className="mt-2 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                  >
                    <Volume2 size={12} />
                    Listen
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot size={16} className="text-blue-600" />
              </div>
              <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {retailer ? (
                <>
                  <button
                    onClick={() => {
                      setInput("What should I know before this visit?");
                      setTimeout(handleSend, 100);
                    }}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    Brief me
                  </button>
                  <button
                    onClick={() => {
                      setInput("What's selling best here?");
                      setTimeout(handleSend, 100);
                    }}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    Performance
                  </button>
                  <button
                    onClick={() => {
                      setInput("Any issues I should know about?");
                      setTimeout(handleSend, 100);
                    }}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    Issues
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setInput("How's my territory looking?");
                      setTimeout(handleSend, 100);
                    }}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    Territory overview
                  </button>
                  <button
                    onClick={() => {
                      setInput("What should I prioritize today?");
                      setTimeout(handleSend, 100);
                    }}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    Priorities
                  </button>
                  <button
                    onClick={() => {
                      setInput("Which accounts are at risk?");
                      setTimeout(handleSend, 100);
                    }}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    At risk
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`p-3 rounded-full transition-colors ${
                isListening
                  ? 'bg-red-100 text-red-600 animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? "Listening..." : "Ask your VP anything..."}
                className="w-full px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isListening}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>

          {isListening && (
            <div className="mt-2 text-center text-sm text-red-600">
              🎙️ Listening... speak now
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
