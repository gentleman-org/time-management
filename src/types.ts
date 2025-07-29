
// 定义任务类型
export interface Task {
  id: number;
  name: string;
  deadline?: string;
  x: number; // x坐标
  y: number; // y坐标
  createTime: string;
  notified1h?: boolean;
  notified30m?: boolean;
  notifiedExpired?: boolean;
}

// 定义新任务表单类型
export interface NewTaskForm {
  name: string;
  quadrant: string;
  deadline: string;
  x: number;
  y: number;
}
