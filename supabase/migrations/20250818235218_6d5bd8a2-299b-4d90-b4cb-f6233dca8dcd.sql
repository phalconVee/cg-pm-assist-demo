-- Create conversations table for chat history
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id UUID NOT NULL DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  message JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for conversation access (allowing anonymous users for now)
CREATE POLICY "Allow anonymous read conversations" 
ON public.conversations 
FOR SELECT 
USING (true);

CREATE POLICY "Allow anonymous insert conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_conversations_session_id ON public.conversations(session_id);
CREATE INDEX idx_conversations_created_at ON public.conversations(created_at DESC);