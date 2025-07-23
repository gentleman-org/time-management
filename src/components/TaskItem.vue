<template>
  <div class="task-item" :class="priorityClass">
    <div class="task-header">
      <span class="task-name">{{ task.name }}</span>
      <el-button 
        type="danger" 
        size="small" 
        :icon="Delete" 
        circle
        @click="$emit('delete', task.id)"
        class="delete-btn"
      />
    </div>
    
    <div class="task-details" v-if="task.priority">
      <div class="task-priority">
        <el-icon><Flag /></el-icon>
        <span>{{ getPriorityText(task.priority) }}</span>
      </div>
    </div>
    
    <div class="task-create-time">
      <div class="task-deadline" v-if="task.deadline">
        <el-icon><Clock /></el-icon>
        <span>{{ formatDeadline(task.deadline) }}</span>
        <span class="deadline-status" :class="deadlineStatus">{{ getDeadlineStatusText() }}</span>
      </div>
      <p>创建于: {{ task.createTime }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Delete, Clock, Flag } from '@element-plus/icons-vue'

// 定义任务类型
interface Task {
  id: number
  name: string
  deadline?: string
  priority: 'low' | 'medium' | 'high'
  createTime: string
}

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  delete: [taskId: number]
}>()

// 优先级样式类
const priorityClass = computed(() => {
  return `priority-${props.task.priority || 'medium'}`
})

// 截止时间状态
const deadlineStatus = computed(() => {
  if (!props.task.deadline) return ''
  
  const now = new Date()
  const deadline = new Date(props.task.deadline)
  const timeDiff = deadline.getTime() - now.getTime()
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60))
  
  if (timeDiff < 0) return 'overdue'
  if (hoursDiff <= 1) return 'urgent'
  if (hoursDiff <= 24) return 'warning'
  return 'normal'
})

// 格式化截止时间
const formatDeadline = (deadline: string) => {
  const date = new Date(deadline)
  const now = new Date()
  const timeDiff = date.getTime() - now.getTime()
  
  if (timeDiff < 0) {
    return `${deadline} (已过期)`
  }
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) {
    return `${deadline} (${days}天${hours}小时后)`
  } else if (hours > 0) {
    return `${deadline} (${hours}小时后)`
  } else {
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
    return `${deadline} (${minutes}分钟后)`
  }
}

// 获取截止时间状态文本
const getDeadlineStatusText = () => {
  switch (deadlineStatus.value) {
    case 'overdue': return '已过期'
    case 'urgent': return '紧急'
    case 'warning': return '即将到期'
    default: return ''
  }
}

// 获取优先级文本
const getPriorityText = (priority: 'low' | 'medium' | 'high') => {
  const priorityMap: Record<string, string> = {
    low: '低优先级',
    medium: '中优先级', 
    high: '高优先级'
  }
  return priorityMap[priority] || '中优先级'
}
</script>

<style scoped>
.task-item {
  background: white;
  border-radius: 8px;
  padding: 6px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #ddd;
  cursor: move;
  transition: all 0.3s ease;
}

.task-item + .task-item {
  margin-top: 6px;
}

.task-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.task-item.priority-high {
  border-left-color: #f56565;
}

.task-item.priority-medium {
  border-left-color: #ed8936;
}

.task-item.priority-low {
  border-left-color: #38a169;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.task-name {
  font-weight: 600;
  color: #2d3748;
  flex: 1;
  line-height: 1.4;
  word-break: break-word;
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
  margin-left: 8px;
  flex-shrink: 0;
}

.task-item:hover .delete-btn {
  opacity: 1;
}

.task-details {
  margin-bottom: 8px;
}

.task-deadline,
.task-priority {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.task-deadline .el-icon,
.task-priority .el-icon {
  font-size: 14px;
}

.deadline-status {
  font-weight: 600;
  margin-left: 4px;
}

.deadline-status.overdue {
  color: #e53e3e;
}

.deadline-status.urgent {
  color: #dd6b20;
}

.deadline-status.warning {
  color: #d69e2e;
}

.task-create-time {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: #a0aec0;
  border-top: 1px solid #edf2f7;
  padding-top: 6px;
}

/* 拖拽时的样式 */
.sortable-ghost {
  opacity: 0.5;
}

.sortable-chosen {
  transform: rotate(5deg);
}
</style> 