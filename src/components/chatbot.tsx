
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Loader2, Bot } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { performChat } from '@/app/actions';
import { useToast } from './ui/use-toast';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await performChat({
        history: messages,
        message: input,
      });
      const botMessage: Message = { role: 'model', content: response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Chatbot Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
       const errorMessage: Message = { role: 'model', content: "Sorry, I ran into an error. Please try again." };
       setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 z-50 w-full max-w-sm"
          >
            <Card className="shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">Resume Bot</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          'flex items-end gap-2',
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[80%] rounded-lg p-3 text-sm',
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          )}
                        >
                          <p>{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                       <div className="flex items-end gap-2 justify-start">
                         <div className="max-w-[80%] rounded-lg p-3 text-sm bg-muted flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin" />
                         </div>
                       </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about resumes..."
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        className="fixed bottom-4 right-4 z-50 rounded-full w-16 h-16 shadow-lg"
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle Chatbot"
      >
        <AnimatePresence>
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: 0 }}>
              <X className="h-8 w-8" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0 }}>
              <MessageCircle className="h-8 w-8" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </>
  );
}
