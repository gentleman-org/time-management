<template>
  <div class="four-quadrants-container">
    <!-- 标题栏 -->
    <div class="header">
      <h1>时间管理 - 四象限法则</h1>
      <el-button type="primary" @click="showAddDialog = true" :icon="Plus">
        添加任务
      </el-button>
    </div>

    <!-- 四象限主体 -->
    <div class="quadrants-wrapper">
      <!-- 四象限网格 -->
      <div class="quadrants-grid">
        <!-- 第二象限：重要+不紧急 -->
        <div class="quadrant quadrant-2">
          <div class="quadrant-title">第二象限 &emsp; 重要 · 不紧急</div>
          <draggable
            v-model="quadrant2Items"
            group="tasks"
            @change="onDragChange"
            class="draggable-area"
            :component-data="{ tag: 'div', type: 'transition-group', name: 'flip-list' }"
          >
            <template #item="{ element }">
              <TaskItem :task="element" @delete="deleteTask" />
            </template>
          </draggable>
        </div>

        <!-- 第一象限：重要+紧急 -->
        <div class="quadrant quadrant-1">
          <div class="quadrant-title">第一象限 &emsp; 重要 · 紧急</div>
          <draggable
            v-model="quadrant1Items"
            group="tasks"
            @change="onDragChange"
            class="draggable-area"
            :component-data="{ tag: 'div', type: 'transition-group', name: 'flip-list' }"
          >
            <template #item="{ element }">
              <TaskItem :task="element" @delete="deleteTask" />
            </template>
          </draggable>
        </div>

        <!-- 第三象限：不重要+不紧急 -->
        <div class="quadrant quadrant-3">
          <div class="quadrant-title">第三象限 &emsp; 不重要 · 不紧急</div>
          <draggable
            v-model="quadrant3Items"
            group="tasks"
            @change="onDragChange"
            class="draggable-area"
            :component-data="{ tag: 'div', type: 'transition-group', name: 'flip-list' }"
          >
            <template #item="{ element }">
              <TaskItem :task="element" @delete="deleteTask" />
            </template>
          </draggable>
        </div>

        <!-- 第四象限：不重要+紧急 -->
        <div class="quadrant quadrant-4">
          <div class="quadrant-title">第四象限 &emsp; 不重要 · 紧急</div>
          <draggable
            v-model="quadrant4Items"
            group="tasks"
            @change="onDragChange"
            class="draggable-area"
            :component-data="{ tag: 'div', type: 'transition-group', name: 'flip-list' }"
          >
            <template #item="{ element }">
              <TaskItem :task="element" @delete="deleteTask" />
            </template>
          </draggable>
        </div>

        <!-- 坐标轴 -->
        <div class="axis-horizontal"></div>
        <div class="axis-vertical"></div>
      </div>
    </div>

    <!-- 添加任务对话框 -->
    <el-dialog v-model="showAddDialog" title="添加新任务" width="500px">
      <el-form :model="newTask" label-width="100px">
        <el-form-item label="任务名称" required>
          <el-input v-model="newTask.name" placeholder="请输入任务名称" />
        </el-form-item>
        
        <el-form-item label="所在象限" required>
          <el-select v-model="newTask.quadrant" placeholder="请选择象限">
            <el-option label="第一象限（重要·紧急）" value="1" />
            <el-option label="第二象限（重要·不紧急）" value="2" />
            <el-option label="第三象限（不重要·不紧急）" value="3" />
            <el-option label="第四象限（不重要·紧急）" value="4" />
          </el-select>
        </el-form-item>

        <el-form-item label="截止时间">
          <el-date-picker
            v-model="newTask.deadline"
            type="datetime"
            placeholder="选择截止时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            style="width: 100%;"
          />
        </el-form-item>

        <el-form-item label="优先级">
          <el-select v-model="newTask.priority" placeholder="选择优先级">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addTask">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import TaskItem from './TaskItem.vue'

// 定义任务类型
interface Task {
  id: number
  name: string
  deadline?: string
  priority: 'low' | 'medium' | 'high'
  createTime: string
  notified1h?: boolean
  notified30m?: boolean
  notifiedExpired?: boolean
}

// 定义新任务表单类型
interface NewTaskForm {
  name: string
  quadrant: string
  deadline: string
  priority: 'low' | 'medium' | 'high'
}

// 响应式数据
const showAddDialog = ref<boolean>(false)
const quadrant1Items = ref<Task[]>([])
const quadrant2Items = ref<Task[]>([])
const quadrant3Items = ref<Task[]>([])
const quadrant4Items = ref<Task[]>([])

// 新任务表单
const newTask = reactive<NewTaskForm>({
  name: '',
  quadrant: '',
  deadline: '',
  priority: 'medium'
})

// 通知定时器
let notificationTimer: number | null = null

// 添加任务
const addTask = () => {
  if (!newTask.name || !newTask.quadrant) {
    ElMessage.error('请填写任务名称和选择象限')
    return
  }

  const task = {
    id: Date.now(),
    name: newTask.name,
    deadline: newTask.deadline,
    priority: newTask.priority,
    createTime: new Date().toLocaleString()
  }

  // 根据象限添加到对应列表
  switch (newTask.quadrant) {
    case '1':
      insertTask(quadrant1Items.value, task)
      break
    case '2':
      insertTask(quadrant2Items.value, task)
      break
    case '3':
      insertTask(quadrant3Items.value, task)
      break
    case '4':
      insertTask(quadrant4Items.value, task)
      break
  }

  // 重置表单
  Object.assign(newTask, {
    name: '',
    quadrant: '',
    deadline: '',
    priority: 'medium'
  })

  showAddDialog.value = false
  ElMessage.success('任务添加成功')
  
  // 保存到本地存储
  saveToLocalStorage()
  
  // 重新设置通知
  setupNotifications()
}

// 找到优先级插入到对应象限
function insertTask(quadrants: Task[], task: Task) {
  for (let i = 0; i < quadrants.length; i++) {
    const quadrant = quadrants[i];

    if (quadrant.priority === task.priority) {
      quadrants.splice(i, 0, task)
      return
    }
  }
  quadrants.push(task)
}

// 拖拽变化处理
const onDragChange = () => {
  saveToLocalStorage()
}

// 删除任务
const deleteTask = (taskId: number) => {
  const allQuadrants = [quadrant1Items, quadrant2Items, quadrant3Items, quadrant4Items]
  
  allQuadrants.forEach(quadrant => {
    const index = quadrant.value.findIndex(task => task.id === taskId)
    if (index > -1) {
      quadrant.value.splice(index, 1)
    }
  })
  
  saveToLocalStorage()
  setupNotifications()
  ElMessage.success('任务删除成功')
}

// 保存到本地存储
const saveToLocalStorage = () => {
  const data = {
    quadrant1: quadrant1Items.value,
    quadrant2: quadrant2Items.value,
    quadrant3: quadrant3Items.value,
    quadrant4: quadrant4Items.value
  }
  localStorage.setItem('timeManagementTasks', JSON.stringify(data))
}

// 从本地存储加载
const loadFromLocalStorage = () => {
  const data = localStorage.getItem('timeManagementTasks')
  if (data) {
    const parsed = JSON.parse(data)
    quadrant1Items.value = parsed.quadrant1 || []
    quadrant2Items.value = parsed.quadrant2 || []
    quadrant3Items.value = parsed.quadrant3 || []
    quadrant4Items.value = parsed.quadrant4 || []
  }
}

// 设置截止时间通知
const setupNotifications = () => {
  // 清除之前的定时器
  if (notificationTimer) {
    clearInterval(notificationTimer)
  }

  // 每分钟检查一次
  notificationTimer = setInterval(() => {
    checkDeadlines()
  }, 60000)

  // 立即检查一次
  checkDeadlines()
}

// 检查截止时间
const checkDeadlines = () => {
  const now = new Date()
  const allTasks = [
    ...quadrant1Items.value,
    ...quadrant2Items.value,
    ...quadrant3Items.value,
    ...quadrant4Items.value
  ]

  allTasks.forEach(task => {
    if (task.deadline) {
      const deadline = new Date(task.deadline)
      const timeDiff = deadline.getTime() - now.getTime()
      const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60))

      // 提前1小时提醒
      if (hoursDiff === 1 && !task.notified1h) {
        showNotification(task, '1小时后到期')
        task.notified1h = true
      }
      
      // 提前30分钟提醒
      else if (timeDiff <= 30 * 60 * 1000 && timeDiff > 0 && !task.notified30m) {
        showNotification(task, '30分钟后到期')
        task.notified30m = true
      }
      
      // 到期提醒
      else if (timeDiff <= 0 && !task.notifiedExpired) {
        showNotification(task, '已到期', 'error')
        task.notifiedExpired = true
      }
    }
  })

  saveToLocalStorage()
}

// 显示通知
const showNotification = (task: Task, message: string, type: 'success' | 'warning' | 'info' | 'error' = 'warning') => {
  // 浏览器通知
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`任务提醒：${task.name}`, {
      body: message,
      icon: '/favicon.ico'
    })
  }

  // Element Plus 通知
  ElNotification({
    title: '任务提醒',
    message: `${task.name} - ${message}`,
    type: type,
    duration: 0 // 不自动关闭
  })
}

// 请求通知权限
const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

// 组件挂载时
onMounted(() => {
  loadFromLocalStorage()
  requestNotificationPermission()
  setupNotifications()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (notificationTimer) {
    clearInterval(notificationTimer)
  }
})
</script>

<style scoped>
.four-quadrants-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  color: white;
}

.header h1 {
  font-size: 24px;
  font-weight: 600;
}

.quadrants-wrapper {
  flex: 1;
  display: flex;
  position: relative;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.quadrants-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 6px;
  position: relative;
}

.quadrant {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  overflow: hidden;
  height: calc(50vh - 68px);
}

.quadrant-1 {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

.quadrant-2 {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.quadrant-3 {
  background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
}

.quadrant-4 {
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
}

.quadrant-title {
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 12px;
  color: #333;
  line-height: 1.3;
}

.draggable-area {
  min-height: 200px;
  height: calc(100% - 30px);
  overflow-y: auto;
}

/* 坐标轴样式 */
.axis-horizontal {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 1;
}

.axis-vertical {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  z-index: 1;
}

/* 过渡动画 */
.flip-list-move,
.flip-list-enter-active,
.flip-list-leave-active {
  transition: all 0.3s ease;
}

.flip-list-enter-from,
.flip-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.flip-list-leave-active {
  position: absolute;
}

/* 滚动条样式 */
.draggable-area::-webkit-scrollbar {
  width: 4px;
}

.draggable-area::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.draggable-area::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.draggable-area::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style> 