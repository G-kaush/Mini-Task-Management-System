'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context';
import {
  TaskCard,
  TaskForm,
  Modal,
  TaskFiltersComponent,
  Pagination,
  LoadingSpinner,
  Button,
} from '@/components';
import { taskService } from '@/services';
import { Task, TaskRequest, TaskFilters, PageResponse } from '@/types';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';

export default function TasksPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<PageResponse<Task> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filters, setFilters] = useState<TaskFilters>({
    page: 0,
    size: 6,
    sortBy: 'dueDate',
    sortDir: 'asc',
  });

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return; // Don't fetch if not authenticated
    
    try {
      setIsLoading(true);
      const data = await taskService.getTasks(filters);
      setTasks(data);
      setError('');
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      // Don't show error if it's an auth error (redirect will handle it)
      if (axiosError.response?.status !== 401) {
        setError(axiosError.response?.data?.message || 'Failed to fetch tasks');
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters, isAuthenticated]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, fetchTasks]);

  const handleCreateTask = async (data: TaskRequest) => {
    setIsSubmitting(true);
    try {
      await taskService.createTask(data);
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError.response?.data?.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (data: TaskRequest) => {
    if (!editingTask) return;
    setIsSubmitting(true);
    try {
      await taskService.updateTask(editingTask.id, data);
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError.response?.data?.message || 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(taskId);
      fetchTasks();
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      await taskService.markAsCompleted(taskId);
      fetchTasks();
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError.response?.data?.message || 'Failed to complete task');
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const resetFilters = () => {
    setFilters({
      page: 0,
      size: 6,
      sortBy: 'dueDate',
      sortDir: 'asc',
    });
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">
            {user?.role === 'ADMIN' ? 'Viewing all tasks (Admin)' : 'Manage your tasks'}
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ New Task</Button>
      </div>

      <TaskFiltersComponent
        filters={filters}
        onFilterChange={setFilters}
        onReset={resetFilters}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
          <button
            onClick={() => setError('')}
            className="float-right text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : tasks && tasks.content.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.content.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditModal}
                onDelete={handleDeleteTask}
                onComplete={handleCompleteTask}
              />
            ))}
          </div>

          <Pagination
            currentPage={tasks.pageNumber}
            totalPages={tasks.totalPages}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />

          <div className="text-center text-sm text-gray-500 mt-4">
            Showing {tasks.content.length} of {tasks.totalElements} tasks
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
          <p className="text-gray-500 mt-1">
            {filters.status || filters.priority
              ? 'Try adjusting your filters'
              : 'Get started by creating your first task'}
          </p>
          {!filters.status && !filters.priority && (
            <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
              Create Task
            </Button>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={closeModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
