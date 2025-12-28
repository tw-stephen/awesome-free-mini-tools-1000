import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'delayed'

interface TimelineTask {
  id: string
  name: string
  startDate: string
  endDate: string
  status: TaskStatus
  assignee: string
  progress: number
}

interface Project {
  id: string
  name: string
  tasks: TimelineTask[]
  createdAt: string
}

export default function ProjectTimeline() {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskForm, setTaskForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    assignee: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('project-timelines')
    if (saved) setProjects(JSON.parse(saved))
  }, [])

  const saveProjects = (updated: Project[]) => {
    setProjects(updated)
    localStorage.setItem('project-timelines', JSON.stringify(updated))
  }

  const createProject = () => {
    const name = prompt(t('tools.projectTimeline.projectName'))
    if (!name) return
    const project: Project = {
      id: Date.now().toString(),
      name,
      tasks: [],
      createdAt: new Date().toISOString()
    }
    saveProjects([project, ...projects])
    setCurrentProject(project)
  }

  const updateProject = (updated: Project) => {
    saveProjects(projects.map(p => p.id === updated.id ? updated : p))
    setCurrentProject(updated)
  }

  const deleteProject = (id: string) => {
    saveProjects(projects.filter(p => p.id !== id))
    if (currentProject?.id === id) setCurrentProject(null)
  }

  const addTask = () => {
    if (!currentProject || !taskForm.name || !taskForm.startDate || !taskForm.endDate) return
    const task: TimelineTask = {
      id: Date.now().toString(),
      name: taskForm.name,
      startDate: taskForm.startDate,
      endDate: taskForm.endDate,
      status: 'pending',
      assignee: taskForm.assignee,
      progress: 0
    }
    updateProject({
      ...currentProject,
      tasks: [...currentProject.tasks, task].sort((a, b) => a.startDate.localeCompare(b.startDate))
    })
    setTaskForm({ name: '', startDate: '', endDate: '', assignee: '' })
    setShowTaskForm(false)
  }

  const updateTask = (taskId: string, updates: Partial<TimelineTask>) => {
    if (!currentProject) return
    updateProject({
      ...currentProject,
      tasks: currentProject.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
    })
  }

  const deleteTask = (taskId: string) => {
    if (!currentProject) return
    updateProject({
      ...currentProject,
      tasks: currentProject.tasks.filter(t => t.id !== taskId)
    })
  }

  const timelineRange = useMemo(() => {
    if (!currentProject || currentProject.tasks.length === 0) return { start: new Date(), end: new Date(), days: 0 }
    const dates = currentProject.tasks.flatMap(t => [new Date(t.startDate), new Date(t.endDate)])
    const start = new Date(Math.min(...dates.map(d => d.getTime())))
    const end = new Date(Math.max(...dates.map(d => d.getTime())))
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return { start, end, days }
  }, [currentProject])

  const getTaskPosition = (task: TimelineTask) => {
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.endDate)
    const left = ((taskStart.getTime() - timelineRange.start.getTime()) / (1000 * 60 * 60 * 24)) / timelineRange.days * 100
    const width = ((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24) + 1) / timelineRange.days * 100
    return { left: `${Math.max(0, left)}%`, width: `${Math.max(5, width)}%` }
  }

  const statusColors: Record<TaskStatus, string> = {
    pending: 'bg-slate-400',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500',
    delayed: 'bg-red-500'
  }

  const projectStats = useMemo(() => {
    if (!currentProject) return { total: 0, completed: 0, progress: 0 }
    const total = currentProject.tasks.length
    const completed = currentProject.tasks.filter(t => t.status === 'completed').length
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, progress }
  }, [currentProject])

  return (
    <div className="space-y-4">
      {!currentProject ? (
        <>
          <button
            onClick={createProject}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.projectTimeline.createProject')}
          </button>

          {projects.length > 0 && (
            <div className="card p-4">
              <h3 className="font-medium text-slate-700 mb-3">{t('tools.projectTimeline.yourProjects')}</h3>
              <div className="space-y-2">
                {projects.map(project => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div onClick={() => setCurrentProject(project)} className="flex-1 cursor-pointer">
                      <div className="font-medium">{project.name}</div>
                      <div className="text-xs text-slate-500">
                        {project.tasks.length} {t('tools.projectTimeline.tasks')}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentProject(null)}
              className="px-3 py-2 bg-slate-100 rounded"
            >
              ←
            </button>
            <h2 className="text-lg font-medium flex-1">{currentProject.name}</h2>
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              +
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="card p-3 text-center">
              <div className="text-xl font-bold">{projectStats.total}</div>
              <div className="text-xs text-slate-500">{t('tools.projectTimeline.totalTasks')}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold text-green-600">{projectStats.completed}</div>
              <div className="text-xs text-slate-500">{t('tools.projectTimeline.completed')}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold">{projectStats.progress}%</div>
              <div className="text-xs text-slate-500">{t('tools.projectTimeline.progress')}</div>
            </div>
          </div>

          {showTaskForm && (
            <div className="card p-4 space-y-3">
              <input
                type="text"
                value={taskForm.name}
                onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
                placeholder={t('tools.projectTimeline.taskName')}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-500">{t('tools.projectTimeline.start')}</label>
                  <input
                    type="date"
                    value={taskForm.startDate}
                    onChange={(e) => setTaskForm({ ...taskForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">{t('tools.projectTimeline.end')}</label>
                  <input
                    type="date"
                    value={taskForm.endDate}
                    onChange={(e) => setTaskForm({ ...taskForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
              </div>
              <input
                type="text"
                value={taskForm.assignee}
                onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                placeholder={t('tools.projectTimeline.assignee')}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              <button
                onClick={addTask}
                disabled={!taskForm.name || !taskForm.startDate || !taskForm.endDate}
                className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                {t('tools.projectTimeline.addTask')}
              </button>
            </div>
          )}

          {currentProject.tasks.length > 0 && (
            <div className="card p-4">
              <h3 className="font-medium text-slate-700 mb-3">{t('tools.projectTimeline.timeline')}</h3>
              <div className="overflow-x-auto">
                <div className="min-w-[500px]">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>{timelineRange.start.toLocaleDateString()}</span>
                    <span>{timelineRange.end.toLocaleDateString()}</span>
                  </div>
                  <div className="space-y-2">
                    {currentProject.tasks.map(task => {
                      const pos = getTaskPosition(task)
                      return (
                        <div key={task.id} className="relative h-8 bg-slate-100 rounded">
                          <div
                            className={`absolute top-0 h-full rounded ${statusColors[task.status]} flex items-center px-2`}
                            style={{ left: pos.left, width: pos.width }}
                          >
                            <span className="text-white text-xs truncate">{task.name}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card p-4">
            <h3 className="font-medium text-slate-700 mb-3">{t('tools.projectTimeline.taskList')}</h3>
            {currentProject.tasks.length === 0 ? (
              <p className="text-center text-slate-500 py-4">{t('tools.projectTimeline.noTasks')}</p>
            ) : (
              <div className="space-y-2">
                {currentProject.tasks.map(task => (
                  <div key={task.id} className="p-3 bg-slate-50 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{task.name}</div>
                        <div className="text-xs text-slate-500">
                          {task.startDate} → {task.endDate}
                          {task.assignee && ` • ${task.assignee}`}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                        className="text-xs px-2 py-1 border border-slate-300 rounded"
                      >
                        <option value="pending">{t('tools.projectTimeline.pending')}</option>
                        <option value="in_progress">{t('tools.projectTimeline.inProgress')}</option>
                        <option value="completed">{t('tools.projectTimeline.completed')}</option>
                        <option value="delayed">{t('tools.projectTimeline.delayed')}</option>
                      </select>
                      <input
                        type="range"
                        value={task.progress}
                        onChange={(e) => updateTask(task.id, { progress: parseInt(e.target.value) })}
                        min="0"
                        max="100"
                        className="flex-1"
                      />
                      <span className="text-xs w-8">{task.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
