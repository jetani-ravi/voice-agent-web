import React, { useEffect, useState, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, X } from 'lucide-react';
import TypingIndicator from '@/components/ui/typing-indicator';
import { me } from '@/app/modules/user/action';
import { Agent } from '@/app/modules/agents/interface';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
interface Message {
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
  timestamp: Date;
  // When streaming, the flag remains true until the stream is complete.
  streaming?: boolean;
}

interface LLMChatProps {
  agent: Agent;
  onStop: () => void;
}

const LLMChat: React.FC<LLMChatProps> = ({ agent, onStop }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession()
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = async () => {
    const result = await me();
    let org_id = '';
    if (result.success) {
      org_id = result.data!.active_organization._id;
    }

    if (!session?.user.id) {
      toast({
        title: 'Session Expired',
        description: 'Please login again',
        variant: 'destructive',
      });
      return;
    }
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/chat/v1/${agent.agent_id}?user_id=${session?.user.id}&turn_based_conversation=true&org_id=${org_id}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket Connected');
    };

    ws.current.onmessage = (event) => {
      const response = JSON.parse(event.data);
      const data = response.data;

      if (data === '<beginning_of_stream>') {
        // Add a streaming message with a typing indicator.
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: <TypingIndicator />,
            streaming: true,
            timestamp: new Date(),
          },
        ]);
      } else if (data === '<end_of_stream>') {
        // Mark the streaming message as complete.
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === 'assistant' && lastMessage.streaming) {
            return [...prev.slice(0, -1), { ...lastMessage, streaming: false }];
          }
          return prev;
        });
      } else {
        // Replace the streaming message with the actual content.
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === 'assistant' && lastMessage.streaming) {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: data, timestamp: new Date() },
            ];
          }
          return [
            ...prev,
            {
              role: 'assistant',
              content: data,
              timestamp: new Date(),
            },
          ];
        });
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket Disconnected');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (!inputMessage.trim() || !ws.current) return;
    const message = {
      data: inputMessage,
      type: 'text',
      timestamp: new Date(),
    };
    ws.current.send(JSON.stringify(message));

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: inputMessage,
        timestamp: new Date(),
      },
    ]);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stopConversation = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
      setIsConnected(false);
    }
    // Call parent's callback to hide the chat component.
    onStop();
  };

  const formatTimestamp = (date: Date) => {
    return format(date, 'hh:mm a'); // 12-hour format with AM/PM
  };
  return (
    <Card className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-medium">{agent.agent_config.agent_name || 'Chat Assistant'}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={stopConversation}
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex flex-col max-w-[80%] gap-1">
                <div
                  className={`p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-8'
                      : 'bg-muted mr-8'
                  } ${
                    message.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
                  } shadow-sm`}
                >
                  {message.content}
                </div>
                <span className={`text-xs text-muted-foreground ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <CardContent className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!isConnected}
            className="shadow-sm"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!isConnected || !inputMessage.trim()}
            className="shadow-sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LLMChat;
