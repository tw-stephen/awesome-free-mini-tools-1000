import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Milestone {
  id: string
  name: string
  description: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed' | 'delayed'
  completedDate?: string
}

interface Project {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  milestones: Milestone[]
}

export default function ProjectMilestones() {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showNewProject, setShowNewProject] = useState(false)
  const [showNewMilestone, setShowNewMilestone] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', description: '', startDate: '', endDate: '' })
  const [newMilestone, setNewMilestone] = useState({ name: '', description: '', dueDate: '' })

  useEffect(() => {
    const saved = localStorage.getItem('project-milestones')
    if (saved) {
      const data = JSON.parse(saved)
      setProjects(data)
      if (data.length > 0) setSelectedProject(data[0])
    }
  }, [])

  const saveProjects = (updated: Project[]) => {
    setProjects(updated)
    localStorage.setItem('project-milestones', JSON.stringify(updated))
  }

  const addProject = () => {
    if (!newProject.name.trim()) return
    const project: Project = {
      id: Date.now().toString(),
      ...newProject,
      milestones: []
    }
    const updated = [project, ...projects]
    saveProjects(updated)
    setSelectedProject(project)
    setNewProject({ name: '', description: '', startDate: '', endDate: '' })
    setShowNewProject(false)
  }

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id)
    saveProjects(updated)
    setSelectedProject(updated.length > 0 ? updated[0] : null)
  }

  const addMilestone = () => {
    if (!selectedProject || !newMilestone.name.trim()) return
    const milestone: Milestone = {
      id: Date.now().toString(),
      name: newMilestone.name,
      description: newMilestone.description,
      dueDate: newMilestone.dueDate,
      status: 'pending'
    }
    const updated = projects.map(p => {
      if (p.id === selectedProject.id) {
        return { ...p, milestones: [...p.milestones, milestone].sort((a, b) => a.dueDate.localeCompare(b.dueDate)) }
      }
      return p
    })
    saveProjects(updated)
    setSelectedProject(updated.find(p => p.id === selectedProject.id) || null)
    setNewMilestone({ name: '', description: '', dueDate: '' })
    setShowNewMilestone(false)
  }

  const updateMilestoneStatus = (milestoneId: string, status: Milestone['status']) => {
    if (!selectedProject) return
    const updated = projects.map(p => {
      if (p.id === selectedProject.id) {
        return {
          ...p,
          milestones: p.milestones.map(m =>
            m.id === milestoneId
              ? { ...m, status, completedDate: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined }
              : m
          )
        }
      }
      return p
    })
    saveProjects(updated)
    setSelectedProject(updated.find(p => p.id === selectedProject.id) || null)
  }

  const deleteMilestone = (milestoneId: string) => {
    if (!selectedProject) return
    const updated = projects.map(p => {
      if (p.id === selectedProject.id) {
        return { ...p, milestones: p.milestones.filter(m => m.id !== milestoneId) }
      }
      return p
    })
    saveProjects(updated)
    setSelectedProject(updated.find(p => p.id === selectedProject.id) || null)
  }

  const getProgress = (project: Project) => {
    if (project.milestones.length === 0) return 0
    const completed = project.milestones.filter(m => m.status === 'completed').length
    return Math.round((completed / project.milestones.length) * 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      case 'delayed': return 'bg-red-500'
      default: return 'bg-slate-300'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 border-green-300'
      case 'in-progress': return 'bg-blue-50 border-blue-300'
      case 'delayed': return 'bg-red-50 border-red-300'
      default: return 'bg-slate-50 border-slate-200'
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">{t('tools.projectMilestones.projects')}</h3>
          <button
            onClick={() => setShowNewProject(!showNewProject)}
            className="text-sm text-blue-500"
          >
            {showNewProject ? t('tools.projectMilestones.cancel') : t('tools.projectMilestones.newProject')}
          </button>
        </div>

        {showNewProject && (
          <div className="space-y-2 p-3 bg-slate-50 rounded mb-3">
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              placeholder={t('tools.projectMilestones.projectName')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder={t('tools.projectMilestones.projectDescription')}
              className="w-full px-3 py-2 border border-slate-300 rounded h-16"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="date"
                value={newProject.endDate}
                onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <button
              onClick={addProject}
              disabled={!newProject.name.trim()}
              className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.projectMilestones.create')}
            </button>
          </div>
        )}

        <div className="space-y-2">
          {projects.map(project => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`w-full p-3 rounded text-left ${
                selectedProject?.id === project.id
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="flex justify-between">
                <span className="font-medium">{project.name}</span>
                <span className="text-sm text-slate-500">{getProgress(project)}%</span>
              </div>
              <div className="bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all"
                  style={{ width: `${getProgress(project)}%` }}
                />
              </div>
            </button>
          ))}
          {projects.length === 0 && (
            <div className="text-center text-slate-400 py-4">
              {t('tools.projectMilestones.noProjects')}
            </div>
          )}
        </div>
      </div>

      {selectedProject && (
        <div className="card p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-bold text-lg">{selectedProject.name}</h2>
              {selectedProject.description && (
                <p className="text-sm text-slate-500">{selectedProject.description}</p>
              )}
              <div className="text-xs text-slate-400 mt-1">
                {selectedProject.startDate} - {selectedProject.endDate}
              </div>
            </div>
            <button
              onClick={() => deleteProject(selectedProject.id)}
              className="text-red-500 text-sm"
            >
              {t('tools.projectMilestones.delete')}
            </button>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{t('tools.projectMilestones.progress')}</span>
              <span className="font-bold">{getProgress(selectedProject)}%</span>
            </div>
            <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-green-500 h-full transition-all"
                style={{ width: `${getProgress(selectedProject)}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setShowNewMilestone(!showNewMilestone)}
            className="w-full py-2 bg-green-500 text-white rounded mb-4"
          >
            {showNewMilestone ? t('tools.projectMilestones.cancel') : t('tools.projectMilestones.addMilestone')}
          </button>

          {showNewMilestone && (
            <div className="space-y-2 p-3 bg-slate-50 rounded mb-4">
              <input
                type="text"
                value={newMilestone.name}
                onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
                placeholder={t('tools.projectMilestones.milestoneName')}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              <textarea
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                placeholder={t('tools.projectMilestones.milestoneDescription')}
                className="w-full px-3 py-2 border border-slate-300 rounded h-16"
              />
              <input
                type="date"
                value={newMilestone.dueDate}
                onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              <button
                onClick={addMilestone}
                disabled={!newMilestone.name.trim()}
                className="w-full py-2 bg-green-500 text-white rounded disabled:opacity-50"
              >
                {t('tools.projectMilestones.add')}
              </button>
            </div>
          )}

          <div className="space-y-2">
            {selectedProject.milestones.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                {t('tools.projectMilestones.noMilestones')}
              </div>
            ) : (
              selectedProject.milestones.map((milestone, index) => (
                <div key={milestone.id} className={`p-3 rounded border ${getStatusBg(milestone.status)}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(milestone.status)}`} />
                      {index < selectedProject.milestones.length - 1 && (
                        <div className="w-0.5 h-8 bg-slate-300 mt-1" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{milestone.name}</div>
                          {milestone.description && (
                            <div className="text-sm text-slate-500">{milestone.description}</div>
                          )}
                          <div className="text-xs text-slate-400 mt-1">
                            {t('tools.projectMilestones.due')}: {milestone.dueDate}
                            {milestone.completedDate && ` | ${t('tools.projectMilestones.completed')}: ${milestone.completedDate}`}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <select
                            value={milestone.status}
                            onChange={(e) => updateMilestoneStatus(milestone.id, e.target.value as Milestone['status'])}
                            className="text-xs px-2 py-1 border border-slate-200 rounded"
                          >
                            <option value="pending">{t('tools.projectMilestones.statusPending')}</option>
                            <option value="in-progress">{t('tools.projectMilestones.statusInProgress')}</option>
                            <option value="completed">{t('tools.projectMilestones.statusCompleted')}</option>
                            <option value="delayed">{t('tools.projectMilestones.statusDelayed')}</option>
                          </select>
                          <button
                            onClick={() => deleteMilestone(milestone.id)}
                            className="text-red-500 text-xs"
                          >
                            {t('tools.projectMilestones.delete')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
