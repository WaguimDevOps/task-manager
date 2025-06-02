"use client";

import { useState } from 'react';
import { Task } from '@/lib/supabase/types';
import { TaskItem } from '@/components/task-item';
import { TaskEdit } from '@/components/task-edit';
import { Dialog } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog } from '@/components/ui/alert-dialog';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (id: string) => void;
}

export function TaskList({ tasks, loading, onTaskUpdated, onTaskDeleted }: TaskListProps) {
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleEditClick = (task: Task) => {
    setEditTask(task);
    setOpenEdit(true);
  };

  const handleDeleteClick = (task: Task) => {
    setDeleteTask(task);
    setOpenDelete(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setEditTask(null);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
    setDeleteTask(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border border-border">
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-muted-foreground mb-2">No tasks found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or create a new task</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onEdit={() => handleEditClick(task)} 
          onDelete={() => handleDeleteClick(task)}
          onStatusUpdate={onTaskUpdated}
        />
      ))}

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        {editTask && (
          <TaskEdit 
            task={editTask} 
            onSave={onTaskUpdated} 
            onCancel={handleEditClose} 
          />
        )}
      </Dialog>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        {deleteTask && (
          <DeleteConfirmation
            task={deleteTask}
            onConfirm={() => {
              onTaskDeleted(deleteTask.id);
              handleDeleteClose();
            }}
            onCancel={handleDeleteClose}
          />
        )}
      </AlertDialog>
    </div>
  );
}

import { 
  AlertDialogContent, 
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';

function DeleteConfirmation({ 
  task, 
  onConfirm, 
  onCancel 
}: { 
  task: Task, 
  onConfirm: () => void, 
  onCancel: () => void 
}) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete the task "{task.title}". 
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground">
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}