"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Todo } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoContent, setNewTodoContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabaseSubscription = useRef<any>(null);

  // Check for user authentication
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      
      if (!user) {
        router.push("/auth");
        return;
      }
      
      setUser(user);
      fetchTodos(user.id);
    };
    
    checkUser();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser || null);
        
        if (currentUser) {
          fetchTodos(currentUser.id);
        } else {
          router.push("/auth");
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // Set up real-time subscription when user is available
  useEffect(() => {
    if (!user) return;

    // Clean up existing subscription if any
    if (supabaseSubscription.current) {
      supabase.removeChannel(supabaseSubscription.current);
    }
    
    // Set up new subscription with the current user
    supabaseSubscription.current = supabase
      .channel(`todos-channel-${user.id}`)
      .on(
        "postgres_changes",
        { 
          event: "INSERT", 
          schema: "public", 
          table: "todos",
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log("INSERT event received:", payload);
          // Add the new todo to the list
          const newTodo = payload.new as Todo;
          setTodos(currentTodos => [newTodo, ...currentTodos]);
        }
      )
      .on(
        "postgres_changes",
        { 
          event: "UPDATE", 
          schema: "public", 
          table: "todos",
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log("UPDATE event received:", payload);
          // Update the modified todo in the list
          const updatedTodo = payload.new as Todo;
          setTodos(currentTodos => 
            currentTodos.map(todo => 
              todo.id === updatedTodo.id ? updatedTodo : todo
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { 
          event: "DELETE", 
          schema: "public", 
          table: "todos",
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log("DELETE event received:", payload);
          // Remove the deleted todo from the list
          const deletedTodoId = payload.old.id;
          setTodos(currentTodos => 
            currentTodos.filter(todo => todo.id !== deletedTodoId)
          );
        }
      )
      .subscribe((status) => {
        console.log(`Supabase realtime subscription status: ${status}`);
      });
      
    return () => {
      if (supabaseSubscription.current) {
        supabase.removeChannel(supabaseSubscription.current);
      }
    };
  }, [user]);

  const fetchTodos = async (userId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setTodos(data || []);
    } catch (error: any) {
      setError(error.message);
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTodoContent.trim() || !user) return;
    
    try {
      // Create a temporary ID for optimistic UI update
      const tempId = crypto.randomUUID();
      const newTodo: Todo = {
        id: tempId,
        content: newTodoContent.trim(),
        completed: false,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Optimistically add todo to the list
      setTodos(currentTodos => [newTodo, ...currentTodos]);
      
      // Clear input
      setNewTodoContent("");
      
      // Send to server
      const { data, error } = await supabase.from("todos").insert({
        content: newTodoContent.trim(),
        user_id: user.id,
      }).select();
      
      if (error) {
        // Remove the optimistic todo if there was an error
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== tempId));
        throw error;
      }
      
      // If not using realtime for some reason, update with the server response
      if (data && data.length > 0) {
        setTodos(currentTodos => 
          currentTodos.map(todo => 
            todo.id === tempId ? data[0] : todo
          )
        );
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodoStatus = async (todo: Todo) => {
    try {
      // Optimistically update UI
      setTodos(currentTodos => 
        currentTodos.map(t => 
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        )
      );
      
      // Send update to server
      const { error } = await supabase
        .from("todos")
        .update({ completed: !todo.completed })
        .eq("id", todo.id)
        .eq("user_id", user.id);
        
      if (error) {
        // Revert optimistic update if there's an error
        setTodos(currentTodos => 
          currentTodos.map(t => 
            t.id === todo.id ? todo : t
          )
        );
        throw error;
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Error toggling todo status:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      // Optimistically remove from UI
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      
      // Delete from server
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
        
      if (error) {
        // If error, fetch todos again to restore correct state
        fetchTodos(user.id);
        throw error;
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Error deleting todo:", error);
    }
  };

  if (!user) {
    return <div className="text-center py-8">Please sign in to view your todos</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Todo List</h1>
      
      {error && (
        <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Add a new todo..."
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit">Add</Button>
      </form>
      
      {loading ? (
        <div className="text-center py-8">Loading your todos...</div>
      ) : todos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No todos yet. Add your first one above!
        </div>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 p-4 bg-white rounded-lg shadow dark:bg-gray-800"
            >
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() => toggleTodoStatus(todo)}
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`flex-1 ${
                  todo.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {todo.content}
              </label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                aria-label="Delete todo"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}