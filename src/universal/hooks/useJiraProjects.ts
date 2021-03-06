import {useEffect, useState} from 'react'
import AtlassianClientManager, {
  AccessibleResource,
  JiraProject
} from 'universal/utils/AtlassianClientManager'

interface MenuItem {
  cloudId: string
  projectName: string
  project: JiraProject
}

// Dirty little hack to cache the results even after the component unmounts
const container = {
  projects: [] as MenuItem[],
  status: 'loading',
  clear: null as null | number
}

const getProjectName = (projectName, sites, cloudId) => {
  if (sites.length === 1) return projectName
  const site = sites.find((site) => site.id === cloudId)
  return `${site.name}/${projectName}`
}

const useJiraProjects = (accessToken: string, sites: AccessibleResource[]) => {
  let isMounted = true
  window.clearTimeout(container.clear as number)
  const manager = new AtlassianClientManager(accessToken || '')
  const [projects, setProjects] = useState<MenuItem[]>(container.projects)
  const [status, setStatus] = useState(container.status)
  useEffect(() => {
    const fetchProjects = async () => {
      const cloudIds = sites.map(({id}) => id)
      await manager.getProjects(cloudIds, (err, res) => {
        if (!isMounted) return
        if (err) {
          console.error(err)
          container.status = 'error'
          setStatus('error')
        } else if (res) {
          const {cloudId, newProjects} = res
          const newItems = newProjects.map((project) => ({
            cloudId,
            projectName: getProjectName(project.name, sites, cloudId),
            project
          }))
          container.projects.push(...newItems)
          // important! we only mutated the current object, we need a new one to trigger a rerender
          setProjects([...container.projects])
        }
      })
      container.status = 'loaded'
      setStatus('loaded')
    }

    if (isMounted && container.projects.length === 0 && sites.length > 0) {
      fetchProjects().catch()
    }
    return () => {
      isMounted = false
      container.clear = window.setTimeout(() => {
        container.projects.length = 0
        container.status = 'loading'
      }, 10000)
    }
  }, [accessToken, sites])
  return {items: projects, status}
}

export default useJiraProjects
