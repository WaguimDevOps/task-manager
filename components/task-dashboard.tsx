"use client";

import { useState, useEffect } from 'react';
import { TaskList } from '@/components/task-list';
import { TaskFilters } from '@/components/task-filters';
import { TaskCreate } from '@/components/task-create';
import { TaskReport } from '@/components/task-report';
import { Task } from '@/lib/supabase/types';
import { TasksFilter, getTasks, deleteTask as deleteTaskApi } from '@/lib/api/tasks';
import { useToast } from '@/hooks/use-toast';

export function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TasksFilter>({
    status: 'all',
    sortOrder: 'newest',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks(filters);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Task Created",
      description: "Your task has been successfully created.",
    });
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    toast({
      title: "Task Updated",
      description: "Your task has been successfully updated.",
    });
  };

  const handleTaskDeleted = async (taskId: string) => {
    try {
      await deleteTaskApi(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: "Task Deleted",
        description: "Your task has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFiltersChange = (newFilters: TasksFilter) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
          <p className="text-muted-foreground">
            Manage your tasks easily and efficiently
          </p>
        </div>
        <div className="flex gap-2">
          <TaskReport tasks={tasks} />
          <TaskCreate onTaskCreated={handleTaskCreated} />
        </div>
      </div>
      
      <TaskFilters filters={filters} onFiltersChange={handleFiltersChange} />
      
      <TaskList 
        tasks={tasks}
        loading={loading}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
      />
    </div>
  );
}