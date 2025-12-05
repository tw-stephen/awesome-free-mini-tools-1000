import { ComponentType } from 'react'
import CaseConverter from './01-text/CaseConverter'
import TextCounter from './01-text/TextCounter'
import TextDiff from './01-text/TextDiff'
import DuplicateRemover from './01-text/DuplicateRemover'
import TextSorter from './01-text/TextSorter'
import ToolIndex from './25-other/ToolIndex'
import InfographicGenerator from './25-other/InfographicGenerator'
import TimelineGenerator from './25-other/TimelineGenerator'
import TreeDiagramGenerator from './25-other/TreeDiagramGenerator'
import RelationshipDiagramGenerator from './25-other/RelationshipDiagramGenerator'

export interface ToolInfo {
  id: string
  path: string
  nameKey: string
  descriptionKey: string
  category: string
  component: ComponentType
}

export const tools: ToolInfo[] = [
  {
    id: '1000',
    path: 'tool-index',
    nameKey: 'tools.toolIndex.name',
    descriptionKey: 'tools.toolIndex.description',
    category: '25-other',
    component: ToolIndex,
  },
  {
    id: '999',
    path: 'infographic-generator',
    nameKey: 'tools.infographicGenerator.name',
    descriptionKey: 'tools.infographicGenerator.description',
    category: '25-other',
    component: InfographicGenerator,
  },
  {
    id: '998',
    path: 'timeline-generator',
    nameKey: 'tools.timelineGenerator.name',
    descriptionKey: 'tools.timelineGenerator.description',
    category: '25-other',
    component: TimelineGenerator,
  },
  {
    id: '997',
    path: 'tree-diagram-generator',
    nameKey: 'tools.treeDiagram.name',
    descriptionKey: 'tools.treeDiagram.description',
    category: '25-other',
    component: TreeDiagramGenerator,
  },
  {
    id: '996',
    path: 'relationship-diagram-generator',
    nameKey: 'tools.relationshipDiagram.name',
    descriptionKey: 'tools.relationshipDiagram.description',
    category: '25-other',
    component: RelationshipDiagramGenerator,
  },
  {
    id: '001',
    path: 'case-converter',
    nameKey: 'tools.caseConverter.name',
    descriptionKey: 'tools.caseConverter.description',
    category: '01-text',
    component: CaseConverter,
  },
  {
    id: '002',
    path: 'text-counter',
    nameKey: 'tools.textCounter.name',
    descriptionKey: 'tools.textCounter.description',
    category: '01-text',
    component: TextCounter,
  },
  {
    id: '003',
    path: 'text-diff',
    nameKey: 'tools.textDiff.name',
    descriptionKey: 'tools.textDiff.description',
    category: '01-text',
    component: TextDiff,
  },
  {
    id: '004',
    path: 'duplicate-remover',
    nameKey: 'tools.duplicateRemover.name',
    descriptionKey: 'tools.duplicateRemover.description',
    category: '01-text',
    component: DuplicateRemover,
  },
  {
    id: '005',
    path: 'text-sorter',
    nameKey: 'tools.textSorter.name',
    descriptionKey: 'tools.textSorter.description',
    category: '01-text',
    component: TextSorter,
  },
]

export const categories = [
  { id: '01-text', nameKey: 'categories.01-text' },
  { id: '25-other', nameKey: 'categories.25-other' },
]

export function getToolByPath(path: string): ToolInfo | undefined {
  return tools.find((tool) => tool.path === path)
}

export function getToolsByCategory(categoryId: string): ToolInfo[] {
  return tools.filter((tool) => tool.category === categoryId)
}
