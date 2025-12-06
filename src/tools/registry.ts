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
import AreaChartGenerator from './25-other/AreaChartGenerator'
import BubbleChartGenerator from './25-other/BubbleChartGenerator'
import HeatmapGenerator from './25-other/HeatmapGenerator'
import FunnelChartGenerator from './25-other/FunnelChartGenerator'
import WaterfallChartGenerator from './25-other/WaterfallChartGenerator'
import GaugeChartGenerator from './25-other/GaugeChartGenerator'
import ProgressRingGenerator from './25-other/ProgressRingGenerator'
import WordCloudGenerator from './25-other/WordCloudGenerator'
import QRCodeGenerator from './25-other/QRCodeGenerator'
import BarcodeGenerator from './25-other/BarcodeGenerator'
import ColorPaletteGenerator from './25-other/ColorPaletteGenerator'
import GradientGenerator from './25-other/GradientGenerator'
import BoxShadowGenerator from './25-other/BoxShadowGenerator'
import BorderRadiusGenerator from './25-other/BorderRadiusGenerator'
import CSSFilterGenerator from './25-other/CSSFilterGenerator'
import TextShadowGenerator from './25-other/TextShadowGenerator'
import CSSTransformGenerator from './25-other/CSSTransformGenerator'
import FlexboxGenerator from './25-other/FlexboxGenerator'
import GridGenerator from './25-other/GridGenerator'
import AspectRatioCalculator from './25-other/AspectRatioCalculator'
import CSSUnitConverter from './25-other/CSSUnitConverter'
import LoremIpsumGenerator from './25-other/LoremIpsumGenerator'
import PlaceholderImageGenerator from './25-other/PlaceholderImageGenerator'
import FaviconGenerator from './25-other/FaviconGenerator'
import SVGIconEditor from './25-other/SVGIconEditor'
import SpriteSheetGenerator from './25-other/SpriteSheetGenerator'
import ImageCropper from './25-other/ImageCropper'
import ImageResizer from './25-other/ImageResizer'
import ImageCompressor from './25-other/ImageCompressor'
import ImageFormatConverter from './25-other/ImageFormatConverter'
import ImageRotator from './25-other/ImageRotator'
import ImageFlipper from './25-other/ImageFlipper'
import ImageFilter from './25-other/ImageFilter'

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
    id: '986',
    path: 'area-chart-generator',
    nameKey: 'tools.areaChart.name',
    descriptionKey: 'tools.areaChart.description',
    category: '25-other',
    component: AreaChartGenerator,
  },
  {
    id: '985',
    path: 'bubble-chart-generator',
    nameKey: 'tools.bubbleChart.name',
    descriptionKey: 'tools.bubbleChart.description',
    category: '25-other',
    component: BubbleChartGenerator,
  },
  {
    id: '984',
    path: 'heatmap-generator',
    nameKey: 'tools.heatmap.name',
    descriptionKey: 'tools.heatmap.description',
    category: '25-other',
    component: HeatmapGenerator,
  },
  {
    id: '983',
    path: 'funnel-chart-generator',
    nameKey: 'tools.funnelChart.name',
    descriptionKey: 'tools.funnelChart.description',
    category: '25-other',
    component: FunnelChartGenerator,
  },
  {
    id: '982',
    path: 'waterfall-chart-generator',
    nameKey: 'tools.waterfallChart.name',
    descriptionKey: 'tools.waterfallChart.description',
    category: '25-other',
    component: WaterfallChartGenerator,
  },
  {
    id: '981',
    path: 'gauge-chart-generator',
    nameKey: 'tools.gaugeChart.name',
    descriptionKey: 'tools.gaugeChart.description',
    category: '25-other',
    component: GaugeChartGenerator,
  },
  {
    id: '980',
    path: 'progress-ring-generator',
    nameKey: 'tools.progressRing.name',
    descriptionKey: 'tools.progressRing.description',
    category: '25-other',
    component: ProgressRingGenerator,
  },
  {
    id: '979',
    path: 'word-cloud-generator',
    nameKey: 'tools.wordCloud.name',
    descriptionKey: 'tools.wordCloud.description',
    category: '25-other',
    component: WordCloudGenerator,
  },
  {
    id: '978',
    path: 'qr-code-generator',
    nameKey: 'tools.qrCode.name',
    descriptionKey: 'tools.qrCode.description',
    category: '25-other',
    component: QRCodeGenerator,
  },
  {
    id: '977',
    path: 'barcode-generator',
    nameKey: 'tools.barcode.name',
    descriptionKey: 'tools.barcode.description',
    category: '25-other',
    component: BarcodeGenerator,
  },
  {
    id: '976',
    path: 'color-palette-generator',
    nameKey: 'tools.colorPalette.name',
    descriptionKey: 'tools.colorPalette.description',
    category: '25-other',
    component: ColorPaletteGenerator,
  },
  {
    id: '975',
    path: 'gradient-generator',
    nameKey: 'tools.gradient.name',
    descriptionKey: 'tools.gradient.description',
    category: '25-other',
    component: GradientGenerator,
  },
  {
    id: '974',
    path: 'box-shadow-generator',
    nameKey: 'tools.boxShadow.name',
    descriptionKey: 'tools.boxShadow.description',
    category: '25-other',
    component: BoxShadowGenerator,
  },
  {
    id: '973',
    path: 'border-radius-generator',
    nameKey: 'tools.borderRadius.name',
    descriptionKey: 'tools.borderRadius.description',
    category: '25-other',
    component: BorderRadiusGenerator,
  },
  {
    id: '972',
    path: 'css-filter-generator',
    nameKey: 'tools.cssFilter.name',
    descriptionKey: 'tools.cssFilter.description',
    category: '25-other',
    component: CSSFilterGenerator,
  },
  {
    id: '971',
    path: 'text-shadow-generator',
    nameKey: 'tools.textShadow.name',
    descriptionKey: 'tools.textShadow.description',
    category: '25-other',
    component: TextShadowGenerator,
  },
  {
    id: '970',
    path: 'css-transform-generator',
    nameKey: 'tools.cssTransform.name',
    descriptionKey: 'tools.cssTransform.description',
    category: '25-other',
    component: CSSTransformGenerator,
  },
  {
    id: '969',
    path: 'flexbox-generator',
    nameKey: 'tools.flexbox.name',
    descriptionKey: 'tools.flexbox.description',
    category: '25-other',
    component: FlexboxGenerator,
  },
  {
    id: '968',
    path: 'grid-generator',
    nameKey: 'tools.grid.name',
    descriptionKey: 'tools.grid.description',
    category: '25-other',
    component: GridGenerator,
  },
  {
    id: '967',
    path: 'aspect-ratio-calculator',
    nameKey: 'tools.aspectRatio.name',
    descriptionKey: 'tools.aspectRatio.description',
    category: '25-other',
    component: AspectRatioCalculator,
  },
  {
    id: '966',
    path: 'css-unit-converter',
    nameKey: 'tools.unitConverter.name',
    descriptionKey: 'tools.unitConverter.description',
    category: '25-other',
    component: CSSUnitConverter,
  },
  {
    id: '965',
    path: 'lorem-ipsum-generator',
    nameKey: 'tools.loremIpsum.name',
    descriptionKey: 'tools.loremIpsum.description',
    category: '25-other',
    component: LoremIpsumGenerator,
  },
  {
    id: '964',
    path: 'placeholder-image-generator',
    nameKey: 'tools.placeholder.name',
    descriptionKey: 'tools.placeholder.description',
    category: '25-other',
    component: PlaceholderImageGenerator,
  },
  {
    id: '963',
    path: 'favicon-generator',
    nameKey: 'tools.favicon.name',
    descriptionKey: 'tools.favicon.description',
    category: '25-other',
    component: FaviconGenerator,
  },
  {
    id: '962',
    path: 'svg-icon-editor',
    nameKey: 'tools.svgIcon.name',
    descriptionKey: 'tools.svgIcon.description',
    category: '25-other',
    component: SVGIconEditor,
  },
  {
    id: '961',
    path: 'sprite-sheet-generator',
    nameKey: 'tools.spriteSheet.name',
    descriptionKey: 'tools.spriteSheet.description',
    category: '25-other',
    component: SpriteSheetGenerator,
  },
  {
    id: '960',
    path: 'image-cropper',
    nameKey: 'tools.imageCropper.name',
    descriptionKey: 'tools.imageCropper.description',
    category: '25-other',
    component: ImageCropper,
  },
  {
    id: '959',
    path: 'image-resizer',
    nameKey: 'tools.imageResizer.name',
    descriptionKey: 'tools.imageResizer.description',
    category: '25-other',
    component: ImageResizer,
  },
  {
    id: '958',
    path: 'image-compressor',
    nameKey: 'tools.imageCompressor.name',
    descriptionKey: 'tools.imageCompressor.description',
    category: '25-other',
    component: ImageCompressor,
  },
  {
    id: '957',
    path: 'image-format-converter',
    nameKey: 'tools.imageConverter.name',
    descriptionKey: 'tools.imageConverter.description',
    category: '25-other',
    component: ImageFormatConverter,
  },
  {
    id: '956',
    path: 'image-rotator',
    nameKey: 'tools.imageRotator.name',
    descriptionKey: 'tools.imageRotator.description',
    category: '25-other',
    component: ImageRotator,
  },
  {
    id: '955',
    path: 'image-flipper',
    nameKey: 'tools.imageFlipper.name',
    descriptionKey: 'tools.imageFlipper.description',
    category: '25-other',
    component: ImageFlipper,
  },
  {
    id: '954',
    path: 'image-filter',
    nameKey: 'tools.imageFilter.name',
    descriptionKey: 'tools.imageFilter.description',
    category: '25-other',
    component: ImageFilter,
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
