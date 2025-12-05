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
import FlowchartGenerator from './25-other/FlowchartGenerator'
import MindMapGenerator from './25-other/MindMapGenerator'
import GanttChartGenerator from './25-other/GanttChartGenerator'
import OrgChartGenerator from './25-other/OrgChartGenerator'
import PieChartGenerator from './25-other/PieChartGenerator'
import BarChartGenerator from './25-other/BarChartGenerator'
import LineChartGenerator from './25-other/LineChartGenerator'
import ScatterPlotGenerator from './25-other/ScatterPlotGenerator'
import RadarChartGenerator from './25-other/RadarChartGenerator'

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
    id: '995',
    path: 'flowchart-generator',
    nameKey: 'tools.flowchart.name',
    descriptionKey: 'tools.flowchart.description',
    category: '25-other',
    component: FlowchartGenerator,
  },
  {
    id: '994',
    path: 'mind-map-generator',
    nameKey: 'tools.mindMap.name',
    descriptionKey: 'tools.mindMap.description',
    category: '25-other',
    component: MindMapGenerator,
  },
  {
    id: '993',
    path: 'gantt-chart-generator',
    nameKey: 'tools.gantt.name',
    descriptionKey: 'tools.gantt.description',
    category: '25-other',
    component: GanttChartGenerator,
  },
  {
    id: '992',
    path: 'org-chart-generator',
    nameKey: 'tools.orgChart.name',
    descriptionKey: 'tools.orgChart.description',
    category: '25-other',
    component: OrgChartGenerator,
  },
  {
    id: '991',
    path: 'pie-chart-generator',
    nameKey: 'tools.pieChart.name',
    descriptionKey: 'tools.pieChart.description',
    category: '25-other',
    component: PieChartGenerator,
  },
  {
    id: '990',
    path: 'bar-chart-generator',
    nameKey: 'tools.barChart.name',
    descriptionKey: 'tools.barChart.description',
    category: '25-other',
    component: BarChartGenerator,
  },
  {
    id: '989',
    path: 'line-chart-generator',
    nameKey: 'tools.lineChart.name',
    descriptionKey: 'tools.lineChart.description',
    category: '25-other',
    component: LineChartGenerator,
  },
  {
    id: '988',
    path: 'scatter-plot-generator',
    nameKey: 'tools.scatterPlot.name',
    descriptionKey: 'tools.scatterPlot.description',
    category: '25-other',
    component: ScatterPlotGenerator,
  },
  {
    id: '987',
    path: 'radar-chart-generator',
    nameKey: 'tools.radarChart.name',
    descriptionKey: 'tools.radarChart.description',
    category: '25-other',
    component: RadarChartGenerator,
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
