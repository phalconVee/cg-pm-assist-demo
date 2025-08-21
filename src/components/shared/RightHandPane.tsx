import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, CheckCircle, Circle, HelpCircle, Sparkles, RefreshCw, ChevronDown, Edit, Paperclip, Send, Image, Upload, MapPin, Calculator, Info, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatLoader from '@/components/ui/chat-loader';

interface QuickAction {
  type: 'route' | 'calculator' | 'info';
  label: string;
  action: string;
  context: string;
}

interface AIMessage {
  response_type: 'answer' | 'navigation' | 'calculation' | 'guidance';
  message: {
    text: string;
    confidence: 'high' | 'medium' | 'low';
  };
  quick_actions: QuickAction[];
  personalization: {
    user_context: string;
    relevant_forms: string[];
    progress_hint: string;
  };
  references: Array<{
    type: 'irs_form' | 'publication' | 'tax_code';
    code: string;
    description: string;
  }>;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string | AIMessage;
  timestamp: Date;
}

interface ConversationHistory {
  session_id: string;
  title: string;
  created_at: string;
}

interface RightHandPaneProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearchQuery?: string;
}

const RightHandPane: React.FC<RightHandPaneProps> = ({ isOpen, onClose, initialSearchQuery }) => {
  const [isConversationOpen, setIsConversationOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showAttachmentPopup, setShowAttachmentPopup] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [conversationHistory, setConversationHistory] = useState<{
    today: ConversationHistory[];
    yesterday: ConversationHistory[];
  }>({ today: [], yesterday: [] });
  const [currentConversationTitle, setCurrentConversationTitle] = useState('New Conversation');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const conversationRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (conversationRef.current && !conversationRef.current.contains(event.target as Node)) {
        setIsConversationOpen(false);
      }
      if (attachmentRef.current && !attachmentRef.current.contains(event.target as Node)) {
        setShowAttachmentPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch conversation history
  useEffect(() => {
    const fetchConversationHistory = async () => {
      try {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const todayEnd = new Date(today.setHours(23, 59, 59, 999)).toISOString();
        const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0)).toISOString();
        const yesterdayEnd = new Date(yesterday.setHours(23, 59, 59, 999)).toISOString();

        // Fetch today's conversations - get first message of each session for titles
        const { data: todayConversations } = await supabase
          .from('conversations')
          .select('session_id, message, created_at')
          .eq('role', 'user')
          .gte('created_at', todayStart)
          .lte('created_at', todayEnd)
          .order('created_at', { ascending: true }); // Changed to ascending to get first messages first

        console.log('Raw today conversations:', todayConversations?.length, todayConversations);

        // Fetch yesterday's conversations - get first message of each session for titles
        const { data: yesterdayConversations } = await supabase
          .from('conversations')
          .select('session_id, message, created_at')
          .eq('role', 'user')
          .gte('created_at', yesterdayStart)
          .lte('created_at', yesterdayEnd)
          .order('created_at', { ascending: true }); // Changed to ascending to get first messages first

        console.log('Raw yesterday conversations:', yesterdayConversations?.length, yesterdayConversations);

        const formatConversations = (conversations: any[]): ConversationHistory[] => {
          const uniqueConversations = new Map();
          const sessionLatestTimes = new Map();
          
          // First pass: collect first message of each session and track latest time
          conversations?.forEach(conv => {
            if (!uniqueConversations.has(conv.session_id)) {
              // Use first message (chronologically) as title
              const message = typeof conv.message === 'string' ? conv.message : conv.message?.text || '';
              const title = message.length > 50 ? message.substring(0, 50) + '...' : message;
              
              uniqueConversations.set(conv.session_id, {
                session_id: conv.session_id,
                title: title || 'Untitled conversation',
                created_at: conv.created_at
              });
            }
            
            // Track the latest timestamp for each session for proper ordering
            const currentTime = new Date(conv.created_at).getTime();
            const existingTime = sessionLatestTimes.get(conv.session_id) || 0;
            if (currentTime > existingTime) {
              sessionLatestTimes.set(conv.session_id, currentTime);
            }
          });
          
          // Sort by latest activity in each session (most recent first)
          return Array.from(uniqueConversations.values())
            .sort((a, b) => {
              const timeA = sessionLatestTimes.get(a.session_id) || 0;
              const timeB = sessionLatestTimes.get(b.session_id) || 0;
              return timeB - timeA;
            })
            .slice(0, 5); // Limit to 5 conversations per day
        };

        setConversationHistory({
          today: formatConversations(todayConversations || []),
          yesterday: formatConversations(yesterdayConversations || [])
        });
      } catch (error) {
        console.error('Error fetching conversation history:', error);
      }
    };

    if (isOpen) {
      fetchConversationHistory();
    }
  }, [isOpen]);

  // Handle initial search query
  useEffect(() => {
    if (initialSearchQuery && isOpen) {
      // Start a new conversation
      setMessages([]);
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
      setCurrentConversationTitle('New Conversation');
      
      // Send the search query as a message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: initialSearchQuery,
        timestamp: new Date()
      };

      setMessages([userMessage]);
      setIsLoading(true);

      // Send to LLM using the same sessionId
      const sendSearchQuery = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
            body: {
              message: initialSearchQuery,
              sessionId: newSessionId,
              userContext: getCurrentContext()
            }
          });

          if (error) throw error;

          const aiMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: data,
            timestamp: new Date()
          };

          setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
          console.error('Error sending search query:', error);
          toast({
            title: "Error",
            description: "Failed to process search query. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };

      sendSearchQuery();
    }
  }, [initialSearchQuery, isOpen]);

  // Listen for realtime updates to conversation history
  useEffect(() => {
    if (!isOpen) return;

    const channel = supabase
      .channel('conversation-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          // Refresh conversation history when new conversations are added
          const fetchConversationHistory = async () => {
            try {
              const today = new Date();
              const yesterday = new Date(today);
              yesterday.setDate(yesterday.getDate() - 1);

              const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString();
              const todayEnd = new Date(today.setHours(23, 59, 59, 999)).toISOString();
              const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0)).toISOString();
              const yesterdayEnd = new Date(yesterday.setHours(23, 59, 59, 999)).toISOString();

              const { data: todayConversations } = await supabase
                .from('conversations')
                .select('session_id, message, created_at')
                .eq('role', 'user')
                .gte('created_at', todayStart)
                .lte('created_at', todayEnd)
                .order('created_at', { ascending: true }); // Changed to ascending to get first messages first

              const { data: yesterdayConversations } = await supabase
                .from('conversations')
                .select('session_id, message, created_at')
                .eq('role', 'user')
                .gte('created_at', yesterdayStart)
                .lte('created_at', yesterdayEnd)
                .order('created_at', { ascending: true }); // Changed to ascending to get first messages first

              const formatConversations = (conversations: any[]): ConversationHistory[] => {
                const uniqueConversations = new Map();
                const sessionLatestTimes = new Map();
                
                // First pass: collect first message of each session and track latest time
                conversations?.forEach(conv => {
                  if (!uniqueConversations.has(conv.session_id)) {
                    // Use first message (chronologically) as title
                    const message = typeof conv.message === 'string' ? conv.message : conv.message?.text || '';
                    const title = message.length > 50 ? message.substring(0, 50) + '...' : message;
                    
                    uniqueConversations.set(conv.session_id, {
                      session_id: conv.session_id,
                      title: title || 'Untitled conversation',
                      created_at: conv.created_at
                    });
                  }
                  
                  // Track the latest timestamp for each session for proper ordering
                  const currentTime = new Date(conv.created_at).getTime();
                  const existingTime = sessionLatestTimes.get(conv.session_id) || 0;
                  if (currentTime > existingTime) {
                    sessionLatestTimes.set(conv.session_id, currentTime);
                  }
                });
                
                // Sort by latest activity in each session (most recent first)
                return Array.from(uniqueConversations.values())
                  .sort((a, b) => {
                    const timeA = sessionLatestTimes.get(a.session_id) || 0;
                    const timeB = sessionLatestTimes.get(b.session_id) || 0;
                    return timeB - timeA;
                  })
                  .slice(0, 5); // Limit to 5 conversations per day
              };

              setConversationHistory({
                today: formatConversations(todayConversations || []),
                yesterday: formatConversations(yesterdayConversations || [])
              });
            } catch (error) {
              console.error('Error fetching conversation history:', error);
            }
          };

          fetchConversationHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen]);

  const getCurrentContext = () => {
    const route = location.pathname;
    const contexts: { [key: string]: string } = {
      '/personal-info': 'Personal Info - You & Your Family',
      '/wages-income': 'Federal Taxes - Wages & Income',
      '/deductions-credits': 'Federal Taxes - Deductions & Credits',
      '/other-tax-situations': 'Federal Taxes - Other Tax Situations',
      '/prepare-state': 'State Taxes',
      '/your-state-returns': 'Your State Returns',
      '/state-review': 'State Review',
      '/review': 'Final Review',
      '/file': 'Finish and File'
    };
    return contexts[route] || 'Get to Know Me';
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: {
          message: inputValue.trim(),
          sessionId,
          userContext: getCurrentContext()
        }
      });

      if (error) throw error;

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setSessionId(crypto.randomUUID());
    setCurrentConversationTitle('New Conversation');
    setIsConversationOpen(false);
  };

  const loadConversation = async (sessionIdToLoad: string) => {
    try {
      // Find the conversation title from history
      const allConversations = [...conversationHistory.today, ...conversationHistory.yesterday];
      const conversation = allConversations.find(conv => conv.session_id === sessionIdToLoad);
      const conversationTitle = conversation?.title || 'Conversation';
      
      const { data: conversationMessages } = await supabase
        .from('conversations')
        .select('id, role, message, created_at')
        .eq('session_id', sessionIdToLoad)
        .order('created_at', { ascending: true });

      if (conversationMessages) {
        const formattedMessages: ChatMessage[] = conversationMessages.map(msg => {
          let content: string | AIMessage;
          
          if (msg.role === 'user') {
            // For user messages, extract text from message object or use as string
            if (typeof msg.message === 'string') {
              content = msg.message;
            } else if (msg.message && typeof msg.message === 'object' && 'text' in msg.message) {
              content = (msg.message as any).text || '';
            } else {
              content = '';
            }
          } else {
            // For assistant messages, use as AIMessage
            content = msg.message as unknown as AIMessage;
          }
          
          return {
            id: msg.id,
            role: msg.role as 'user' | 'assistant',
            content,
            timestamp: new Date(msg.created_at)
          };
        });

        setMessages(formattedMessages);
        setSessionId(sessionIdToLoad as `${string}-${string}-${string}-${string}-${string}`);
        setCurrentConversationTitle(conversationTitle);
        setIsConversationOpen(false);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    if (action.type === 'route') {
      navigate(action.action);
    } else if (action.type === 'calculator') {
      // Handle calculator actions
      toast({
        title: "Calculator",
        description: `Opening ${action.label}...`
      });
    } else if (action.type === 'info') {
      // Handle info actions
      toast({
        title: "Information",
        description: action.context
      });
    }
  };

  const parseMessageText = (text: string) => {
    // Replace **bold** with actual bold HTML and handle line breaks
    const parsedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
    
    return { __html: parsedText };
  };

  const renderMessage = (message: ChatMessage) => {
    if (message.role === 'user') {
      return (
        <div key={message.id} className="flex justify-end mb-4">
          <div className="max-w-[80%] bg-primary text-primary-foreground rounded-lg px-4 py-2">
            <p className="text-sm">{message.content as string}</p>
          </div>
        </div>
      );
    } else {
      const aiMessage = message.content as AIMessage;
      const messageText = typeof aiMessage.message === 'string' 
        ? aiMessage.message 
        : aiMessage.message?.text || 'No message content';
      
      return (
        <div key={message.id} className="flex justify-start mb-6">
          <div className="w-full">
            <div className="flex items-start space-x-3 mb-2">
              <img src="/lovable-uploads/08ba415d-6139-4502-8c64-0edc68429d26.png" alt="AI Assistant" className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div 
                  className="text-sm text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={parseMessageText(messageText)}
                />
              </div>
            </div>
            
            {/* Feedback Icons */}
            <div className="flex items-center space-x-2 ml-11 mb-3">
              <ThumbsUp className="h-4 w-4 text-muted-foreground hover:text-green-600 cursor-pointer transition-colors" />
              <ThumbsDown className="h-4 w-4 text-muted-foreground hover:text-red-600 cursor-pointer transition-colors" />
            </div>
            
            {/* Quick Actions */}
            {aiMessage.quick_actions && aiMessage.quick_actions.length > 0 && (
              <div className="ml-11 mt-3">
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex space-x-2 pb-2">
                    {aiMessage.quick_actions.map((action, index) => (
                      <a
                        key={index}
                        href={action.action}
                        className="flex-shrink-0"
                      >
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-muted transition-colors whitespace-nowrap"
                        >
                          {action.label}
                        </Badge>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* References */}
            {aiMessage.references && aiMessage.references.length > 0 && (
              <div className="ml-11 mt-3">
                <p className="text-xs text-muted-foreground mb-2">References:</p>
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex space-x-2 pb-2">
                    {aiMessage.references.map((ref, index) => (
                      <Card key={index} className="flex-shrink-0 min-w-[200px]">
                        <CardContent className="p-3">
                          <div className="text-xs">
                            <span className="font-medium text-foreground">{ref.code}</span>
                            <p className="text-muted-foreground mt-1">{ref.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  };
  
  const taxTasks = [
    { id: 1, title: "Add personal information", completed: true },
    { id: 2, title: "Import W-2 forms", completed: true },
    { id: 3, title: "Review standard deduction", completed: true },
    { id: 4, title: "Check for tax credits", completed: false },
    { id: 5, title: "Review state tax requirements", completed: false },
    { id: 6, title: "Prepare for e-filing", completed: false },
    { id: 7, title: "Final tax return review", completed: false },
  ];

  const completedTasks = taxTasks.filter(task => task.completed).length;

  return (
    <>      
      {/* Right Hand Pane */}
      <div className={`
        fixed top-0 right-0 h-full bg-white border-l border-border z-50
        transform transition-all duration-300 ease-out shadow-2xl
        w-full lg:w-96
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header with Collapsible Conversation Dropdown */}
          <div className="border-b border-border relative">
            <div className="flex items-center justify-between px-4 py-3">
              <Collapsible ref={conversationRef} open={isConversationOpen} onOpenChange={setIsConversationOpen} className="relative flex-1">
                <CollapsibleTrigger className="flex items-center space-x-2 hover:bg-muted/50 rounded-md px-1 py-1">
                  <span className="text-sm font-medium text-foreground">{currentConversationTitle}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isConversationOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="absolute top-full left-0 right-0 z-50 mt-1 mx-1">
                  <Card className="shadow-lg border-2 w-full">
                    <CardContent className="p-0">
                       <div 
                         className="flex items-center space-x-2 text-sm text-foreground hover:bg-muted/50 px-3 py-2 cursor-pointer border-b"
                         onClick={startNewConversation}
                       >
                         <Edit className="h-4 w-4 text-muted-foreground" />
                         <span>New conversation</span>
                       </div>
                      
                      {conversationHistory.today.length > 0 && (
                        <div className="py-1">
                          <div className="text-xs text-muted-foreground px-3 py-1 font-medium">Today</div>
                          {conversationHistory.today.map((conversation, index) => {
                            console.log(`Rendering today conversation ${index + 1}:`, conversation);
                            return (
                              <div 
                                key={conversation.session_id}
                                className="text-sm text-muted-foreground hover:bg-muted/50 px-3 py-2 cursor-pointer"
                                onClick={() => loadConversation(conversation.session_id)}
                              >
                                {conversation.title}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {conversationHistory.yesterday.length > 0 && (
                        <div className="py-1">
                          <div className="text-xs text-muted-foreground px-3 py-1 font-medium">Yesterday</div>
                          {conversationHistory.yesterday.map((conversation) => (
                            <div 
                              key={conversation.session_id}
                              className="text-sm text-muted-foreground hover:bg-muted/50 px-3 py-2 cursor-pointer"
                              onClick={() => loadConversation(conversation.session_id)}
                            >
                              {conversation.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={startNewConversation}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              // Initial state - show greeting and guide
              <div className="p-6 flex flex-col items-center justify-center h-full">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-16 h-16 flex items-center justify-center mb-4">
                    <img src="/lovable-uploads/08ba415d-6139-4502-8c64-0edc68429d26.png" alt="AI Assistant" className="h-16 w-16" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Hey there!</h2>
                  <p className="text-primary font-medium mb-6">How can I help?</p>
                  <Badge variant="secondary" className="mb-4 text-xs" style={{ backgroundColor: '#f7f7f7', color: '#666' }}>
                    What's new?
                  </Badge>
                </div>

                {/* Tax Progress Guide */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-foreground">Tax preparation guide</h3>
                      <Badge variant="secondary" className="text-xs">
                        {completedTasks}/7
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {taxTasks.map((task) => (
                        <div key={task.id} className="flex items-center space-x-3">
                          {task.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className={`text-sm ${
                            task.completed 
                              ? 'text-muted-foreground line-through' 
                              : 'text-foreground'
                          }`}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Chat mode - show messages
              <div className="p-4">
                <div className="space-y-4">
                  {messages.map(renderMessage)}
                  {isLoading && (
                    <ChatLoader />
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Footer - Chat Input Area */}
          <div className="p-4">
            <div className="relative bg-transparent rounded-md border border-border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200" style={{ borderRadius: '6px', height: '90px' }}>
              <input
                type="text"
                placeholder="Ask anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full h-full px-4 pt-3 pb-12 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
                style={{ verticalAlign: 'top' }}
              />
              
              {/* Attachment Popup */}
              <div ref={attachmentRef} className="relative">
                {showAttachmentPopup && (
                  <div className="absolute bottom-10 left-2 z-50 bg-white border border-border rounded-md shadow-lg min-w-[160px]">
                    <div className="py-1">
                      <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors">
                        <Image className="h-4 w-4" />
                        <span>Select from file</span>
                      </button>
                      <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>Upload from device</span>
                      </button>
                    </div>
                  </div>
                )}
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute bottom-2 left-2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowAttachmentPopup(!showAttachmentPopup)}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className={`absolute bottom-2 right-2 h-6 w-6 p-0 transition-colors ${
                  inputValue.trim() 
                    ? 'text-primary hover:text-primary/80' 
                    : 'text-muted-foreground/50 cursor-not-allowed'
                }`}
                disabled={!inputValue.trim() || isLoading}
                onClick={sendMessage}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightHandPane;