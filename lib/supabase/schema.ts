import { Database } from '@/lib/supabase/types';

/**
 * Supabase Schema
 * 
 * This schema defines the structure of our Supabase database for the task management system.
 * 
 * Tables:
 * 1. tasks - Stores all task information including title, description, status, and dates
 */

export const schema = {
  name: 'Task Manager',
  tables: [
    {
      name: 'tasks',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          isNullable: false,
          defaultValue: { type: 'function', value: 'uuid_generate_v4()' }
        },
        {
          name: 'title',
          type: 'text',
          isNullable: false
        },
        {
          name: 'description',
          type: 'text',
          isNullable: true
        },
        {
          name: 'status',
          type: 'text',
          isNullable: false,
          defaultValue: { type: 'string', value: 'todo' },
          enum: ['done', 'running', 'todo']
        },
        {
          name: 'hours_spent',
          type: 'numeric',
          isNullable: true,
          defaultValue: { type: 'number', value: 0 }
        },
        {
          name: 'due_date',
          type: 'timestamptz',
          isNullable: true
        },
        {
          name: 'created_at',
          type: 'timestamptz',
          isNullable: false,
          defaultValue: { type: 'function', value: 'now()' }
        },
        {
          name: 'updated_at',
          type: 'timestamptz',
          isNullable: false,
          defaultValue: { type: 'function', value: 'now()' }
        }
      ],
      indexes: [
        {
          name: 'tasks_status_idx',
          columns: ['status']
        },
        {
          name: 'tasks_created_at_idx',
          columns: ['created_at']
        },
        {
          name: 'tasks_due_date_idx',
          columns: ['due_date']
        }
      ]
    }
  ]
};