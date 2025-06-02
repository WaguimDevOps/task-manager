"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { Task, UpdateTask } from '@/lib/supabase/types';
import { updateTask } from '@/lib/api/tasks';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, CheckCircle, Circle, Clock, Timer } from 'lucide-react';
import { motion } from '@/lib/motion';

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusUpdate: (task: Task) => void;
}

export function TaskItem({ task, onEdit, onDelete, onStatusUpdate }: TaskItemProps) {
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: 'todo' | 'running' | 'done') => {
    if (task.status === newStatus) return;
    
    try {
      setUpdating(true);
      const updatedTask = await updateTask(task.id, { status: newStatus });
      onStatusUpdate(updatedTask);
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const statusStyles = {
    todo: {
      icon: Circle,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      label: 'To Do'
    },
    running: {
      icon: Clock,
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      label: 'In Progress'
    },
    done: {
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      label: 'Done'
    }
  };

  const StatusIcon = statusStyles[task.status].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "transition-all duration-200",
        task.status === 'done' && "opacity-80"
      )}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className={cn(
                "text-xl line-clamp-1",
                task.status === 'done' && "line-through opacity-70"
              )}>
                {task.title}
              </CardTitle>
              {task.hours_spent !== null && task.hours_spent > 0 && (
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <Timer className="h-4 w-4 mr-1" />
                  {task.hours_spent} hours spent
                </div>
              )}
            </div>
            <Badge variant="outline" className={cn("ml-2", statusStyles[task.status].color)}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {statusStyles[task.status].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {task.description && (
            <p className={cn(
              "text-muted-foreground line-clamp-2 text-sm",
              task.status === 'done' && "opacity-70"
            )}>
              {task.description}
            </p>
          )}
          {task.due_date && (
            <p className="text-sm mt-2 text-muted-foreground">
              Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('todo')}
              disabled={updating || task.status === 'todo'}
              className={cn(task.status === 'todo' && "border-blue-500")}
            >
              <Circle className="h-4 w-4 mr-1" />
              To Do
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('running')}
              disabled={updating || task.status === 'running'}
              className={cn(task.status === 'running' && "border-amber-500")}
            >
              <Clock className="h-4 w-4 mr-1" />
              In Progress
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('done')}
              disabled={updating || task.status === 'done'}
              className={cn(task.status === 'done' && "border-green-500")}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Done
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              aria-label="Edit task"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}