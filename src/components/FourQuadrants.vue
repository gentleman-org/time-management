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
          <div class="grid-container">
            <div 
              v-for="row in 4" 
              :key="`q2-row-${row}`"
              class="grid-row"
            >
              <div 
                v-for="col in 4" 
                :key="`q2-cell-${row}-${col}`"
                class="grid-cell"
                :class="{ 'has-task': getTaskAtPosition(quadrant2Items, -(5-col), 5-row) }"
                @drop="onDropToGrid($event, 2, -(5-col), 5-row)"
                @dragover="onDragOver"
                @dragenter="onDragEnter"
                @click="onCellClick(2, -(5-col), 5-row)"
                :data-x="-(5-col)"
                :data-y="5-row"
              >
                <TaskItem 
                  v-if="getTaskAtPosition(quadrant2Items, -(5-col), 5-row)"
                  :task="getTaskAtPosition(quadrant2Items, -(5-col), 5-row)!"
                  @delete="deleteTask"
                  @dragstart="onDragStart($event, getTaskAtPosition(quadrant2Items, -(5-col), 5-row)!)"
                  draggable="true"
                  class="grid-task"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 第一象限：重要+紧急 -->
        <div class="quadrant quadrant-1">
          <div class="quadrant-title">第一象限 &emsp; 重要 · 紧急</div>
          <div class="grid-container">
            <div 
              v-for="row in 4" 
              :key="`q1-row-${row}`"
              class="grid-row"
            >
              <div 
                v-for="col in 4" 
                :key="`q1-cell-${row}-${col}`"
                class="grid-cell"
                :class="{ 'has-task': getTaskAtPosition(quadrant1Items, col, 5-row) }"
                @drop="onDropToGrid($event, 1, col, 5-row)"
                @dragover="onDragOver"
                @dragenter="onDragEnter"
                @click="onCellClick(1, col, 5-row)"
                :data-x="col"
                :data-y="5-row"
              >
                <TaskItem 
                  v-if="getTaskAtPosition(quadrant1Items, col, 5-row)"
                  :task="getTaskAtPosition(quadrant1Items, col, 5-row)!"
                  @delete="deleteTask"
                  @dragstart="onDragStart($event, getTaskAtPosition(quadrant1Items, col, 5-row)!)"
                  draggable="true"
                  class="grid-task"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 第三象限：不重要+不紧急 -->
        <div class="quadrant quadrant-3">
          <div class="quadrant-title">第三象限 &emsp; 不重要 · 不紧急</div>
          <div class="grid-container">
            <div 
              v-for="row in 4" 
              :key="`q3-row-${row}`"
              class="grid-row"
            >
              <div 
                v-for="col in 4" 
                :key="`q3-cell-${row}-${col}`"
                class="grid-cell"
                :class="{ 'has-task': getTaskAtPosition(quadrant3Items, -(5-col), -row) }"
                @drop="onDropToGrid($event, 3, -(5-col), -row)"
                @dragover="onDragOver"
                @dragenter="onDragEnter"
                @click="onCellClick(3, -(5-col), -row)"
                :data-x="-(5-col)"
                :data-y="-row"
              >
                <TaskItem 
                  v-if="getTaskAtPosition(quadrant3Items, -(5-col), -row)"
                  :task="getTaskAtPosition(quadrant3Items, -(5-col), -row)!"
                  @delete="deleteTask"
                  @dragstart="onDragStart($event, getTaskAtPosition(quadrant3Items, -(5-col), -row)!)"
                  draggable="true"
                  class="grid-task"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 第四象限：不重要+紧急 -->
        <div class="quadrant quadrant-4">
          <div class="quadrant-title">第四象限 &emsp; 不重要 · 紧急</div>
          <div class="grid-container">
            <div 
              v-for="row in 4" 
              :key="`q4-row-${row}`"
              class="grid-row"
            >
              <div 
                v-for="col in 4" 
                :key="`q4-cell-${row}-${col}`"
                class="grid-cell"
                :class="{ 'has-task': getTaskAtPosition(quadrant4Items, col, -row) }"
                @drop="onDropToGrid($event, 4, col, -row)"
                @dragover="onDragOver"
                @dragenter="onDragEnter"
                @click="onCellClick(4, col, -row)"
                :data-x="col"
                :data-y="-row"
              >
                <TaskItem 
                  v-if="getTaskAtPosition(quadrant4Items, col, -row)"
                  :task="getTaskAtPosition(quadrant4Items, col, -row)!"
                  @delete="deleteTask"
                  @dragstart="onDragStart($event, getTaskAtPosition(quadrant4Items, col, -row)!)"
                  draggable="true"
                  class="grid-task"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 坐标轴 -->
        <!-- <div class="axis-horizontal"></div>
        <div class="axis-vertical"></div> -->
        
        <!-- 坐标轴标签 -->
        <div class="axis-labels">
          <div class="axis-label top">↑重要</div>
          <div class="axis-label right">紧急 →</div>
          <!-- <div class="axis-label bottom">Y轴负方向 ↓</div>
          <div class="axis-label left">← X轴负方向</div> -->
          <div class="axis-label center">(0,0)</div>
        </div>
      </div>
    </div>

    <!-- 添加任务对话框 -->
    <el-dialog v-model="showAddDialog" title="添加新任务" width="650px">
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

        <!-- <el-form-item label="优先级">
          <el-input-number 
            v-model="newTask.priority" 
            :min="1" 
            :max="4" 
            :step="1"
            style="width: 100%;"
          />
          <div class="form-help-text">数字1-4，数值越大优先级越高</div>
        </el-form-item> -->

        <el-form-item label="坐标位置">
          <div class="coordinate-inputs">
            <div class="coordinate-input">
              <label>X坐标:</label>
              <el-input-number 
                v-model="newTask.x" 
                :min="-4" 
                :max="4" 
                :step="1"
                style="width: 120px;"
              />
            </div>
            <div class="coordinate-input">
              <label>Y坐标:</label>
              <el-input-number 
                v-model="newTask.y" 
                :min="-4" 
                :max="4" 
                :step="1"
                style="width: 120px;"
              />
            </div>
          </div>
          <div class="form-help-text">坐标范围-5到5，原点在中心。第一象限(+,+)，第二象限(-,+)，第三象限(-,-)，第四象限(+,-)</div>
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
import TaskItem from './TaskItem.vue'

// 定义任务类型
interface Task {
  id: number
  name: string
  deadline?: string
  x: number // x坐标
  y: number // y坐标
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
  x: number
  y: number
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
  x: 1,
  y: 1
})

// 当前拖拽的任务
let draggedTask: Task | null = null

// 通知定时器
let notificationTimer: number | null = null

// 添加任务
const addTask = () => {
  if (!newTask.name || !newTask.quadrant) {
    ElMessage.error('请填写任务名称和选择象限')
    return
  }

  // 验证坐标范围
  if (newTask.x < -4 || newTask.x > 4 || newTask.y < -4 || newTask.y > 4) {
    ElMessage.error('坐标必须在-4到4范围内')
    return
  }

  // 验证坐标与象限的匹配
  const expectedQuadrant = getQuadrantFromCoordinates(newTask.x, newTask.y)
  if (expectedQuadrant !== parseInt(newTask.quadrant)) {
    ElMessage.error(`坐标 (${newTask.x}, ${newTask.y}) 应该属于第${expectedQuadrant}象限`)
    return
  }

  const targetQuadrant = getQuadrantArray(parseInt(newTask.quadrant))
  
  // 检查目标位置是否已有任务
  const existingTask = getTaskAtPosition(targetQuadrant.value, newTask.x, newTask.y)
  if (existingTask) {
    ElMessage.error(`坐标 (${newTask.x}, ${newTask.y}) 已有任务`)
    return
  }

  const task = {
    id: Date.now(),
    name: newTask.name,
    deadline: newTask.deadline,
    x: newTask.x,
    y: newTask.y,
    createTime: new Date().toLocaleString()
  }

  // 添加到目标象限
  targetQuadrant.value.push(task)

  // 重置表单
  Object.assign(newTask, {
    name: '',
    quadrant: '',
    deadline: '',
    x: 1,
    y: 1
  })

  showAddDialog.value = false
  ElMessage.success(`任务已添加到坐标 (${task.x}, ${task.y})`)
  
  // 保存到本地存储
  saveToLocalStorage()
  
  // 重新设置通知
  setupNotifications()
}

// 根据坐标优先级排序任务
const sortTasksByPriority = (tasks: Task[]) => {
  tasks.sort((a, b) => {
    const priorityA = a.x + a.y
    const priorityB = b.x + b.y
    return priorityB - priorityA // 降序排列，数值大的在前
  })
}

// 重新排序所有象限的任务
const sortAllQuadrants = () => {
  sortTasksByPriority(quadrant1Items.value)
  sortTasksByPriority(quadrant2Items.value)
  sortTasksByPriority(quadrant3Items.value)
  sortTasksByPriority(quadrant4Items.value)
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

// 获取指定位置的任务
const getTaskAtPosition = (tasks: Task[], x: number, y: number) => {
  return tasks.find(task => task.x === x && task.y === y)
}

// 开始拖拽
const onDragStart = (event: DragEvent, task: Task) => {
  draggedTask = task
  event.dataTransfer!.effectAllowed = 'move'
}

// 拖拽悬停
const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
}

// 拖拽进入
const onDragEnter = (event: DragEvent) => {
  event.preventDefault()
}

// 放置到网格
const onDropToGrid = (event: DragEvent, quadrant: number, x: number, y: number) => {
  event.preventDefault()
  
  if (!draggedTask) return

  // 检查目标位置是否已有任务
  const targetQuadrant = getQuadrantArray(quadrant)
  const existingTask = getTaskAtPosition(targetQuadrant.value, x, y)
  
  if (existingTask && existingTask.id !== draggedTask.id) {
    ElMessage.error('该位置已有任务')
    return
  }

  // 从原象限移除任务
  removeTaskFromAllQuadrants(draggedTask.id)

  // 更新任务坐标
  draggedTask.x = x
  draggedTask.y = y

  // 添加到目标象限
  targetQuadrant.value.push(draggedTask)

  // 保存到本地存储
  saveToLocalStorage()
  
  ElMessage.success(`任务已移动到坐标 (${x}, ${y})`)
  draggedTask = null
}

// 点击格子添加任务
const onCellClick = (quadrant: number, x: number, y: number) => {
  // 检查这个位置是否已有任务
  const targetQuadrant = getQuadrantArray(quadrant)
  const existingTask = getTaskAtPosition(targetQuadrant.value, x, y)
  
  if (existingTask) {
    // 如果已有任务，不执行任何操作
    return
  }

  // 自动填入表单
  newTask.quadrant = quadrant.toString()
  newTask.x = x
  newTask.y = y
  
  // 打开添加任务对话框
  showAddDialog.value = true
  
  const quadrantName = ['', '第一象限', '第二象限', '第三象限', '第四象限'][quadrant]
  ElMessage.info(`点击${quadrantName}坐标 (${x}, ${y})，请填写任务信息`)
}

// 获取象限数组引用
const getQuadrantArray = (quadrant: number) => {
  switch (quadrant) {
    case 1: return quadrant1Items
    case 2: return quadrant2Items
    case 3: return quadrant3Items
    case 4: return quadrant4Items
    default: return quadrant1Items
  }
}

// 从所有象限移除任务
const removeTaskFromAllQuadrants = (taskId: number) => {
  const allQuadrants = [quadrant1Items, quadrant2Items, quadrant3Items, quadrant4Items]
  
  allQuadrants.forEach(quadrant => {
    const index = quadrant.value.findIndex(task => task.id === taskId)
    if (index > -1) {
      quadrant.value.splice(index, 1)
    }
  })
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

// 根据坐标判断象限
const getQuadrantFromCoordinates = (x: number, y: number) => {
  if (x > 0 && y > 0) return 1  // 第一象限
  if (x < 0 && y > 0) return 2  // 第二象限
  if (x < 0 && y < 0) return 3  // 第三象限
  if (x > 0 && y < 0) return 4  // 第四象限
  return 1 // 默认第一象限
}

// 组件挂载时
onMounted(() => {
  loadFromLocalStorage()
  sortAllQuadrants()
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
  background: #f5f7fa;
  padding: 16px;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  color: #333;
}

.header h1 {
  font-size: 24px;
  font-weight: 600;
}

.quadrants-wrapper {
  flex: 1;
  display: flex;
  position: relative;
  background: linear-gradient(45deg, 
    rgba(100, 100, 100, 0.1) 0%,     /* 第三象限：灰色 */
    rgba(100, 150, 100, 0.1) 25%,    /* 第二象限：绿色 */
    rgba(150, 150, 100, 0.1) 50%,    /* 过渡 */
    rgba(200, 100, 100, 0.1) 75%,    /* 第四象限：橙色 */
    rgba(255, 100, 100, 0.2) 100%    /* 第一象限：红色 */
  );
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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
  background: rgba(255, 100, 100, 0.15);
  border: 1px solid rgba(255, 100, 100, 0.3);
}

.quadrant-2 {
  background: rgba(100, 150, 100, 0.15);
  border: 1px solid rgba(100, 150, 100, 0.3);
}

.quadrant-3 {
  background: rgba(100, 100, 100, 0.15);
  border: 1px solid rgba(100, 100, 100, 0.3);
}

.quadrant-4 {
  background: rgba(200, 100, 100, 0.15);
  border: 1px solid rgba(200, 100, 100, 0.3);
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
  left: 12px;
  right: 12px;
  height: 3px;
  background: linear-gradient(90deg, 
    rgba(0, 0, 0, 0.3) 0%, 
    rgba(0, 0, 0, 0.6) 50%, 
    rgba(0, 0, 0, 0.3) 100%
  );
  z-index: 2;
  border-radius: 2px;
}

.axis-vertical {
  position: absolute;
  left: 50%;
  top: 12px;
  bottom: 12px;
  width: 3px;
  background: linear-gradient(180deg, 
    rgba(0, 0, 0, 0.3) 0%, 
    rgba(0, 0, 0, 0.6) 50%, 
    rgba(0, 0, 0, 0.3) 100%
  );
  z-index: 2;
  border-radius: 2px;
}

/* 坐标轴标签 */
.axis-labels {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}

.axis-label {
  position: absolute;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.axis-label.top {
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 23px;
}

.axis-label.bottom {
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
}

.axis-label.left {
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
}

.axis-label.right {
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
}

.axis-label.center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(0, 0, 0, 0.2);
  font-size: 10px;
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

/* 表单样式 */
.coordinate-inputs {
  display: flex;
  gap: 16px;
  align-items: center;
}

.coordinate-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.coordinate-input label {
  font-size: 14px;
  color: #606266;
  min-width: 60px;
}

.form-help-text {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

/* 网格系统样式 */
.grid-container {
  display: flex;
  flex-direction: column;
  height: calc(100% - 30px);
  gap: 2px;
}

.grid-row {
  display: flex;
  flex: 1;
  gap: 2px;
}

.grid-cell {
  flex: 1;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.3);
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.grid-cell:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.grid-cell.has-task {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(0, 0, 0, 0.15);
}

.grid-task {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0 !important;
  font-size: 11px;
  padding: 4px;
  box-sizing: border-box;
}

.grid-task .task-header {
  margin-bottom: 4px;
}

.grid-task .task-name {
  font-size: 11px;
  line-height: 1.2;
  font-weight: 600;
}

.grid-task .task-details {
  margin-bottom: 4px;
}

.grid-task .task-priority,
.grid-task .task-coordinate {
  font-size: 9px;
  margin-bottom: 2px;
}

.grid-task .task-create-time {
  font-size: 8px;
  padding-top: 2px;
}

.grid-task .delete-btn {
  width: 16px;
  height: 16px;
  font-size: 10px;
}

/* 拖拽状态样式 */
.grid-cell:hover:empty::before {
  content: '点击添加';
  color: rgba(0, 0, 0, 0.4);
  font-size: 10px;
  white-space: nowrap;
}

.grid-cell:hover {
  cursor: pointer;
}

.dragging .grid-cell {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.1);
}

/* 网格坐标提示 */
.grid-cell:empty:hover::after {
  content: '(' attr(data-x) ', ' attr(data-y) ')';
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.6);
  background: rgba(255, 255, 255, 0.8);
  padding: 1px 3px;
  border-radius: 2px;
}

/* 添加象限标识 */
.grid-cell::before {
  content: attr(data-x) ',' attr(data-y);
  position: absolute;
  top: 1px;
  left: 2px;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.3);
  z-index: 1;
}
</style> 