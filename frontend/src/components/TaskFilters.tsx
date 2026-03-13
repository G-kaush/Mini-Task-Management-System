'use client';

import { TaskFilters, TaskStatus, TaskPriority } from '@/types';
import { Select, Button } from './ui';

interface TaskFiltersProps {
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
  onReset: () => void;
}

export function TaskFiltersComponent({ filters, onFilterChange, onReset }: TaskFiltersProps) {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Done' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priority' },
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'title', label: 'Title' },
  ];

  const sortDirOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <Select
          label="Status"
          value={filters.status || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              status: e.target.value as TaskStatus | undefined || undefined,
              page: 0,
            })
          }
          options={statusOptions}
        />

        <Select
          label="Priority"
          value={filters.priority || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              priority: e.target.value as TaskPriority | undefined || undefined,
              page: 0,
            })
          }
          options={priorityOptions}
        />

        <Select
          label="Sort By"
          value={filters.sortBy || 'dueDate'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              sortBy: e.target.value as TaskFilters['sortBy'],
            })
          }
          options={sortOptions}
        />

        <Select
          label="Order"
          value={filters.sortDir || 'asc'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              sortDir: e.target.value as 'asc' | 'desc',
            })
          }
          options={sortDirOptions}
        />

        <Button variant="secondary" onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
