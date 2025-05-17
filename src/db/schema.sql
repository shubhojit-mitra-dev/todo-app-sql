/*
  This file contains the SQL migration to set up the todos table in Supabase
  Run this in the Supabase SQL editor to create your schema
*/

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create a table for todos
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security on todos table
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select only their own todos
CREATE POLICY select_own_todos ON todos
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own todos
CREATE POLICY insert_own_todos ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update only their own todos
CREATE POLICY update_own_todos ON todos
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete only their own todos
CREATE POLICY delete_own_todos ON todos
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries filtering by user_id
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON todos (user_id);

-- Create function to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatically updating updated_at column on update
CREATE TRIGGER update_todos_updated_at
BEFORE UPDATE ON todos
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();