import { supabase } from '@/lib/supabase/client';
import { Task, NewTask, UpdateTask } from '@/lib/supabase/types';

export type SortOrder = 'newest' | 'oldest';
export type StatusFilter = 'all' | 'done' | 'running' | 'todo';

export interface TasksFilter {
  status?: StatusFilter;
  dateFrom?: string;
  dateTo?: string;
  sortOrder?: SortOrder;
}

export async function getTasks(filter: TasksFilter = {}) {
  let query = supabase
    .from('tasks')
    .select('*');

  // Apply status filter
  if (filter.status && filter.status !== 'all') {
    query = query.eq('status', filter.status);
  }

  // Apply date filters
  if (filter.dateFrom) {
    query = query.gte('due_date', filter.dateFrom);
  }
  
  if (filter.dateTo) {
    query = query.lte('due_date', filter.dateTo);
  }

  // Apply sort order
  if (filter.sortOrder === 'oldest') {
    query = query.order('created_at', { ascending: true });
  } else {
    // Default to newest first
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching tasks:', error);
    throw new Error(error.message);
  }
  
  return data as Task[];
}

export async function createTask(task: NewTask) {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating task:', error);
    throw new Error(error.message);
  }
  
  return data as Task;
}

export async function updateTask(id: string, updates: UpdateTask) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating task:', error);
    throw new Error(error.message);
  }
  
  return data as Task;
}

export async function deleteTask(id: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting task:', error);
    throw new Error(error.message);
  }
  
  return true;
}