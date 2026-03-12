package com.taskmanager.system.repository;

import com.taskmanager.system.entity.Task;
import com.taskmanager.system.entity.TaskPriority;
import com.taskmanager.system.entity.TaskStatus;
import com.taskmanager.system.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    Page<Task> findByUser(User user, Pageable pageable);
    
    Page<Task> findByUserAndStatus(User user, TaskStatus status, Pageable pageable);
    
    Page<Task> findByUserAndPriority(User user, TaskPriority priority, Pageable pageable);
    
    Page<Task> findByUserAndStatusAndPriority(User user, TaskStatus status, TaskPriority priority, Pageable pageable);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:priority IS NULL OR t.priority = :priority)")
    Page<Task> findByUserWithFilters(
            @Param("user") User user,
            @Param("status") TaskStatus status,
            @Param("priority") TaskPriority priority,
            Pageable pageable);
    
    @Query("SELECT t FROM Task t WHERE " +
           "(:status IS NULL OR t.status = :status) " +
           "AND (:priority IS NULL OR t.priority = :priority)")
    Page<Task> findAllWithFilters(
            @Param("status") TaskStatus status,
            @Param("priority") TaskPriority priority,
            Pageable pageable);
    
    boolean existsByIdAndUser(Long id, User user);
}
