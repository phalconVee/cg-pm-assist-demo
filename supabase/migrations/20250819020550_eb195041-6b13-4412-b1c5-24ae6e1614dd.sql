-- Enable realtime for conversations table
ALTER TABLE conversations REPLICA IDENTITY FULL;

-- Add the conversations table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;