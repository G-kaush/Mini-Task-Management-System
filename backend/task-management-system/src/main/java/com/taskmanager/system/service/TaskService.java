package com.taskmanager.system.service;

import com.taskmanager.system.dto.PageResponse;
import com.taskmanager.system.dto.TaskRequest;
import com.taskmanager.system.dto.TaskResponse;
import com.taskmanager.system.entity.Role;
import com.taskmanager.system.entity.Task;
import com.taskmanager.system.entity.TaskPriority;
import com.taskmanager.system.entity.TaskStatus;
import com.taskmanager.system.entity.User;
import com.taskmanager.system.exception.ForbiddenException;
import com.taskmanager.system.exception.ResourceNotFoundException;
import com.taskmanager.system.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    @Transactional
    public TaskResponse createTask(TaskRequest request, User user) {
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .dueDate(request.getDueDate())
                .user(user)
                .build();

        Task savedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(savedTask);
    }

    @Transactional
    public TaskResponse updateTask(Long taskId, TaskRequest request, User user) {
        Task task = getTaskById(taskId);

        // Check if user owns the task or is admin
        if (!task.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new ForbiddenException("You don't have permission to update this task");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        task.setDueDate(request.getDueDate());

        Task updatedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(updatedTask);
    }

    @Transactional
    public void deleteTask(Long taskId, User user) {
        Task task = getTaskById(taskId);

        // Check if user owns the task or is admin
        if (!task.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new ForbiddenException("You don't have permission to delete this task");
        }

        taskRepository.delete(task);
    }

    public TaskResponse getTask(Long taskId, User user) {
        Task task = getTaskById(taskId);

        // Check if user owns the task or is admin
        if (!task.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new ForbiddenException("You don't have permission to view this task");
        }

        return TaskResponse.fromEntity(task);
    }

    public PageResponse<TaskResponse> getTasks(
            User user,
            TaskStatus status,
            TaskPriority priority,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Task> taskPage;

        if (user.getRole() == Role.ADMIN) {
            // Admin can see all tasks
            taskPage = taskRepository.findAllWithFilters(status, priority, pageable);
        } else {
            // Regular users can only see their own tasks
            taskPage = taskRepository.findByUserWithFilters(user, status, priority, pageable);
        }

        List<TaskResponse> content = taskPage.getContent()
                .stream()
                .map(TaskResponse::fromEntity)
                .toList();

        return PageResponse.<TaskResponse>builder()
                .content(content)
                .pageNumber(taskPage.getNumber())
                .pageSize(taskPage.getSize())
                .totalElements(taskPage.getTotalElements())
                .totalPages(taskPage.getTotalPages())
                .last(taskPage.isLast())
                .first(taskPage.isFirst())
                .build();
    }

    @Transactional
    public TaskResponse markTaskAsCompleted(Long taskId, User user) {
        Task task = getTaskById(taskId);

        // Check if user owns the task or is admin
        if (!task.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new ForbiddenException("You don't have permission to update this task");
        }

        task.setStatus(TaskStatus.DONE);
        Task updatedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(updatedTask);
    }

    private Task getTaskById(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
    }
}
