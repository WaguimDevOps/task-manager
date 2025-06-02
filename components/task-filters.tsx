"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { TasksFilter } from '@/lib/api/tasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CheckCircle, Circle, Clock, Calendar as CalendarIcon, SortAsc, SortDesc, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  filters: TasksFilter;
  onFiltersChange: (filters: TasksFilter) => void;
}

export function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    filters.dateFrom ? new Date(filters.dateFrom) : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    filters.dateTo ? new Date(filters.dateTo) : undefined
  );

  useEffect(() => {
    if (dateFrom) {
      onFiltersChange({ dateFrom: dateFrom.toISOString() });
    }
  }, [dateFrom]);

  useEffect(() => {
    if (dateTo) {
      onFiltersChange({ dateTo: dateTo.toISOString() });
    }
  }, [dateTo]);

  const handleStatusChange = (status: string) => {
    onFiltersChange({ status: status as TasksFilter['status'] });
  };

  const handleSortChange = (sortOrder: string) => {
    onFiltersChange({ sortOrder: sortOrder as TasksFilter['sortOrder'] });
  };

  const clearDateFilter = (type: 'from' | 'to') => {
    if (type === 'from') {
      setDateFrom(undefined);
      onFiltersChange({ dateFrom: undefined });
    } else {
      setDateTo(undefined);
      onFiltersChange({ dateTo: undefined });
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          {/* Status Filter */}
          <div className="w-full md:w-auto">
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select
              value={filters.status || 'all'}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="todo">
                  <div className="flex items-center">
                    <Circle className="h-4 w-4 mr-2 text-blue-500" />
                    <span>To Do</span>
                  </div>
                </SelectItem>
                <SelectItem value="running">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-amber-500" />
                    <span>In Progress</span>
                  </div>
                </SelectItem>
                <SelectItem value="done">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Done</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date From Filter */}
          <div className="w-full md:w-auto">
            <label className="text-sm font-medium mb-1 block">From Date</label>
            <div className="flex">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal md:w-[200px]",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Select from date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {dateFrom && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => clearDateFilter('from')}
                  className="ml-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Date To Filter */}
          <div className="w-full md:w-auto">
            <label className="text-sm font-medium mb-1 block">To Date</label>
            <div className="flex">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal md:w-[200px]",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Select to date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {dateTo && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => clearDateFilter('to')}
                  className="ml-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Sort Order */}
          <div className="w-full md:w-auto">
            <label className="text-sm font-medium mb-1 block">Sort By</label>
            <Select
              value={filters.sortOrder || 'newest'}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center">
                    <SortDesc className="h-4 w-4 mr-2" />
                    <span>Newest First</span>
                  </div>
                </SelectItem>
                <SelectItem value="oldest">
                  <div className="flex items-center">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <span>Oldest First</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}