"use client";

import { Task } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { format } from 'date-fns';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import dynamic from 'next/dynamic';

interface TaskReportProps {
  tasks: Task[];
}

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  task: {
    marginBottom: 15,
    padding: 10,
    borderBottom: 1,
    borderBottomColor: '#E5E7EB',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskDetail: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 3,
  },
  stats: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F3F4F6',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

// PDF Document component
const TaskPDF = ({ tasks }: TaskReportProps) => {
  const totalHours = tasks.reduce((sum, task) => sum + (task.hours_spent || 0), 0);
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const pendingTasks = tasks.filter(task => task.status !== 'done').length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Task Report</Text>
        
        <View style={styles.stats}>
          <Text style={styles.statsTitle}>Summary</Text>
          <Text style={styles.taskDetail}>Total Tasks: {tasks.length}</Text>
          <Text style={styles.taskDetail}>Completed Tasks: {completedTasks}</Text>
          <Text style={styles.taskDetail}>Pending Tasks: {pendingTasks}</Text>
          <Text style={styles.taskDetail}>Total Hours Spent: {totalHours}</Text>
        </View>

        <View style={styles.section}>
          {tasks.map((task, index) => (
            <View key={task.id} style={styles.task}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              {task.description && (
                <Text style={styles.taskDetail}>Description: {task.description}</Text>
              )}
              <Text style={styles.taskDetail}>Status: {task.status}</Text>
              <Text style={styles.taskDetail}>Hours Spent: {task.hours_spent || 0}</Text>
              {task.due_date && (
                <Text style={styles.taskDetail}>
                  Due Date: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                </Text>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

// Dynamic import of PDFDownloadLink to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { 
    ssr: false,
    loading: () => (
      <Button disabled>
        <FileDown className="h-4 w-4 mr-2" />
        Loading PDF...
      </Button>
    )
  }
);

export function TaskReport({ tasks }: TaskReportProps) {
  return (
    <PDFDownloadLink
      document={<TaskPDF tasks={tasks} />}
      fileName={`task-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`}
    >
      {({ loading }) => (
        <Button disabled={loading}>
          <FileDown className="h-4 w-4 mr-2" />
          {loading ? 'Generating Report...' : 'Download Report'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}