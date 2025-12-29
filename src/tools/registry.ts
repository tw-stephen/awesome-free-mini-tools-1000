import { ComponentType } from 'react'
import CaseConverter from './01-text/CaseConverter'
import TextCounter from './01-text/TextCounter'
import TextDiff from './01-text/TextDiff'
import DuplicateRemover from './01-text/DuplicateRemover'
import TextSorter from './01-text/TextSorter'
import TextReverser from './01-text/TextReverser'
import WhitespaceCleaner from './01-text/WhitespaceCleaner'
import NewlineConverter from './01-text/NewlineConverter'
import TextTruncator from './01-text/TextTruncator'
import TextSplitter from './01-text/TextSplitter'
import TextJoiner from './01-text/TextJoiner'
import LineNumberAdder from './01-text/LineNumberAdder'
import IndentationConverter from './01-text/IndentationConverter'
import UnicodeConverter from './01-text/UnicodeConverter'
import HtmlEntityConverter from './01-text/HtmlEntityConverter'
import UrlEncoder from './01-text/UrlEncoder'
import Base64Encoder from './01-text/Base64Encoder'
import NumberBaseConverter from './01-text/NumberBaseConverter'
import AsciiArtGenerator from './01-text/AsciiArtGenerator'
import MorseCodeConverter from './01-text/MorseCodeConverter'
import Rot13Encoder from './01-text/Rot13Encoder'
import PigLatinConverter from './01-text/PigLatinConverter'
import FullwidthConverter from './01-text/FullwidthConverter'
import ChineseConverter from './01-text/ChineseConverter'
import PinyinAnnotator from './01-text/PinyinAnnotator'
import BopomofoConverter from './01-text/BopomofoConverter'
import KanaConverter from './01-text/KanaConverter'
import KoreanRomanizer from './01-text/KoreanRomanizer'
import NumberToChinese from './01-text/NumberToChinese'
import RomanNumeralConverter from './01-text/RomanNumeralConverter'
import EmojiFinder from './01-text/EmojiFinder'
import PasswordGenerator from './01-text/PasswordGenerator'
import UuidGenerator from './01-text/UuidGenerator'
import HashGenerator from './01-text/HashGenerator'
import HmacGenerator from './01-text/HmacGenerator'
import RegexTester from './01-text/RegexTester'
import MarkdownPreviewer from './01-text/MarkdownPreviewer'
import JsonFormatter from './01-text/JsonFormatter'
import TextSteganography from './01-text/TextSteganography'
import BatchImageProcessor from './02-image/BatchImageProcessor'
import AudioVisualizer from './03-audio-video/AudioVisualizer'
import AudioRecorder from './03-audio-video/AudioRecorder'
import VideoPlayer from './03-audio-video/VideoPlayer'
import AudioTrimmer from './03-audio-video/AudioTrimmer'
import VideoToGif from './03-audio-video/VideoToGif'
import AudioMerger from './03-audio-video/AudioMerger'
import VideoThumbnail from './03-audio-video/VideoThumbnail'
import AudioSpeedChanger from './03-audio-video/AudioSpeedChanger'
import ToneGenerator from './03-audio-video/ToneGenerator'
import Metronome from './03-audio-video/Metronome'
import SoundMeter from './03-audio-video/SoundMeter'
import WhiteNoiseGenerator from './03-audio-video/WhiteNoiseGenerator'
import MediaInfo from './03-audio-video/MediaInfo'
import AudioReverser from './03-audio-video/AudioReverser'
import BpmCounter from './03-audio-video/BpmCounter'
import PitchDetector from './03-audio-video/PitchDetector'
import BinauralBeats from './03-audio-video/BinauralBeats'
import DrumMachine from './03-audio-video/DrumMachine'
import VideoLooper from './03-audio-video/VideoLooper'
import AudioFader from './03-audio-video/AudioFader'
import ChordGenerator from './03-audio-video/ChordGenerator'
import AudioNormalizer from './03-audio-video/AudioNormalizer'
import AudioWaveformViewer from './03-audio-video/AudioWaveformViewer'
import AudioLooper from './03-audio-video/AudioLooper'
import FrequencyAnalyzer from './03-audio-video/FrequencyAnalyzer'
import VoiceRecorder from './03-audio-video/VoiceRecorder'
import ScreenRecorder from './03-audio-video/ScreenRecorder'
import AudioSplitter from './03-audio-video/AudioSplitter'
import AudioCompressor from './03-audio-video/AudioCompressor'
import AudioEqualizer from './03-audio-video/AudioEqualizer'
import SoundEffects from './03-audio-video/SoundEffects'
import VideoSpeedChanger from './03-audio-video/VideoSpeedChanger'
import VideoReverser from './03-audio-video/VideoReverser'
import SubtitleEditor from './03-audio-video/SubtitleEditor'
import AudioChannelSplitter from './03-audio-video/AudioChannelSplitter'
import SilenceRemover from './03-audio-video/SilenceRemover'
import AudioStereoWidener from './03-audio-video/AudioStereoWidener'
import AudioPanChanger from './03-audio-video/AudioPanChanger'
import VideoFrameExtractor from './03-audio-video/VideoFrameExtractor'
import AudioMonoToStereo from './03-audio-video/AudioMonoToStereo'
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
import ImageWatermark from './25-other/ImageWatermark'
import ImageColorPicker from './25-other/ImageColorPicker'
import ImageMetadataViewer from './25-other/ImageMetadataViewer'
import ScreenshotTool from './25-other/ScreenshotTool'
import ImageCollageMaker from './25-other/ImageCollageMaker'
import ImageBackgroundRemover from './25-other/ImageBackgroundRemover'
import ImageAnnotator from './25-other/ImageAnnotator'
import ImageBlurTool from './25-other/ImageBlurTool'
import ImageMosaicTool from './25-other/ImageMosaicTool'
import ImageHistogram from './25-other/ImageHistogram'
import ImageSplitter from './25-other/ImageSplitter'
import ImageMerger from './25-other/ImageMerger'
// Data & Conversion Tools (121-160)
import JsonToYaml from './04-data/JsonToYaml'
import YamlToJson from './04-data/YamlToJson'
import CsvToJson from './04-data/CsvToJson'
import JsonToCsv from './04-data/JsonToCsv'
import XmlToJson from './04-data/XmlToJson'
import JsonToXml from './04-data/JsonToXml'
import SqlFormatter from './04-data/SqlFormatter'
import CssMinifier from './04-data/CssMinifier'
import JsMinifier from './04-data/JsMinifier'
import HtmlMinifier from './04-data/HtmlMinifier'
import TimestampConverter from './04-data/TimestampConverter'
import ColorConverter from './04-data/ColorConverter'
import TemperatureConverter from './04-data/TemperatureConverter'
import LengthConverter from './04-data/LengthConverter'
import WeightConverter from './04-data/WeightConverter'
import SpeedConverter from './04-data/SpeedConverter'
import AreaConverter from './04-data/AreaConverter'
import VolumeConverter from './04-data/VolumeConverter'
import DataStorageConverter from './04-data/DataStorageConverter'
import DataNumberBaseConverter from './04-data/NumberBaseConverter'
import AngleConverter from './04-data/AngleConverter'
import PressureConverter from './04-data/PressureConverter'
import EnergyConverter from './04-data/EnergyConverter'
import PowerConverter from './04-data/PowerConverter'
import FrequencyConverter from './04-data/FrequencyConverter'
import TimeConverter from './04-data/TimeConverter'
import CurrencyConverter from './04-data/CurrencyConverter'
import DataRomanNumeralConverter from './04-data/RomanNumeralConverter'
import AsciiConverter from './04-data/AsciiConverter'
import DataUnicodeConverter from './04-data/UnicodeConverter'
import MarkdownToHtml from './04-data/MarkdownToHtml'
import HtmlToMarkdown from './04-data/HtmlToMarkdown'
import TextToBinary from './04-data/TextToBinary'
import UrlParser from './04-data/UrlParser'
import JsonPathTester from './04-data/JsonPathTester'
import DataRegexTester from './04-data/RegexTester'
import DiffTool from './04-data/DiffTool'
import HashCalculator from './04-data/HashCalculator'
import ChecksumValidator from './04-data/ChecksumValidator'
import ByteConverter from './04-data/ByteConverter'
// Developer Tools (161-200)
import JsonValidator from './05-dev/JsonValidator'
import XmlValidator from './05-dev/XmlValidator'
import YamlValidator from './05-dev/YamlValidator'
import HtmlValidator from './05-dev/HtmlValidator'
import CssValidator from './05-dev/CssValidator'
import JsBeautifier from './05-dev/JsBeautifier'
import CssBeautifier from './05-dev/CssBeautifier'
import HtmlBeautifier from './05-dev/HtmlBeautifier'
import SqlBeautifier from './05-dev/SqlBeautifier'
import CodeDiff from './05-dev/CodeDiff'
import RegexBuilder from './05-dev/RegexBuilder'
import CronGenerator from './05-dev/CronGenerator'
import JwtDecoder from './05-dev/JwtDecoder'
import Base64ImageEncoder from './05-dev/Base64ImageEncoder'
import DevColorPaletteGenerator from './05-dev/ColorPaletteGenerator'
import DevGradientGenerator from './05-dev/GradientGenerator'
import DevBoxShadowGenerator from './05-dev/BoxShadowGenerator'
import DevBorderRadiusGenerator from './05-dev/BorderRadiusGenerator'
import DevFlexboxGenerator from './05-dev/FlexboxGenerator'
import DevGridGenerator from './05-dev/GridGenerator'
import DevLoremIpsumGenerator from './05-dev/LoremIpsumGenerator'
import DevPasswordGenerator from './05-dev/DevPasswordGenerator'
import DevUuidGenerator from './05-dev/UuidGenerator'
import SlugGenerator from './05-dev/SlugGenerator'
import MockDataGenerator from './05-dev/MockDataGenerator'
import HttpStatusCodes from './05-dev/HttpStatusCodes'
import HtmlEntitiesConverter from './05-dev/HtmlEntitiesConverter'
import JsonStringEscaper from './05-dev/JsonStringEscaper'
import MetaTagGenerator from './05-dev/MetaTagGenerator'
import GitignoreGenerator from './05-dev/GitignoreGenerator'
import LicenseGenerator from './05-dev/LicenseGenerator'
import MarkdownTableGenerator from './05-dev/MarkdownTableGenerator'
import DevPlaceholderImageGenerator from './05-dev/PlaceholderImageGenerator'
import EnvFileGenerator from './05-dev/EnvFileGenerator'
import PackageJsonGenerator from './05-dev/PackageJsonGenerator'
import ReadmeGenerator from './05-dev/ReadmeGenerator'
import DockerfileGenerator from './05-dev/DockerfileGenerator'
import NginxConfigGenerator from './05-dev/NginxConfigGenerator'
import HtaccessGenerator from './05-dev/HtaccessGenerator'
import CodeSnippetManager from './05-dev/CodeSnippetManager'
// Utility Tools (201-240)
import BasicCalculator from './06-utility/BasicCalculator'
import ScientificCalculator from './06-utility/ScientificCalculator'
import AgeCalculator from './06-utility/AgeCalculator'
import DateCalculator from './06-utility/DateCalculator'
import BmiCalculator from './20-health/BMICalculator'
import CalorieCounter20 from './20-health/CalorieCounter'
import WaterIntakeTracker from './20-health/WaterIntakeTracker'
import SleepLogger from './20-health/SleepLogger'
import ExerciseTimer from './20-health/ExerciseTimer'
import StepCounter from './20-health/StepCounter'
// Category 21: Creativity Tools (#768-#790)
import CreativityColorMixer from './21-creativity/ColorMixer'
import CreativityPatternGenerator from './21-creativity/PatternGenerator'
import CreativityAsciiArtGenerator from './21-creativity/AsciiArtGenerator'
import CreativityPixelArtMaker from './21-creativity/PixelArtMaker'
import CreativityGradientMaker from './21-creativity/GradientMaker'
import CreativityFontPairing from './21-creativity/FontPairing'
import CreativityColorHarmony from './21-creativity/ColorHarmony'
import CreativityLogoIdeas from './21-creativity/LogoIdeas'
import CreativityMoodboardMaker from './21-creativity/MoodboardMaker'
import CreativityIconPreviewer from './21-creativity/IconPreviewer'
import CreativityPaletteExtractor from './21-creativity/PaletteExtractor'
import CreativityStyleGuideGenerator from './21-creativity/StyleGuideGenerator'
import CreativityMockupViewer from './21-creativity/MockupViewer'
import CreativityTypographyScale from './21-creativity/TypographyScale'
import CreativitySpacingCalculator from './21-creativity/SpacingCalculator'
import CreativityBreakpointCalculator from './21-creativity/BreakpointCalculator'
import CreativityAnimationTimingCalculator from './21-creativity/AnimationTimingCalculator'
import CreativityShadowGenerator from './21-creativity/ShadowGenerator'
import CreativityBorderGenerator from './21-creativity/BorderGenerator'
import CreativityFilterPreview from './21-creativity/FilterPreview'
import CreativityBlendModePreview from './21-creativity/BlendModePreview'
import CreativityTextEffectGenerator from './21-creativity/TextEffectGenerator'
import CreativityBackgroundPatternGenerator from './21-creativity/BackgroundPatternGenerator'

import TipCalculator from './06-utility/TipCalculator'
import PercentageCalculator from './06-utility/PercentageCalculator'
import LoanCalculator from './06-utility/LoanCalculator'
import InvestmentCalculator from './06-utility/InvestmentCalculator'
import UnitPriceCalculator from './06-utility/UnitPriceCalculator'
import CountdownTimer from './06-utility/CountdownTimer'
import Stopwatch from './06-utility/Stopwatch'
import WorldClock from './06-utility/WorldClock'
import AlarmClock from './06-utility/AlarmClock'
import PomodoroTimer from './06-utility/PomodoroTimer'
import RandomNumberGenerator from './06-utility/RandomNumberGenerator'
import CoinFlipper from './06-utility/CoinFlipper'
import SpinWheel from './06-utility/SpinWheel'
import UtilPasswordGenerator from './06-utility/PasswordGenerator'
import UtilQrCodeGenerator from './06-utility/QrCodeGenerator'
import UtilBarcodeGenerator from './06-utility/BarcodeGenerator'
import UtilHashGenerator from './06-utility/HashGenerator'
import UtilColorConverter from './06-utility/ColorConverter'
import UtilTemperatureConverter from './06-utility/TemperatureConverter'
import UtilLengthConverter from './06-utility/LengthConverter'
import UtilWeightConverter from './06-utility/WeightConverter'
import UtilVolumeConverter from './06-utility/VolumeConverter'
import UtilSpeedConverter from './06-utility/SpeedConverter'
import UtilAreaConverter from './06-utility/AreaConverter'
import UtilTimeConverter from './06-utility/TimeConverter'
import UtilDataStorageConverter from './06-utility/DataStorageConverter'
import UtilCurrencyConverter from './06-utility/CurrencyConverter'
import UtilTimezoneConverter from './06-utility/TimezoneConverter'
import UtilNumberBaseConverter from './06-utility/NumberBaseConverter'
import UtilRomanNumeralConverter from './06-utility/RomanNumeralConverter'
import UtilMorseCodeConverter from './06-utility/MorseCodeConverter'
import ScreenRuler from './06-utility/ScreenRuler'
import BatteryStatus from './06-utility/BatteryStatus'
import InternetSpeedTest from './06-utility/InternetSpeedTest'
import NoteTaking from './06-utility/NoteTaking'
// Lifestyle Tools (241-280)
import RecipeScaler from './07-lifestyle/RecipeScaler'
import FitnessCalculator from './07-lifestyle/FitnessCalculator'
import SleepCalculator from './07-lifestyle/SleepCalculator'
import CalorieCounter from './07-lifestyle/CalorieCounter'
import LifestyleWaterIntakeTracker from './07-lifestyle/WaterIntakeTracker'
import HabitTracker from './07-lifestyle/HabitTracker'
import TodoList from './07-lifestyle/TodoList'
import BudgetTracker from './07-lifestyle/BudgetTracker'
import ExpenseSplitter from './07-lifestyle/ExpenseSplitter'
import CookingUnitConverter from './07-lifestyle/CookingUnitConverter'
import MeetingPlanner from './07-lifestyle/MeetingPlanner'
import EventCountdown from './07-lifestyle/EventCountdown'
import BirthdayReminder from './07-lifestyle/BirthdayReminder'
import GroceryList from './07-lifestyle/GroceryList'
import MealPlanner from './07-lifestyle/MealPlanner'
import WorkoutTracker from './07-lifestyle/WorkoutTracker'
import MoodTracker from './07-lifestyle/MoodTracker'
import JournalApp from './07-lifestyle/JournalApp'
import GratitudeJournal from './07-lifestyle/GratitudeJournal'
import BookTracker from './07-lifestyle/BookTracker'
import MovieTracker from './07-lifestyle/MovieTracker'
import PlantWateringReminder from './07-lifestyle/PlantWateringReminder'
import PetCareTracker from './07-lifestyle/PetCareTracker'
import ChoreTracker from './07-lifestyle/ChoreTracker'
import QuoteOfTheDay from './07-lifestyle/QuoteOfTheDay'
import AffirmationGenerator from './07-lifestyle/AffirmationGenerator'
import BreathingExercise from './07-lifestyle/BreathingExercise'
import MeditationTimer from './07-lifestyle/MeditationTimer'
import DailyPlanner from './07-lifestyle/DailyPlanner'
import GoalTracker from './07-lifestyle/GoalTracker'
import SavingsGoalTracker from './07-lifestyle/SavingsGoalTracker'
import DebtPayoffCalculator from './07-lifestyle/DebtPayoffCalculator'
import NetWorthCalculator from './07-lifestyle/NetWorthCalculator'
import TravelPackingList from './07-lifestyle/TravelPackingList'
import SubscriptionManager from './07-lifestyle/SubscriptionManager'
import ContactManager from './07-lifestyle/ContactManager'
import ScreenTimeTracker from './07-lifestyle/ScreenTimeTracker'
import DigitalDetoxTimer from './07-lifestyle/DigitalDetoxTimer'
import PasswordHealthChecker from './07-lifestyle/PasswordHealthChecker'
import LifeCalendar from './07-lifestyle/LifeCalendar'
// Finance Tools (281-320)
import FinanceLoanCalculator from './08-finance/LoanCalculator'
import CompoundInterestCalculator from './08-finance/CompoundInterestCalculator'
import InvestmentReturnCalculator from './08-finance/InvestmentReturnCalculator'
import FinanceCurrencyConverter from './08-finance/CurrencyConverter'
import FinanceTipCalculator from './08-finance/TipCalculator'
import BillSplitter from './08-finance/BillSplitter'
import FinanceSavingsGoalTracker from './08-finance/SavingsGoalTracker'
import BudgetPlanner from './08-finance/BudgetPlanner'
import FinanceNetWorthCalculator from './08-finance/NetWorthCalculator'
import RetirementCalculator from './08-finance/RetirementCalculator'
import MortgageCalculator from './08-finance/MortgageCalculator'
import TaxEstimator from './08-finance/TaxEstimator'
import FinanceExpenseTracker from './08-finance/ExpenseTracker'
import InvoiceGenerator from './08-finance/InvoiceGenerator'
import ProfitMarginCalculator from './08-finance/ProfitMarginCalculator'
import BreakEvenCalculator from './08-finance/BreakEvenCalculator'
import SalaryToHourlyConverter from './08-finance/SalaryToHourlyConverter'
import InflationCalculator from './08-finance/InflationCalculator'
import DiscountCalculator from './08-finance/DiscountCalculator'
import CreditCardPayoffCalculator from './08-finance/CreditCardPayoffCalculator'
import EmergencyFundCalculator from './08-finance/EmergencyFundCalculator'
import DownPaymentCalculator from './08-finance/DownPaymentCalculator'
import CarLoanCalculator from './08-finance/CarLoanCalculator'
import StockReturnCalculator from './08-finance/StockReturnCalculator'
import DividendCalculator from './08-finance/DividendCalculator'
import PricePerUnitCalculator from './08-finance/PricePerUnitCalculator'
import MarkupCalculator from './08-finance/MarkupCalculator'
import CommissionCalculator from './08-finance/CommissionCalculator'
import HourlyRateCalculator from './08-finance/HourlyRateCalculator'
import FreelanceRateCalculator from './08-finance/FreelanceRateCalculator'
import SubscriptionCostCalculator from './08-finance/SubscriptionCostCalculator'
import CostOfLivingCalculator from './08-finance/CostOfLivingCalculator'
import DebtSnowballCalculator from './08-finance/DebtSnowballCalculator'
import BudgetRuleCalculator from './08-finance/BudgetRuleCalculator'
import FutureValueCalculator from './08-finance/FutureValueCalculator'
import PresentValueCalculator from './08-finance/PresentValueCalculator'
import CAGRCalculator from './08-finance/CAGRCalculator'
import ExpenseRatioCalculator from './08-finance/ExpenseRatioCalculator'
import NetIncomeCalculator from './08-finance/NetIncomeCalculator'
import FinancialIndependenceCalculator from './08-finance/FinancialIndependenceCalculator'
// Education Tools (321-360)
import FlashcardMaker from './09-education/FlashcardMaker'
import EduPomodoroTimer from './09-education/PomodoroTimer'
import GradeCalculator from './09-education/GradeCalculator'
import GpaCalculator from './09-education/GpaCalculator'
import CitationGenerator from './09-education/CitationGenerator'
import ReadingSpeedTest from './09-education/ReadingSpeedTest'
import TypingSpeedTest from './09-education/TypingSpeedTest'
import MathSolver from './09-education/MathSolver'
import FractionCalculator from './09-education/FractionCalculator'
import EduPercentageCalculator from './09-education/PercentageCalculator'
import PeriodicTable from './09-education/PeriodicTable'
import MolecularWeightCalculator from './09-education/MolecularWeightCalculator'
import StatisticsCalculator from './09-education/StatisticsCalculator'
import ProbabilityCalculator from './09-education/ProbabilityCalculator'
import EssayWordCounter from './09-education/EssayWordCounter'
import StudyTimer from './09-education/StudyTimer'
import VocabularyBuilder from './09-education/VocabularyBuilder'
import MultiplicationTable from './09-education/MultiplicationTable'
import QuizMaker from './09-education/QuizMaker'
import EduUnitConverter from './09-education/UnitConverter'
import MindMapCreator from './09-education/MindMapCreator'
import CornellNotes from './09-education/CornellNotes'
import AcronymGenerator from './09-education/AcronymGenerator'
import SpellingPractice from './09-education/SpellingPractice'
import EquationBalancer from './09-education/EquationBalancer'
import GeometryCalculator from './09-education/GeometryCalculator'
import HistoryTimeline from './09-education/HistoryTimeline'
import NoteTakingTemplate from './09-education/NoteTakingTemplate'
import MnemonicCreator from './09-education/MnemonicCreator'
import BookSummary from './09-education/BookSummary'
import DebateTimer from './09-education/DebateTimer'
import MorseCodeTranslator from './09-education/MorseCodeTranslator'
import BinaryConverter from './09-education/BinaryConverter'
import EduRomanNumeralConverter from './09-education/RomanNumeralConverter'
import ThesaurusTool from './09-education/ThesaurusTool'
import EssayOutliner from './09-education/EssayOutliner'
import HomeworkTracker from './09-education/HomeworkTracker'
import ClassSchedule from './09-education/ClassSchedule'
import LanguageFlashcards from './09-education/LanguageFlashcards'
import MathFactsPractice from './09-education/MathFactsPractice'
import ReadingLog from './09-education/ReadingLog'
import ScienceGlossary from './09-education/ScienceGlossary'
// Health Tools (363-402)
import IdealWeightCalculator from './10-health/IdealWeightCalculator'
import BodyFatCalculator from './10-health/BodyFatCalculator'
import HealthCalorieCounter from './10-health/CalorieCounter'
import WaterIntakeCalculator from './10-health/WaterIntakeCalculator'
import SleepTracker from './10-health/SleepTracker'
import HealthMoodTracker from './10-health/MoodTracker'
import MedicationReminder from './10-health/MedicationReminder'
import HeartRateMonitor from './10-health/HeartRateMonitor'
import BloodPressureLog from './10-health/BloodPressureLog'
import WeightTracker from './10-health/WeightTracker'
import HealthMealPlanner from './10-health/MealPlanner'
import Health10ExerciseTimer from './10-health/ExerciseTimer'
import FastingTimer from './10-health/FastingTimer'
import PregnancyCalculator from './10-health/PregnancyCalculator'
import OvulationCalculator from './10-health/OvulationCalculator'
import HealthBreathingExercise from './10-health/BreathingExercise'
import HealthMeditationTimer from './10-health/MeditationTimer'
import BmrCalculator from './10-health/BmrCalculator'
import TdeeCalculator from './10-health/TdeeCalculator'
import MacroCalculator from './10-health/MacroCalculator'
import WorkoutLog from './10-health/WorkoutLog'
import RunningPaceCalculator from './10-health/RunningPaceCalculator'
import YogaPoseGuide from './10-health/YogaPoseGuide'
import FirstAidGuide from './10-health/FirstAidGuide'
import Health10StepCounter from './10-health/StepCounter'
import HydrationTracker from './10-health/HydrationTracker'
import ProteinIntakeCalculator from './10-health/ProteinIntakeCalculator'
import VisionTest from './10-health/VisionTest'
import PainDiary from './10-health/PainDiary'
import PostureReminder from './10-health/PostureReminder'
import AllergyTracker from './10-health/AllergyTracker'
import StressLevelTracker from './10-health/StressLevelTracker'
import VaccinationSchedule from './10-health/VaccinationSchedule'
import BabyGrowthTracker from './10-health/BabyGrowthTracker'
import HearingTest from './10-health/HearingTest'
import KetoCalculator from './10-health/KetoCalculator'
import SwimmingLog from './10-health/SwimmingLog'
import CyclingCalculator from './10-health/CyclingCalculator'
import NutritionFactsLookup from './10-health/NutritionFactsLookup'
import SymptomChecker from './10-health/SymptomChecker'
import HashtagGenerator from './11-social/HashtagGenerator'
import TweetCharacterCounter from './11-social/TweetCharacterCounter'
import BioGenerator from './11-social/BioGenerator'
import UsernameGenerator from './11-social/UsernameGenerator'
import EngagementRateCalculator from './11-social/EngagementRateCalculator'
import SocialQRCodeGenerator from './11-social/QRCodeGenerator'
import DiscordTimestamp from './11-social/DiscordTimestamp'
import EmailSignatureGenerator from './11-social/EmailSignatureGenerator'
import PollCreator from './11-social/PollCreator'
import SocialEventCountdown from './11-social/EventCountdown'
import InvitationCardCreator from './11-social/InvitationCardCreator'
import GuestListManager from './11-social/GuestListManager'
import NameTagGenerator from './11-social/NameTagGenerator'
import ContentIdeasGenerator from './11-social/ContentIdeasGenerator'
import InfluencerRateCalculator from './11-social/InfluencerRateCalculator'
import TeamNameGenerator from './11-social/TeamNameGenerator'
import ThankYouNoteGenerator from './11-social/ThankYouNoteGenerator'
import MeetingNotesTemplate from './11-social/MeetingNotesTemplate'
import ContactCardGenerator from './11-social/ContactCardGenerator'
import SocialMediaCalendar from './11-social/SocialMediaCalendar'
import SocialImageResizer from './11-social/SocialImageResizer'
import RSVPTracker from './11-social/RSVPTracker'
import CaptionGenerator from './11-social/CaptionGenerator'
import GroupChatNameGenerator from './11-social/GroupChatNameGenerator'
import FollowerMilestoneTracker from './11-social/FollowerMilestoneTracker'
import SeatingChartGenerator from './11-social/SeatingChartGenerator'
import PlaceCardGenerator from './11-social/PlaceCardGenerator'
import BadgeGenerator from './11-social/BadgeGenerator'
import LinkInBioCreator from './11-social/LinkInBioCreator'
import SocialAnalyticsDashboard from './11-social/SocialAnalyticsDashboard'
import CommentTemplateGenerator from './11-social/CommentTemplateGenerator'
import StoryTemplateGenerator from './11-social/StoryTemplateGenerator'
import SlackEmojiPicker from './11-social/SlackEmojiPicker'
import VideoCallBackgroundGenerator from './11-social/VideoCallBackgroundGenerator'
import GiftRegistryCreator from './11-social/GiftRegistryCreator'
import PartyPlanner from './11-social/PartyPlanner'
import ProfilePictureCropper from './11-social/ProfilePictureCropper'
import ViralScoreCalculator from './11-social/ViralScoreCalculator'
import PostSchedulerMockup from './11-social/PostSchedulerMockup'
import SocialLinkGenerator from './11-social/SocialLinkGenerator'
import ProdInvoiceGenerator from './12-productivity/InvoiceGenerator'
import ReceiptMaker from './12-productivity/ReceiptMaker'
import BusinessCardGenerator from './12-productivity/BusinessCardGenerator'
import MeetingAgendaCreator from './12-productivity/MeetingAgendaCreator'
import ExpenseTracker from './12-productivity/ExpenseTracker'
import TimeTracker from './12-productivity/TimeTracker'
import TaskPriorityMatrix from './12-productivity/TaskPriorityMatrix'
import DecisionMatrix from './12-productivity/DecisionMatrix'
import SwotAnalysis from './12-productivity/SwotAnalysis'
import ProdGoalTracker from './12-productivity/GoalTracker'
import ProdHabitTracker from './12-productivity/HabitTracker'
import ProdPomodoroTimer from './12-productivity/PomodoroTimer'
import ProdMindMapCreator from './12-productivity/MindMapCreator'
import KanbanBoard from './12-productivity/KanbanBoard'
import ProdDailyPlanner from './12-productivity/DailyPlanner'
import NoteTakingApp from './12-productivity/NoteTakingApp'
import ChecklistMaker from './12-productivity/ChecklistMaker'
import BookmarkManager from './12-productivity/BookmarkManager'
import PasswordGeneratorPro from './12-productivity/PasswordGeneratorPro'
import QuoteGenerator from './12-productivity/QuoteGenerator'
import MemoMaker from './12-productivity/MemoMaker'
import ProjectTimeline from './12-productivity/ProjectTimeline'
import EmailTemplateGenerator from './12-productivity/EmailTemplateGenerator'
import ProdBudgetPlanner from './12-productivity/BudgetPlanner'
import InventoryTracker from './12-productivity/InventoryTracker'
import ContractTemplate from './12-productivity/ContractTemplate'
import PresentationOutline from './12-productivity/PresentationOutline'
import ClientDirectory from './12-productivity/ClientDirectory'
import ShippingLabelGenerator from './12-productivity/ShippingLabelGenerator'
import PackingListCreator from './12-productivity/PackingListCreator'
import OrderFormCreator from './12-productivity/OrderFormCreator'
import ReturnLabelGenerator from './12-productivity/ReturnLabelGenerator'
import WarrantyTracker from './12-productivity/WarrantyTracker'
import AppointmentScheduler from './12-productivity/AppointmentScheduler'
import MileageTracker from './12-productivity/MileageTracker'
import VehicleMaintenanceLog from './12-productivity/VehicleMaintenanceLog'
import SubscriptionTracker from './12-productivity/SubscriptionTracker'
import ProdLoanCalculator from './12-productivity/LoanCalculator'
import SavingsGoalCalculator from './12-productivity/SavingsGoalCalculator'
import NetWorthTracker from './12-productivity/NetWorthTracker'
import ScienceUnitConverter from './13-science/UnitConverter'
import ScienceScientificCalculator from './13-science/ScientificCalculator'
import ScienceGraphingCalculator from './13-science/GraphingCalculator'
import ScienceMatrixCalculator from './13-science/MatrixCalculator'
import ScienceEquationSolver from './13-science/EquationSolver'
import ScienceStatisticsCalculator from './13-science/StatisticsCalculator'
import ScienceTrigonometryCalculator from './13-science/TrigonometryCalculator'
import SciencePrimeNumberChecker from './13-science/PrimeNumberChecker'
import ScienceFactorCalculator from './13-science/FactorCalculator'
import ScienceGcdLcmCalculator from './13-science/GcdLcmCalculator'
import ScienceFractionCalculator from './13-science/FractionCalculator'
import SciencePercentageCalculator from './13-science/PercentageCalculator'
import ScienceNumberBaseConverter from './13-science/NumberBaseConverter'
import ScienceBinaryCalculator from './13-science/BinaryCalculator'
import ScienceHexCalculator from './13-science/HexCalculator'
import ScienceChemicalFormulaParser from './13-science/ChemicalFormulaParser'
import SciencePhysicsCalculator from './13-science/PhysicsCalculator'
import ScienceMolarityCalculator from './13-science/MolarityCalculator'
import ScienceGeometryCalculator from './13-science/GeometryCalculator'
import ScienceSequenceCalculator from './13-science/SequenceCalculator'
import ScienceLogarithmCalculator from './13-science/LogarithmCalculator'
import ScienceComplexNumberCalculator from './13-science/ComplexNumberCalculator'
import ScienceVectorCalculator from './13-science/VectorCalculator'
import ScienceDerivativeCalculator from './13-science/DerivativeCalculator'
import ScienceIntegralCalculator from './13-science/IntegralCalculator'
import ScienceProbabilityCalculator from './13-science/ProbabilityCalculator'
import ScienceQuadraticSolver from './13-science/QuadraticSolver'
import SciencePolynomialCalculator from './13-science/PolynomialCalculator'
import ScienceAstronomyCalculator from './13-science/AstronomyCalculator'
import ScienceElectricalCalculator from './13-science/ElectricalCalculator'
import ScienceTemperatureConverter from './13-science/TemperatureConverter'
import ScienceSpeedConverter from './13-science/SpeedConverter'
import ScienceDataStorageConverter from './13-science/DataStorageConverter'
import ScienceAngleConverter from './13-science/AngleConverter'
import ScienceTimeConverter from './13-science/TimeConverter'
import ScienceForceConverter from './13-science/ForceConverter'
import SciencePressureConverter from './13-science/PressureConverter'
import ScienceEnergyConverter from './13-science/EnergyConverter'
import SciencePowerConverter from './13-science/PowerConverter'
import ScienceFrequencyCalculator from './13-science/FrequencyCalculator'

// Category 14: Games & Entertainment
import DiceRoller from './14-games/DiceRoller'
import CardShuffler from './14-games/CardShuffler'
import WordSearchGenerator from './14-games/WordSearchGenerator'
import SudokuGenerator from './14-games/SudokuGenerator'
import TriviaQuiz from './14-games/TriviaQuiz'
import RockPaperScissors from './14-games/RockPaperScissors'
import TicTacToe from './14-games/TicTacToe'
import MemoryMatch from './14-games/MemoryMatch'
import HangmanGame from './14-games/HangmanGame'
import NumberGuessingGame from './14-games/NumberGuessingGame'
import ReactionTimeTest from './14-games/ReactionTimeTest'
import ColorMatchGame from './14-games/ColorMatchGame'
import WordScramble from './14-games/WordScramble'
import TypingRaceGame from './14-games/TypingRaceGame'
import MathQuizGame from './14-games/MathQuizGame'
import PuzzleSlider from './14-games/PuzzleSlider'
import MazeGenerator from './14-games/MazeGenerator'
import ConnectFour from './14-games/ConnectFour'
import Minesweeper from './14-games/Minesweeper'
import Game2048 from './14-games/Game2048'
import WhackAMole from './14-games/WhackAMole'
import CookieClicker from './14-games/CookieClicker'
import EmojiPuzzle from './14-games/EmojiPuzzle'
import SpotDifference from './14-games/SpotDifference'
import QuickDraw from './14-games/QuickDraw'
import WordChain from './14-games/WordChain'
import AnagramFinder from './14-games/AnagramFinder'
import PatternMemory from './14-games/PatternMemory'
import SpeedMath from './14-games/SpeedMath'
import FlagQuiz from './14-games/FlagQuiz'
import CapitalQuiz from './14-games/CapitalQuiz'
import TrueOrFalse from './14-games/TrueOrFalse'
import BrainTeaser from './14-games/BrainTeaser'
import LogoQuiz from './14-games/LogoQuiz'
import SoundBoard from './14-games/SoundBoard'
import StoryGenerator from './14-games/StoryGenerator'
import CharacterCreator from './14-games/CharacterCreator'
import NameGenerator from './14-games/NameGenerator'
import MadLibs from './14-games/MadLibs'
import FortuneWheel from './14-games/FortuneWheel'

// Category 15: Art & Design (#563-#602)
import ArtColorPaletteGenerator from './15-art/ColorPaletteGenerator'
import ArtGradientGenerator from './15-art/GradientGenerator'
import PatternMaker from './15-art/PatternMaker'
import PixelArtMaker from './15-art/PixelArtMaker'
import IconGenerator from './15-art/IconGenerator'
import LogoMaker from './15-art/LogoMaker'
import BannerCreator from './15-art/BannerCreator'
import ArtFaviconGenerator from './15-art/FaviconGenerator'
import MockupGenerator from './15-art/MockupGenerator'
import ColorBlindSimulator from './15-art/ColorBlindSimulator'
import ImageFilters from './15-art/ImageFilters'
import TextureMaker from './15-art/TextureMaker'
import ShapeGenerator from './15-art/ShapeGenerator'
import WatermarkMaker from './15-art/WatermarkMaker'
import CollageCreator from './15-art/CollageCreator'
import MemeGenerator from './15-art/MemeGenerator'
import AvatarCreator from './15-art/AvatarCreator'
import BadgeMaker from './15-art/BadgeMaker'
import CertificateMaker from './15-art/CertificateMaker'
import BusinessCardDesigner from './15-art/BusinessCardDesigner'
import PosterMaker from './15-art/PosterMaker'
import ChartMaker from './15-art/ChartMaker'
import FlowchartMaker from './15-art/FlowchartMaker'
import MindmapBuilder from './15-art/MindmapBuilder'
import ColorMixer from './15-art/ColorMixer'
import PaletteExtractor from './15-art/PaletteExtractor'
import ColorHarmony from './15-art/ColorHarmony'
import ContrastChecker from './15-art/ContrastChecker'
import ShadowGenerator from './15-art/ShadowGenerator'
import BorderGenerator from './15-art/BorderGenerator'
import DividerMaker from './15-art/DividerMaker'
import EmojiArt from './15-art/EmojiArt'
import ASCIIArtGenerator from './15-art/ASCIIArtGenerator'
import TypographyTool from './15-art/TypographyTool'
import FontPairer from './15-art/FontPairer'
import DesignInspiration from './15-art/DesignInspiration'
import ArtColorConverter from './15-art/ColorConverter'
import ArtImageCropper from './15-art/ImageCropper'
import ThumbnailMaker from './15-art/ThumbnailMaker'
import SocialMediaImageCreator from './15-art/SocialMediaImageCreator'

// Category 16: Communication & Collaboration (#603-#642)
import TeamMessageFormatter from './16-communication/TeamMessageFormatter'
import MeetingScheduler from './16-communication/MeetingScheduler'
import EmailTemplateBuilder from './16-communication/EmailTemplateBuilder'
import GroupNameGenerator from './16-communication/GroupNameGenerator'
import AnnouncementMaker from './16-communication/AnnouncementMaker'
import SlackMessageFormatter from './16-communication/SlackMessageFormatter'
import DiscordEmbedGenerator from './16-communication/DiscordEmbedGenerator'
import AgendaCreator from './16-communication/AgendaCreator'
import MeetingMinutes from './16-communication/MeetingMinutes'
import PollMaker from './16-communication/PollMaker'
import IcebreakerGenerator from './16-communication/IcebreakerGenerator'
import StandupFormatter from './16-communication/StandupFormatter'
import RetrospectiveTemplate from './16-communication/RetrospectiveTemplate'
import FeedbackFormBuilder from './16-communication/FeedbackFormBuilder'
import TeamDirectory from './16-communication/TeamDirectory'
import OnboardingChecklist from './16-communication/OnboardingChecklist'
import OneOnOneAgenda from './16-communication/OneOnOneAgenda'
import StatusUpdateFormatter from './16-communication/StatusUpdateFormatter'
import TaskDelegator from './16-communication/TaskDelegator'
import TeamRoleAssigner from './16-communication/TeamRoleAssigner'
import CommDecisionMatrix from './16-communication/DecisionMatrix'
import BrainstormBoard from './16-communication/BrainstormBoard'
import CommProjectTimeline from './16-communication/ProjectTimeline'
import MilestoneTracker from './16-communication/MilestoneTracker'
import ResourcePlanner from './16-communication/ResourcePlanner'
import WorkloadBalancer from './16-communication/WorkloadBalancer'
import CommunicationLog from './16-communication/CommunicationLog'
import EscalationPath from './16-communication/EscalationPath'
import OrgChartMaker from './16-communication/OrgChartMaker'
import ExitInterviewTemplate from './16-communication/ExitInterviewTemplate'
import PerformanceReviewTemplate from './16-communication/PerformanceReviewTemplate'
import MeetingCostCalculator from './16-communication/MeetingCostCalculator'
import TeamHealthCheck from './16-communication/TeamHealthCheck'
import RACIMatrix from './16-communication/RACIMatrix'
import KnowledgeBaseBuilder from './16-communication/KnowledgeBaseBuilder'
import ChangelogGenerator from './16-communication/ChangelogGenerator'
import ReleaseNotesBuilder from './16-communication/ReleaseNotesBuilder'
import SOPBuilder from './16-communication/SOPBuilder'
import ProcessFlowMaker from './16-communication/ProcessFlowMaker'
import TeamCapacityPlanner from './16-communication/TeamCapacityPlanner'

// Category 17: Security & Privacy
import PasswordGeneratorSecurity from './17-security/PasswordGenerator'
import PasswordStrengthChecker from './17-security/PasswordStrengthChecker'
import HashGeneratorSecurity from './17-security/HashGenerator'
import TextEncryptor from './17-security/TextEncryptor'
import TwoFactorSetup from './17-security/TwoFactorSetup'
import SecureNotepad from './17-security/SecureNotepad'
import PrivacyPolicyGenerator from './17-security/PrivacyPolicyGenerator'
import CookieConsentBuilder from './17-security/CookieConsentBuilder'
import DataBreachChecker from './17-security/DataBreachChecker'
import PermissionAnalyzer from './17-security/PermissionAnalyzer'
import SecurityHeadersChecker from './17-security/SecurityHeadersChecker'
import SSLCertificateInfo from './17-security/SSLCertificateInfo'
import KeyPairGenerator from './17-security/KeyPairGenerator'
import SecretSharing from './17-security/SecretSharing'
import FileHashChecker from './17-security/FileHashChecker'
import MetadataStripper from './17-security/MetadataStripper'
import AnonymousIdGenerator from './17-security/AnonymousIdGenerator'
import PrivacySettingsAudit from './17-security/PrivacySettingsAudit'
import SecurePasswordShare from './17-security/SecurePasswordShare'
import AccessControlMatrix from './17-security/AccessControlMatrix'
import RiskAssessmentTool from './17-security/RiskAssessmentTool'
import IncidentResponsePlan from './17-security/IncidentResponsePlan'
import SecurityChecklist from './17-security/SecurityChecklist'
import PhishingDetector from './17-security/PhishingDetector'
import DataClassifier from './17-security/DataClassifier'
import EncryptionKeyManager from './17-security/EncryptionKeyManager'
import SecureFileNamer from './17-security/SecureFileNamer'
import PrivacyImpactAssessment from './17-security/PrivacyImpactAssessment'
import ConsentManager from './17-security/ConsentManager'
import DataRetentionPolicy from './17-security/DataRetentionPolicy'
import SecurityAwarenessQuiz from './17-security/SecurityAwarenessQuiz'
import ThreatModelBuilder from './17-security/ThreatModelBuilder'
import SecurityPolicyGenerator from './17-security/SecurityPolicyGenerator'
import ComplianceChecker from './17-security/ComplianceChecker'
import AuditLogViewer from './17-security/AuditLogViewer'
import AccessReviewTool from './17-security/AccessReviewTool'
import SecurityScorecard from './17-security/SecurityScorecard'
import VulnerabilityTracker from './17-security/VulnerabilityTracker'
import SecureCodeReview from './17-security/SecureCodeReview'
import BiometricAuthGuide from './17-security/BiometricAuthGuide'

// Category 18: Business & Marketing
import BusinessNameGenerator from './18-business/BusinessNameGenerator'
import SloganGenerator from './18-business/SloganGenerator'
import PitchDeckOutline from './18-business/PitchDeckOutline'
import SWOTAnalysis from './18-business/SWOTAnalysis'
import CompetitorAnalysis from './18-business/CompetitorAnalysis'
import ValueProposition from './18-business/ValueProposition'
import ElevatorPitch from './18-business/ElevatorPitch'
import CustomerPersona from './18-business/CustomerPersona'
import PricingCalculator from './18-business/PricingCalculator'
import MarketSizeCalculator from './18-business/MarketSizeCalculator'
import BizBreakEvenCalculator from './18-business/BreakEvenCalculator'
import ROICalculator from './18-business/ROICalculator'
import SocialMediaPlanner from './18-business/SocialMediaPlanner'
import BizEmailSignatureGenerator from './18-business/EmailSignatureGenerator'
import BizInvoiceGenerator from './18-business/InvoiceGenerator'
import ProposalTemplate from './18-business/ProposalTemplate'
import BizContractTemplate from './18-business/ContractTemplate'
import BrandingKit from './18-business/BrandingKit'
import MeetingAgenda from './18-business/MeetingAgenda'
import BizProjectTimeline from './18-business/ProjectTimeline'
import OKRTracker from './18-business/OKRTracker'
import KPIDashboard from './18-business/KPIDashboard'
import BizBudgetPlanner from './18-business/BudgetPlanner'
import CashFlowTracker from './18-business/CashFlowTracker'
import BizProfitMarginCalculator from './18-business/ProfitMarginCalculator'
import SalesForecaster from './18-business/SalesForecaster'
import LeadScoring from './18-business/LeadScoring'
import EmailCampaign from './18-business/EmailCampaign'
import ABTestPlanner from './18-business/ABTestPlanner'
import ContentCalendar from './18-business/ContentCalendar'
import SEOChecker from './18-business/SEOChecker'
import KeywordPlanner from './18-business/KeywordPlanner'
import BizHashtagGenerator from './18-business/HashtagGenerator'
import PressRelease from './18-business/PressRelease'
import MediaKit from './18-business/MediaKit'
import TestimonialCollector from './18-business/TestimonialCollector'
import CaseStudyTemplate from './18-business/CaseStudyTemplate'
import NewsletterBuilder from './18-business/NewsletterBuilder'
import SurveyCreator from './18-business/SurveyCreator'
import FeedbackForm from './18-business/FeedbackForm'
import Edu19FlashcardMaker from './19-education/FlashcardMaker'
import QuizGenerator from './19-education/QuizGenerator'
import Edu19StudyTimer from './19-education/StudyTimer'
import NoteSummarizer from './19-education/NoteSummarizer'
import Edu19VocabularyBuilder from './19-education/VocabularyBuilder'
import GrammarChecker from './19-education/GrammarChecker'
import Edu19CitationGenerator from './19-education/CitationGenerator'
import BibliographyMaker from './19-education/BibliographyMaker'
import Edu19EssayOutliner from './19-education/EssayOutliner'
import MindMapper from './19-education/MindMapper'
import MathProblemSolver from './19-education/MathProblemSolver'
import Edu19PeriodicTable from './19-education/PeriodicTable'
import Edu19MultiplicationTable from './19-education/MultiplicationTable'
import Edu19FractionCalculator from './19-education/FractionCalculator'
import Edu19GradeCalculator from './19-education/GradeCalculator'
import GPACalculator from './19-education/GPACalculator'
import Edu19ReadingSpeedTest from './19-education/ReadingSpeedTest'
import Edu19TypingSpeedTest from './19-education/TypingSpeedTest'
import LearningGoalTracker from './19-education/LearningGoalTracker'
import HomeworkPlanner from './19-education/HomeworkPlanner'
import ExamCountdown from './19-education/ExamCountdown'
import StudyGroupOrganizer from './19-education/StudyGroupOrganizer'
import LanguageLearningTracker from './19-education/LanguageLearningTracker'
import Edu19SpellingPractice from './19-education/SpellingPractice'
import MathFactsFluency from './19-education/MathFactsFluency'
import CourseScheduler from './19-education/CourseScheduler'
import ResearchPaperOutliner from './19-education/ResearchPaperOutliner'
import ThesisStatementBuilder from './19-education/ThesisStatementBuilder'
import BookReportHelper from './19-education/BookReportHelper'
import ScienceExperimentLog from './19-education/ScienceExperimentLog'
import HistoryTimelineMaker from './19-education/HistoryTimelineMaker'
import GeographyQuiz from './19-education/GeographyQuiz'
import MusicTheoryHelper from './19-education/MusicTheoryHelper'
import DebatePrep from './19-education/DebatePrep'
import PresentationTimer from './19-education/PresentationTimer'
import ClassParticipationTracker from './19-education/ClassParticipationTracker'
import StudyBreakReminder from './19-education/StudyBreakReminder'
import LearningStyleQuiz from './19-education/LearningStyleQuiz'
import AcademicCalendar from './19-education/AcademicCalendar'
import StudyPlaylist from './19-education/StudyPlaylist'

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
    id: '953',
    path: 'image-watermark',
    nameKey: 'tools.imageWatermark.name',
    descriptionKey: 'tools.imageWatermark.description',
    category: '25-other',
    component: ImageWatermark,
  },
  {
    id: '952',
    path: 'image-color-picker',
    nameKey: 'tools.imageColorPicker.name',
    descriptionKey: 'tools.imageColorPicker.description',
    category: '25-other',
    component: ImageColorPicker,
  },
  {
    id: '951',
    path: 'image-metadata-viewer',
    nameKey: 'tools.imageMetadata.name',
    descriptionKey: 'tools.imageMetadata.description',
    category: '25-other',
    component: ImageMetadataViewer,
  },
  {
    id: '950',
    path: 'screenshot-tool',
    nameKey: 'tools.screenshotTool.name',
    descriptionKey: 'tools.screenshotTool.description',
    category: '25-other',
    component: ScreenshotTool,
  },
  {
    id: '949',
    path: 'image-collage-maker',
    nameKey: 'tools.imageCollage.name',
    descriptionKey: 'tools.imageCollage.description',
    category: '25-other',
    component: ImageCollageMaker,
  },
  {
    id: '948',
    path: 'image-background-remover',
    nameKey: 'tools.bgRemover.name',
    descriptionKey: 'tools.bgRemover.description',
    category: '25-other',
    component: ImageBackgroundRemover,
  },
  {
    id: '947',
    path: 'image-annotator',
    nameKey: 'tools.imageAnnotator.name',
    descriptionKey: 'tools.imageAnnotator.description',
    category: '25-other',
    component: ImageAnnotator,
  },
  {
    id: '946',
    path: 'image-blur-tool',
    nameKey: 'tools.imageBlur.name',
    descriptionKey: 'tools.imageBlur.description',
    category: '25-other',
    component: ImageBlurTool,
  },
  {
    id: '945',
    path: 'image-mosaic-tool',
    nameKey: 'tools.imageMosaic.name',
    descriptionKey: 'tools.imageMosaic.description',
    category: '25-other',
    component: ImageMosaicTool,
  },
  {
    id: '944',
    path: 'image-histogram',
    nameKey: 'tools.imageHistogram.name',
    descriptionKey: 'tools.imageHistogram.description',
    category: '25-other',
    component: ImageHistogram,
  },
  {
    id: '943',
    path: 'image-splitter',
    nameKey: 'tools.imageSplitter.name',
    descriptionKey: 'tools.imageSplitter.description',
    category: '25-other',
    component: ImageSplitter,
  },
  {
    id: '942',
    path: 'image-merger',
    nameKey: 'tools.imageMerger.name',
    descriptionKey: 'tools.imageMerger.description',
    category: '25-other',
    component: ImageMerger,
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
  {
    id: '006',
    path: 'text-reverser',
    nameKey: 'tools.textReverser.name',
    descriptionKey: 'tools.textReverser.description',
    category: '01-text',
    component: TextReverser,
  },
  {
    id: '007',
    path: 'whitespace-cleaner',
    nameKey: 'tools.whitespaceCleaner.name',
    descriptionKey: 'tools.whitespaceCleaner.description',
    category: '01-text',
    component: WhitespaceCleaner,
  },
  {
    id: '008',
    path: 'newline-converter',
    nameKey: 'tools.newlineConverter.name',
    descriptionKey: 'tools.newlineConverter.description',
    category: '01-text',
    component: NewlineConverter,
  },
  {
    id: '009',
    path: 'text-truncator',
    nameKey: 'tools.textTruncator.name',
    descriptionKey: 'tools.textTruncator.description',
    category: '01-text',
    component: TextTruncator,
  },
  {
    id: '010',
    path: 'text-splitter',
    nameKey: 'tools.textSplitter.name',
    descriptionKey: 'tools.textSplitter.description',
    category: '01-text',
    component: TextSplitter,
  },
  {
    id: '011',
    path: 'text-joiner',
    nameKey: 'tools.textJoiner.name',
    descriptionKey: 'tools.textJoiner.description',
    category: '01-text',
    component: TextJoiner,
  },
  {
    id: '012',
    path: 'line-number-adder',
    nameKey: 'tools.lineNumberAdder.name',
    descriptionKey: 'tools.lineNumberAdder.description',
    category: '01-text',
    component: LineNumberAdder,
  },
  {
    id: '013',
    path: 'indentation-converter',
    nameKey: 'tools.indentationConverter.name',
    descriptionKey: 'tools.indentationConverter.description',
    category: '01-text',
    component: IndentationConverter,
  },
  {
    id: '014',
    path: 'unicode-converter',
    nameKey: 'tools.unicodeConverter.name',
    descriptionKey: 'tools.unicodeConverter.description',
    category: '01-text',
    component: UnicodeConverter,
  },
  {
    id: '015',
    path: 'html-entity-converter',
    nameKey: 'tools.htmlEntityConverter.name',
    descriptionKey: 'tools.htmlEntityConverter.description',
    category: '01-text',
    component: HtmlEntityConverter,
  },
  {
    id: '016',
    path: 'url-encoder',
    nameKey: 'tools.urlEncoder.name',
    descriptionKey: 'tools.urlEncoder.description',
    category: '01-text',
    component: UrlEncoder,
  },
  {
    id: '017',
    path: 'base64-encoder',
    nameKey: 'tools.base64Encoder.name',
    descriptionKey: 'tools.base64Encoder.description',
    category: '01-text',
    component: Base64Encoder,
  },
  {
    id: '018',
    path: 'number-base-converter',
    nameKey: 'tools.numberBaseConverter.name',
    descriptionKey: 'tools.numberBaseConverter.description',
    category: '01-text',
    component: NumberBaseConverter,
  },
  {
    id: '019',
    path: 'ascii-art-generator',
    nameKey: 'tools.asciiArtGenerator.name',
    descriptionKey: 'tools.asciiArtGenerator.description',
    category: '01-text',
    component: AsciiArtGenerator,
  },
  {
    id: '020',
    path: 'morse-code-converter',
    nameKey: 'tools.morseCodeConverter.name',
    descriptionKey: 'tools.morseCodeConverter.description',
    category: '01-text',
    component: MorseCodeConverter,
  },
  {
    id: '021',
    path: 'rot13-encoder',
    nameKey: 'tools.rot13Encoder.name',
    descriptionKey: 'tools.rot13Encoder.description',
    category: '01-text',
    component: Rot13Encoder,
  },
  {
    id: '022',
    path: 'pig-latin-converter',
    nameKey: 'tools.pigLatinConverter.name',
    descriptionKey: 'tools.pigLatinConverter.description',
    category: '01-text',
    component: PigLatinConverter,
  },
  {
    id: '023',
    path: 'fullwidth-converter',
    nameKey: 'tools.fullwidthConverter.name',
    descriptionKey: 'tools.fullwidthConverter.description',
    category: '01-text',
    component: FullwidthConverter,
  },
  {
    id: '024',
    path: 'chinese-converter',
    nameKey: 'tools.chineseConverter.name',
    descriptionKey: 'tools.chineseConverter.description',
    category: '01-text',
    component: ChineseConverter,
  },
  {
    id: '025',
    path: 'pinyin-annotator',
    nameKey: 'tools.pinyinAnnotator.name',
    descriptionKey: 'tools.pinyinAnnotator.description',
    category: '01-text',
    component: PinyinAnnotator,
  },
  {
    id: '026',
    path: 'bopomofo-converter',
    nameKey: 'tools.bopomofoConverter.name',
    descriptionKey: 'tools.bopomofoConverter.description',
    category: '01-text',
    component: BopomofoConverter,
  },
  {
    id: '027',
    path: 'kana-converter',
    nameKey: 'tools.kanaConverter.name',
    descriptionKey: 'tools.kanaConverter.description',
    category: '01-text',
    component: KanaConverter,
  },
  {
    id: '028',
    path: 'korean-romanizer',
    nameKey: 'tools.koreanRomanizer.name',
    descriptionKey: 'tools.koreanRomanizer.description',
    category: '01-text',
    component: KoreanRomanizer,
  },
  {
    id: '029',
    path: 'number-to-chinese',
    nameKey: 'tools.numberToChinese.name',
    descriptionKey: 'tools.numberToChinese.description',
    category: '01-text',
    component: NumberToChinese,
  },
  {
    id: '030',
    path: 'roman-numeral-converter',
    nameKey: 'tools.romanNumeralConverter.name',
    descriptionKey: 'tools.romanNumeralConverter.description',
    category: '01-text',
    component: RomanNumeralConverter,
  },
  {
    id: '031',
    path: 'emoji-finder',
    nameKey: 'tools.emojiFinder.name',
    descriptionKey: 'tools.emojiFinder.description',
    category: '01-text',
    component: EmojiFinder,
  },
  {
    id: '032',
    path: 'password-generator',
    nameKey: 'tools.passwordGenerator.name',
    descriptionKey: 'tools.passwordGenerator.description',
    category: '01-text',
    component: PasswordGenerator,
  },
  {
    id: '033',
    path: 'uuid-generator',
    nameKey: 'tools.uuidGenerator.name',
    descriptionKey: 'tools.uuidGenerator.description',
    category: '01-text',
    component: UuidGenerator,
  },
  {
    id: '034',
    path: 'hash-generator',
    nameKey: 'tools.hashGenerator.name',
    descriptionKey: 'tools.hashGenerator.description',
    category: '01-text',
    component: HashGenerator,
  },
  {
    id: '035',
    path: 'hmac-generator',
    nameKey: 'tools.hmacGenerator.name',
    descriptionKey: 'tools.hmacGenerator.description',
    category: '01-text',
    component: HmacGenerator,
  },
  {
    id: '036',
    path: 'regex-tester',
    nameKey: 'tools.regexTester.name',
    descriptionKey: 'tools.regexTester.description',
    category: '01-text',
    component: RegexTester,
  },
  {
    id: '037',
    path: 'markdown-previewer',
    nameKey: 'tools.markdownPreviewer.name',
    descriptionKey: 'tools.markdownPreviewer.description',
    category: '01-text',
    component: MarkdownPreviewer,
  },
  {
    id: '038',
    path: 'json-formatter',
    nameKey: 'tools.jsonFormatter.name',
    descriptionKey: 'tools.jsonFormatter.description',
    category: '01-text',
    component: JsonFormatter,
  },
  {
    id: '039',
    path: 'text-steganography',
    nameKey: 'tools.textSteganography.name',
    descriptionKey: 'tools.textSteganography.description',
    category: '01-text',
    component: TextSteganography,
  },
  {
    id: '040',
    path: 'text-hash-calculator',
    nameKey: 'tools.hashGenerator.name',
    descriptionKey: 'tools.hashGenerator.description',
    category: '01-text',
    component: HashGenerator,
  },
  {
    id: '041',
    path: 'image-format-converter-tool',
    nameKey: 'tools.imageConverter.name',
    descriptionKey: 'tools.imageConverter.description',
    category: '02-image',
    component: ImageFormatConverter,
  },
  {
    id: '042',
    path: 'image-compressor-tool',
    nameKey: 'tools.imageCompressor.name',
    descriptionKey: 'tools.imageCompressor.description',
    category: '02-image',
    component: ImageCompressor,
  },
  {
    id: '043',
    path: 'image-cropper-tool',
    nameKey: 'tools.imageCropper.name',
    descriptionKey: 'tools.imageCropper.description',
    category: '02-image',
    component: ImageCropper,
  },
  {
    id: '044',
    path: 'image-resizer-tool',
    nameKey: 'tools.imageResizer.name',
    descriptionKey: 'tools.imageResizer.description',
    category: '02-image',
    component: ImageResizer,
  },
  {
    id: '045',
    path: 'image-rotator-tool',
    nameKey: 'tools.imageRotator.name',
    descriptionKey: 'tools.imageRotator.description',
    category: '02-image',
    component: ImageRotator,
  },
  {
    id: '046',
    path: 'batch-image-processor',
    nameKey: 'tools.batchImageProcessor.name',
    descriptionKey: 'tools.batchImageProcessor.description',
    category: '02-image',
    component: BatchImageProcessor,
  },
  {
    id: '047',
    path: 'image-filter-tool',
    nameKey: 'tools.imageFilter.name',
    descriptionKey: 'tools.imageFilter.description',
    category: '02-image',
    component: ImageFilter,
  },
  {
    id: '048',
    path: 'image-blur-tool-2',
    nameKey: 'tools.imageBlur.name',
    descriptionKey: 'tools.imageBlur.description',
    category: '02-image',
    component: ImageBlurTool,
  },
  {
    id: '049',
    path: 'image-mosaic-tool-2',
    nameKey: 'tools.imageMosaic.name',
    descriptionKey: 'tools.imageMosaic.description',
    category: '02-image',
    component: ImageMosaicTool,
  },
  {
    id: '050',
    path: 'image-flipper-tool',
    nameKey: 'tools.imageFlipper.name',
    descriptionKey: 'tools.imageFlipper.description',
    category: '02-image',
    component: ImageFlipper,
  },
  {
    id: '051',
    path: 'image-watermark-tool',
    nameKey: 'tools.imageWatermark.name',
    descriptionKey: 'tools.imageWatermark.description',
    category: '02-image',
    component: ImageWatermark,
  },
  {
    id: '052',
    path: 'image-color-picker-tool',
    nameKey: 'tools.imageColorPicker.name',
    descriptionKey: 'tools.imageColorPicker.description',
    category: '02-image',
    component: ImageColorPicker,
  },
  {
    id: '053',
    path: 'image-metadata-tool',
    nameKey: 'tools.imageMetadata.name',
    descriptionKey: 'tools.imageMetadata.description',
    category: '02-image',
    component: ImageMetadataViewer,
  },
  {
    id: '054',
    path: 'image-histogram-tool',
    nameKey: 'tools.imageHistogram.name',
    descriptionKey: 'tools.imageHistogram.description',
    category: '02-image',
    component: ImageHistogram,
  },
  {
    id: '055',
    path: 'image-splitter-tool',
    nameKey: 'tools.imageSplitter.name',
    descriptionKey: 'tools.imageSplitter.description',
    category: '02-image',
    component: ImageSplitter,
  },
  {
    id: '056',
    path: 'image-merger-tool',
    nameKey: 'tools.imageMerger.name',
    descriptionKey: 'tools.imageMerger.description',
    category: '02-image',
    component: ImageMerger,
  },
  {
    id: '057',
    path: 'image-collage-tool',
    nameKey: 'tools.imageCollage.name',
    descriptionKey: 'tools.imageCollage.description',
    category: '02-image',
    component: ImageCollageMaker,
  },
  {
    id: '058',
    path: 'image-annotator-tool',
    nameKey: 'tools.imageAnnotator.name',
    descriptionKey: 'tools.imageAnnotator.description',
    category: '02-image',
    component: ImageAnnotator,
  },
  {
    id: '059',
    path: 'image-background-remover-tool',
    nameKey: 'tools.bgRemover.name',
    descriptionKey: 'tools.bgRemover.description',
    category: '02-image',
    component: ImageBackgroundRemover,
  },
  {
    id: '060',
    path: 'screenshot-capture-tool',
    nameKey: 'tools.screenshotTool.name',
    descriptionKey: 'tools.screenshotTool.description',
    category: '02-image',
    component: ScreenshotTool,
  },
  {
    id: '061',
    path: 'qr-code-tool',
    nameKey: 'tools.qrCode.name',
    descriptionKey: 'tools.qrCode.description',
    category: '02-image',
    component: QRCodeGenerator,
  },
  {
    id: '062',
    path: 'barcode-tool',
    nameKey: 'tools.barcode.name',
    descriptionKey: 'tools.barcode.description',
    category: '02-image',
    component: BarcodeGenerator,
  },
  {
    id: '063',
    path: 'favicon-tool',
    nameKey: 'tools.favicon.name',
    descriptionKey: 'tools.favicon.description',
    category: '02-image',
    component: FaviconGenerator,
  },
  {
    id: '064',
    path: 'svg-icon-tool',
    nameKey: 'tools.svgIcon.name',
    descriptionKey: 'tools.svgIcon.description',
    category: '02-image',
    component: SVGIconEditor,
  },
  {
    id: '065',
    path: 'sprite-sheet-tool',
    nameKey: 'tools.spriteSheet.name',
    descriptionKey: 'tools.spriteSheet.description',
    category: '02-image',
    component: SpriteSheetGenerator,
  },
  {
    id: '066',
    path: 'placeholder-tool',
    nameKey: 'tools.placeholder.name',
    descriptionKey: 'tools.placeholder.description',
    category: '02-image',
    component: PlaceholderImageGenerator,
  },
  {
    id: '067',
    path: 'color-palette-tool',
    nameKey: 'tools.colorPalette.name',
    descriptionKey: 'tools.colorPalette.description',
    category: '02-image',
    component: ColorPaletteGenerator,
  },
  {
    id: '068',
    path: 'gradient-tool',
    nameKey: 'tools.gradient.name',
    descriptionKey: 'tools.gradient.description',
    category: '02-image',
    component: GradientGenerator,
  },
  {
    id: '069',
    path: 'box-shadow-tool',
    nameKey: 'tools.boxShadow.name',
    descriptionKey: 'tools.boxShadow.description',
    category: '02-image',
    component: BoxShadowGenerator,
  },
  {
    id: '070',
    path: 'border-radius-tool',
    nameKey: 'tools.borderRadius.name',
    descriptionKey: 'tools.borderRadius.description',
    category: '02-image',
    component: BorderRadiusGenerator,
  },
  {
    id: '071',
    path: 'css-filter-tool',
    nameKey: 'tools.cssFilter.name',
    descriptionKey: 'tools.cssFilter.description',
    category: '02-image',
    component: CSSFilterGenerator,
  },
  {
    id: '072',
    path: 'text-shadow-tool',
    nameKey: 'tools.textShadow.name',
    descriptionKey: 'tools.textShadow.description',
    category: '02-image',
    component: TextShadowGenerator,
  },
  {
    id: '073',
    path: 'css-transform-tool',
    nameKey: 'tools.cssTransform.name',
    descriptionKey: 'tools.cssTransform.description',
    category: '02-image',
    component: CSSTransformGenerator,
  },
  {
    id: '074',
    path: 'flexbox-tool',
    nameKey: 'tools.flexbox.name',
    descriptionKey: 'tools.flexbox.description',
    category: '02-image',
    component: FlexboxGenerator,
  },
  {
    id: '075',
    path: 'grid-tool',
    nameKey: 'tools.grid.name',
    descriptionKey: 'tools.grid.description',
    category: '02-image',
    component: GridGenerator,
  },
  {
    id: '076',
    path: 'aspect-ratio-tool',
    nameKey: 'tools.aspectRatio.name',
    descriptionKey: 'tools.aspectRatio.description',
    category: '02-image',
    component: AspectRatioCalculator,
  },
  {
    id: '077',
    path: 'css-unit-tool',
    nameKey: 'tools.unitConverter.name',
    descriptionKey: 'tools.unitConverter.description',
    category: '02-image',
    component: CSSUnitConverter,
  },
  {
    id: '078',
    path: 'word-cloud-tool',
    nameKey: 'tools.wordCloud.name',
    descriptionKey: 'tools.wordCloud.description',
    category: '02-image',
    component: WordCloudGenerator,
  },
  {
    id: '079',
    path: 'progress-ring-tool',
    nameKey: 'tools.progressRing.name',
    descriptionKey: 'tools.progressRing.description',
    category: '02-image',
    component: ProgressRingGenerator,
  },
  {
    id: '080',
    path: 'gauge-chart-tool',
    nameKey: 'tools.gaugeChart.name',
    descriptionKey: 'tools.gaugeChart.description',
    category: '02-image',
    component: GaugeChartGenerator,
  },
  // Audio & Video Tools (081-120)
  {
    id: '081',
    path: 'audio-visualizer',
    nameKey: 'tools.audioVisualizer.name',
    descriptionKey: 'tools.audioVisualizer.description',
    category: '03-audio-video',
    component: AudioVisualizer,
  },
  {
    id: '082',
    path: 'audio-recorder',
    nameKey: 'tools.audioRecorder.name',
    descriptionKey: 'tools.audioRecorder.description',
    category: '03-audio-video',
    component: AudioRecorder,
  },
  {
    id: '083',
    path: 'video-player',
    nameKey: 'tools.videoPlayer.name',
    descriptionKey: 'tools.videoPlayer.description',
    category: '03-audio-video',
    component: VideoPlayer,
  },
  {
    id: '084',
    path: 'audio-trimmer',
    nameKey: 'tools.audioTrimmer.name',
    descriptionKey: 'tools.audioTrimmer.description',
    category: '03-audio-video',
    component: AudioTrimmer,
  },
  {
    id: '085',
    path: 'video-to-gif',
    nameKey: 'tools.videoToGif.name',
    descriptionKey: 'tools.videoToGif.description',
    category: '03-audio-video',
    component: VideoToGif,
  },
  {
    id: '086',
    path: 'audio-merger',
    nameKey: 'tools.audioMerger.name',
    descriptionKey: 'tools.audioMerger.description',
    category: '03-audio-video',
    component: AudioMerger,
  },
  {
    id: '087',
    path: 'video-thumbnail',
    nameKey: 'tools.videoThumbnail.name',
    descriptionKey: 'tools.videoThumbnail.description',
    category: '03-audio-video',
    component: VideoThumbnail,
  },
  {
    id: '088',
    path: 'audio-speed-changer',
    nameKey: 'tools.audioSpeedChanger.name',
    descriptionKey: 'tools.audioSpeedChanger.description',
    category: '03-audio-video',
    component: AudioSpeedChanger,
  },
  {
    id: '089',
    path: 'tone-generator',
    nameKey: 'tools.toneGenerator.name',
    descriptionKey: 'tools.toneGenerator.description',
    category: '03-audio-video',
    component: ToneGenerator,
  },
  {
    id: '090',
    path: 'metronome',
    nameKey: 'tools.metronome.name',
    descriptionKey: 'tools.metronome.description',
    category: '03-audio-video',
    component: Metronome,
  },
  {
    id: '091',
    path: 'sound-meter',
    nameKey: 'tools.soundMeter.name',
    descriptionKey: 'tools.soundMeter.description',
    category: '03-audio-video',
    component: SoundMeter,
  },
  {
    id: '092',
    path: 'white-noise-generator',
    nameKey: 'tools.whiteNoiseGenerator.name',
    descriptionKey: 'tools.whiteNoiseGenerator.description',
    category: '03-audio-video',
    component: WhiteNoiseGenerator,
  },
  {
    id: '093',
    path: 'media-info',
    nameKey: 'tools.mediaInfo.name',
    descriptionKey: 'tools.mediaInfo.description',
    category: '03-audio-video',
    component: MediaInfo,
  },
  {
    id: '094',
    path: 'audio-reverser',
    nameKey: 'tools.audioReverser.name',
    descriptionKey: 'tools.audioReverser.description',
    category: '03-audio-video',
    component: AudioReverser,
  },
  {
    id: '095',
    path: 'bpm-counter',
    nameKey: 'tools.bpmCounter.name',
    descriptionKey: 'tools.bpmCounter.description',
    category: '03-audio-video',
    component: BpmCounter,
  },
  {
    id: '096',
    path: 'pitch-detector',
    nameKey: 'tools.pitchDetector.name',
    descriptionKey: 'tools.pitchDetector.description',
    category: '03-audio-video',
    component: PitchDetector,
  },
  {
    id: '097',
    path: 'binaural-beats',
    nameKey: 'tools.binauralBeats.name',
    descriptionKey: 'tools.binauralBeats.description',
    category: '03-audio-video',
    component: BinauralBeats,
  },
  {
    id: '098',
    path: 'drum-machine',
    nameKey: 'tools.drumMachine.name',
    descriptionKey: 'tools.drumMachine.description',
    category: '03-audio-video',
    component: DrumMachine,
  },
  {
    id: '099',
    path: 'video-looper',
    nameKey: 'tools.videoLooper.name',
    descriptionKey: 'tools.videoLooper.description',
    category: '03-audio-video',
    component: VideoLooper,
  },
  {
    id: '100',
    path: 'audio-fader',
    nameKey: 'tools.audioFader.name',
    descriptionKey: 'tools.audioFader.description',
    category: '03-audio-video',
    component: AudioFader,
  },
  {
    id: '101',
    path: 'chord-generator',
    nameKey: 'tools.chordGenerator.name',
    descriptionKey: 'tools.chordGenerator.description',
    category: '03-audio-video',
    component: ChordGenerator,
  },
  {
    id: '102',
    path: 'audio-normalizer',
    nameKey: 'tools.audioNormalizer.name',
    descriptionKey: 'tools.audioNormalizer.description',
    category: '03-audio-video',
    component: AudioNormalizer,
  },
  {
    id: '103',
    path: 'audio-waveform-viewer',
    nameKey: 'tools.audioWaveformViewer.name',
    descriptionKey: 'tools.audioWaveformViewer.description',
    category: '03-audio-video',
    component: AudioWaveformViewer,
  },
  {
    id: '104',
    path: 'audio-looper',
    nameKey: 'tools.audioLooper.name',
    descriptionKey: 'tools.audioLooper.description',
    category: '03-audio-video',
    component: AudioLooper,
  },
  {
    id: '105',
    path: 'frequency-analyzer',
    nameKey: 'tools.frequencyAnalyzer.name',
    descriptionKey: 'tools.frequencyAnalyzer.description',
    category: '03-audio-video',
    component: FrequencyAnalyzer,
  },
  {
    id: '106',
    path: 'voice-recorder',
    nameKey: 'tools.voiceRecorder.name',
    descriptionKey: 'tools.voiceRecorder.description',
    category: '03-audio-video',
    component: VoiceRecorder,
  },
  {
    id: '107',
    path: 'screen-recorder',
    nameKey: 'tools.screenRecorder.name',
    descriptionKey: 'tools.screenRecorder.description',
    category: '03-audio-video',
    component: ScreenRecorder,
  },
  {
    id: '108',
    path: 'audio-splitter',
    nameKey: 'tools.audioSplitter.name',
    descriptionKey: 'tools.audioSplitter.description',
    category: '03-audio-video',
    component: AudioSplitter,
  },
  {
    id: '109',
    path: 'audio-compressor',
    nameKey: 'tools.audioCompressor.name',
    descriptionKey: 'tools.audioCompressor.description',
    category: '03-audio-video',
    component: AudioCompressor,
  },
  {
    id: '110',
    path: 'audio-equalizer',
    nameKey: 'tools.audioEqualizer.name',
    descriptionKey: 'tools.audioEqualizer.description',
    category: '03-audio-video',
    component: AudioEqualizer,
  },
  {
    id: '111',
    path: 'sound-effects',
    nameKey: 'tools.soundEffects.name',
    descriptionKey: 'tools.soundEffects.description',
    category: '03-audio-video',
    component: SoundEffects,
  },
  {
    id: '112',
    path: 'video-speed-changer',
    nameKey: 'tools.videoSpeedChanger.name',
    descriptionKey: 'tools.videoSpeedChanger.description',
    category: '03-audio-video',
    component: VideoSpeedChanger,
  },
  {
    id: '113',
    path: 'video-reverser',
    nameKey: 'tools.videoReverser.name',
    descriptionKey: 'tools.videoReverser.description',
    category: '03-audio-video',
    component: VideoReverser,
  },
  {
    id: '114',
    path: 'subtitle-editor',
    nameKey: 'tools.subtitleEditor.name',
    descriptionKey: 'tools.subtitleEditor.description',
    category: '03-audio-video',
    component: SubtitleEditor,
  },
  {
    id: '115',
    path: 'audio-channel-splitter',
    nameKey: 'tools.audioChannelSplitter.name',
    descriptionKey: 'tools.audioChannelSplitter.description',
    category: '03-audio-video',
    component: AudioChannelSplitter,
  },
  {
    id: '116',
    path: 'silence-remover',
    nameKey: 'tools.silenceRemover.name',
    descriptionKey: 'tools.silenceRemover.description',
    category: '03-audio-video',
    component: SilenceRemover,
  },
  {
    id: '117',
    path: 'audio-stereo-widener',
    nameKey: 'tools.audioStereoWidener.name',
    descriptionKey: 'tools.audioStereoWidener.description',
    category: '03-audio-video',
    component: AudioStereoWidener,
  },
  {
    id: '118',
    path: 'audio-pan-changer',
    nameKey: 'tools.audioPanChanger.name',
    descriptionKey: 'tools.audioPanChanger.description',
    category: '03-audio-video',
    component: AudioPanChanger,
  },
  {
    id: '119',
    path: 'video-frame-extractor',
    nameKey: 'tools.videoFrameExtractor.name',
    descriptionKey: 'tools.videoFrameExtractor.description',
    category: '03-audio-video',
    component: VideoFrameExtractor,
  },
  {
    id: '120',
    path: 'audio-mono-to-stereo',
    nameKey: 'tools.audioMonoToStereo.name',
    descriptionKey: 'tools.audioMonoToStereo.description',
    category: '03-audio-video',
    component: AudioMonoToStereo,
  },
  // Data & Conversion Tools (121-160)
  {
    id: '121',
    path: 'json-to-yaml',
    nameKey: 'tools.jsonToYaml.name',
    descriptionKey: 'tools.jsonToYaml.description',
    category: '04-data',
    component: JsonToYaml,
  },
  {
    id: '122',
    path: 'yaml-to-json',
    nameKey: 'tools.yamlToJson.name',
    descriptionKey: 'tools.yamlToJson.description',
    category: '04-data',
    component: YamlToJson,
  },
  {
    id: '123',
    path: 'csv-to-json',
    nameKey: 'tools.csvToJson.name',
    descriptionKey: 'tools.csvToJson.description',
    category: '04-data',
    component: CsvToJson,
  },
  {
    id: '124',
    path: 'json-to-csv',
    nameKey: 'tools.jsonToCsv.name',
    descriptionKey: 'tools.jsonToCsv.description',
    category: '04-data',
    component: JsonToCsv,
  },
  {
    id: '125',
    path: 'xml-to-json',
    nameKey: 'tools.xmlToJson.name',
    descriptionKey: 'tools.xmlToJson.description',
    category: '04-data',
    component: XmlToJson,
  },
  {
    id: '126',
    path: 'json-to-xml',
    nameKey: 'tools.jsonToXml.name',
    descriptionKey: 'tools.jsonToXml.description',
    category: '04-data',
    component: JsonToXml,
  },
  {
    id: '127',
    path: 'sql-formatter',
    nameKey: 'tools.sqlFormatter.name',
    descriptionKey: 'tools.sqlFormatter.description',
    category: '04-data',
    component: SqlFormatter,
  },
  {
    id: '128',
    path: 'css-minifier',
    nameKey: 'tools.cssMinifier.name',
    descriptionKey: 'tools.cssMinifier.description',
    category: '04-data',
    component: CssMinifier,
  },
  {
    id: '129',
    path: 'js-minifier',
    nameKey: 'tools.jsMinifier.name',
    descriptionKey: 'tools.jsMinifier.description',
    category: '04-data',
    component: JsMinifier,
  },
  {
    id: '130',
    path: 'html-minifier',
    nameKey: 'tools.htmlMinifier.name',
    descriptionKey: 'tools.htmlMinifier.description',
    category: '04-data',
    component: HtmlMinifier,
  },
  {
    id: '131',
    path: 'timestamp-converter',
    nameKey: 'tools.timestampConverter.name',
    descriptionKey: 'tools.timestampConverter.description',
    category: '04-data',
    component: TimestampConverter,
  },
  {
    id: '132',
    path: 'color-converter',
    nameKey: 'tools.colorConverter.name',
    descriptionKey: 'tools.colorConverter.description',
    category: '04-data',
    component: ColorConverter,
  },
  {
    id: '133',
    path: 'temperature-converter',
    nameKey: 'tools.temperatureConverter.name',
    descriptionKey: 'tools.temperatureConverter.description',
    category: '04-data',
    component: TemperatureConverter,
  },
  {
    id: '134',
    path: 'length-converter',
    nameKey: 'tools.lengthConverter.name',
    descriptionKey: 'tools.lengthConverter.description',
    category: '04-data',
    component: LengthConverter,
  },
  {
    id: '135',
    path: 'weight-converter',
    nameKey: 'tools.weightConverter.name',
    descriptionKey: 'tools.weightConverter.description',
    category: '04-data',
    component: WeightConverter,
  },
  {
    id: '136',
    path: 'speed-converter',
    nameKey: 'tools.speedConverter.name',
    descriptionKey: 'tools.speedConverter.description',
    category: '04-data',
    component: SpeedConverter,
  },
  {
    id: '137',
    path: 'area-converter',
    nameKey: 'tools.areaConverter.name',
    descriptionKey: 'tools.areaConverter.description',
    category: '04-data',
    component: AreaConverter,
  },
  {
    id: '138',
    path: 'volume-converter',
    nameKey: 'tools.volumeConverter.name',
    descriptionKey: 'tools.volumeConverter.description',
    category: '04-data',
    component: VolumeConverter,
  },
  {
    id: '139',
    path: 'data-storage-converter',
    nameKey: 'tools.dataStorageConverter.name',
    descriptionKey: 'tools.dataStorageConverter.description',
    category: '04-data',
    component: DataStorageConverter,
  },
  {
    id: '140',
    path: 'number-base-converter-data',
    nameKey: 'tools.dataNumberBaseConverter.name',
    descriptionKey: 'tools.dataNumberBaseConverter.description',
    category: '04-data',
    component: DataNumberBaseConverter,
  },
  {
    id: '141',
    path: 'angle-converter',
    nameKey: 'tools.angleConverter.name',
    descriptionKey: 'tools.angleConverter.description',
    category: '04-data',
    component: AngleConverter,
  },
  {
    id: '142',
    path: 'pressure-converter',
    nameKey: 'tools.pressureConverter.name',
    descriptionKey: 'tools.pressureConverter.description',
    category: '04-data',
    component: PressureConverter,
  },
  {
    id: '143',
    path: 'energy-converter',
    nameKey: 'tools.energyConverter.name',
    descriptionKey: 'tools.energyConverter.description',
    category: '04-data',
    component: EnergyConverter,
  },
  {
    id: '144',
    path: 'power-converter',
    nameKey: 'tools.powerConverter.name',
    descriptionKey: 'tools.powerConverter.description',
    category: '04-data',
    component: PowerConverter,
  },
  {
    id: '145',
    path: 'frequency-converter',
    nameKey: 'tools.frequencyConverter.name',
    descriptionKey: 'tools.frequencyConverter.description',
    category: '04-data',
    component: FrequencyConverter,
  },
  {
    id: '146',
    path: 'time-converter',
    nameKey: 'tools.timeConverter.name',
    descriptionKey: 'tools.timeConverter.description',
    category: '04-data',
    component: TimeConverter,
  },
  {
    id: '147',
    path: 'currency-converter',
    nameKey: 'tools.currencyConverter.name',
    descriptionKey: 'tools.currencyConverter.description',
    category: '04-data',
    component: CurrencyConverter,
  },
  {
    id: '148',
    path: 'roman-numeral-converter-data',
    nameKey: 'tools.dataRomanNumeralConverter.name',
    descriptionKey: 'tools.dataRomanNumeralConverter.description',
    category: '04-data',
    component: DataRomanNumeralConverter,
  },
  {
    id: '149',
    path: 'ascii-converter',
    nameKey: 'tools.asciiConverter.name',
    descriptionKey: 'tools.asciiConverter.description',
    category: '04-data',
    component: AsciiConverter,
  },
  {
    id: '150',
    path: 'unicode-converter-data',
    nameKey: 'tools.dataUnicodeConverter.name',
    descriptionKey: 'tools.dataUnicodeConverter.description',
    category: '04-data',
    component: DataUnicodeConverter,
  },
  {
    id: '151',
    path: 'markdown-to-html',
    nameKey: 'tools.markdownToHtml.name',
    descriptionKey: 'tools.markdownToHtml.description',
    category: '04-data',
    component: MarkdownToHtml,
  },
  {
    id: '152',
    path: 'html-to-markdown',
    nameKey: 'tools.htmlToMarkdown.name',
    descriptionKey: 'tools.htmlToMarkdown.description',
    category: '04-data',
    component: HtmlToMarkdown,
  },
  {
    id: '153',
    path: 'text-to-binary',
    nameKey: 'tools.textToBinary.name',
    descriptionKey: 'tools.textToBinary.description',
    category: '04-data',
    component: TextToBinary,
  },
  {
    id: '154',
    path: 'url-parser',
    nameKey: 'tools.urlParser.name',
    descriptionKey: 'tools.urlParser.description',
    category: '04-data',
    component: UrlParser,
  },
  {
    id: '155',
    path: 'json-path-tester',
    nameKey: 'tools.jsonPathTester.name',
    descriptionKey: 'tools.jsonPathTester.description',
    category: '04-data',
    component: JsonPathTester,
  },
  {
    id: '156',
    path: 'regex-tester-data',
    nameKey: 'tools.dataRegexTester.name',
    descriptionKey: 'tools.dataRegexTester.description',
    category: '04-data',
    component: DataRegexTester,
  },
  {
    id: '157',
    path: 'diff-tool',
    nameKey: 'tools.diffTool.name',
    descriptionKey: 'tools.diffTool.description',
    category: '04-data',
    component: DiffTool,
  },
  {
    id: '158',
    path: 'hash-calculator',
    nameKey: 'tools.hashCalculator.name',
    descriptionKey: 'tools.hashCalculator.description',
    category: '04-data',
    component: HashCalculator,
  },
  {
    id: '159',
    path: 'checksum-validator',
    nameKey: 'tools.checksumValidator.name',
    descriptionKey: 'tools.checksumValidator.description',
    category: '04-data',
    component: ChecksumValidator,
  },
  {
    id: '160',
    path: 'byte-converter',
    nameKey: 'tools.byteConverter.name',
    descriptionKey: 'tools.byteConverter.description',
    category: '04-data',
    component: ByteConverter,
  },
  // Developer Tools (161-200)
  {
    id: '161',
    path: 'json-validator',
    nameKey: 'tools.jsonValidator.name',
    descriptionKey: 'tools.jsonValidator.description',
    category: '05-dev',
    component: JsonValidator,
  },
  {
    id: '162',
    path: 'xml-validator',
    nameKey: 'tools.xmlValidator.name',
    descriptionKey: 'tools.xmlValidator.description',
    category: '05-dev',
    component: XmlValidator,
  },
  {
    id: '163',
    path: 'yaml-validator',
    nameKey: 'tools.yamlValidator.name',
    descriptionKey: 'tools.yamlValidator.description',
    category: '05-dev',
    component: YamlValidator,
  },
  {
    id: '164',
    path: 'html-validator',
    nameKey: 'tools.htmlValidator.name',
    descriptionKey: 'tools.htmlValidator.description',
    category: '05-dev',
    component: HtmlValidator,
  },
  {
    id: '165',
    path: 'css-validator',
    nameKey: 'tools.cssValidator.name',
    descriptionKey: 'tools.cssValidator.description',
    category: '05-dev',
    component: CssValidator,
  },
  {
    id: '166',
    path: 'js-beautifier',
    nameKey: 'tools.jsBeautifier.name',
    descriptionKey: 'tools.jsBeautifier.description',
    category: '05-dev',
    component: JsBeautifier,
  },
  {
    id: '167',
    path: 'css-beautifier',
    nameKey: 'tools.cssBeautifier.name',
    descriptionKey: 'tools.cssBeautifier.description',
    category: '05-dev',
    component: CssBeautifier,
  },
  {
    id: '168',
    path: 'html-beautifier',
    nameKey: 'tools.htmlBeautifier.name',
    descriptionKey: 'tools.htmlBeautifier.description',
    category: '05-dev',
    component: HtmlBeautifier,
  },
  {
    id: '169',
    path: 'sql-beautifier',
    nameKey: 'tools.sqlBeautifier.name',
    descriptionKey: 'tools.sqlBeautifier.description',
    category: '05-dev',
    component: SqlBeautifier,
  },
  {
    id: '170',
    path: 'code-diff',
    nameKey: 'tools.codeDiff.name',
    descriptionKey: 'tools.codeDiff.description',
    category: '05-dev',
    component: CodeDiff,
  },
  {
    id: '171',
    path: 'regex-builder',
    nameKey: 'tools.regexBuilder.name',
    descriptionKey: 'tools.regexBuilder.description',
    category: '05-dev',
    component: RegexBuilder,
  },
  {
    id: '172',
    path: 'cron-generator',
    nameKey: 'tools.cronGenerator.name',
    descriptionKey: 'tools.cronGenerator.description',
    category: '05-dev',
    component: CronGenerator,
  },
  {
    id: '173',
    path: 'jwt-decoder',
    nameKey: 'tools.jwtDecoder.name',
    descriptionKey: 'tools.jwtDecoder.description',
    category: '05-dev',
    component: JwtDecoder,
  },
  {
    id: '174',
    path: 'base64-image-encoder',
    nameKey: 'tools.base64ImageEncoder.name',
    descriptionKey: 'tools.base64ImageEncoder.description',
    category: '05-dev',
    component: Base64ImageEncoder,
  },
  {
    id: '175',
    path: 'dev-color-palette',
    nameKey: 'tools.devColorPalette.name',
    descriptionKey: 'tools.devColorPalette.description',
    category: '05-dev',
    component: DevColorPaletteGenerator,
  },
  {
    id: '176',
    path: 'dev-gradient',
    nameKey: 'tools.devGradient.name',
    descriptionKey: 'tools.devGradient.description',
    category: '05-dev',
    component: DevGradientGenerator,
  },
  {
    id: '177',
    path: 'dev-box-shadow',
    nameKey: 'tools.devBoxShadow.name',
    descriptionKey: 'tools.devBoxShadow.description',
    category: '05-dev',
    component: DevBoxShadowGenerator,
  },
  {
    id: '178',
    path: 'dev-border-radius',
    nameKey: 'tools.devBorderRadius.name',
    descriptionKey: 'tools.devBorderRadius.description',
    category: '05-dev',
    component: DevBorderRadiusGenerator,
  },
  {
    id: '179',
    path: 'dev-flexbox',
    nameKey: 'tools.devFlexbox.name',
    descriptionKey: 'tools.devFlexbox.description',
    category: '05-dev',
    component: DevFlexboxGenerator,
  },
  {
    id: '180',
    path: 'dev-grid',
    nameKey: 'tools.devGrid.name',
    descriptionKey: 'tools.devGrid.description',
    category: '05-dev',
    component: DevGridGenerator,
  },
  {
    id: '181',
    path: 'dev-lorem-ipsum',
    nameKey: 'tools.devLoremIpsum.name',
    descriptionKey: 'tools.devLoremIpsum.description',
    category: '05-dev',
    component: DevLoremIpsumGenerator,
  },
  {
    id: '182',
    path: 'dev-password-generator',
    nameKey: 'tools.devPasswordGenerator.name',
    descriptionKey: 'tools.devPasswordGenerator.description',
    category: '05-dev',
    component: DevPasswordGenerator,
  },
  {
    id: '183',
    path: 'dev-uuid-generator',
    nameKey: 'tools.devUuidGenerator.name',
    descriptionKey: 'tools.devUuidGenerator.description',
    category: '05-dev',
    component: DevUuidGenerator,
  },
  {
    id: '184',
    path: 'slug-generator',
    nameKey: 'tools.slugGenerator.name',
    descriptionKey: 'tools.slugGenerator.description',
    category: '05-dev',
    component: SlugGenerator,
  },
  {
    id: '185',
    path: 'mock-data-generator',
    nameKey: 'tools.mockDataGenerator.name',
    descriptionKey: 'tools.mockDataGenerator.description',
    category: '05-dev',
    component: MockDataGenerator,
  },
  {
    id: '186',
    path: 'http-status-codes',
    nameKey: 'tools.httpStatusCodes.name',
    descriptionKey: 'tools.httpStatusCodes.description',
    category: '05-dev',
    component: HttpStatusCodes,
  },
  {
    id: '187',
    path: 'html-entities-converter',
    nameKey: 'tools.htmlEntitiesConverter.name',
    descriptionKey: 'tools.htmlEntitiesConverter.description',
    category: '05-dev',
    component: HtmlEntitiesConverter,
  },
  {
    id: '188',
    path: 'json-string-escaper',
    nameKey: 'tools.jsonStringEscaper.name',
    descriptionKey: 'tools.jsonStringEscaper.description',
    category: '05-dev',
    component: JsonStringEscaper,
  },
  {
    id: '189',
    path: 'meta-tag-generator',
    nameKey: 'tools.metaTagGenerator.name',
    descriptionKey: 'tools.metaTagGenerator.description',
    category: '05-dev',
    component: MetaTagGenerator,
  },
  {
    id: '190',
    path: 'gitignore-generator',
    nameKey: 'tools.gitignoreGenerator.name',
    descriptionKey: 'tools.gitignoreGenerator.description',
    category: '05-dev',
    component: GitignoreGenerator,
  },
  {
    id: '191',
    path: 'license-generator',
    nameKey: 'tools.licenseGenerator.name',
    descriptionKey: 'tools.licenseGenerator.description',
    category: '05-dev',
    component: LicenseGenerator,
  },
  {
    id: '192',
    path: 'markdown-table-generator',
    nameKey: 'tools.markdownTableGenerator.name',
    descriptionKey: 'tools.markdownTableGenerator.description',
    category: '05-dev',
    component: MarkdownTableGenerator,
  },
  {
    id: '193',
    path: 'dev-placeholder-image',
    nameKey: 'tools.devPlaceholderImage.name',
    descriptionKey: 'tools.devPlaceholderImage.description',
    category: '05-dev',
    component: DevPlaceholderImageGenerator,
  },
  {
    id: '194',
    path: 'env-file-generator',
    nameKey: 'tools.envFileGenerator.name',
    descriptionKey: 'tools.envFileGenerator.description',
    category: '05-dev',
    component: EnvFileGenerator,
  },
  {
    id: '195',
    path: 'package-json-generator',
    nameKey: 'tools.packageJsonGenerator.name',
    descriptionKey: 'tools.packageJsonGenerator.description',
    category: '05-dev',
    component: PackageJsonGenerator,
  },
  {
    id: '196',
    path: 'readme-generator',
    nameKey: 'tools.readmeGenerator.name',
    descriptionKey: 'tools.readmeGenerator.description',
    category: '05-dev',
    component: ReadmeGenerator,
  },
  {
    id: '197',
    path: 'dockerfile-generator',
    nameKey: 'tools.dockerfileGenerator.name',
    descriptionKey: 'tools.dockerfileGenerator.description',
    category: '05-dev',
    component: DockerfileGenerator,
  },
  {
    id: '198',
    path: 'nginx-config-generator',
    nameKey: 'tools.nginxConfigGenerator.name',
    descriptionKey: 'tools.nginxConfigGenerator.description',
    category: '05-dev',
    component: NginxConfigGenerator,
  },
  {
    id: '199',
    path: 'htaccess-generator',
    nameKey: 'tools.htaccessGenerator.name',
    descriptionKey: 'tools.htaccessGenerator.description',
    category: '05-dev',
    component: HtaccessGenerator,
  },
  {
    id: '200',
    path: 'code-snippet-manager',
    nameKey: 'tools.codeSnippetManager.name',
    descriptionKey: 'tools.codeSnippetManager.description',
    category: '05-dev',
    component: CodeSnippetManager,
  },
  // Utility Tools (201-240)
  {
    id: '201',
    path: 'basic-calculator',
    nameKey: 'tools.basicCalculator.name',
    descriptionKey: 'tools.basicCalculator.description',
    category: '06-utility',
    component: BasicCalculator,
  },
  {
    id: '202',
    path: 'scientific-calculator',
    nameKey: 'tools.scientificCalculator.name',
    descriptionKey: 'tools.scientificCalculator.description',
    category: '06-utility',
    component: ScientificCalculator,
  },
  {
    id: '203',
    path: 'age-calculator',
    nameKey: 'tools.ageCalculator.name',
    descriptionKey: 'tools.ageCalculator.description',
    category: '06-utility',
    component: AgeCalculator,
  },
  {
    id: '204',
    path: 'date-calculator',
    nameKey: 'tools.dateCalculator.name',
    descriptionKey: 'tools.dateCalculator.description',
    category: '06-utility',
    component: DateCalculator,
  },
  {
    id: '205',
    path: 'bmi-calculator',
    nameKey: 'tools.bmiCalculator.name',
    descriptionKey: 'tools.bmiCalculator.description',
    category: '20-health',
    component: BmiCalculator,
  },
  {
    id: '206',
    path: 'tip-calculator',
    nameKey: 'tools.tipCalculator.name',
    descriptionKey: 'tools.tipCalculator.description',
    category: '06-utility',
    component: TipCalculator,
  },
  {
    id: '207',
    path: 'percentage-calculator',
    nameKey: 'tools.percentageCalculator.name',
    descriptionKey: 'tools.percentageCalculator.description',
    category: '06-utility',
    component: PercentageCalculator,
  },
  {
    id: '208',
    path: 'loan-calculator',
    nameKey: 'tools.loanCalculator.name',
    descriptionKey: 'tools.loanCalculator.description',
    category: '06-utility',
    component: LoanCalculator,
  },
  {
    id: '209',
    path: 'investment-calculator',
    nameKey: 'tools.investmentCalculator.name',
    descriptionKey: 'tools.investmentCalculator.description',
    category: '06-utility',
    component: InvestmentCalculator,
  },
  {
    id: '210',
    path: 'unit-price-calculator',
    nameKey: 'tools.unitPriceCalculator.name',
    descriptionKey: 'tools.unitPriceCalculator.description',
    category: '06-utility',
    component: UnitPriceCalculator,
  },
  {
    id: '211',
    path: 'countdown-timer',
    nameKey: 'tools.countdownTimer.name',
    descriptionKey: 'tools.countdownTimer.description',
    category: '06-utility',
    component: CountdownTimer,
  },
  {
    id: '212',
    path: 'stopwatch',
    nameKey: 'tools.stopwatch.name',
    descriptionKey: 'tools.stopwatch.description',
    category: '06-utility',
    component: Stopwatch,
  },
  {
    id: '213',
    path: 'world-clock',
    nameKey: 'tools.worldClock.name',
    descriptionKey: 'tools.worldClock.description',
    category: '06-utility',
    component: WorldClock,
  },
  {
    id: '214',
    path: 'alarm-clock',
    nameKey: 'tools.alarmClock.name',
    descriptionKey: 'tools.alarmClock.description',
    category: '06-utility',
    component: AlarmClock,
  },
  {
    id: '215',
    path: 'pomodoro-timer',
    nameKey: 'tools.pomodoroTimer.name',
    descriptionKey: 'tools.pomodoroTimer.description',
    category: '06-utility',
    component: PomodoroTimer,
  },
  {
    id: '216',
    path: 'random-number-generator',
    nameKey: 'tools.randomNumberGenerator.name',
    descriptionKey: 'tools.randomNumberGenerator.description',
    category: '06-utility',
    component: RandomNumberGenerator,
  },
  {
    id: '217',
    path: 'coin-flipper',
    nameKey: 'tools.coinFlipper.name',
    descriptionKey: 'tools.coinFlipper.description',
    category: '06-utility',
    component: CoinFlipper,
  },
  {
    id: '218',
    path: 'spin-wheel',
    nameKey: 'tools.spinWheel.name',
    descriptionKey: 'tools.spinWheel.description',
    category: '06-utility',
    component: SpinWheel,
  },
  {
    id: '219',
    path: 'util-password-generator',
    nameKey: 'tools.utilPasswordGenerator.name',
    descriptionKey: 'tools.utilPasswordGenerator.description',
    category: '06-utility',
    component: UtilPasswordGenerator,
  },
  {
    id: '220',
    path: 'util-qr-code-generator',
    nameKey: 'tools.utilQrCodeGenerator.name',
    descriptionKey: 'tools.utilQrCodeGenerator.description',
    category: '06-utility',
    component: UtilQrCodeGenerator,
  },
  {
    id: '221',
    path: 'util-barcode-generator',
    nameKey: 'tools.utilBarcodeGenerator.name',
    descriptionKey: 'tools.utilBarcodeGenerator.description',
    category: '06-utility',
    component: UtilBarcodeGenerator,
  },
  {
    id: '222',
    path: 'util-hash-generator',
    nameKey: 'tools.utilHashGenerator.name',
    descriptionKey: 'tools.utilHashGenerator.description',
    category: '06-utility',
    component: UtilHashGenerator,
  },
  {
    id: '223',
    path: 'util-color-converter',
    nameKey: 'tools.utilColorConverter.name',
    descriptionKey: 'tools.utilColorConverter.description',
    category: '06-utility',
    component: UtilColorConverter,
  },
  {
    id: '224',
    path: 'util-temperature-converter',
    nameKey: 'tools.utilTemperatureConverter.name',
    descriptionKey: 'tools.utilTemperatureConverter.description',
    category: '06-utility',
    component: UtilTemperatureConverter,
  },
  {
    id: '225',
    path: 'util-length-converter',
    nameKey: 'tools.utilLengthConverter.name',
    descriptionKey: 'tools.utilLengthConverter.description',
    category: '06-utility',
    component: UtilLengthConverter,
  },
  {
    id: '226',
    path: 'util-weight-converter',
    nameKey: 'tools.utilWeightConverter.name',
    descriptionKey: 'tools.utilWeightConverter.description',
    category: '06-utility',
    component: UtilWeightConverter,
  },
  {
    id: '227',
    path: 'util-volume-converter',
    nameKey: 'tools.utilVolumeConverter.name',
    descriptionKey: 'tools.utilVolumeConverter.description',
    category: '06-utility',
    component: UtilVolumeConverter,
  },
  {
    id: '228',
    path: 'util-speed-converter',
    nameKey: 'tools.utilSpeedConverter.name',
    descriptionKey: 'tools.utilSpeedConverter.description',
    category: '06-utility',
    component: UtilSpeedConverter,
  },
  {
    id: '229',
    path: 'util-area-converter',
    nameKey: 'tools.utilAreaConverter.name',
    descriptionKey: 'tools.utilAreaConverter.description',
    category: '06-utility',
    component: UtilAreaConverter,
  },
  {
    id: '230',
    path: 'util-time-converter',
    nameKey: 'tools.utilTimeConverter.name',
    descriptionKey: 'tools.utilTimeConverter.description',
    category: '06-utility',
    component: UtilTimeConverter,
  },
  {
    id: '231',
    path: 'util-data-storage-converter',
    nameKey: 'tools.utilDataStorageConverter.name',
    descriptionKey: 'tools.utilDataStorageConverter.description',
    category: '06-utility',
    component: UtilDataStorageConverter,
  },
  {
    id: '232',
    path: 'util-currency-converter',
    nameKey: 'tools.utilCurrencyConverter.name',
    descriptionKey: 'tools.utilCurrencyConverter.description',
    category: '06-utility',
    component: UtilCurrencyConverter,
  },
  {
    id: '233',
    path: 'util-timezone-converter',
    nameKey: 'tools.utilTimezoneConverter.name',
    descriptionKey: 'tools.utilTimezoneConverter.description',
    category: '06-utility',
    component: UtilTimezoneConverter,
  },
  {
    id: '234',
    path: 'util-number-base-converter',
    nameKey: 'tools.utilNumberBaseConverter.name',
    descriptionKey: 'tools.utilNumberBaseConverter.description',
    category: '06-utility',
    component: UtilNumberBaseConverter,
  },
  {
    id: '235',
    path: 'util-roman-numeral-converter',
    nameKey: 'tools.utilRomanNumeralConverter.name',
    descriptionKey: 'tools.utilRomanNumeralConverter.description',
    category: '06-utility',
    component: UtilRomanNumeralConverter,
  },
  {
    id: '236',
    path: 'util-morse-code-converter',
    nameKey: 'tools.utilMorseCodeConverter.name',
    descriptionKey: 'tools.utilMorseCodeConverter.description',
    category: '06-utility',
    component: UtilMorseCodeConverter,
  },
  {
    id: '237',
    path: 'screen-ruler',
    nameKey: 'tools.screenRuler.name',
    descriptionKey: 'tools.screenRuler.description',
    category: '06-utility',
    component: ScreenRuler,
  },
  {
    id: '238',
    path: 'battery-status',
    nameKey: 'tools.batteryStatus.name',
    descriptionKey: 'tools.batteryStatus.description',
    category: '06-utility',
    component: BatteryStatus,
  },
  {
    id: '239',
    path: 'internet-speed-test',
    nameKey: 'tools.internetSpeedTest.name',
    descriptionKey: 'tools.internetSpeedTest.description',
    category: '06-utility',
    component: InternetSpeedTest,
  },
  {
    id: '240',
    path: 'note-taking',
    nameKey: 'tools.noteTaking.name',
    descriptionKey: 'tools.noteTaking.description',
    category: '06-utility',
    component: NoteTaking,
  },
  // Lifestyle Tools (241-280)
  {
    id: '241',
    path: 'recipe-scaler',
    nameKey: 'tools.recipeScaler.name',
    descriptionKey: 'tools.recipeScaler.description',
    category: '07-lifestyle',
    component: RecipeScaler,
  },
  {
    id: '242',
    path: 'fitness-calculator',
    nameKey: 'tools.fitnessCalculator.name',
    descriptionKey: 'tools.fitnessCalculator.description',
    category: '07-lifestyle',
    component: FitnessCalculator,
  },
  {
    id: '243',
    path: 'sleep-calculator',
    nameKey: 'tools.sleepCalculator.name',
    descriptionKey: 'tools.sleepCalculator.description',
    category: '07-lifestyle',
    component: SleepCalculator,
  },
  {
    id: '244',
    path: 'calorie-counter',
    nameKey: 'tools.calorieCounter.name',
    descriptionKey: 'tools.calorieCounter.description',
    category: '07-lifestyle',
    component: CalorieCounter,
  },
  {
    id: '245',
    path: 'water-intake-tracker',
    nameKey: 'tools.waterIntakeTracker.name',
    descriptionKey: 'tools.waterIntakeTracker.description',
    category: '07-lifestyle',
    component: LifestyleWaterIntakeTracker,
  },
  {
    id: '246',
    path: 'habit-tracker',
    nameKey: 'tools.habitTracker.name',
    descriptionKey: 'tools.habitTracker.description',
    category: '07-lifestyle',
    component: HabitTracker,
  },
  {
    id: '247',
    path: 'todo-list',
    nameKey: 'tools.todoList.name',
    descriptionKey: 'tools.todoList.description',
    category: '07-lifestyle',
    component: TodoList,
  },
  {
    id: '248',
    path: 'budget-tracker',
    nameKey: 'tools.budgetTracker.name',
    descriptionKey: 'tools.budgetTracker.description',
    category: '07-lifestyle',
    component: BudgetTracker,
  },
  {
    id: '249',
    path: 'expense-splitter',
    nameKey: 'tools.expenseSplitter.name',
    descriptionKey: 'tools.expenseSplitter.description',
    category: '07-lifestyle',
    component: ExpenseSplitter,
  },
  {
    id: '250',
    path: 'cooking-unit-converter',
    nameKey: 'tools.cookingUnitConverter.name',
    descriptionKey: 'tools.cookingUnitConverter.description',
    category: '07-lifestyle',
    component: CookingUnitConverter,
  },
  {
    id: '251',
    path: 'meeting-planner',
    nameKey: 'tools.meetingPlanner.name',
    descriptionKey: 'tools.meetingPlanner.description',
    category: '07-lifestyle',
    component: MeetingPlanner,
  },
  {
    id: '252',
    path: 'event-countdown',
    nameKey: 'tools.eventCountdown.name',
    descriptionKey: 'tools.eventCountdown.description',
    category: '07-lifestyle',
    component: EventCountdown,
  },
  {
    id: '253',
    path: 'birthday-reminder',
    nameKey: 'tools.birthdayReminder.name',
    descriptionKey: 'tools.birthdayReminder.description',
    category: '07-lifestyle',
    component: BirthdayReminder,
  },
  {
    id: '254',
    path: 'grocery-list',
    nameKey: 'tools.groceryList.name',
    descriptionKey: 'tools.groceryList.description',
    category: '07-lifestyle',
    component: GroceryList,
  },
  {
    id: '255',
    path: 'meal-planner',
    nameKey: 'tools.mealPlanner.name',
    descriptionKey: 'tools.mealPlanner.description',
    category: '07-lifestyle',
    component: MealPlanner,
  },
  {
    id: '256',
    path: 'workout-tracker',
    nameKey: 'tools.workoutTracker.name',
    descriptionKey: 'tools.workoutTracker.description',
    category: '07-lifestyle',
    component: WorkoutTracker,
  },
  {
    id: '257',
    path: 'mood-tracker',
    nameKey: 'tools.moodTracker.name',
    descriptionKey: 'tools.moodTracker.description',
    category: '07-lifestyle',
    component: MoodTracker,
  },
  {
    id: '258',
    path: 'journal-app',
    nameKey: 'tools.journalApp.name',
    descriptionKey: 'tools.journalApp.description',
    category: '07-lifestyle',
    component: JournalApp,
  },
  {
    id: '259',
    path: 'gratitude-journal',
    nameKey: 'tools.gratitudeJournal.name',
    descriptionKey: 'tools.gratitudeJournal.description',
    category: '07-lifestyle',
    component: GratitudeJournal,
  },
  {
    id: '260',
    path: 'book-tracker',
    nameKey: 'tools.bookTracker.name',
    descriptionKey: 'tools.bookTracker.description',
    category: '07-lifestyle',
    component: BookTracker,
  },
  {
    id: '261',
    path: 'movie-tracker',
    nameKey: 'tools.movieTracker.name',
    descriptionKey: 'tools.movieTracker.description',
    category: '07-lifestyle',
    component: MovieTracker,
  },
  {
    id: '262',
    path: 'plant-watering-reminder',
    nameKey: 'tools.plantWateringReminder.name',
    descriptionKey: 'tools.plantWateringReminder.description',
    category: '07-lifestyle',
    component: PlantWateringReminder,
  },
  {
    id: '263',
    path: 'pet-care-tracker',
    nameKey: 'tools.petCareTracker.name',
    descriptionKey: 'tools.petCareTracker.description',
    category: '07-lifestyle',
    component: PetCareTracker,
  },
  {
    id: '264',
    path: 'chore-tracker',
    nameKey: 'tools.choreTracker.name',
    descriptionKey: 'tools.choreTracker.description',
    category: '07-lifestyle',
    component: ChoreTracker,
  },
  {
    id: '265',
    path: 'quote-of-the-day',
    nameKey: 'tools.quoteOfTheDay.name',
    descriptionKey: 'tools.quoteOfTheDay.description',
    category: '07-lifestyle',
    component: QuoteOfTheDay,
  },
  {
    id: '266',
    path: 'affirmation-generator',
    nameKey: 'tools.affirmationGenerator.name',
    descriptionKey: 'tools.affirmationGenerator.description',
    category: '07-lifestyle',
    component: AffirmationGenerator,
  },
  {
    id: '267',
    path: 'breathing-exercise',
    nameKey: 'tools.breathingExercise.name',
    descriptionKey: 'tools.breathingExercise.description',
    category: '07-lifestyle',
    component: BreathingExercise,
  },
  {
    id: '268',
    path: 'meditation-timer',
    nameKey: 'tools.meditationTimer.name',
    descriptionKey: 'tools.meditationTimer.description',
    category: '07-lifestyle',
    component: MeditationTimer,
  },
  {
    id: '269',
    path: 'daily-planner',
    nameKey: 'tools.dailyPlanner.name',
    descriptionKey: 'tools.dailyPlanner.description',
    category: '07-lifestyle',
    component: DailyPlanner,
  },
  {
    id: '270',
    path: 'goal-tracker',
    nameKey: 'tools.goalTracker.name',
    descriptionKey: 'tools.goalTracker.description',
    category: '07-lifestyle',
    component: GoalTracker,
  },
  {
    id: '271',
    path: 'savings-goal-tracker',
    nameKey: 'tools.savingsGoalTracker.name',
    descriptionKey: 'tools.savingsGoalTracker.description',
    category: '07-lifestyle',
    component: SavingsGoalTracker,
  },
  {
    id: '272',
    path: 'debt-payoff-calculator',
    nameKey: 'tools.debtPayoffCalculator.name',
    descriptionKey: 'tools.debtPayoffCalculator.description',
    category: '07-lifestyle',
    component: DebtPayoffCalculator,
  },
  {
    id: '273',
    path: 'net-worth-calculator',
    nameKey: 'tools.netWorthCalculator.name',
    descriptionKey: 'tools.netWorthCalculator.description',
    category: '07-lifestyle',
    component: NetWorthCalculator,
  },
  {
    id: '274',
    path: 'travel-packing-list',
    nameKey: 'tools.travelPackingList.name',
    descriptionKey: 'tools.travelPackingList.description',
    category: '07-lifestyle',
    component: TravelPackingList,
  },
  {
    id: '275',
    path: 'subscription-manager',
    nameKey: 'tools.subscriptionManager.name',
    descriptionKey: 'tools.subscriptionManager.description',
    category: '07-lifestyle',
    component: SubscriptionManager,
  },
  {
    id: '276',
    path: 'contact-manager',
    nameKey: 'tools.contactManager.name',
    descriptionKey: 'tools.contactManager.description',
    category: '07-lifestyle',
    component: ContactManager,
  },
  {
    id: '277',
    path: 'screen-time-tracker',
    nameKey: 'tools.screenTimeTracker.name',
    descriptionKey: 'tools.screenTimeTracker.description',
    category: '07-lifestyle',
    component: ScreenTimeTracker,
  },
  {
    id: '278',
    path: 'digital-detox-timer',
    nameKey: 'tools.digitalDetoxTimer.name',
    descriptionKey: 'tools.digitalDetoxTimer.description',
    category: '07-lifestyle',
    component: DigitalDetoxTimer,
  },
  {
    id: '279',
    path: 'password-health-checker',
    nameKey: 'tools.passwordHealthChecker.name',
    descriptionKey: 'tools.passwordHealthChecker.description',
    category: '07-lifestyle',
    component: PasswordHealthChecker,
  },
  {
    id: '280',
    path: 'life-calendar',
    nameKey: 'tools.lifeCalendar.name',
    descriptionKey: 'tools.lifeCalendar.description',
    category: '07-lifestyle',
    component: LifeCalendar,
  },
  // Finance Tools (281-320)
  {
    id: '281',
    path: 'finance-loan-calculator',
    nameKey: 'tools.financeLoanCalculator.name',
    descriptionKey: 'tools.financeLoanCalculator.description',
    category: '08-finance',
    component: FinanceLoanCalculator,
  },
  {
    id: '282',
    path: 'compound-interest-calculator',
    nameKey: 'tools.compoundInterestCalculator.name',
    descriptionKey: 'tools.compoundInterestCalculator.description',
    category: '08-finance',
    component: CompoundInterestCalculator,
  },
  {
    id: '283',
    path: 'investment-return-calculator',
    nameKey: 'tools.investmentReturnCalculator.name',
    descriptionKey: 'tools.investmentReturnCalculator.description',
    category: '08-finance',
    component: InvestmentReturnCalculator,
  },
  {
    id: '284',
    path: 'finance-currency-converter',
    nameKey: 'tools.financeCurrencyConverter.name',
    descriptionKey: 'tools.financeCurrencyConverter.description',
    category: '08-finance',
    component: FinanceCurrencyConverter,
  },
  {
    id: '285',
    path: 'finance-tip-calculator',
    nameKey: 'tools.financeTipCalculator.name',
    descriptionKey: 'tools.financeTipCalculator.description',
    category: '08-finance',
    component: FinanceTipCalculator,
  },
  {
    id: '286',
    path: 'bill-splitter',
    nameKey: 'tools.billSplitter.name',
    descriptionKey: 'tools.billSplitter.description',
    category: '08-finance',
    component: BillSplitter,
  },
  {
    id: '287',
    path: 'finance-savings-goal-tracker',
    nameKey: 'tools.financeSavingsGoalTracker.name',
    descriptionKey: 'tools.financeSavingsGoalTracker.description',
    category: '08-finance',
    component: FinanceSavingsGoalTracker,
  },
  {
    id: '288',
    path: 'budget-planner',
    nameKey: 'tools.budgetPlanner.name',
    descriptionKey: 'tools.budgetPlanner.description',
    category: '08-finance',
    component: BudgetPlanner,
  },
  {
    id: '289',
    path: 'finance-net-worth-calculator',
    nameKey: 'tools.financeNetWorthCalculator.name',
    descriptionKey: 'tools.financeNetWorthCalculator.description',
    category: '08-finance',
    component: FinanceNetWorthCalculator,
  },
  {
    id: '290',
    path: 'retirement-calculator',
    nameKey: 'tools.retirementCalculator.name',
    descriptionKey: 'tools.retirementCalculator.description',
    category: '08-finance',
    component: RetirementCalculator,
  },
  {
    id: '291',
    path: 'mortgage-calculator',
    nameKey: 'tools.mortgageCalculator.name',
    descriptionKey: 'tools.mortgageCalculator.description',
    category: '08-finance',
    component: MortgageCalculator,
  },
  {
    id: '292',
    path: 'tax-estimator',
    nameKey: 'tools.taxEstimator.name',
    descriptionKey: 'tools.taxEstimator.description',
    category: '08-finance',
    component: TaxEstimator,
  },
  {
    id: '293',
    path: 'finance-expense-tracker',
    nameKey: 'tools.financeExpenseTracker.name',
    descriptionKey: 'tools.financeExpenseTracker.description',
    category: '08-finance',
    component: FinanceExpenseTracker,
  },
  {
    id: '294',
    path: 'invoice-generator',
    nameKey: 'tools.invoiceGenerator.name',
    descriptionKey: 'tools.invoiceGenerator.description',
    category: '08-finance',
    component: InvoiceGenerator,
  },
  {
    id: '295',
    path: 'profit-margin-calculator',
    nameKey: 'tools.profitMarginCalculator.name',
    descriptionKey: 'tools.profitMarginCalculator.description',
    category: '08-finance',
    component: ProfitMarginCalculator,
  },
  {
    id: '296',
    path: 'break-even-calculator',
    nameKey: 'tools.breakEvenCalculator.name',
    descriptionKey: 'tools.breakEvenCalculator.description',
    category: '08-finance',
    component: BreakEvenCalculator,
  },
  {
    id: '297',
    path: 'salary-to-hourly-converter',
    nameKey: 'tools.salaryToHourlyConverter.name',
    descriptionKey: 'tools.salaryToHourlyConverter.description',
    category: '08-finance',
    component: SalaryToHourlyConverter,
  },
  {
    id: '298',
    path: 'inflation-calculator',
    nameKey: 'tools.inflationCalculator.name',
    descriptionKey: 'tools.inflationCalculator.description',
    category: '08-finance',
    component: InflationCalculator,
  },
  {
    id: '299',
    path: 'discount-calculator',
    nameKey: 'tools.discountCalculator.name',
    descriptionKey: 'tools.discountCalculator.description',
    category: '08-finance',
    component: DiscountCalculator,
  },
  {
    id: '300',
    path: 'credit-card-payoff-calculator',
    nameKey: 'tools.creditCardPayoffCalculator.name',
    descriptionKey: 'tools.creditCardPayoffCalculator.description',
    category: '08-finance',
    component: CreditCardPayoffCalculator,
  },
  {
    id: '301',
    path: 'emergency-fund-calculator',
    nameKey: 'tools.emergencyFundCalculator.name',
    descriptionKey: 'tools.emergencyFundCalculator.description',
    category: '08-finance',
    component: EmergencyFundCalculator,
  },
  {
    id: '302',
    path: 'down-payment-calculator',
    nameKey: 'tools.downPaymentCalculator.name',
    descriptionKey: 'tools.downPaymentCalculator.description',
    category: '08-finance',
    component: DownPaymentCalculator,
  },
  {
    id: '303',
    path: 'car-loan-calculator',
    nameKey: 'tools.carLoanCalculator.name',
    descriptionKey: 'tools.carLoanCalculator.description',
    category: '08-finance',
    component: CarLoanCalculator,
  },
  {
    id: '304',
    path: 'stock-return-calculator',
    nameKey: 'tools.stockReturnCalculator.name',
    descriptionKey: 'tools.stockReturnCalculator.description',
    category: '08-finance',
    component: StockReturnCalculator,
  },
  {
    id: '305',
    path: 'dividend-calculator',
    nameKey: 'tools.dividendCalculator.name',
    descriptionKey: 'tools.dividendCalculator.description',
    category: '08-finance',
    component: DividendCalculator,
  },
  {
    id: '306',
    path: 'price-per-unit-calculator',
    nameKey: 'tools.pricePerUnitCalculator.name',
    descriptionKey: 'tools.pricePerUnitCalculator.description',
    category: '08-finance',
    component: PricePerUnitCalculator,
  },
  {
    id: '307',
    path: 'markup-calculator',
    nameKey: 'tools.markupCalculator.name',
    descriptionKey: 'tools.markupCalculator.description',
    category: '08-finance',
    component: MarkupCalculator,
  },
  {
    id: '308',
    path: 'commission-calculator',
    nameKey: 'tools.commissionCalculator.name',
    descriptionKey: 'tools.commissionCalculator.description',
    category: '08-finance',
    component: CommissionCalculator,
  },
  {
    id: '309',
    path: 'hourly-rate-calculator',
    nameKey: 'tools.hourlyRateCalculator.name',
    descriptionKey: 'tools.hourlyRateCalculator.description',
    category: '08-finance',
    component: HourlyRateCalculator,
  },
  {
    id: '310',
    path: 'freelance-rate-calculator',
    nameKey: 'tools.freelanceRateCalculator.name',
    descriptionKey: 'tools.freelanceRateCalculator.description',
    category: '08-finance',
    component: FreelanceRateCalculator,
  },
  {
    id: '311',
    path: 'subscription-cost-calculator',
    nameKey: 'tools.subscriptionCostCalculator.name',
    descriptionKey: 'tools.subscriptionCostCalculator.description',
    category: '08-finance',
    component: SubscriptionCostCalculator,
  },
  {
    id: '312',
    path: 'cost-of-living-calculator',
    nameKey: 'tools.costOfLivingCalculator.name',
    descriptionKey: 'tools.costOfLivingCalculator.description',
    category: '08-finance',
    component: CostOfLivingCalculator,
  },
  {
    id: '313',
    path: 'debt-snowball-calculator',
    nameKey: 'tools.debtSnowballCalculator.name',
    descriptionKey: 'tools.debtSnowballCalculator.description',
    category: '08-finance',
    component: DebtSnowballCalculator,
  },
  {
    id: '314',
    path: 'budget-rule-calculator',
    nameKey: 'tools.budgetRuleCalculator.name',
    descriptionKey: 'tools.budgetRuleCalculator.description',
    category: '08-finance',
    component: BudgetRuleCalculator,
  },
  {
    id: '315',
    path: 'future-value-calculator',
    nameKey: 'tools.futureValueCalculator.name',
    descriptionKey: 'tools.futureValueCalculator.description',
    category: '08-finance',
    component: FutureValueCalculator,
  },
  {
    id: '316',
    path: 'present-value-calculator',
    nameKey: 'tools.presentValueCalculator.name',
    descriptionKey: 'tools.presentValueCalculator.description',
    category: '08-finance',
    component: PresentValueCalculator,
  },
  {
    id: '317',
    path: 'cagr-calculator',
    nameKey: 'tools.cagrCalculator.name',
    descriptionKey: 'tools.cagrCalculator.description',
    category: '08-finance',
    component: CAGRCalculator,
  },
  {
    id: '318',
    path: 'expense-ratio-calculator',
    nameKey: 'tools.expenseRatioCalculator.name',
    descriptionKey: 'tools.expenseRatioCalculator.description',
    category: '08-finance',
    component: ExpenseRatioCalculator,
  },
  {
    id: '319',
    path: 'net-income-calculator',
    nameKey: 'tools.netIncomeCalculator.name',
    descriptionKey: 'tools.netIncomeCalculator.description',
    category: '08-finance',
    component: NetIncomeCalculator,
  },
  {
    id: '320',
    path: 'financial-independence-calculator',
    nameKey: 'tools.financialIndependenceCalculator.name',
    descriptionKey: 'tools.financialIndependenceCalculator.description',
    category: '08-finance',
    component: FinancialIndependenceCalculator,
  },
  // Education Tools (321-360)
  {
    id: '321',
    path: 'flashcard-maker',
    nameKey: 'tools.flashcardMaker.name',
    descriptionKey: 'tools.flashcardMaker.description',
    category: '09-education',
    component: FlashcardMaker,
  },
  {
    id: '322',
    path: 'edu-pomodoro-timer',
    nameKey: 'tools.eduPomodoroTimer.name',
    descriptionKey: 'tools.eduPomodoroTimer.description',
    category: '09-education',
    component: EduPomodoroTimer,
  },
  {
    id: '323',
    path: 'grade-calculator',
    nameKey: 'tools.gradeCalculator.name',
    descriptionKey: 'tools.gradeCalculator.description',
    category: '09-education',
    component: GradeCalculator,
  },
  {
    id: '324',
    path: 'gpa-calculator',
    nameKey: 'tools.gpaCalculator.name',
    descriptionKey: 'tools.gpaCalculator.description',
    category: '09-education',
    component: GpaCalculator,
  },
  {
    id: '325',
    path: 'citation-generator',
    nameKey: 'tools.citationGenerator.name',
    descriptionKey: 'tools.citationGenerator.description',
    category: '09-education',
    component: CitationGenerator,
  },
  {
    id: '326',
    path: 'reading-speed-test',
    nameKey: 'tools.readingSpeedTest.name',
    descriptionKey: 'tools.readingSpeedTest.description',
    category: '09-education',
    component: ReadingSpeedTest,
  },
  {
    id: '327',
    path: 'typing-speed-test',
    nameKey: 'tools.typingSpeedTest.name',
    descriptionKey: 'tools.typingSpeedTest.description',
    category: '09-education',
    component: TypingSpeedTest,
  },
  {
    id: '328',
    path: 'math-solver',
    nameKey: 'tools.mathSolver.name',
    descriptionKey: 'tools.mathSolver.description',
    category: '09-education',
    component: MathSolver,
  },
  {
    id: '329',
    path: 'fraction-calculator',
    nameKey: 'tools.fractionCalculator.name',
    descriptionKey: 'tools.fractionCalculator.description',
    category: '09-education',
    component: FractionCalculator,
  },
  {
    id: '330',
    path: 'edu-percentage-calculator',
    nameKey: 'tools.eduPercentageCalculator.name',
    descriptionKey: 'tools.eduPercentageCalculator.description',
    category: '09-education',
    component: EduPercentageCalculator,
  },
  {
    id: '331',
    path: 'periodic-table',
    nameKey: 'tools.periodicTable.name',
    descriptionKey: 'tools.periodicTable.description',
    category: '09-education',
    component: PeriodicTable,
  },
  {
    id: '332',
    path: 'molecular-weight-calculator',
    nameKey: 'tools.molecularWeightCalculator.name',
    descriptionKey: 'tools.molecularWeightCalculator.description',
    category: '09-education',
    component: MolecularWeightCalculator,
  },
  {
    id: '333',
    path: 'statistics-calculator',
    nameKey: 'tools.statisticsCalculator.name',
    descriptionKey: 'tools.statisticsCalculator.description',
    category: '09-education',
    component: StatisticsCalculator,
  },
  {
    id: '334',
    path: 'probability-calculator',
    nameKey: 'tools.probabilityCalculator.name',
    descriptionKey: 'tools.probabilityCalculator.description',
    category: '09-education',
    component: ProbabilityCalculator,
  },
  {
    id: '335',
    path: 'essay-word-counter',
    nameKey: 'tools.essayWordCounter.name',
    descriptionKey: 'tools.essayWordCounter.description',
    category: '09-education',
    component: EssayWordCounter,
  },
  {
    id: '336',
    path: 'study-timer',
    nameKey: 'tools.studyTimer.name',
    descriptionKey: 'tools.studyTimer.description',
    category: '09-education',
    component: StudyTimer,
  },
  {
    id: '337',
    path: 'vocabulary-builder',
    nameKey: 'tools.vocabularyBuilder.name',
    descriptionKey: 'tools.vocabularyBuilder.description',
    category: '09-education',
    component: VocabularyBuilder,
  },
  {
    id: '338',
    path: 'multiplication-table',
    nameKey: 'tools.multiplicationTable.name',
    descriptionKey: 'tools.multiplicationTable.description',
    category: '09-education',
    component: MultiplicationTable,
  },
  {
    id: '339',
    path: 'quiz-maker',
    nameKey: 'tools.quizMaker.name',
    descriptionKey: 'tools.quizMaker.description',
    category: '09-education',
    component: QuizMaker,
  },
  {
    id: '340',
    path: 'edu-unit-converter',
    nameKey: 'tools.eduUnitConverter.name',
    descriptionKey: 'tools.eduUnitConverter.description',
    category: '09-education',
    component: EduUnitConverter,
  },
  {
    id: '341',
    path: 'mind-map-creator',
    nameKey: 'tools.mindMapCreator.name',
    descriptionKey: 'tools.mindMapCreator.description',
    category: '09-education',
    component: MindMapCreator,
  },
  {
    id: '342',
    path: 'cornell-notes',
    nameKey: 'tools.cornellNotes.name',
    descriptionKey: 'tools.cornellNotes.description',
    category: '09-education',
    component: CornellNotes,
  },
  {
    id: '343',
    path: 'acronym-generator',
    nameKey: 'tools.acronymGenerator.name',
    descriptionKey: 'tools.acronymGenerator.description',
    category: '09-education',
    component: AcronymGenerator,
  },
  {
    id: '344',
    path: 'spelling-practice',
    nameKey: 'tools.spellingPractice.name',
    descriptionKey: 'tools.spellingPractice.description',
    category: '09-education',
    component: SpellingPractice,
  },
  {
    id: '345',
    path: 'equation-balancer',
    nameKey: 'tools.equationBalancer.name',
    descriptionKey: 'tools.equationBalancer.description',
    category: '09-education',
    component: EquationBalancer,
  },
  {
    id: '346',
    path: 'geometry-calculator',
    nameKey: 'tools.geometryCalculator.name',
    descriptionKey: 'tools.geometryCalculator.description',
    category: '09-education',
    component: GeometryCalculator,
  },
  {
    id: '347',
    path: 'history-timeline',
    nameKey: 'tools.historyTimeline.name',
    descriptionKey: 'tools.historyTimeline.description',
    category: '09-education',
    component: HistoryTimeline,
  },
  {
    id: '348',
    path: 'note-taking-template',
    nameKey: 'tools.noteTakingTemplate.name',
    descriptionKey: 'tools.noteTakingTemplate.description',
    category: '09-education',
    component: NoteTakingTemplate,
  },
  {
    id: '349',
    path: 'mnemonic-creator',
    nameKey: 'tools.mnemonicCreator.name',
    descriptionKey: 'tools.mnemonicCreator.description',
    category: '09-education',
    component: MnemonicCreator,
  },
  {
    id: '350',
    path: 'book-summary',
    nameKey: 'tools.bookSummary.name',
    descriptionKey: 'tools.bookSummary.description',
    category: '09-education',
    component: BookSummary,
  },
  {
    id: '351',
    path: 'debate-timer',
    nameKey: 'tools.debateTimer.name',
    descriptionKey: 'tools.debateTimer.description',
    category: '09-education',
    component: DebateTimer,
  },
  {
    id: '352',
    path: 'morse-code-translator',
    nameKey: 'tools.morseCodeTranslator.name',
    descriptionKey: 'tools.morseCodeTranslator.description',
    category: '09-education',
    component: MorseCodeTranslator,
  },
  {
    id: '353',
    path: 'binary-converter',
    nameKey: 'tools.binaryConverter.name',
    descriptionKey: 'tools.binaryConverter.description',
    category: '09-education',
    component: BinaryConverter,
  },
  {
    id: '354',
    path: 'edu-roman-numeral-converter',
    nameKey: 'tools.eduRomanNumeralConverter.name',
    descriptionKey: 'tools.eduRomanNumeralConverter.description',
    category: '09-education',
    component: EduRomanNumeralConverter,
  },
  {
    id: '355',
    path: 'thesaurus-tool',
    nameKey: 'tools.thesaurusTool.name',
    descriptionKey: 'tools.thesaurusTool.description',
    category: '09-education',
    component: ThesaurusTool,
  },
  {
    id: '356',
    path: 'essay-outliner',
    nameKey: 'tools.essayOutliner.name',
    descriptionKey: 'tools.essayOutliner.description',
    category: '09-education',
    component: EssayOutliner,
  },
  {
    id: '357',
    path: 'homework-tracker',
    nameKey: 'tools.homeworkTracker.name',
    descriptionKey: 'tools.homeworkTracker.description',
    category: '09-education',
    component: HomeworkTracker,
  },
  {
    id: '358',
    path: 'class-schedule',
    nameKey: 'tools.classSchedule.name',
    descriptionKey: 'tools.classSchedule.description',
    category: '09-education',
    component: ClassSchedule,
  },
  {
    id: '359',
    path: 'language-flashcards',
    nameKey: 'tools.languageFlashcards.name',
    descriptionKey: 'tools.languageFlashcards.description',
    category: '09-education',
    component: LanguageFlashcards,
  },
  {
    id: '360',
    path: 'math-facts-practice',
    nameKey: 'tools.mathFactsPractice.name',
    descriptionKey: 'tools.mathFactsPractice.description',
    category: '09-education',
    component: MathFactsPractice,
  },
  {
    id: '361',
    path: 'reading-log',
    nameKey: 'tools.readingLog.name',
    descriptionKey: 'tools.readingLog.description',
    category: '09-education',
    component: ReadingLog,
  },
  {
    id: '362',
    path: 'science-glossary',
    nameKey: 'tools.scienceGlossary.name',
    descriptionKey: 'tools.scienceGlossary.description',
    category: '09-education',
    component: ScienceGlossary,
  },
  // Health Tools (363-402)
  {
    id: '363',
    path: 'ideal-weight-calculator',
    nameKey: 'tools.idealWeight.name',
    descriptionKey: 'tools.idealWeight.description',
    category: '10-health',
    component: IdealWeightCalculator,
  },
  {
    id: '364',
    path: 'body-fat-calculator',
    nameKey: 'tools.bodyFatCalculator.name',
    descriptionKey: 'tools.bodyFatCalculator.description',
    category: '10-health',
    component: BodyFatCalculator,
  },
  {
    id: '365',
    path: 'health-calorie-counter',
    nameKey: 'tools.healthCalorieCounter.name',
    descriptionKey: 'tools.healthCalorieCounter.description',
    category: '10-health',
    component: HealthCalorieCounter,
  },
  {
    id: '366',
    path: 'water-intake-calculator',
    nameKey: 'tools.waterIntakeCalculator.name',
    descriptionKey: 'tools.waterIntakeCalculator.description',
    category: '10-health',
    component: WaterIntakeCalculator,
  },
  {
    id: '367',
    path: 'sleep-tracker',
    nameKey: 'tools.sleepTracker.name',
    descriptionKey: 'tools.sleepTracker.description',
    category: '10-health',
    component: SleepTracker,
  },
  {
    id: '368',
    path: 'health-mood-tracker',
    nameKey: 'tools.healthMoodTracker.name',
    descriptionKey: 'tools.healthMoodTracker.description',
    category: '10-health',
    component: HealthMoodTracker,
  },
  {
    id: '369',
    path: 'medication-reminder',
    nameKey: 'tools.medicationReminder.name',
    descriptionKey: 'tools.medicationReminder.description',
    category: '10-health',
    component: MedicationReminder,
  },
  {
    id: '370',
    path: 'heart-rate-monitor',
    nameKey: 'tools.heartRateMonitor.name',
    descriptionKey: 'tools.heartRateMonitor.description',
    category: '10-health',
    component: HeartRateMonitor,
  },
  {
    id: '371',
    path: 'blood-pressure-log',
    nameKey: 'tools.bloodPressureLog.name',
    descriptionKey: 'tools.bloodPressureLog.description',
    category: '10-health',
    component: BloodPressureLog,
  },
  {
    id: '372',
    path: 'weight-tracker',
    nameKey: 'tools.weightTracker.name',
    descriptionKey: 'tools.weightTracker.description',
    category: '10-health',
    component: WeightTracker,
  },
  {
    id: '373',
    path: 'health-meal-planner',
    nameKey: 'tools.healthMealPlanner.name',
    descriptionKey: 'tools.healthMealPlanner.description',
    category: '10-health',
    component: HealthMealPlanner,
  },
  {
    id: '374',
    path: 'exercise-timer',
    nameKey: 'tools.exerciseTimer.name',
    descriptionKey: 'tools.exerciseTimer.description',
    category: '10-health',
    component: Health10ExerciseTimer,
  },
  {
    id: '375',
    path: 'fasting-timer',
    nameKey: 'tools.fastingTimer.name',
    descriptionKey: 'tools.fastingTimer.description',
    category: '10-health',
    component: FastingTimer,
  },
  {
    id: '376',
    path: 'pregnancy-calculator',
    nameKey: 'tools.pregnancyCalculator.name',
    descriptionKey: 'tools.pregnancyCalculator.description',
    category: '10-health',
    component: PregnancyCalculator,
  },
  {
    id: '377',
    path: 'ovulation-calculator',
    nameKey: 'tools.ovulationCalculator.name',
    descriptionKey: 'tools.ovulationCalculator.description',
    category: '10-health',
    component: OvulationCalculator,
  },
  {
    id: '378',
    path: 'health-breathing-exercise',
    nameKey: 'tools.healthBreathingExercise.name',
    descriptionKey: 'tools.healthBreathingExercise.description',
    category: '10-health',
    component: HealthBreathingExercise,
  },
  {
    id: '379',
    path: 'health-meditation-timer',
    nameKey: 'tools.healthMeditationTimer.name',
    descriptionKey: 'tools.healthMeditationTimer.description',
    category: '10-health',
    component: HealthMeditationTimer,
  },
  {
    id: '380',
    path: 'bmr-calculator',
    nameKey: 'tools.bmrCalculator.name',
    descriptionKey: 'tools.bmrCalculator.description',
    category: '10-health',
    component: BmrCalculator,
  },
  {
    id: '381',
    path: 'tdee-calculator',
    nameKey: 'tools.tdeeCalculator.name',
    descriptionKey: 'tools.tdeeCalculator.description',
    category: '10-health',
    component: TdeeCalculator,
  },
  {
    id: '382',
    path: 'macro-calculator',
    nameKey: 'tools.macroCalculator.name',
    descriptionKey: 'tools.macroCalculator.description',
    category: '10-health',
    component: MacroCalculator,
  },
  {
    id: '383',
    path: 'workout-log',
    nameKey: 'tools.workoutLog.name',
    descriptionKey: 'tools.workoutLog.description',
    category: '10-health',
    component: WorkoutLog,
  },
  {
    id: '384',
    path: 'running-pace-calculator',
    nameKey: 'tools.runningPaceCalculator.name',
    descriptionKey: 'tools.runningPaceCalculator.description',
    category: '10-health',
    component: RunningPaceCalculator,
  },
  {
    id: '385',
    path: 'yoga-pose-guide',
    nameKey: 'tools.yogaPoseGuide.name',
    descriptionKey: 'tools.yogaPoseGuide.description',
    category: '10-health',
    component: YogaPoseGuide,
  },
  {
    id: '386',
    path: 'first-aid-guide',
    nameKey: 'tools.firstAidGuide.name',
    descriptionKey: 'tools.firstAidGuide.description',
    category: '10-health',
    component: FirstAidGuide,
  },
  {
    id: '387',
    path: 'step-counter',
    nameKey: 'tools.stepCounter.name',
    descriptionKey: 'tools.stepCounter.description',
    category: '10-health',
    component: Health10StepCounter,
  },
  {
    id: '388',
    path: 'hydration-tracker',
    nameKey: 'tools.hydrationTracker.name',
    descriptionKey: 'tools.hydrationTracker.description',
    category: '10-health',
    component: HydrationTracker,
  },
  {
    id: '389',
    path: 'protein-intake-calculator',
    nameKey: 'tools.proteinIntakeCalculator.name',
    descriptionKey: 'tools.proteinIntakeCalculator.description',
    category: '10-health',
    component: ProteinIntakeCalculator,
  },
  {
    id: '390',
    path: 'vision-test',
    nameKey: 'tools.visionTest.name',
    descriptionKey: 'tools.visionTest.description',
    category: '10-health',
    component: VisionTest,
  },
  {
    id: '391',
    path: 'pain-diary',
    nameKey: 'tools.painDiary.name',
    descriptionKey: 'tools.painDiary.description',
    category: '10-health',
    component: PainDiary,
  },
  {
    id: '392',
    path: 'posture-reminder',
    nameKey: 'tools.postureReminder.name',
    descriptionKey: 'tools.postureReminder.description',
    category: '10-health',
    component: PostureReminder,
  },
  {
    id: '393',
    path: 'allergy-tracker',
    nameKey: 'tools.allergyTracker.name',
    descriptionKey: 'tools.allergyTracker.description',
    category: '10-health',
    component: AllergyTracker,
  },
  {
    id: '394',
    path: 'stress-level-tracker',
    nameKey: 'tools.stressLevelTracker.name',
    descriptionKey: 'tools.stressLevelTracker.description',
    category: '10-health',
    component: StressLevelTracker,
  },
  {
    id: '395',
    path: 'vaccination-schedule',
    nameKey: 'tools.vaccinationSchedule.name',
    descriptionKey: 'tools.vaccinationSchedule.description',
    category: '10-health',
    component: VaccinationSchedule,
  },
  {
    id: '396',
    path: 'baby-growth-tracker',
    nameKey: 'tools.babyGrowthTracker.name',
    descriptionKey: 'tools.babyGrowthTracker.description',
    category: '10-health',
    component: BabyGrowthTracker,
  },
  {
    id: '397',
    path: 'hearing-test',
    nameKey: 'tools.hearingTest.name',
    descriptionKey: 'tools.hearingTest.description',
    category: '10-health',
    component: HearingTest,
  },
  {
    id: '398',
    path: 'keto-calculator',
    nameKey: 'tools.ketoCalculator.name',
    descriptionKey: 'tools.ketoCalculator.description',
    category: '10-health',
    component: KetoCalculator,
  },
  {
    id: '399',
    path: 'swimming-log',
    nameKey: 'tools.swimmingLog.name',
    descriptionKey: 'tools.swimmingLog.description',
    category: '10-health',
    component: SwimmingLog,
  },
  {
    id: '400',
    path: 'cycling-calculator',
    nameKey: 'tools.cyclingCalculator.name',
    descriptionKey: 'tools.cyclingCalculator.description',
    category: '10-health',
    component: CyclingCalculator,
  },
  {
    id: '401',
    path: 'nutrition-facts-lookup',
    nameKey: 'tools.nutritionFactsLookup.name',
    descriptionKey: 'tools.nutritionFactsLookup.description',
    category: '10-health',
    component: NutritionFactsLookup,
  },
  {
    id: '402',
    path: 'symptom-checker',
    nameKey: 'tools.symptomChecker.name',
    descriptionKey: 'tools.symptomChecker.description',
    category: '10-health',
    component: SymptomChecker,
  },
  {
    id: '403',
    path: 'hashtag-generator',
    nameKey: 'tools.hashtagGenerator.name',
    descriptionKey: 'tools.hashtagGenerator.description',
    category: '11-social',
    component: HashtagGenerator,
  },
  {
    id: '404',
    path: 'tweet-character-counter',
    nameKey: 'tools.tweetCharacterCounter.name',
    descriptionKey: 'tools.tweetCharacterCounter.description',
    category: '11-social',
    component: TweetCharacterCounter,
  },
  {
    id: '405',
    path: 'bio-generator',
    nameKey: 'tools.bioGenerator.name',
    descriptionKey: 'tools.bioGenerator.description',
    category: '11-social',
    component: BioGenerator,
  },
  {
    id: '406',
    path: 'username-generator',
    nameKey: 'tools.usernameGenerator.name',
    descriptionKey: 'tools.usernameGenerator.description',
    category: '11-social',
    component: UsernameGenerator,
  },
  {
    id: '407',
    path: 'engagement-rate-calculator',
    nameKey: 'tools.engagementRateCalculator.name',
    descriptionKey: 'tools.engagementRateCalculator.description',
    category: '11-social',
    component: EngagementRateCalculator,
  },
  {
    id: '408',
    path: 'qr-code-generator',
    nameKey: 'tools.qrCodeGenerator.name',
    descriptionKey: 'tools.qrCodeGenerator.description',
    category: '11-social',
    component: SocialQRCodeGenerator,
  },
  {
    id: '409',
    path: 'discord-timestamp',
    nameKey: 'tools.discordTimestamp.name',
    descriptionKey: 'tools.discordTimestamp.description',
    category: '11-social',
    component: DiscordTimestamp,
  },
  {
    id: '410',
    path: 'email-signature-generator',
    nameKey: 'tools.emailSignatureGenerator.name',
    descriptionKey: 'tools.emailSignatureGenerator.description',
    category: '11-social',
    component: EmailSignatureGenerator,
  },
  {
    id: '411',
    path: 'poll-creator',
    nameKey: 'tools.pollCreator.name',
    descriptionKey: 'tools.pollCreator.description',
    category: '11-social',
    component: PollCreator,
  },
  {
    id: '412',
    path: 'event-countdown',
    nameKey: 'tools.eventCountdown.name',
    descriptionKey: 'tools.eventCountdown.description',
    category: '11-social',
    component: SocialEventCountdown,
  },
  {
    id: '413',
    path: 'invitation-card-creator',
    nameKey: 'tools.invitationCardCreator.name',
    descriptionKey: 'tools.invitationCardCreator.description',
    category: '11-social',
    component: InvitationCardCreator,
  },
  {
    id: '414',
    path: 'guest-list-manager',
    nameKey: 'tools.guestListManager.name',
    descriptionKey: 'tools.guestListManager.description',
    category: '11-social',
    component: GuestListManager,
  },
  {
    id: '415',
    path: 'name-tag-generator',
    nameKey: 'tools.nameTagGenerator.name',
    descriptionKey: 'tools.nameTagGenerator.description',
    category: '11-social',
    component: NameTagGenerator,
  },
  {
    id: '416',
    path: 'content-ideas-generator',
    nameKey: 'tools.contentIdeasGenerator.name',
    descriptionKey: 'tools.contentIdeasGenerator.description',
    category: '11-social',
    component: ContentIdeasGenerator,
  },
  {
    id: '417',
    path: 'influencer-rate-calculator',
    nameKey: 'tools.influencerRateCalculator.name',
    descriptionKey: 'tools.influencerRateCalculator.description',
    category: '11-social',
    component: InfluencerRateCalculator,
  },
  {
    id: '418',
    path: 'team-name-generator',
    nameKey: 'tools.teamNameGenerator.name',
    descriptionKey: 'tools.teamNameGenerator.description',
    category: '11-social',
    component: TeamNameGenerator,
  },
  {
    id: '419',
    path: 'thank-you-note-generator',
    nameKey: 'tools.thankYouNoteGenerator.name',
    descriptionKey: 'tools.thankYouNoteGenerator.description',
    category: '11-social',
    component: ThankYouNoteGenerator,
  },
  {
    id: '420',
    path: 'meeting-notes-template',
    nameKey: 'tools.meetingNotesTemplate.name',
    descriptionKey: 'tools.meetingNotesTemplate.description',
    category: '11-social',
    component: MeetingNotesTemplate,
  },
  {
    id: '421',
    path: 'contact-card-generator',
    nameKey: 'tools.contactCardGenerator.name',
    descriptionKey: 'tools.contactCardGenerator.description',
    category: '11-social',
    component: ContactCardGenerator,
  },
  {
    id: '422',
    path: 'social-media-calendar',
    nameKey: 'tools.socialMediaCalendar.name',
    descriptionKey: 'tools.socialMediaCalendar.description',
    category: '11-social',
    component: SocialMediaCalendar,
  },
  {
    id: '423',
    path: 'social-image-resizer',
    nameKey: 'tools.socialImageResizer.name',
    descriptionKey: 'tools.socialImageResizer.description',
    category: '11-social',
    component: SocialImageResizer,
  },
  {
    id: '424',
    path: 'rsvp-tracker',
    nameKey: 'tools.rsvpTracker.name',
    descriptionKey: 'tools.rsvpTracker.description',
    category: '11-social',
    component: RSVPTracker,
  },
  {
    id: '425',
    path: 'caption-generator',
    nameKey: 'tools.captionGenerator.name',
    descriptionKey: 'tools.captionGenerator.description',
    category: '11-social',
    component: CaptionGenerator,
  },
  {
    id: '426',
    path: 'group-chat-name-generator',
    nameKey: 'tools.groupChatNameGenerator.name',
    descriptionKey: 'tools.groupChatNameGenerator.description',
    category: '11-social',
    component: GroupChatNameGenerator,
  },
  {
    id: '427',
    path: 'follower-milestone-tracker',
    nameKey: 'tools.followerMilestoneTracker.name',
    descriptionKey: 'tools.followerMilestoneTracker.description',
    category: '11-social',
    component: FollowerMilestoneTracker,
  },
  {
    id: '428',
    path: 'seating-chart-generator',
    nameKey: 'tools.seatingChartGenerator.name',
    descriptionKey: 'tools.seatingChartGenerator.description',
    category: '11-social',
    component: SeatingChartGenerator,
  },
  {
    id: '429',
    path: 'place-card-generator',
    nameKey: 'tools.placeCardGenerator.name',
    descriptionKey: 'tools.placeCardGenerator.description',
    category: '11-social',
    component: PlaceCardGenerator,
  },
  {
    id: '430',
    path: 'badge-generator',
    nameKey: 'tools.badgeGenerator.name',
    descriptionKey: 'tools.badgeGenerator.description',
    category: '11-social',
    component: BadgeGenerator,
  },
  {
    id: '431',
    path: 'link-in-bio-creator',
    nameKey: 'tools.linkInBioCreator.name',
    descriptionKey: 'tools.linkInBioCreator.description',
    category: '11-social',
    component: LinkInBioCreator,
  },
  {
    id: '432',
    path: 'social-analytics-dashboard',
    nameKey: 'tools.socialAnalyticsDashboard.name',
    descriptionKey: 'tools.socialAnalyticsDashboard.description',
    category: '11-social',
    component: SocialAnalyticsDashboard,
  },
  {
    id: '433',
    path: 'comment-template-generator',
    nameKey: 'tools.commentTemplateGenerator.name',
    descriptionKey: 'tools.commentTemplateGenerator.description',
    category: '11-social',
    component: CommentTemplateGenerator,
  },
  {
    id: '434',
    path: 'story-template-generator',
    nameKey: 'tools.storyTemplateGenerator.name',
    descriptionKey: 'tools.storyTemplateGenerator.description',
    category: '11-social',
    component: StoryTemplateGenerator,
  },
  {
    id: '435',
    path: 'slack-emoji-picker',
    nameKey: 'tools.slackEmojiPicker.name',
    descriptionKey: 'tools.slackEmojiPicker.description',
    category: '11-social',
    component: SlackEmojiPicker,
  },
  {
    id: '436',
    path: 'video-call-background-generator',
    nameKey: 'tools.videoCallBackgroundGenerator.name',
    descriptionKey: 'tools.videoCallBackgroundGenerator.description',
    category: '11-social',
    component: VideoCallBackgroundGenerator,
  },
  {
    id: '437',
    path: 'gift-registry-creator',
    nameKey: 'tools.giftRegistryCreator.name',
    descriptionKey: 'tools.giftRegistryCreator.description',
    category: '11-social',
    component: GiftRegistryCreator,
  },
  {
    id: '438',
    path: 'party-planner',
    nameKey: 'tools.partyPlanner.name',
    descriptionKey: 'tools.partyPlanner.description',
    category: '11-social',
    component: PartyPlanner,
  },
  {
    id: '439',
    path: 'profile-picture-cropper',
    nameKey: 'tools.profilePictureCropper.name',
    descriptionKey: 'tools.profilePictureCropper.description',
    category: '11-social',
    component: ProfilePictureCropper,
  },
  {
    id: '440',
    path: 'viral-score-calculator',
    nameKey: 'tools.viralScoreCalculator.name',
    descriptionKey: 'tools.viralScoreCalculator.description',
    category: '11-social',
    component: ViralScoreCalculator,
  },
  {
    id: '441',
    path: 'post-scheduler-mockup',
    nameKey: 'tools.postSchedulerMockup.name',
    descriptionKey: 'tools.postSchedulerMockup.description',
    category: '11-social',
    component: PostSchedulerMockup,
  },
  {
    id: '442',
    path: 'social-link-generator',
    nameKey: 'tools.socialLinkGenerator.name',
    descriptionKey: 'tools.socialLinkGenerator.description',
    category: '11-social',
    component: SocialLinkGenerator,
  },
  {
    id: '443',
    path: 'invoice-generator',
    nameKey: 'tools.invoiceGenerator.name',
    descriptionKey: 'tools.invoiceGenerator.description',
    category: '12-productivity',
    component: ProdInvoiceGenerator,
  },
  {
    id: '444',
    path: 'receipt-maker',
    nameKey: 'tools.receiptMaker.name',
    descriptionKey: 'tools.receiptMaker.description',
    category: '12-productivity',
    component: ReceiptMaker,
  },
  {
    id: '445',
    path: 'business-card-generator',
    nameKey: 'tools.businessCardGenerator.name',
    descriptionKey: 'tools.businessCardGenerator.description',
    category: '12-productivity',
    component: BusinessCardGenerator,
  },
  {
    id: '446',
    path: 'meeting-agenda-creator',
    nameKey: 'tools.meetingAgendaCreator.name',
    descriptionKey: 'tools.meetingAgendaCreator.description',
    category: '12-productivity',
    component: MeetingAgendaCreator,
  },
  {
    id: '447',
    path: 'expense-tracker',
    nameKey: 'tools.expenseTracker.name',
    descriptionKey: 'tools.expenseTracker.description',
    category: '12-productivity',
    component: ExpenseTracker,
  },
  {
    id: '448',
    path: 'time-tracker',
    nameKey: 'tools.timeTracker.name',
    descriptionKey: 'tools.timeTracker.description',
    category: '12-productivity',
    component: TimeTracker,
  },
  {
    id: '449',
    path: 'task-priority-matrix',
    nameKey: 'tools.taskPriorityMatrix.name',
    descriptionKey: 'tools.taskPriorityMatrix.description',
    category: '12-productivity',
    component: TaskPriorityMatrix,
  },
  {
    id: '450',
    path: 'decision-matrix',
    nameKey: 'tools.decisionMatrix.name',
    descriptionKey: 'tools.decisionMatrix.description',
    category: '12-productivity',
    component: DecisionMatrix,
  },
  {
    id: '451',
    path: 'swot-analysis',
    nameKey: 'tools.swotAnalysis.name',
    descriptionKey: 'tools.swotAnalysis.description',
    category: '12-productivity',
    component: SwotAnalysis,
  },
  {
    id: '452',
    path: 'goal-tracker',
    nameKey: 'tools.goalTracker.name',
    descriptionKey: 'tools.goalTracker.description',
    category: '12-productivity',
    component: ProdGoalTracker,
  },
  {
    id: '453',
    path: 'habit-tracker',
    nameKey: 'tools.habitTracker.name',
    descriptionKey: 'tools.habitTracker.description',
    category: '12-productivity',
    component: ProdHabitTracker,
  },
  {
    id: '454',
    path: 'pomodoro-timer',
    nameKey: 'tools.pomodoroTimer.name',
    descriptionKey: 'tools.pomodoroTimer.description',
    category: '12-productivity',
    component: ProdPomodoroTimer,
  },
  {
    id: '455',
    path: 'mind-map-creator',
    nameKey: 'tools.mindMapCreator.name',
    descriptionKey: 'tools.mindMapCreator.description',
    category: '12-productivity',
    component: ProdMindMapCreator,
  },
  {
    id: '456',
    path: 'kanban-board',
    nameKey: 'tools.kanbanBoard.name',
    descriptionKey: 'tools.kanbanBoard.description',
    category: '12-productivity',
    component: KanbanBoard,
  },
  {
    id: '457',
    path: 'daily-planner',
    nameKey: 'tools.dailyPlanner.name',
    descriptionKey: 'tools.dailyPlanner.description',
    category: '12-productivity',
    component: ProdDailyPlanner,
  },
  {
    id: '458',
    path: 'note-taking-app',
    nameKey: 'tools.noteTakingApp.name',
    descriptionKey: 'tools.noteTakingApp.description',
    category: '12-productivity',
    component: NoteTakingApp,
  },
  {
    id: '459',
    path: 'checklist-maker',
    nameKey: 'tools.checklistMaker.name',
    descriptionKey: 'tools.checklistMaker.description',
    category: '12-productivity',
    component: ChecklistMaker,
  },
  {
    id: '460',
    path: 'bookmark-manager',
    nameKey: 'tools.bookmarkManager.name',
    descriptionKey: 'tools.bookmarkManager.description',
    category: '12-productivity',
    component: BookmarkManager,
  },
  {
    id: '461',
    path: 'password-generator-pro',
    nameKey: 'tools.passwordGeneratorPro.name',
    descriptionKey: 'tools.passwordGeneratorPro.description',
    category: '12-productivity',
    component: PasswordGeneratorPro,
  },
  {
    id: '462',
    path: 'quote-generator',
    nameKey: 'tools.quoteGenerator.name',
    descriptionKey: 'tools.quoteGenerator.description',
    category: '12-productivity',
    component: QuoteGenerator,
  },
  {
    id: '463',
    path: 'memo-maker',
    nameKey: 'tools.memoMaker.name',
    descriptionKey: 'tools.memoMaker.description',
    category: '12-productivity',
    component: MemoMaker,
  },
  {
    id: '464',
    path: 'project-timeline',
    nameKey: 'tools.projectTimeline.name',
    descriptionKey: 'tools.projectTimeline.description',
    category: '12-productivity',
    component: ProjectTimeline,
  },
  {
    id: '465',
    path: 'email-template-generator',
    nameKey: 'tools.emailTemplateGenerator.name',
    descriptionKey: 'tools.emailTemplateGenerator.description',
    category: '12-productivity',
    component: EmailTemplateGenerator,
  },
  {
    id: '466',
    path: 'budget-planner',
    nameKey: 'tools.budgetPlanner.name',
    descriptionKey: 'tools.budgetPlanner.description',
    category: '12-productivity',
    component: ProdBudgetPlanner,
  },
  {
    id: '467',
    path: 'inventory-tracker',
    nameKey: 'tools.inventoryTracker.name',
    descriptionKey: 'tools.inventoryTracker.description',
    category: '12-productivity',
    component: InventoryTracker,
  },
  {
    id: '468',
    path: 'contract-template',
    nameKey: 'tools.contractTemplate.name',
    descriptionKey: 'tools.contractTemplate.description',
    category: '12-productivity',
    component: ContractTemplate,
  },
  {
    id: '469',
    path: 'presentation-outline',
    nameKey: 'tools.presentationOutline.name',
    descriptionKey: 'tools.presentationOutline.description',
    category: '12-productivity',
    component: PresentationOutline,
  },
  {
    id: '470',
    path: 'client-directory',
    nameKey: 'tools.clientDirectory.name',
    descriptionKey: 'tools.clientDirectory.description',
    category: '12-productivity',
    component: ClientDirectory,
  },
  {
    id: '471',
    path: 'shipping-label-generator',
    nameKey: 'tools.shippingLabelGenerator.name',
    descriptionKey: 'tools.shippingLabelGenerator.description',
    category: '12-productivity',
    component: ShippingLabelGenerator,
  },
  {
    id: '472',
    path: 'packing-list-creator',
    nameKey: 'tools.packingListCreator.name',
    descriptionKey: 'tools.packingListCreator.description',
    category: '12-productivity',
    component: PackingListCreator,
  },
  {
    id: '473',
    path: 'order-form-creator',
    nameKey: 'tools.orderFormCreator.name',
    descriptionKey: 'tools.orderFormCreator.description',
    category: '12-productivity',
    component: OrderFormCreator,
  },
  {
    id: '474',
    path: 'return-label-generator',
    nameKey: 'tools.returnLabelGenerator.name',
    descriptionKey: 'tools.returnLabelGenerator.description',
    category: '12-productivity',
    component: ReturnLabelGenerator,
  },
  {
    id: '475',
    path: 'warranty-tracker',
    nameKey: 'tools.warrantyTracker.name',
    descriptionKey: 'tools.warrantyTracker.description',
    category: '12-productivity',
    component: WarrantyTracker,
  },
  {
    id: '476',
    path: 'appointment-scheduler',
    nameKey: 'tools.appointmentScheduler.name',
    descriptionKey: 'tools.appointmentScheduler.description',
    category: '12-productivity',
    component: AppointmentScheduler,
  },
  {
    id: '477',
    path: 'mileage-tracker',
    nameKey: 'tools.mileageTracker.name',
    descriptionKey: 'tools.mileageTracker.description',
    category: '12-productivity',
    component: MileageTracker,
  },
  {
    id: '478',
    path: 'vehicle-maintenance-log',
    nameKey: 'tools.vehicleMaintenanceLog.name',
    descriptionKey: 'tools.vehicleMaintenanceLog.description',
    category: '12-productivity',
    component: VehicleMaintenanceLog,
  },
  {
    id: '479',
    path: 'subscription-tracker',
    nameKey: 'tools.subscriptionTracker.name',
    descriptionKey: 'tools.subscriptionTracker.description',
    category: '12-productivity',
    component: SubscriptionTracker,
  },
  {
    id: '480',
    path: 'loan-calculator',
    nameKey: 'tools.loanCalculator.name',
    descriptionKey: 'tools.loanCalculator.description',
    category: '12-productivity',
    component: ProdLoanCalculator,
  },
  {
    id: '481',
    path: 'savings-goal-calculator',
    nameKey: 'tools.savingsGoalCalculator.name',
    descriptionKey: 'tools.savingsGoalCalculator.description',
    category: '12-productivity',
    component: SavingsGoalCalculator,
  },
  {
    id: '482',
    path: 'net-worth-tracker',
    nameKey: 'tools.netWorthTracker.name',
    descriptionKey: 'tools.netWorthTracker.description',
    category: '12-productivity',
    component: NetWorthTracker,
  },
  {
    id: '483',
    path: 'unit-converter',
    nameKey: 'tools.unitConverter.name',
    descriptionKey: 'tools.unitConverter.description',
    category: '13-science',
    component: ScienceUnitConverter,
  },
  {
    id: '484',
    path: 'scientific-calculator',
    nameKey: 'tools.scientificCalculator.name',
    descriptionKey: 'tools.scientificCalculator.description',
    category: '13-science',
    component: ScienceScientificCalculator,
  },
  {
    id: '485',
    path: 'graphing-calculator',
    nameKey: 'tools.graphingCalculator.name',
    descriptionKey: 'tools.graphingCalculator.description',
    category: '13-science',
    component: ScienceGraphingCalculator,
  },
  {
    id: '486',
    path: 'matrix-calculator',
    nameKey: 'tools.matrixCalculator.name',
    descriptionKey: 'tools.matrixCalculator.description',
    category: '13-science',
    component: ScienceMatrixCalculator,
  },
  {
    id: '487',
    path: 'equation-solver',
    nameKey: 'tools.equationSolver.name',
    descriptionKey: 'tools.equationSolver.description',
    category: '13-science',
    component: ScienceEquationSolver,
  },
  {
    id: '488',
    path: 'statistics-calculator',
    nameKey: 'tools.statisticsCalculator.name',
    descriptionKey: 'tools.statisticsCalculator.description',
    category: '13-science',
    component: ScienceStatisticsCalculator,
  },
  {
    id: '489',
    path: 'trigonometry-calculator',
    nameKey: 'tools.trigonometryCalculator.name',
    descriptionKey: 'tools.trigonometryCalculator.description',
    category: '13-science',
    component: ScienceTrigonometryCalculator,
  },
  {
    id: '490',
    path: 'prime-number-checker',
    nameKey: 'tools.primeNumberChecker.name',
    descriptionKey: 'tools.primeNumberChecker.description',
    category: '13-science',
    component: SciencePrimeNumberChecker,
  },
  {
    id: '491',
    path: 'factor-calculator',
    nameKey: 'tools.factorCalculator.name',
    descriptionKey: 'tools.factorCalculator.description',
    category: '13-science',
    component: ScienceFactorCalculator,
  },
  {
    id: '492',
    path: 'gcd-lcm-calculator',
    nameKey: 'tools.gcdLcmCalculator.name',
    descriptionKey: 'tools.gcdLcmCalculator.description',
    category: '13-science',
    component: ScienceGcdLcmCalculator,
  },
  {
    id: '493',
    path: 'fraction-calculator',
    nameKey: 'tools.fractionCalculator.name',
    descriptionKey: 'tools.fractionCalculator.description',
    category: '13-science',
    component: ScienceFractionCalculator,
  },
  {
    id: '494',
    path: 'percentage-calculator',
    nameKey: 'tools.percentageCalculator.name',
    descriptionKey: 'tools.percentageCalculator.description',
    category: '13-science',
    component: SciencePercentageCalculator,
  },
  {
    id: '495',
    path: 'science-number-base-converter',
    nameKey: 'tools.scienceNumberBaseConverter.name',
    descriptionKey: 'tools.scienceNumberBaseConverter.description',
    category: '13-science',
    component: ScienceNumberBaseConverter,
  },
  {
    id: '496',
    path: 'binary-calculator',
    nameKey: 'tools.binaryCalculator.name',
    descriptionKey: 'tools.binaryCalculator.description',
    category: '13-science',
    component: ScienceBinaryCalculator,
  },
  {
    id: '497',
    path: 'hex-calculator',
    nameKey: 'tools.hexCalculator.name',
    descriptionKey: 'tools.hexCalculator.description',
    category: '13-science',
    component: ScienceHexCalculator,
  },
  {
    id: '498',
    path: 'chemical-formula-parser',
    nameKey: 'tools.chemicalFormulaParser.name',
    descriptionKey: 'tools.chemicalFormulaParser.description',
    category: '13-science',
    component: ScienceChemicalFormulaParser,
  },
  {
    id: '499',
    path: 'physics-calculator',
    nameKey: 'tools.physicsCalculator.name',
    descriptionKey: 'tools.physicsCalculator.description',
    category: '13-science',
    component: SciencePhysicsCalculator,
  },
  {
    id: '500',
    path: 'molarity-calculator',
    nameKey: 'tools.molarityCalculator.name',
    descriptionKey: 'tools.molarityCalculator.description',
    category: '13-science',
    component: ScienceMolarityCalculator,
  },
  {
    id: '501',
    path: 'geometry-calculator',
    nameKey: 'tools.geometryCalculator.name',
    descriptionKey: 'tools.geometryCalculator.description',
    category: '13-science',
    component: ScienceGeometryCalculator,
  },
  {
    id: '502',
    path: 'sequence-calculator',
    nameKey: 'tools.sequenceCalculator.name',
    descriptionKey: 'tools.sequenceCalculator.description',
    category: '13-science',
    component: ScienceSequenceCalculator,
  },
  {
    id: '503',
    path: 'logarithm-calculator',
    nameKey: 'tools.logarithmCalculator.name',
    descriptionKey: 'tools.logarithmCalculator.description',
    category: '13-science',
    component: ScienceLogarithmCalculator,
  },
  {
    id: '504',
    path: 'complex-number-calculator',
    nameKey: 'tools.complexNumberCalculator.name',
    descriptionKey: 'tools.complexNumberCalculator.description',
    category: '13-science',
    component: ScienceComplexNumberCalculator,
  },
  {
    id: '505',
    path: 'vector-calculator',
    nameKey: 'tools.vectorCalculator.name',
    descriptionKey: 'tools.vectorCalculator.description',
    category: '13-science',
    component: ScienceVectorCalculator,
  },
  {
    id: '506',
    path: 'derivative-calculator',
    nameKey: 'tools.derivativeCalculator.name',
    descriptionKey: 'tools.derivativeCalculator.description',
    category: '13-science',
    component: ScienceDerivativeCalculator,
  },
  {
    id: '507',
    path: 'integral-calculator',
    nameKey: 'tools.integralCalculator.name',
    descriptionKey: 'tools.integralCalculator.description',
    category: '13-science',
    component: ScienceIntegralCalculator,
  },
  {
    id: '508',
    path: 'probability-calculator',
    nameKey: 'tools.probabilityCalculator.name',
    descriptionKey: 'tools.probabilityCalculator.description',
    category: '13-science',
    component: ScienceProbabilityCalculator,
  },
  {
    id: '509',
    path: 'quadratic-solver',
    nameKey: 'tools.quadraticSolver.name',
    descriptionKey: 'tools.quadraticSolver.description',
    category: '13-science',
    component: ScienceQuadraticSolver,
  },
  {
    id: '510',
    path: 'polynomial-calculator',
    nameKey: 'tools.polynomialCalculator.name',
    descriptionKey: 'tools.polynomialCalculator.description',
    category: '13-science',
    component: SciencePolynomialCalculator,
  },
  {
    id: '511',
    path: 'astronomy-calculator',
    nameKey: 'tools.astronomyCalculator.name',
    descriptionKey: 'tools.astronomyCalculator.description',
    category: '13-science',
    component: ScienceAstronomyCalculator,
  },
  {
    id: '512',
    path: 'electrical-calculator',
    nameKey: 'tools.electricalCalculator.name',
    descriptionKey: 'tools.electricalCalculator.description',
    category: '13-science',
    component: ScienceElectricalCalculator,
  },
  {
    id: '513',
    path: 'temperature-converter',
    nameKey: 'tools.temperatureConverter.name',
    descriptionKey: 'tools.temperatureConverter.description',
    category: '13-science',
    component: ScienceTemperatureConverter,
  },
  {
    id: '514',
    path: 'speed-converter',
    nameKey: 'tools.speedConverter.name',
    descriptionKey: 'tools.speedConverter.description',
    category: '13-science',
    component: ScienceSpeedConverter,
  },
  {
    id: '515',
    path: 'data-storage-converter',
    nameKey: 'tools.dataStorageConverter.name',
    descriptionKey: 'tools.dataStorageConverter.description',
    category: '13-science',
    component: ScienceDataStorageConverter,
  },
  {
    id: '516',
    path: 'angle-converter',
    nameKey: 'tools.angleConverter.name',
    descriptionKey: 'tools.angleConverter.description',
    category: '13-science',
    component: ScienceAngleConverter,
  },
  {
    id: '517',
    path: 'time-converter',
    nameKey: 'tools.timeConverter.name',
    descriptionKey: 'tools.timeConverter.description',
    category: '13-science',
    component: ScienceTimeConverter,
  },
  {
    id: '518',
    path: 'force-converter',
    nameKey: 'tools.forceConverter.name',
    descriptionKey: 'tools.forceConverter.description',
    category: '13-science',
    component: ScienceForceConverter,
  },
  {
    id: '519',
    path: 'pressure-converter',
    nameKey: 'tools.pressureConverter.name',
    descriptionKey: 'tools.pressureConverter.description',
    category: '13-science',
    component: SciencePressureConverter,
  },
  {
    id: '520',
    path: 'energy-converter',
    nameKey: 'tools.energyConverter.name',
    descriptionKey: 'tools.energyConverter.description',
    category: '13-science',
    component: ScienceEnergyConverter,
  },
  {
    id: '521',
    path: 'power-converter',
    nameKey: 'tools.powerConverter.name',
    descriptionKey: 'tools.powerConverter.description',
    category: '13-science',
    component: SciencePowerConverter,
  },
  {
    id: '522',
    path: 'frequency-calculator',
    nameKey: 'tools.frequencyCalculator.name',
    descriptionKey: 'tools.frequencyCalculator.description',
    category: '13-science',
    component: ScienceFrequencyCalculator,
  },
  // Category 14: Games & Entertainment (#523-#562)
  {
    id: '523',
    path: 'dice-roller',
    nameKey: 'tools.diceRoller.name',
    descriptionKey: 'tools.diceRoller.description',
    category: '14-games',
    component: DiceRoller,
  },
  {
    id: '524',
    path: 'card-shuffler',
    nameKey: 'tools.cardShuffler.name',
    descriptionKey: 'tools.cardShuffler.description',
    category: '14-games',
    component: CardShuffler,
  },
  {
    id: '525',
    path: 'word-search-generator',
    nameKey: 'tools.wordSearchGenerator.name',
    descriptionKey: 'tools.wordSearchGenerator.description',
    category: '14-games',
    component: WordSearchGenerator,
  },
  {
    id: '526',
    path: 'sudoku-generator',
    nameKey: 'tools.sudokuGenerator.name',
    descriptionKey: 'tools.sudokuGenerator.description',
    category: '14-games',
    component: SudokuGenerator,
  },
  {
    id: '527',
    path: 'trivia-quiz',
    nameKey: 'tools.triviaQuiz.name',
    descriptionKey: 'tools.triviaQuiz.description',
    category: '14-games',
    component: TriviaQuiz,
  },
  {
    id: '528',
    path: 'rock-paper-scissors',
    nameKey: 'tools.rockPaperScissors.name',
    descriptionKey: 'tools.rockPaperScissors.description',
    category: '14-games',
    component: RockPaperScissors,
  },
  {
    id: '529',
    path: 'tic-tac-toe',
    nameKey: 'tools.ticTacToe.name',
    descriptionKey: 'tools.ticTacToe.description',
    category: '14-games',
    component: TicTacToe,
  },
  {
    id: '530',
    path: 'memory-match',
    nameKey: 'tools.memoryMatch.name',
    descriptionKey: 'tools.memoryMatch.description',
    category: '14-games',
    component: MemoryMatch,
  },
  {
    id: '531',
    path: 'hangman-game',
    nameKey: 'tools.hangmanGame.name',
    descriptionKey: 'tools.hangmanGame.description',
    category: '14-games',
    component: HangmanGame,
  },
  {
    id: '532',
    path: 'number-guessing-game',
    nameKey: 'tools.numberGuessingGame.name',
    descriptionKey: 'tools.numberGuessingGame.description',
    category: '14-games',
    component: NumberGuessingGame,
  },
  {
    id: '533',
    path: 'reaction-time-test',
    nameKey: 'tools.reactionTimeTest.name',
    descriptionKey: 'tools.reactionTimeTest.description',
    category: '14-games',
    component: ReactionTimeTest,
  },
  {
    id: '534',
    path: 'color-match-game',
    nameKey: 'tools.colorMatchGame.name',
    descriptionKey: 'tools.colorMatchGame.description',
    category: '14-games',
    component: ColorMatchGame,
  },
  {
    id: '535',
    path: 'word-scramble',
    nameKey: 'tools.wordScramble.name',
    descriptionKey: 'tools.wordScramble.description',
    category: '14-games',
    component: WordScramble,
  },
  {
    id: '536',
    path: 'typing-race-game',
    nameKey: 'tools.typingRaceGame.name',
    descriptionKey: 'tools.typingRaceGame.description',
    category: '14-games',
    component: TypingRaceGame,
  },
  {
    id: '537',
    path: 'math-quiz-game',
    nameKey: 'tools.mathQuizGame.name',
    descriptionKey: 'tools.mathQuizGame.description',
    category: '14-games',
    component: MathQuizGame,
  },
  {
    id: '538',
    path: 'puzzle-slider',
    nameKey: 'tools.puzzleSlider.name',
    descriptionKey: 'tools.puzzleSlider.description',
    category: '14-games',
    component: PuzzleSlider,
  },
  {
    id: '539',
    path: 'maze-generator',
    nameKey: 'tools.mazeGenerator.name',
    descriptionKey: 'tools.mazeGenerator.description',
    category: '14-games',
    component: MazeGenerator,
  },
  {
    id: '540',
    path: 'connect-four',
    nameKey: 'tools.connectFour.name',
    descriptionKey: 'tools.connectFour.description',
    category: '14-games',
    component: ConnectFour,
  },
  {
    id: '541',
    path: 'minesweeper',
    nameKey: 'tools.minesweeper.name',
    descriptionKey: 'tools.minesweeper.description',
    category: '14-games',
    component: Minesweeper,
  },
  {
    id: '542',
    path: 'game-2048',
    nameKey: 'tools.game2048.name',
    descriptionKey: 'tools.game2048.description',
    category: '14-games',
    component: Game2048,
  },
  {
    id: '543',
    path: 'whack-a-mole',
    nameKey: 'tools.whackAMole.name',
    descriptionKey: 'tools.whackAMole.description',
    category: '14-games',
    component: WhackAMole,
  },
  {
    id: '544',
    path: 'cookie-clicker',
    nameKey: 'tools.cookieClicker.name',
    descriptionKey: 'tools.cookieClicker.description',
    category: '14-games',
    component: CookieClicker,
  },
  {
    id: '545',
    path: 'emoji-puzzle',
    nameKey: 'tools.emojiPuzzle.name',
    descriptionKey: 'tools.emojiPuzzle.description',
    category: '14-games',
    component: EmojiPuzzle,
  },
  {
    id: '546',
    path: 'spot-difference',
    nameKey: 'tools.spotDifference.name',
    descriptionKey: 'tools.spotDifference.description',
    category: '14-games',
    component: SpotDifference,
  },
  {
    id: '547',
    path: 'quick-draw',
    nameKey: 'tools.quickDraw.name',
    descriptionKey: 'tools.quickDraw.description',
    category: '14-games',
    component: QuickDraw,
  },
  {
    id: '548',
    path: 'word-chain',
    nameKey: 'tools.wordChain.name',
    descriptionKey: 'tools.wordChain.description',
    category: '14-games',
    component: WordChain,
  },
  {
    id: '549',
    path: 'anagram-finder',
    nameKey: 'tools.anagramFinder.name',
    descriptionKey: 'tools.anagramFinder.description',
    category: '14-games',
    component: AnagramFinder,
  },
  {
    id: '550',
    path: 'pattern-memory',
    nameKey: 'tools.patternMemory.name',
    descriptionKey: 'tools.patternMemory.description',
    category: '14-games',
    component: PatternMemory,
  },
  {
    id: '551',
    path: 'speed-math',
    nameKey: 'tools.speedMath.name',
    descriptionKey: 'tools.speedMath.description',
    category: '14-games',
    component: SpeedMath,
  },
  {
    id: '552',
    path: 'flag-quiz',
    nameKey: 'tools.flagQuiz.name',
    descriptionKey: 'tools.flagQuiz.description',
    category: '14-games',
    component: FlagQuiz,
  },
  {
    id: '553',
    path: 'capital-quiz',
    nameKey: 'tools.capitalQuiz.name',
    descriptionKey: 'tools.capitalQuiz.description',
    category: '14-games',
    component: CapitalQuiz,
  },
  {
    id: '554',
    path: 'true-or-false',
    nameKey: 'tools.trueOrFalse.name',
    descriptionKey: 'tools.trueOrFalse.description',
    category: '14-games',
    component: TrueOrFalse,
  },
  {
    id: '555',
    path: 'brain-teaser',
    nameKey: 'tools.brainTeaser.name',
    descriptionKey: 'tools.brainTeaser.description',
    category: '14-games',
    component: BrainTeaser,
  },
  {
    id: '556',
    path: 'logo-quiz',
    nameKey: 'tools.logoQuiz.name',
    descriptionKey: 'tools.logoQuiz.description',
    category: '14-games',
    component: LogoQuiz,
  },
  {
    id: '557',
    path: 'sound-board',
    nameKey: 'tools.soundBoard.name',
    descriptionKey: 'tools.soundBoard.description',
    category: '14-games',
    component: SoundBoard,
  },
  {
    id: '558',
    path: 'story-generator',
    nameKey: 'tools.storyGenerator.name',
    descriptionKey: 'tools.storyGenerator.description',
    category: '14-games',
    component: StoryGenerator,
  },
  {
    id: '559',
    path: 'character-creator',
    nameKey: 'tools.characterCreator.name',
    descriptionKey: 'tools.characterCreator.description',
    category: '14-games',
    component: CharacterCreator,
  },
  {
    id: '560',
    path: 'name-generator',
    nameKey: 'tools.nameGenerator.name',
    descriptionKey: 'tools.nameGenerator.description',
    category: '14-games',
    component: NameGenerator,
  },
  {
    id: '561',
    path: 'mad-libs',
    nameKey: 'tools.madLibs.name',
    descriptionKey: 'tools.madLibs.description',
    category: '14-games',
    component: MadLibs,
  },
  {
    id: '562',
    path: 'fortune-wheel',
    nameKey: 'tools.fortuneWheel.name',
    descriptionKey: 'tools.fortuneWheel.description',
    category: '14-games',
    component: FortuneWheel,
  },
  // Category 15: Art & Design (#563-#602)
  {
    id: '563',
    path: 'color-palette-generator',
    nameKey: 'tools.colorPaletteGenerator.name',
    descriptionKey: 'tools.colorPaletteGenerator.description',
    category: '15-art',
    component: ArtColorPaletteGenerator,
  },
  {
    id: '564',
    path: 'gradient-generator',
    nameKey: 'tools.gradientGenerator.name',
    descriptionKey: 'tools.gradientGenerator.description',
    category: '15-art',
    component: ArtGradientGenerator,
  },
  {
    id: '565',
    path: 'pattern-maker',
    nameKey: 'tools.patternMaker.name',
    descriptionKey: 'tools.patternMaker.description',
    category: '15-art',
    component: PatternMaker,
  },
  {
    id: '566',
    path: 'pixel-art-maker',
    nameKey: 'tools.pixelArtMaker.name',
    descriptionKey: 'tools.pixelArtMaker.description',
    category: '15-art',
    component: PixelArtMaker,
  },
  {
    id: '567',
    path: 'icon-generator',
    nameKey: 'tools.iconGenerator.name',
    descriptionKey: 'tools.iconGenerator.description',
    category: '15-art',
    component: IconGenerator,
  },
  {
    id: '568',
    path: 'logo-maker',
    nameKey: 'tools.logoMaker.name',
    descriptionKey: 'tools.logoMaker.description',
    category: '15-art',
    component: LogoMaker,
  },
  {
    id: '569',
    path: 'banner-creator',
    nameKey: 'tools.bannerCreator.name',
    descriptionKey: 'tools.bannerCreator.description',
    category: '15-art',
    component: BannerCreator,
  },
  {
    id: '570',
    path: 'favicon-generator',
    nameKey: 'tools.faviconGenerator.name',
    descriptionKey: 'tools.faviconGenerator.description',
    category: '15-art',
    component: ArtFaviconGenerator,
  },
  {
    id: '571',
    path: 'mockup-generator',
    nameKey: 'tools.mockupGenerator.name',
    descriptionKey: 'tools.mockupGenerator.description',
    category: '15-art',
    component: MockupGenerator,
  },
  {
    id: '572',
    path: 'color-blind-simulator',
    nameKey: 'tools.colorBlindSimulator.name',
    descriptionKey: 'tools.colorBlindSimulator.description',
    category: '15-art',
    component: ColorBlindSimulator,
  },
  {
    id: '573',
    path: 'image-filters',
    nameKey: 'tools.imageFilters.name',
    descriptionKey: 'tools.imageFilters.description',
    category: '15-art',
    component: ImageFilters,
  },
  {
    id: '574',
    path: 'texture-maker',
    nameKey: 'tools.textureMaker.name',
    descriptionKey: 'tools.textureMaker.description',
    category: '15-art',
    component: TextureMaker,
  },
  {
    id: '575',
    path: 'shape-generator',
    nameKey: 'tools.shapeGenerator.name',
    descriptionKey: 'tools.shapeGenerator.description',
    category: '15-art',
    component: ShapeGenerator,
  },
  {
    id: '576',
    path: 'watermark-maker',
    nameKey: 'tools.watermarkMaker.name',
    descriptionKey: 'tools.watermarkMaker.description',
    category: '15-art',
    component: WatermarkMaker,
  },
  {
    id: '577',
    path: 'collage-creator',
    nameKey: 'tools.collageCreator.name',
    descriptionKey: 'tools.collageCreator.description',
    category: '15-art',
    component: CollageCreator,
  },
  {
    id: '578',
    path: 'meme-generator',
    nameKey: 'tools.memeGenerator.name',
    descriptionKey: 'tools.memeGenerator.description',
    category: '15-art',
    component: MemeGenerator,
  },
  {
    id: '579',
    path: 'avatar-creator',
    nameKey: 'tools.avatarCreator.name',
    descriptionKey: 'tools.avatarCreator.description',
    category: '15-art',
    component: AvatarCreator,
  },
  {
    id: '580',
    path: 'badge-maker',
    nameKey: 'tools.badgeMaker.name',
    descriptionKey: 'tools.badgeMaker.description',
    category: '15-art',
    component: BadgeMaker,
  },
  {
    id: '581',
    path: 'certificate-maker',
    nameKey: 'tools.certificateMaker.name',
    descriptionKey: 'tools.certificateMaker.description',
    category: '15-art',
    component: CertificateMaker,
  },
  {
    id: '582',
    path: 'business-card-designer',
    nameKey: 'tools.businessCardDesigner.name',
    descriptionKey: 'tools.businessCardDesigner.description',
    category: '15-art',
    component: BusinessCardDesigner,
  },
  {
    id: '583',
    path: 'poster-maker',
    nameKey: 'tools.posterMaker.name',
    descriptionKey: 'tools.posterMaker.description',
    category: '15-art',
    component: PosterMaker,
  },
  {
    id: '584',
    path: 'chart-maker',
    nameKey: 'tools.chartMaker.name',
    descriptionKey: 'tools.chartMaker.description',
    category: '15-art',
    component: ChartMaker,
  },
  {
    id: '585',
    path: 'flowchart-maker',
    nameKey: 'tools.flowchartMaker.name',
    descriptionKey: 'tools.flowchartMaker.description',
    category: '15-art',
    component: FlowchartMaker,
  },
  {
    id: '586',
    path: 'mindmap-builder',
    nameKey: 'tools.mindmapBuilder.name',
    descriptionKey: 'tools.mindmapBuilder.description',
    category: '15-art',
    component: MindmapBuilder,
  },
  {
    id: '587',
    path: 'color-mixer',
    nameKey: 'tools.colorMixer.name',
    descriptionKey: 'tools.colorMixer.description',
    category: '15-art',
    component: ColorMixer,
  },
  {
    id: '588',
    path: 'palette-extractor',
    nameKey: 'tools.paletteExtractor.name',
    descriptionKey: 'tools.paletteExtractor.description',
    category: '15-art',
    component: PaletteExtractor,
  },
  {
    id: '589',
    path: 'color-harmony',
    nameKey: 'tools.colorHarmony.name',
    descriptionKey: 'tools.colorHarmony.description',
    category: '15-art',
    component: ColorHarmony,
  },
  {
    id: '590',
    path: 'contrast-checker',
    nameKey: 'tools.contrastChecker.name',
    descriptionKey: 'tools.contrastChecker.description',
    category: '15-art',
    component: ContrastChecker,
  },
  {
    id: '591',
    path: 'shadow-generator',
    nameKey: 'tools.shadowGenerator.name',
    descriptionKey: 'tools.shadowGenerator.description',
    category: '15-art',
    component: ShadowGenerator,
  },
  {
    id: '592',
    path: 'border-generator',
    nameKey: 'tools.borderGenerator.name',
    descriptionKey: 'tools.borderGenerator.description',
    category: '15-art',
    component: BorderGenerator,
  },
  {
    id: '593',
    path: 'divider-maker',
    nameKey: 'tools.dividerMaker.name',
    descriptionKey: 'tools.dividerMaker.description',
    category: '15-art',
    component: DividerMaker,
  },
  {
    id: '594',
    path: 'emoji-art',
    nameKey: 'tools.emojiArt.name',
    descriptionKey: 'tools.emojiArt.description',
    category: '15-art',
    component: EmojiArt,
  },
  {
    id: '595',
    path: 'ascii-art-generator',
    nameKey: 'tools.asciiArtGenerator.name',
    descriptionKey: 'tools.asciiArtGenerator.description',
    category: '15-art',
    component: ASCIIArtGenerator,
  },
  {
    id: '596',
    path: 'typography-tool',
    nameKey: 'tools.typographyTool.name',
    descriptionKey: 'tools.typographyTool.description',
    category: '15-art',
    component: TypographyTool,
  },
  {
    id: '597',
    path: 'font-pairer',
    nameKey: 'tools.fontPairer.name',
    descriptionKey: 'tools.fontPairer.description',
    category: '15-art',
    component: FontPairer,
  },
  {
    id: '598',
    path: 'design-inspiration',
    nameKey: 'tools.designInspiration.name',
    descriptionKey: 'tools.designInspiration.description',
    category: '15-art',
    component: DesignInspiration,
  },
  {
    id: '599',
    path: 'color-converter',
    nameKey: 'tools.colorConverter.name',
    descriptionKey: 'tools.colorConverter.description',
    category: '15-art',
    component: ArtColorConverter,
  },
  {
    id: '600',
    path: 'image-cropper',
    nameKey: 'tools.imageCropper.name',
    descriptionKey: 'tools.imageCropper.description',
    category: '15-art',
    component: ArtImageCropper,
  },
  {
    id: '601',
    path: 'thumbnail-maker',
    nameKey: 'tools.thumbnailMaker.name',
    descriptionKey: 'tools.thumbnailMaker.description',
    category: '15-art',
    component: ThumbnailMaker,
  },
  {
    id: '602',
    path: 'social-media-image-creator',
    nameKey: 'tools.socialMediaImageCreator.name',
    descriptionKey: 'tools.socialMediaImageCreator.description',
    category: '15-art',
    component: SocialMediaImageCreator,
  },
  // Category 16: Communication & Collaboration (#603-#642)
  {
    id: '603',
    path: 'team-message-formatter',
    nameKey: 'tools.teamMessageFormatter.name',
    descriptionKey: 'tools.teamMessageFormatter.description',
    category: '16-communication',
    component: TeamMessageFormatter,
  },
  {
    id: '604',
    path: 'meeting-scheduler',
    nameKey: 'tools.meetingScheduler.name',
    descriptionKey: 'tools.meetingScheduler.description',
    category: '16-communication',
    component: MeetingScheduler,
  },
  {
    id: '605',
    path: 'email-template-builder',
    nameKey: 'tools.emailTemplateBuilder.name',
    descriptionKey: 'tools.emailTemplateBuilder.description',
    category: '16-communication',
    component: EmailTemplateBuilder,
  },
  {
    id: '606',
    path: 'group-name-generator',
    nameKey: 'tools.groupNameGenerator.name',
    descriptionKey: 'tools.groupNameGenerator.description',
    category: '16-communication',
    component: GroupNameGenerator,
  },
  {
    id: '607',
    path: 'announcement-maker',
    nameKey: 'tools.announcementMaker.name',
    descriptionKey: 'tools.announcementMaker.description',
    category: '16-communication',
    component: AnnouncementMaker,
  },
  {
    id: '608',
    path: 'slack-message-formatter',
    nameKey: 'tools.slackMessageFormatter.name',
    descriptionKey: 'tools.slackMessageFormatter.description',
    category: '16-communication',
    component: SlackMessageFormatter,
  },
  {
    id: '609',
    path: 'discord-embed-generator',
    nameKey: 'tools.discordEmbedGenerator.name',
    descriptionKey: 'tools.discordEmbedGenerator.description',
    category: '16-communication',
    component: DiscordEmbedGenerator,
  },
  {
    id: '610',
    path: 'agenda-creator',
    nameKey: 'tools.agendaCreator.name',
    descriptionKey: 'tools.agendaCreator.description',
    category: '16-communication',
    component: AgendaCreator,
  },
  {
    id: '611',
    path: 'meeting-minutes',
    nameKey: 'tools.meetingMinutes.name',
    descriptionKey: 'tools.meetingMinutes.description',
    category: '16-communication',
    component: MeetingMinutes,
  },
  {
    id: '612',
    path: 'poll-maker',
    nameKey: 'tools.pollMaker.name',
    descriptionKey: 'tools.pollMaker.description',
    category: '16-communication',
    component: PollMaker,
  },
  {
    id: '613',
    path: 'icebreaker-generator',
    nameKey: 'tools.icebreakerGenerator.name',
    descriptionKey: 'tools.icebreakerGenerator.description',
    category: '16-communication',
    component: IcebreakerGenerator,
  },
  {
    id: '614',
    path: 'standup-formatter',
    nameKey: 'tools.standupFormatter.name',
    descriptionKey: 'tools.standupFormatter.description',
    category: '16-communication',
    component: StandupFormatter,
  },
  {
    id: '615',
    path: 'retrospective-template',
    nameKey: 'tools.retrospectiveTemplate.name',
    descriptionKey: 'tools.retrospectiveTemplate.description',
    category: '16-communication',
    component: RetrospectiveTemplate,
  },
  {
    id: '616',
    path: 'feedback-form-builder',
    nameKey: 'tools.feedbackFormBuilder.name',
    descriptionKey: 'tools.feedbackFormBuilder.description',
    category: '16-communication',
    component: FeedbackFormBuilder,
  },
  {
    id: '617',
    path: 'team-directory',
    nameKey: 'tools.teamDirectory.name',
    descriptionKey: 'tools.teamDirectory.description',
    category: '16-communication',
    component: TeamDirectory,
  },
  {
    id: '618',
    path: 'onboarding-checklist',
    nameKey: 'tools.onboardingChecklist.name',
    descriptionKey: 'tools.onboardingChecklist.description',
    category: '16-communication',
    component: OnboardingChecklist,
  },
  {
    id: '619',
    path: 'one-on-one-agenda',
    nameKey: 'tools.oneOnOneAgenda.name',
    descriptionKey: 'tools.oneOnOneAgenda.description',
    category: '16-communication',
    component: OneOnOneAgenda,
  },
  {
    id: '620',
    path: 'status-update-formatter',
    nameKey: 'tools.statusUpdateFormatter.name',
    descriptionKey: 'tools.statusUpdateFormatter.description',
    category: '16-communication',
    component: StatusUpdateFormatter,
  },
  {
    id: '621',
    path: 'task-delegator',
    nameKey: 'tools.taskDelegator.name',
    descriptionKey: 'tools.taskDelegator.description',
    category: '16-communication',
    component: TaskDelegator,
  },
  {
    id: '622',
    path: 'team-role-assigner',
    nameKey: 'tools.teamRoleAssigner.name',
    descriptionKey: 'tools.teamRoleAssigner.description',
    category: '16-communication',
    component: TeamRoleAssigner,
  },
  {
    id: '623',
    path: 'decision-matrix',
    nameKey: 'tools.decisionMatrix.name',
    descriptionKey: 'tools.decisionMatrix.description',
    category: '16-communication',
    component: CommDecisionMatrix,
  },
  {
    id: '624',
    path: 'brainstorm-board',
    nameKey: 'tools.brainstormBoard.name',
    descriptionKey: 'tools.brainstormBoard.description',
    category: '16-communication',
    component: BrainstormBoard,
  },
  {
    id: '625',
    path: 'project-timeline',
    nameKey: 'tools.projectTimeline.name',
    descriptionKey: 'tools.projectTimeline.description',
    category: '16-communication',
    component: CommProjectTimeline,
  },
  {
    id: '626',
    path: 'milestone-tracker',
    nameKey: 'tools.milestoneTracker.name',
    descriptionKey: 'tools.milestoneTracker.description',
    category: '16-communication',
    component: MilestoneTracker,
  },
  {
    id: '627',
    path: 'resource-planner',
    nameKey: 'tools.resourcePlanner.name',
    descriptionKey: 'tools.resourcePlanner.description',
    category: '16-communication',
    component: ResourcePlanner,
  },
  {
    id: '628',
    path: 'workload-balancer',
    nameKey: 'tools.workloadBalancer.name',
    descriptionKey: 'tools.workloadBalancer.description',
    category: '16-communication',
    component: WorkloadBalancer,
  },
  {
    id: '629',
    path: 'communication-log',
    nameKey: 'tools.communicationLog.name',
    descriptionKey: 'tools.communicationLog.description',
    category: '16-communication',
    component: CommunicationLog,
  },
  {
    id: '630',
    path: 'escalation-path',
    nameKey: 'tools.escalationPath.name',
    descriptionKey: 'tools.escalationPath.description',
    category: '16-communication',
    component: EscalationPath,
  },
  {
    id: '631',
    path: 'org-chart-maker',
    nameKey: 'tools.orgChartMaker.name',
    descriptionKey: 'tools.orgChartMaker.description',
    category: '16-communication',
    component: OrgChartMaker,
  },
  {
    id: '632',
    path: 'exit-interview-template',
    nameKey: 'tools.exitInterviewTemplate.name',
    descriptionKey: 'tools.exitInterviewTemplate.description',
    category: '16-communication',
    component: ExitInterviewTemplate,
  },
  {
    id: '633',
    path: 'performance-review-template',
    nameKey: 'tools.performanceReviewTemplate.name',
    descriptionKey: 'tools.performanceReviewTemplate.description',
    category: '16-communication',
    component: PerformanceReviewTemplate,
  },
  {
    id: '634',
    path: 'meeting-cost-calculator',
    nameKey: 'tools.meetingCostCalculator.name',
    descriptionKey: 'tools.meetingCostCalculator.description',
    category: '16-communication',
    component: MeetingCostCalculator,
  },
  {
    id: '635',
    path: 'team-health-check',
    nameKey: 'tools.teamHealthCheck.name',
    descriptionKey: 'tools.teamHealthCheck.description',
    category: '16-communication',
    component: TeamHealthCheck,
  },
  {
    id: '636',
    path: 'raci-matrix',
    nameKey: 'tools.raciMatrix.name',
    descriptionKey: 'tools.raciMatrix.description',
    category: '16-communication',
    component: RACIMatrix,
  },
  {
    id: '637',
    path: 'knowledge-base-builder',
    nameKey: 'tools.knowledgeBaseBuilder.name',
    descriptionKey: 'tools.knowledgeBaseBuilder.description',
    category: '16-communication',
    component: KnowledgeBaseBuilder,
  },
  {
    id: '638',
    path: 'changelog-generator',
    nameKey: 'tools.changelogGenerator.name',
    descriptionKey: 'tools.changelogGenerator.description',
    category: '16-communication',
    component: ChangelogGenerator,
  },
  {
    id: '639',
    path: 'release-notes-builder',
    nameKey: 'tools.releaseNotesBuilder.name',
    descriptionKey: 'tools.releaseNotesBuilder.description',
    category: '16-communication',
    component: ReleaseNotesBuilder,
  },
  {
    id: '640',
    path: 'sop-builder',
    nameKey: 'tools.sopBuilder.name',
    descriptionKey: 'tools.sopBuilder.description',
    category: '16-communication',
    component: SOPBuilder,
  },
  {
    id: '641',
    path: 'process-flow-maker',
    nameKey: 'tools.processFlowMaker.name',
    descriptionKey: 'tools.processFlowMaker.description',
    category: '16-communication',
    component: ProcessFlowMaker,
  },
  {
    id: '642',
    path: 'team-capacity-planner',
    nameKey: 'tools.teamCapacityPlanner.name',
    descriptionKey: 'tools.teamCapacityPlanner.description',
    category: '16-communication',
    component: TeamCapacityPlanner,
  },
  // Category 17: Security & Privacy (#643-#682)
  {
    id: '643',
    path: 'password-generator-security',
    nameKey: 'tools.passwordGeneratorSecurity.name',
    descriptionKey: 'tools.passwordGeneratorSecurity.description',
    category: '17-security',
    component: PasswordGeneratorSecurity,
  },
  {
    id: '644',
    path: 'password-strength-checker',
    nameKey: 'tools.passwordStrengthChecker.name',
    descriptionKey: 'tools.passwordStrengthChecker.description',
    category: '17-security',
    component: PasswordStrengthChecker,
  },
  {
    id: '645',
    path: 'hash-generator-security',
    nameKey: 'tools.hashGeneratorSecurity.name',
    descriptionKey: 'tools.hashGeneratorSecurity.description',
    category: '17-security',
    component: HashGeneratorSecurity,
  },
  {
    id: '646',
    path: 'text-encryptor',
    nameKey: 'tools.textEncryptor.name',
    descriptionKey: 'tools.textEncryptor.description',
    category: '17-security',
    component: TextEncryptor,
  },
  {
    id: '647',
    path: 'two-factor-setup',
    nameKey: 'tools.twoFactorSetup.name',
    descriptionKey: 'tools.twoFactorSetup.description',
    category: '17-security',
    component: TwoFactorSetup,
  },
  {
    id: '648',
    path: 'secure-notepad',
    nameKey: 'tools.secureNotepad.name',
    descriptionKey: 'tools.secureNotepad.description',
    category: '17-security',
    component: SecureNotepad,
  },
  {
    id: '649',
    path: 'privacy-policy-generator',
    nameKey: 'tools.privacyPolicyGenerator.name',
    descriptionKey: 'tools.privacyPolicyGenerator.description',
    category: '17-security',
    component: PrivacyPolicyGenerator,
  },
  {
    id: '650',
    path: 'cookie-consent-builder',
    nameKey: 'tools.cookieConsentBuilder.name',
    descriptionKey: 'tools.cookieConsentBuilder.description',
    category: '17-security',
    component: CookieConsentBuilder,
  },
  {
    id: '651',
    path: 'data-breach-checker',
    nameKey: 'tools.dataBreachChecker.name',
    descriptionKey: 'tools.dataBreachChecker.description',
    category: '17-security',
    component: DataBreachChecker,
  },
  {
    id: '652',
    path: 'permission-analyzer',
    nameKey: 'tools.permissionAnalyzer.name',
    descriptionKey: 'tools.permissionAnalyzer.description',
    category: '17-security',
    component: PermissionAnalyzer,
  },
  {
    id: '653',
    path: 'security-headers-checker',
    nameKey: 'tools.securityHeadersChecker.name',
    descriptionKey: 'tools.securityHeadersChecker.description',
    category: '17-security',
    component: SecurityHeadersChecker,
  },
  {
    id: '654',
    path: 'ssl-certificate-info',
    nameKey: 'tools.sslCertificateInfo.name',
    descriptionKey: 'tools.sslCertificateInfo.description',
    category: '17-security',
    component: SSLCertificateInfo,
  },
  {
    id: '655',
    path: 'key-pair-generator',
    nameKey: 'tools.keyPairGenerator.name',
    descriptionKey: 'tools.keyPairGenerator.description',
    category: '17-security',
    component: KeyPairGenerator,
  },
  {
    id: '656',
    path: 'secret-sharing',
    nameKey: 'tools.secretSharing.name',
    descriptionKey: 'tools.secretSharing.description',
    category: '17-security',
    component: SecretSharing,
  },
  {
    id: '657',
    path: 'file-hash-checker',
    nameKey: 'tools.fileHashChecker.name',
    descriptionKey: 'tools.fileHashChecker.description',
    category: '17-security',
    component: FileHashChecker,
  },
  {
    id: '658',
    path: 'metadata-stripper',
    nameKey: 'tools.metadataStripper.name',
    descriptionKey: 'tools.metadataStripper.description',
    category: '17-security',
    component: MetadataStripper,
  },
  {
    id: '659',
    path: 'anonymous-id-generator',
    nameKey: 'tools.anonymousIdGenerator.name',
    descriptionKey: 'tools.anonymousIdGenerator.description',
    category: '17-security',
    component: AnonymousIdGenerator,
  },
  {
    id: '660',
    path: 'privacy-settings-audit',
    nameKey: 'tools.privacySettingsAudit.name',
    descriptionKey: 'tools.privacySettingsAudit.description',
    category: '17-security',
    component: PrivacySettingsAudit,
  },
  {
    id: '661',
    path: 'secure-password-share',
    nameKey: 'tools.securePasswordShare.name',
    descriptionKey: 'tools.securePasswordShare.description',
    category: '17-security',
    component: SecurePasswordShare,
  },
  {
    id: '662',
    path: 'access-control-matrix',
    nameKey: 'tools.accessControlMatrix.name',
    descriptionKey: 'tools.accessControlMatrix.description',
    category: '17-security',
    component: AccessControlMatrix,
  },
  {
    id: '663',
    path: 'risk-assessment-tool',
    nameKey: 'tools.riskAssessmentTool.name',
    descriptionKey: 'tools.riskAssessmentTool.description',
    category: '17-security',
    component: RiskAssessmentTool,
  },
  {
    id: '664',
    path: 'incident-response-plan',
    nameKey: 'tools.incidentResponsePlan.name',
    descriptionKey: 'tools.incidentResponsePlan.description',
    category: '17-security',
    component: IncidentResponsePlan,
  },
  {
    id: '665',
    path: 'security-checklist',
    nameKey: 'tools.securityChecklist.name',
    descriptionKey: 'tools.securityChecklist.description',
    category: '17-security',
    component: SecurityChecklist,
  },
  {
    id: '666',
    path: 'phishing-detector',
    nameKey: 'tools.phishingDetector.name',
    descriptionKey: 'tools.phishingDetector.description',
    category: '17-security',
    component: PhishingDetector,
  },
  {
    id: '667',
    path: 'data-classifier',
    nameKey: 'tools.dataClassifier.name',
    descriptionKey: 'tools.dataClassifier.description',
    category: '17-security',
    component: DataClassifier,
  },
  {
    id: '668',
    path: 'encryption-key-manager',
    nameKey: 'tools.encryptionKeyManager.name',
    descriptionKey: 'tools.encryptionKeyManager.description',
    category: '17-security',
    component: EncryptionKeyManager,
  },
  {
    id: '669',
    path: 'secure-file-namer',
    nameKey: 'tools.secureFileNamer.name',
    descriptionKey: 'tools.secureFileNamer.description',
    category: '17-security',
    component: SecureFileNamer,
  },
  {
    id: '670',
    path: 'privacy-impact-assessment',
    nameKey: 'tools.privacyImpactAssessment.name',
    descriptionKey: 'tools.privacyImpactAssessment.description',
    category: '17-security',
    component: PrivacyImpactAssessment,
  },
  {
    id: '671',
    path: 'consent-manager',
    nameKey: 'tools.consentManager.name',
    descriptionKey: 'tools.consentManager.description',
    category: '17-security',
    component: ConsentManager,
  },
  {
    id: '672',
    path: 'data-retention-policy',
    nameKey: 'tools.dataRetentionPolicy.name',
    descriptionKey: 'tools.dataRetentionPolicy.description',
    category: '17-security',
    component: DataRetentionPolicy,
  },
  {
    id: '673',
    path: 'security-awareness-quiz',
    nameKey: 'tools.securityAwarenessQuiz.name',
    descriptionKey: 'tools.securityAwarenessQuiz.description',
    category: '17-security',
    component: SecurityAwarenessQuiz,
  },
  {
    id: '674',
    path: 'threat-model-builder',
    nameKey: 'tools.threatModelBuilder.name',
    descriptionKey: 'tools.threatModelBuilder.description',
    category: '17-security',
    component: ThreatModelBuilder,
  },
  {
    id: '675',
    path: 'security-policy-generator',
    nameKey: 'tools.securityPolicyGenerator.name',
    descriptionKey: 'tools.securityPolicyGenerator.description',
    category: '17-security',
    component: SecurityPolicyGenerator,
  },
  {
    id: '676',
    path: 'compliance-checker',
    nameKey: 'tools.complianceChecker.name',
    descriptionKey: 'tools.complianceChecker.description',
    category: '17-security',
    component: ComplianceChecker,
  },
  {
    id: '677',
    path: 'audit-log-viewer',
    nameKey: 'tools.auditLogViewer.name',
    descriptionKey: 'tools.auditLogViewer.description',
    category: '17-security',
    component: AuditLogViewer,
  },
  {
    id: '678',
    path: 'access-review-tool',
    nameKey: 'tools.accessReviewTool.name',
    descriptionKey: 'tools.accessReviewTool.description',
    category: '17-security',
    component: AccessReviewTool,
  },
  {
    id: '679',
    path: 'security-scorecard',
    nameKey: 'tools.securityScorecard.name',
    descriptionKey: 'tools.securityScorecard.description',
    category: '17-security',
    component: SecurityScorecard,
  },
  {
    id: '680',
    path: 'vulnerability-tracker',
    nameKey: 'tools.vulnerabilityTracker.name',
    descriptionKey: 'tools.vulnerabilityTracker.description',
    category: '17-security',
    component: VulnerabilityTracker,
  },
  {
    id: '681',
    path: 'secure-code-review',
    nameKey: 'tools.secureCodeReview.name',
    descriptionKey: 'tools.secureCodeReview.description',
    category: '17-security',
    component: SecureCodeReview,
  },
  {
    id: '682',
    path: 'biometric-auth-guide',
    nameKey: 'tools.biometricAuthGuide.name',
    descriptionKey: 'tools.biometricAuthGuide.description',
    category: '17-security',
    component: BiometricAuthGuide,
  },
  // Category 18: Business & Marketing (#683-#722)
  {
    id: '683',
    path: 'business-name-generator',
    nameKey: 'tools.businessNameGenerator.name',
    descriptionKey: 'tools.businessNameGenerator.description',
    category: '18-business',
    component: BusinessNameGenerator,
  },
  {
    id: '684',
    path: 'slogan-generator',
    nameKey: 'tools.sloganGenerator.name',
    descriptionKey: 'tools.sloganGenerator.description',
    category: '18-business',
    component: SloganGenerator,
  },
  {
    id: '685',
    path: 'pitch-deck-outline',
    nameKey: 'tools.pitchDeckOutline.name',
    descriptionKey: 'tools.pitchDeckOutline.description',
    category: '18-business',
    component: PitchDeckOutline,
  },
  {
    id: '686',
    path: 'swot-analysis',
    nameKey: 'tools.swotAnalysis.name',
    descriptionKey: 'tools.swotAnalysis.description',
    category: '18-business',
    component: SWOTAnalysis,
  },
  {
    id: '687',
    path: 'competitor-analysis',
    nameKey: 'tools.competitorAnalysis.name',
    descriptionKey: 'tools.competitorAnalysis.description',
    category: '18-business',
    component: CompetitorAnalysis,
  },
  {
    id: '688',
    path: 'value-proposition',
    nameKey: 'tools.valueProposition.name',
    descriptionKey: 'tools.valueProposition.description',
    category: '18-business',
    component: ValueProposition,
  },
  {
    id: '689',
    path: 'elevator-pitch',
    nameKey: 'tools.elevatorPitch.name',
    descriptionKey: 'tools.elevatorPitch.description',
    category: '18-business',
    component: ElevatorPitch,
  },
  {
    id: '690',
    path: 'customer-persona',
    nameKey: 'tools.customerPersona.name',
    descriptionKey: 'tools.customerPersona.description',
    category: '18-business',
    component: CustomerPersona,
  },
  {
    id: '691',
    path: 'pricing-calculator',
    nameKey: 'tools.pricingCalculator.name',
    descriptionKey: 'tools.pricingCalculator.description',
    category: '18-business',
    component: PricingCalculator,
  },
  {
    id: '692',
    path: 'market-size-calculator',
    nameKey: 'tools.marketSizeCalculator.name',
    descriptionKey: 'tools.marketSizeCalculator.description',
    category: '18-business',
    component: MarketSizeCalculator,
  },
  {
    id: '693',
    path: 'break-even-calculator',
    nameKey: 'tools.breakEvenCalculator.name',
    descriptionKey: 'tools.breakEvenCalculator.description',
    category: '18-business',
    component: BizBreakEvenCalculator,
  },
  {
    id: '694',
    path: 'roi-calculator',
    nameKey: 'tools.roiCalculator.name',
    descriptionKey: 'tools.roiCalculator.description',
    category: '18-business',
    component: ROICalculator,
  },
  {
    id: '695',
    path: 'social-media-planner',
    nameKey: 'tools.socialMediaPlanner.name',
    descriptionKey: 'tools.socialMediaPlanner.description',
    category: '18-business',
    component: SocialMediaPlanner,
  },
  {
    id: '696',
    path: 'email-signature-generator',
    nameKey: 'tools.emailSignatureGenerator.name',
    descriptionKey: 'tools.emailSignatureGenerator.description',
    category: '18-business',
    component: BizEmailSignatureGenerator,
  },
  {
    id: '697',
    path: 'invoice-generator',
    nameKey: 'tools.invoiceGenerator.name',
    descriptionKey: 'tools.invoiceGenerator.description',
    category: '18-business',
    component: BizInvoiceGenerator,
  },
  {
    id: '698',
    path: 'proposal-template',
    nameKey: 'tools.proposalTemplate.name',
    descriptionKey: 'tools.proposalTemplate.description',
    category: '18-business',
    component: ProposalTemplate,
  },
  {
    id: '699',
    path: 'contract-template',
    nameKey: 'tools.contractTemplate.name',
    descriptionKey: 'tools.contractTemplate.description',
    category: '18-business',
    component: BizContractTemplate,
  },
  {
    id: '700',
    path: 'branding-kit',
    nameKey: 'tools.brandingKit.name',
    descriptionKey: 'tools.brandingKit.description',
    category: '18-business',
    component: BrandingKit,
  },
  {
    id: '701',
    path: 'meeting-agenda',
    nameKey: 'tools.meetingAgenda.name',
    descriptionKey: 'tools.meetingAgenda.description',
    category: '18-business',
    component: MeetingAgenda,
  },
  {
    id: '702',
    path: 'project-timeline',
    nameKey: 'tools.projectTimeline.name',
    descriptionKey: 'tools.projectTimeline.description',
    category: '18-business',
    component: BizProjectTimeline,
  },
  {
    id: '703',
    path: 'okr-tracker',
    nameKey: 'tools.okrTracker.name',
    descriptionKey: 'tools.okrTracker.description',
    category: '18-business',
    component: OKRTracker,
  },
  {
    id: '704',
    path: 'kpi-dashboard',
    nameKey: 'tools.kpiDashboard.name',
    descriptionKey: 'tools.kpiDashboard.description',
    category: '18-business',
    component: KPIDashboard,
  },
  {
    id: '705',
    path: 'budget-planner',
    nameKey: 'tools.budgetPlanner.name',
    descriptionKey: 'tools.budgetPlanner.description',
    category: '18-business',
    component: BizBudgetPlanner,
  },
  {
    id: '706',
    path: 'cash-flow-tracker',
    nameKey: 'tools.cashFlowTracker.name',
    descriptionKey: 'tools.cashFlowTracker.description',
    category: '18-business',
    component: CashFlowTracker,
  },
  {
    id: '707',
    path: 'profit-margin-calculator',
    nameKey: 'tools.profitMarginCalculator.name',
    descriptionKey: 'tools.profitMarginCalculator.description',
    category: '18-business',
    component: BizProfitMarginCalculator,
  },
  {
    id: '708',
    path: 'sales-forecaster',
    nameKey: 'tools.salesForecaster.name',
    descriptionKey: 'tools.salesForecaster.description',
    category: '18-business',
    component: SalesForecaster,
  },
  {
    id: '709',
    path: 'lead-scoring',
    nameKey: 'tools.leadScoring.name',
    descriptionKey: 'tools.leadScoring.description',
    category: '18-business',
    component: LeadScoring,
  },
  {
    id: '710',
    path: 'email-campaign',
    nameKey: 'tools.emailCampaign.name',
    descriptionKey: 'tools.emailCampaign.description',
    category: '18-business',
    component: EmailCampaign,
  },
  {
    id: '711',
    path: 'ab-test-planner',
    nameKey: 'tools.abTestPlanner.name',
    descriptionKey: 'tools.abTestPlanner.description',
    category: '18-business',
    component: ABTestPlanner,
  },
  {
    id: '712',
    path: 'content-calendar',
    nameKey: 'tools.contentCalendar.name',
    descriptionKey: 'tools.contentCalendar.description',
    category: '18-business',
    component: ContentCalendar,
  },
  {
    id: '713',
    path: 'seo-checker',
    nameKey: 'tools.seoChecker.name',
    descriptionKey: 'tools.seoChecker.description',
    category: '18-business',
    component: SEOChecker,
  },
  {
    id: '714',
    path: 'keyword-planner',
    nameKey: 'tools.keywordPlanner.name',
    descriptionKey: 'tools.keywordPlanner.description',
    category: '18-business',
    component: KeywordPlanner,
  },
  {
    id: '715',
    path: 'hashtag-generator',
    nameKey: 'tools.hashtagGenerator.name',
    descriptionKey: 'tools.hashtagGenerator.description',
    category: '18-business',
    component: BizHashtagGenerator,
  },
  {
    id: '716',
    path: 'press-release',
    nameKey: 'tools.pressRelease.name',
    descriptionKey: 'tools.pressRelease.description',
    category: '18-business',
    component: PressRelease,
  },
  {
    id: '717',
    path: 'media-kit',
    nameKey: 'tools.mediaKit.name',
    descriptionKey: 'tools.mediaKit.description',
    category: '18-business',
    component: MediaKit,
  },
  {
    id: '718',
    path: 'testimonial-collector',
    nameKey: 'tools.testimonialCollector.name',
    descriptionKey: 'tools.testimonialCollector.description',
    category: '18-business',
    component: TestimonialCollector,
  },
  {
    id: '719',
    path: 'case-study-template',
    nameKey: 'tools.caseStudyTemplate.name',
    descriptionKey: 'tools.caseStudyTemplate.description',
    category: '18-business',
    component: CaseStudyTemplate,
  },
  {
    id: '720',
    path: 'newsletter-builder',
    nameKey: 'tools.newsletterBuilder.name',
    descriptionKey: 'tools.newsletterBuilder.description',
    category: '18-business',
    component: NewsletterBuilder,
  },
  {
    id: '721',
    path: 'survey-creator',
    nameKey: 'tools.surveyCreator.name',
    descriptionKey: 'tools.surveyCreator.description',
    category: '18-business',
    component: SurveyCreator,
  },
  {
    id: '722',
    path: 'feedback-form',
    nameKey: 'tools.feedbackForm.name',
    descriptionKey: 'tools.feedbackForm.description',
    category: '18-business',
    component: FeedbackForm,
  },
  {
    id: '723',
    path: 'flashcard-maker',
    nameKey: 'tools.flashcardMaker.name',
    descriptionKey: 'tools.flashcardMaker.description',
    category: '19-education',
    component: Edu19FlashcardMaker,
  },
  {
    id: '724',
    path: 'quiz-generator',
    nameKey: 'tools.quizGenerator.name',
    descriptionKey: 'tools.quizGenerator.description',
    category: '19-education',
    component: QuizGenerator,
  },
  {
    id: '725',
    path: 'study-timer',
    nameKey: 'tools.studyTimer.name',
    descriptionKey: 'tools.studyTimer.description',
    category: '19-education',
    component: Edu19StudyTimer,
  },
  {
    id: '726',
    path: 'note-summarizer',
    nameKey: 'tools.noteSummarizer.name',
    descriptionKey: 'tools.noteSummarizer.description',
    category: '19-education',
    component: NoteSummarizer,
  },
  {
    id: '727',
    path: 'vocabulary-builder',
    nameKey: 'tools.vocabularyBuilder.name',
    descriptionKey: 'tools.vocabularyBuilder.description',
    category: '19-education',
    component: Edu19VocabularyBuilder,
  },
  {
    id: '728',
    path: 'grammar-checker',
    nameKey: 'tools.grammarChecker.name',
    descriptionKey: 'tools.grammarChecker.description',
    category: '19-education',
    component: GrammarChecker,
  },
  {
    id: '729',
    path: 'citation-generator',
    nameKey: 'tools.citationGenerator.name',
    descriptionKey: 'tools.citationGenerator.description',
    category: '19-education',
    component: Edu19CitationGenerator,
  },
  {
    id: '730',
    path: 'bibliography-maker',
    nameKey: 'tools.bibliographyMaker.name',
    descriptionKey: 'tools.bibliographyMaker.description',
    category: '19-education',
    component: BibliographyMaker,
  },
  {
    id: '731',
    path: 'essay-outliner',
    nameKey: 'tools.essayOutliner.name',
    descriptionKey: 'tools.essayOutliner.description',
    category: '19-education',
    component: Edu19EssayOutliner,
  },
  {
    id: '732',
    path: 'mind-mapper',
    nameKey: 'tools.mindMapper.name',
    descriptionKey: 'tools.mindMapper.description',
    category: '19-education',
    component: MindMapper,
  },
  {
    id: '733',
    path: 'math-problem-solver',
    nameKey: 'tools.mathProblemSolver.name',
    descriptionKey: 'tools.mathProblemSolver.description',
    category: '19-education',
    component: MathProblemSolver,
  },
  {
    id: '734',
    path: 'periodic-table',
    nameKey: 'tools.periodicTable.name',
    descriptionKey: 'tools.periodicTable.description',
    category: '19-education',
    component: Edu19PeriodicTable,
  },
  {
    id: '735',
    path: 'multiplication-table',
    nameKey: 'tools.multiplicationTable.name',
    descriptionKey: 'tools.multiplicationTable.description',
    category: '19-education',
    component: Edu19MultiplicationTable,
  },
  {
    id: '736',
    path: 'fraction-calculator',
    nameKey: 'tools.fractionCalculator.name',
    descriptionKey: 'tools.fractionCalculator.description',
    category: '19-education',
    component: Edu19FractionCalculator,
  },
  {
    id: '737',
    path: 'grade-calculator',
    nameKey: 'tools.gradeCalculator.name',
    descriptionKey: 'tools.gradeCalculator.description',
    category: '19-education',
    component: Edu19GradeCalculator,
  },
  {
    id: '738',
    path: 'gpa-calculator',
    nameKey: 'tools.gpaCalculator.name',
    descriptionKey: 'tools.gpaCalculator.description',
    category: '19-education',
    component: GPACalculator,
  },
  {
    id: '739',
    path: 'reading-speed-test',
    nameKey: 'tools.readingSpeedTest.name',
    descriptionKey: 'tools.readingSpeedTest.description',
    category: '19-education',
    component: Edu19ReadingSpeedTest,
  },
  {
    id: '740',
    path: 'typing-speed-test',
    nameKey: 'tools.typingSpeedTest.name',
    descriptionKey: 'tools.typingSpeedTest.description',
    category: '19-education',
    component: Edu19TypingSpeedTest,
  },
  {
    id: '741',
    path: 'learning-goal-tracker',
    nameKey: 'tools.learningGoalTracker.name',
    descriptionKey: 'tools.learningGoalTracker.description',
    category: '19-education',
    component: LearningGoalTracker,
  },
  {
    id: '742',
    path: 'homework-planner',
    nameKey: 'tools.homeworkPlanner.name',
    descriptionKey: 'tools.homeworkPlanner.description',
    category: '19-education',
    component: HomeworkPlanner,
  },
  {
    id: '743',
    path: 'exam-countdown',
    nameKey: 'tools.examCountdown.name',
    descriptionKey: 'tools.examCountdown.description',
    category: '19-education',
    component: ExamCountdown,
  },
  {
    id: '744',
    path: 'study-group-organizer',
    nameKey: 'tools.studyGroupOrganizer.name',
    descriptionKey: 'tools.studyGroupOrganizer.description',
    category: '19-education',
    component: StudyGroupOrganizer,
  },
  {
    id: '745',
    path: 'language-learning-tracker',
    nameKey: 'tools.languageLearningTracker.name',
    descriptionKey: 'tools.languageLearningTracker.description',
    category: '19-education',
    component: LanguageLearningTracker,
  },
  {
    id: '746',
    path: 'spelling-practice',
    nameKey: 'tools.spellingPractice.name',
    descriptionKey: 'tools.spellingPractice.description',
    category: '19-education',
    component: Edu19SpellingPractice,
  },
  {
    id: '747',
    path: 'math-facts-fluency',
    nameKey: 'tools.mathFactsFluency.name',
    descriptionKey: 'tools.mathFactsFluency.description',
    category: '19-education',
    component: MathFactsFluency,
  },
  {
    id: '748',
    path: 'course-scheduler',
    nameKey: 'tools.courseScheduler.name',
    descriptionKey: 'tools.courseScheduler.description',
    category: '19-education',
    component: CourseScheduler,
  },
  {
    id: '749',
    path: 'research-paper-outliner',
    nameKey: 'tools.researchPaperOutliner.name',
    descriptionKey: 'tools.researchPaperOutliner.description',
    category: '19-education',
    component: ResearchPaperOutliner,
  },
  {
    id: '750',
    path: 'thesis-statement-builder',
    nameKey: 'tools.thesisStatementBuilder.name',
    descriptionKey: 'tools.thesisStatementBuilder.description',
    category: '19-education',
    component: ThesisStatementBuilder,
  },
  {
    id: '751',
    path: 'book-report-helper',
    nameKey: 'tools.bookReportHelper.name',
    descriptionKey: 'tools.bookReportHelper.description',
    category: '19-education',
    component: BookReportHelper,
  },
  {
    id: '752',
    path: 'science-experiment-log',
    nameKey: 'tools.scienceExperimentLog.name',
    descriptionKey: 'tools.scienceExperimentLog.description',
    category: '19-education',
    component: ScienceExperimentLog,
  },
  {
    id: '753',
    path: 'history-timeline-maker',
    nameKey: 'tools.historyTimelineMaker.name',
    descriptionKey: 'tools.historyTimelineMaker.description',
    category: '19-education',
    component: HistoryTimelineMaker,
  },
  {
    id: '754',
    path: 'geography-quiz',
    nameKey: 'tools.geographyQuiz.name',
    descriptionKey: 'tools.geographyQuiz.description',
    category: '19-education',
    component: GeographyQuiz,
  },
  {
    id: '755',
    path: 'music-theory-helper',
    nameKey: 'tools.musicTheoryHelper.name',
    descriptionKey: 'tools.musicTheoryHelper.description',
    category: '19-education',
    component: MusicTheoryHelper,
  },
  {
    id: '756',
    path: 'debate-prep',
    nameKey: 'tools.debatePrep.name',
    descriptionKey: 'tools.debatePrep.description',
    category: '19-education',
    component: DebatePrep,
  },
  {
    id: '757',
    path: 'presentation-timer',
    nameKey: 'tools.presentationTimer.name',
    descriptionKey: 'tools.presentationTimer.description',
    category: '19-education',
    component: PresentationTimer,
  },
  {
    id: '758',
    path: 'class-participation-tracker',
    nameKey: 'tools.classParticipationTracker.name',
    descriptionKey: 'tools.classParticipationTracker.description',
    category: '19-education',
    component: ClassParticipationTracker,
  },
  {
    id: '759',
    path: 'study-break-reminder',
    nameKey: 'tools.studyBreakReminder.name',
    descriptionKey: 'tools.studyBreakReminder.description',
    category: '19-education',
    component: StudyBreakReminder,
  },
  {
    id: '760',
    path: 'learning-style-quiz',
    nameKey: 'tools.learningStyleQuiz.name',
    descriptionKey: 'tools.learningStyleQuiz.description',
    category: '19-education',
    component: LearningStyleQuiz,
  },
  {
    id: '761',
    path: 'academic-calendar',
    nameKey: 'tools.academicCalendar.name',
    descriptionKey: 'tools.academicCalendar.description',
    category: '19-education',
    component: AcademicCalendar,
  },
  {
    id: '762',
    path: 'study-playlist',
    nameKey: 'tools.studyPlaylist.name',
    descriptionKey: 'tools.studyPlaylist.description',
    category: '19-education',
    component: StudyPlaylist,
  },
  // Health Tools (20-health) - 763+
  {
    id: '763',
    path: 'calorie-counter',
    nameKey: 'tools.calorieCounter.name',
    descriptionKey: 'tools.calorieCounter.description',
    category: '20-health',
    component: CalorieCounter20,
  },
  {
    id: '764',
    path: 'water-intake-tracker',
    nameKey: 'tools.waterIntakeTracker.name',
    descriptionKey: 'tools.waterIntakeTracker.description',
    category: '20-health',
    component: WaterIntakeTracker,
  },
  {
    id: '765',
    path: 'sleep-logger',
    nameKey: 'tools.sleepLogger.name',
    descriptionKey: 'tools.sleepLogger.description',
    category: '20-health',
    component: SleepLogger,
  },
  {
    id: '766',
    path: 'exercise-timer',
    nameKey: 'tools.exerciseTimer.name',
    descriptionKey: 'tools.exerciseTimer.description',
    category: '20-health',
    component: ExerciseTimer,
  },
  {
    id: '767',
    path: 'step-counter',
    nameKey: 'tools.stepCounter.name',
    descriptionKey: 'tools.stepCounter.description',
    category: '20-health',
    component: StepCounter,
  },
  // Creativity Tools (21-creativity) - 768+
  {
    id: '768',
    path: 'color-mixer',
    nameKey: 'tools.colorMixer.name',
    descriptionKey: 'tools.colorMixer.description',
    category: '21-creativity',
    component: CreativityColorMixer,
  },
  {
    id: '769',
    path: 'pattern-generator',
    nameKey: 'tools.patternGenerator.name',
    descriptionKey: 'tools.patternGenerator.description',
    category: '21-creativity',
    component: CreativityPatternGenerator,
  },
  {
    id: '770',
    path: 'ascii-art-generator',
    nameKey: 'tools.asciiArtGenerator.name',
    descriptionKey: 'tools.asciiArtGenerator.description',
    category: '21-creativity',
    component: CreativityAsciiArtGenerator,
  },
  {
    id: '771',
    path: 'pixel-art-maker',
    nameKey: 'tools.pixelArtMaker.name',
    descriptionKey: 'tools.pixelArtMaker.description',
    category: '21-creativity',
    component: CreativityPixelArtMaker,
  },
  {
    id: '772',
    path: 'gradient-maker',
    nameKey: 'tools.gradientMaker.name',
    descriptionKey: 'tools.gradientMaker.description',
    category: '21-creativity',
    component: CreativityGradientMaker,
  },
  {
    id: '773',
    path: 'font-pairing',
    nameKey: 'tools.fontPairing.name',
    descriptionKey: 'tools.fontPairing.description',
    category: '21-creativity',
    component: CreativityFontPairing,
  },
  {
    id: '774',
    path: 'color-harmony',
    nameKey: 'tools.colorHarmony.name',
    descriptionKey: 'tools.colorHarmony.description',
    category: '21-creativity',
    component: CreativityColorHarmony,
  },
  {
    id: '775',
    path: 'logo-ideas',
    nameKey: 'tools.logoIdeas.name',
    descriptionKey: 'tools.logoIdeas.description',
    category: '21-creativity',
    component: CreativityLogoIdeas,
  },
  {
    id: '776',
    path: 'moodboard-maker',
    nameKey: 'tools.moodboardMaker.name',
    descriptionKey: 'tools.moodboardMaker.description',
    category: '21-creativity',
    component: CreativityMoodboardMaker,
  },
  {
    id: '777',
    path: 'icon-previewer',
    nameKey: 'tools.iconPreviewer.name',
    descriptionKey: 'tools.iconPreviewer.description',
    category: '21-creativity',
    component: CreativityIconPreviewer,
  },
  {
    id: '778',
    path: 'palette-extractor',
    nameKey: 'tools.paletteExtractor.name',
    descriptionKey: 'tools.paletteExtractor.description',
    category: '21-creativity',
    component: CreativityPaletteExtractor,
  },
  {
    id: '779',
    path: 'style-guide-generator',
    nameKey: 'tools.styleGuideGenerator.name',
    descriptionKey: 'tools.styleGuideGenerator.description',
    category: '21-creativity',
    component: CreativityStyleGuideGenerator,
  },
  {
    id: '780',
    path: 'mockup-viewer',
    nameKey: 'tools.mockupViewer.name',
    descriptionKey: 'tools.mockupViewer.description',
    category: '21-creativity',
    component: CreativityMockupViewer,
  },
  {
    id: '781',
    path: 'typography-scale',
    nameKey: 'tools.typographyScale.name',
    descriptionKey: 'tools.typographyScale.description',
    category: '21-creativity',
    component: CreativityTypographyScale,
  },
  {
    id: '782',
    path: 'spacing-calculator',
    nameKey: 'tools.spacingCalculator.name',
    descriptionKey: 'tools.spacingCalculator.description',
    category: '21-creativity',
    component: CreativitySpacingCalculator,
  },
  {
    id: '783',
    path: 'breakpoint-calculator',
    nameKey: 'tools.breakpointCalculator.name',
    descriptionKey: 'tools.breakpointCalculator.description',
    category: '21-creativity',
    component: CreativityBreakpointCalculator,
  },
  {
    id: '784',
    path: 'animation-timing-calculator',
    nameKey: 'tools.animationTimingCalculator.name',
    descriptionKey: 'tools.animationTimingCalculator.description',
    category: '21-creativity',
    component: CreativityAnimationTimingCalculator,
  },
  {
    id: '785',
    path: 'shadow-generator',
    nameKey: 'tools.shadowGenerator.name',
    descriptionKey: 'tools.shadowGenerator.description',
    category: '21-creativity',
    component: CreativityShadowGenerator,
  },
  {
    id: '786',
    path: 'border-generator',
    nameKey: 'tools.borderGenerator.name',
    descriptionKey: 'tools.borderGenerator.description',
    category: '21-creativity',
    component: CreativityBorderGenerator,
  },
  {
    id: '787',
    path: 'filter-preview',
    nameKey: 'tools.filterPreview.name',
    descriptionKey: 'tools.filterPreview.description',
    category: '21-creativity',
    component: CreativityFilterPreview,
  },
  {
    id: '788',
    path: 'blend-mode-preview',
    nameKey: 'tools.blendModePreview.name',
    descriptionKey: 'tools.blendModePreview.description',
    category: '21-creativity',
    component: CreativityBlendModePreview,
  },
  {
    id: '789',
    path: 'text-effect-generator',
    nameKey: 'tools.textEffectGenerator.name',
    descriptionKey: 'tools.textEffectGenerator.description',
    category: '21-creativity',
    component: CreativityTextEffectGenerator,
  },
  {
    id: '790',
    path: 'background-pattern-generator',
    nameKey: 'tools.backgroundPatternGenerator.name',
    descriptionKey: 'tools.backgroundPatternGenerator.description',
    category: '21-creativity',
    component: CreativityBackgroundPatternGenerator,
  },
]

export const categories = [
  { id: '01-text', nameKey: 'categories.01-text' },
  { id: '02-image', nameKey: 'categories.02-image' },
  { id: '03-audio-video', nameKey: 'categories.03-audio-video' },
  { id: '04-data', nameKey: 'categories.04-data' },
  { id: '05-dev', nameKey: 'categories.05-dev' },
  { id: '06-utility', nameKey: 'categories.06-utility' },
  { id: '07-lifestyle', nameKey: 'categories.07-lifestyle' },
  { id: '08-finance', nameKey: 'categories.08-finance' },
  { id: '09-education', nameKey: 'categories.09-education' },
  { id: '10-health', nameKey: 'categories.10-health' },
  { id: '11-social', nameKey: 'categories.11-social' },
  { id: '12-productivity', nameKey: 'categories.12-productivity' },
  { id: '13-science', nameKey: 'categories.13-science' },
  { id: '14-games', nameKey: 'categories.14-games' },
  { id: '15-art', nameKey: 'categories.15-art' },
  { id: '16-communication', nameKey: 'categories.16-communication' },
  { id: '17-security', nameKey: 'categories.17-security' },
  { id: '18-business', nameKey: 'categories.18-business' },
  { id: '19-education', nameKey: 'categories.19-education' },
  { id: '20-health', nameKey: 'categories.20-health' },
  { id: '21-creativity', nameKey: 'categories.21-creativity' },
  { id: '25-other', nameKey: 'categories.25-other' },
]

export function getToolByPath(path: string): ToolInfo | undefined {
  return tools.find((tool) => tool.path === path)
}

export function getToolsByCategory(categoryId: string): ToolInfo[] {
  return tools.filter((tool) => tool.category === categoryId)
}
