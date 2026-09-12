import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Smile, ArrowLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import FloatingHearts from '../components/FloatingHearts';

interface Message {
  id: string;
  sender: 'me' | 'him';
  text: string;
  type?: 'text' | 'hug' | 'kiss';
  created_at: string;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'evening' : hours < 12 && hours >= 5 ? 'morning' : 'night';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes} this ${ampm}`;
}

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showHearts, setShowHearts] = useState(false);
  const [heartType, setHeartType] = useState<'hearts' | 'kisses'>('hearts');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages and subscribe to real-time updates
  useEffect(() => {
    // Load existing messages
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
      } else if (data) {
        setMessages(data);
      }
      setLoading(false);
    };

    loadMessages();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const { error } = await supabase.from('messages').insert({
      sender: 'me',
      text: inputText,
      type: 'text',
    });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setInputText('');
    }
  };

  const sendVirtualLove = async (type: 'hug' | 'kiss') => {
    setHeartType(type === 'hug' ? 'hearts' : 'kisses');
    setShowHearts(true);

    const text = type === 'hug' ? 'Sending you a warm hug 🤗💕' : 'Blowing you a kiss 💋✨';

    const { error } = await supabase.from('messages').insert({
      sender: 'me',
      text,
      type,
    });

    if (error) {
      console.error('Error sending love:', error);
    }

    setTimeout(() => setShowHearts(false), 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-navy">
      <FloatingHearts active={showHearts} type={heartType} />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-5 py-4 bg-surface/80 backdrop-blur-xl border-b border-border-blue/40 safe-top"
      >
        <button onClick={() => navigate('/')} className="p-1">
          <ArrowLeft size={20} className="text-text-secondary" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-baby-pink/30 to-blue-accent flex items-center justify-center">
          <Heart size={16} className="text-baby-pink fill-baby-pink" />
        </div>
        <div className="flex-1">
          <h2 className="font-serif text-lg text-text-primary">
            {new Date().getHours() < 12 ? 'Good morning' : 'Hey'}, babe 💕
          </h2>
          <p className="text-xs text-text-muted">Always here for you</p>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-muted text-sm">Loading messages...</p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: index < 10 ? index * 0.05 : 0 }}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.sender === 'me' ? 'order-1' : 'order-1'}`}>
                  <div
                    className={`rounded-3xl px-4 py-3 shadow-lg ${
                      message.sender === 'me'
                        ? 'bg-gradient-to-br from-baby-pink/90 to-baby-pink-dark/80 rounded-br-lg'
                        : 'bg-surface-light border border-border-blue/40 rounded-bl-lg'
                    }`}
                  >
                    <p className={`text-sm leading-relaxed ${
                      message.sender === 'me' ? 'text-navy' : 'text-text-primary'
                    }`}>{message.text}</p>
                  </div>
                  <p className={`text-[10px] text-text-muted mt-1 ${message.sender === 'me' ? 'text-right mr-1' : 'text-left ml-1'}`}>
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 pb-4 pt-2 bg-surface/60 backdrop-blur-sm border-t border-border-blue/40 safe-bottom">
        {/* Love buttons */}
        <div className="flex gap-2 mb-3 justify-center">
          <button
            onClick={() => sendVirtualLove('hug')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-baby-pink/15 border border-baby-pink/30 text-xs font-medium text-baby-pink active:scale-95 transition-transform"
          >
            <Heart size={14} className="fill-baby-pink/40" />
            Send a hug
          </button>
          <button
            onClick={() => sendVirtualLove('kiss')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-baby-pink/15 border border-baby-pink/30 text-xs font-medium text-baby-pink active:scale-95 transition-transform"
          >
            <span className="text-sm">💋</span>
            Send a kiss
          </button>
        </div>

        {/* Message input */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-text-muted">
            <Smile size={22} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write something sweet..."
              className="w-full px-4 py-3 rounded-full bg-surface-light border border-border-blue/50 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-baby-pink/50 focus:ring-2 focus:ring-baby-pink/20 transition-all"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputText.trim()}
            className="p-3 rounded-full bg-baby-pink text-navy disabled:opacity-40 active:scale-95 transition-all shadow-lg shadow-baby-pink/20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
