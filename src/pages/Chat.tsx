import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Smile, ArrowLeft, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';
import FloatingHearts from '../components/FloatingHearts';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  message_type: string;
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
  const { user, profile, signOut } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showHearts, setShowHearts] = useState(false);
  const [heartType, setHeartType] = useState<'hearts' | 'kisses'>('hearts');
  const [loading, setLoading] = useState(true);
  const [partnerName, setPartnerName] = useState('babe');
  const [partnerAvatar, setPartnerAvatar] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!profile || !user) return;

    const loadData = async () => {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
      } else if (messagesData) {
        setMessages(messagesData);
      }

      const { data: partnerData } = await supabase
        .from('profiles')
        .select('*')
        .eq('secret_code', profile.secret_code)
        .neq('user_id', user.id)
        .single();

      if (partnerData) {
        setPartnerName(partnerData.name || 'babe');
        setPartnerAvatar(partnerData.avatar_url);
      }

      setLoading(false);
    };

    loadData();

    const channel = supabase
      .channel('realtime messages')
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
  }, [profile, user]);

  const sendMessage = async () => {
    if (!inputText.trim() || !user || !profile) return;

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      sender_name: profile.name,
      content: inputText,
      message_type: 'text',
    });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setInputText('');
    }
  };

  const sendVirtualLove = async (type: 'hug' | 'kiss') => {
    if (!user || !profile) return;
    
    setHeartType(type === 'hug' ? 'hearts' : 'kisses');
    setShowHearts(true);

    const content = type === 'hug' ? 'Sending you a warm hug 🤗💕' : 'Blowing you a kiss 💋✨';

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      sender_name: profile.name,
      content,
      message_type: type,
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

  const isMyMessage = (senderId: string) => senderId === user?.id;

  const getAvatar = (msg: Message) => {
    if (isMyMessage(msg.sender_id)) {
      return profile?.avatar_url || null;
    }
    return partnerAvatar;
  };

  return (
    <div className="flex flex-col h-screen bg-cream">
      <FloatingHearts active={showHearts} type={heartType} />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-5 py-4 bg-white/80 backdrop-blur-xl border-b border-border/50 safe-top"
      >
        <button onClick={() => navigate('/')} className="p-1">
          <ArrowLeft size={20} className="text-navy" />
        </button>
        <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center overflow-hidden">
          <span className="font-serif text-butter text-sm italic font-bold">O2M</span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-serif text-lg text-navy truncate">
            Chat with {partnerName} 💕
          </h2>
          <p className="text-xs text-text-muted">Real-time • Just us two</p>
        </div>
        <button
          onClick={signOut}
          className="p-2 rounded-full bg-navy/5 hover:bg-navy/10 transition-colors"
          title="Sign out"
        >
          <LogOut size={16} className="text-navy" />
        </button>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-muted text-sm">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Heart size={40} className="text-navy/20 mb-4" />
            <p className="text-text-secondary mb-2 font-serif italic">No messages yet</p>
            <p className="text-text-muted text-xs">Send the first sweet note 💌</p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => {
              const mine = isMyMessage(message.sender_id);
              const isPartner1 = profile?.partner_number === 1;
              const myBubbleIsNavy = isPartner1;
              const bubbleIsNavy = mine ? myBubbleIsNavy : !myBubbleIsNavy;
              const avatar = getAvatar(message);

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index < 10 ? index * 0.05 : 0 }}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'} gap-2`}
                >
                  {!mine && (
                    <div className="flex-shrink-0 self-end">
                      {avatar ? (
                        <img src={avatar} alt={message.sender_name} className="w-8 h-8 rounded-full object-cover border-2 border-border" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center">
                          <span className="text-xs text-navy font-medium">{message.sender_name?.charAt(0).toUpperCase() || '?'}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`max-w-[75%] flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                    <span className={`text-[10px] text-text-muted mb-1 ${mine ? 'text-right mr-1' : 'text-left ml-1'}`}>
                      {message.sender_name}
                    </span>
                    
                    <div className={`rounded-3xl px-4 py-3 shadow-sm ${
                      bubbleIsNavy ? 'bg-navy' : 'bg-butter'
                    } ${mine ? (bubbleIsNavy ? 'rounded-br-lg' : 'rounded-bl-lg') : (bubbleIsNavy ? 'rounded-bl-lg' : 'rounded-br-lg')}`}>
                      <p className={`text-sm leading-relaxed ${bubbleIsNavy ? 'text-white' : 'text-navy'}`}>
                        {message.content}
                      </p>
                    </div>
                    
                    <p className={`text-[10px] text-text-muted mt-1 ${mine ? 'text-right mr-1' : 'text-left ml-1'}`}>
                      {formatTime(message.created_at)}
                    </p>
                  </div>

                  {mine && (
                    <div className="flex-shrink-0 self-end">
                      {avatar ? (
                        <img src={avatar} alt="You" className="w-8 h-8 rounded-full object-cover border-2 border-border" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center">
                          <span className="text-xs text-butter font-medium">{profile?.name?.charAt(0).toUpperCase() || 'M'}</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 pb-4 pt-2 bg-white/60 backdrop-blur-sm border-t border-border/50 safe-bottom">
        <div className="flex gap-2 mb-3 justify-center">
          <button
            onClick={() => sendVirtualLove('hug')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-navy/5 border border-navy/10 text-xs font-medium text-navy active:scale-95 transition-transform"
          >
            <Heart size={14} className="fill-navy/30" />
            Send a hug
          </button>
          <button
            onClick={() => sendVirtualLove('kiss')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-butter/60 border border-butter-dark/30 text-xs font-medium text-navy active:scale-95 transition-transform"
          >
            <span className="text-sm">💋</span>
            Send a kiss
          </button>
        </div>

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
              className="w-full px-4 py-3 rounded-full bg-white border border-border text-sm text-navy placeholder:text-text-muted/60 focus:outline-none focus:border-navy/30 focus:ring-2 focus:ring-navy/5 transition-all"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputText.trim()}
            className="p-3 rounded-full bg-navy text-butter disabled:opacity-40 active:scale-95 transition-all shadow-md"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}