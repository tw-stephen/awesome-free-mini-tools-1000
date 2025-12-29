// NEW IMPORTS TO ADD AT LINE 830 (after import StudyPlaylist)

// Category 24: Home & Garden (#821-#840)
import PlantWateringReminder24 from './24-home-garden/PlantWateringReminder'
import RoomAreaCalculator from './24-home-garden/RoomAreaCalculator'
import PaintCalculator from './24-home-garden/PaintCalculator'
import WallpaperCalculator from './24-home-garden/WallpaperCalculator'
import FlooringCalculator from './24-home-garden/FlooringCalculator'
import TileCalculator from './24-home-garden/TileCalculator'
import FurnitureFitChecker from './24-home-garden/FurnitureFitChecker'
import LightBulbFinder from './24-home-garden/LightBulbFinder'
import EnergyUsageCalculator from './24-home-garden/EnergyUsageCalculator'
import ApplianceWattageGuide from './24-home-garden/ApplianceWattageGuide'
import CleaningSchedule from './24-home-garden/CleaningSchedule'
import StorageOrganizer from './24-home-garden/StorageOrganizer'
import RoomLayoutPlanner from './24-home-garden/RoomLayoutPlanner'
import ColorSwatchMatcher from './24-home-garden/ColorSwatchMatcher'
import FabricCalculator from './24-home-garden/FabricCalculator'
import WindowMeasurement from './24-home-garden/WindowMeasurement'
import CurtainCalculator from './24-home-garden/CurtainCalculator'
import RugSizeCalculator from './24-home-garden/RugSizeCalculator'
import ShelfSpacingCalculator from './24-home-garden/ShelfSpacingCalculator'
import GardenPlotPlanner from './24-home-garden/GardenPlotPlanner'

// Category 25: Other/Misc - Additional tools (#841-#860)
import BirthdayCountdown from './25-other/BirthdayCountdown'
import AnniversaryReminder from './25-other/AnniversaryReminder'
import Other25AgeCalculator from './25-other/AgeCalculator'
import DayOfWeekFinder from './25-other/DayOfWeekFinder'
import LeapYearChecker from './25-other/LeapYearChecker'
import WeekNumberFinder from './25-other/WeekNumberFinder'
import DaylightHoursCalculator from './25-other/DaylightHoursCalculator'
import SunriseSunsetTimes from './25-other/SunriseSunsetTimes'
import MoonPhaseCalculator from './25-other/MoonPhaseCalculator'
import ZodiacFinder from './25-other/ZodiacFinder'
import ChineseZodiac from './25-other/ChineseZodiac'
import BirthstoneGuide from './25-other/BirthstoneGuide'
import FlowerMeanings from './25-other/FlowerMeanings'
import NumberToWords from './25-other/NumberToWords'
import RomanNumeralQuiz from './25-other/RomanNumeralQuiz'
import Other25TypingSpeedTest from './25-other/TypingSpeedTest'
import Other25ReactionTimeTest from './25-other/ReactionTimeTest'
import MemoryTest from './25-other/MemoryTest'
import ColorBlindnessTest from './25-other/ColorBlindnessTest'
import HearingFrequencyTest from './25-other/HearingFrequencyTest'

// NEW TOOL ENTRIES TO ADD BEFORE LINE 7648 (before the closing ])

/*
  // Category 24: Home & Garden (#821-#840)
  {
    id: '821',
    path: 'plant-watering-reminder-24',
    nameKey: 'tools.plantWateringReminder24.name',
    descriptionKey: 'tools.plantWateringReminder24.description',
    category: '24-home-garden',
    component: PlantWateringReminder24,
  },
  {
    id: '822',
    path: 'room-area-calculator',
    nameKey: 'tools.roomAreaCalculator.name',
    descriptionKey: 'tools.roomAreaCalculator.description',
    category: '24-home-garden',
    component: RoomAreaCalculator,
  },
  {
    id: '823',
    path: 'paint-calculator',
    nameKey: 'tools.paintCalculator.name',
    descriptionKey: 'tools.paintCalculator.description',
    category: '24-home-garden',
    component: PaintCalculator,
  },
  {
    id: '824',
    path: 'wallpaper-calculator',
    nameKey: 'tools.wallpaperCalculator.name',
    descriptionKey: 'tools.wallpaperCalculator.description',
    category: '24-home-garden',
    component: WallpaperCalculator,
  },
  {
    id: '825',
    path: 'flooring-calculator',
    nameKey: 'tools.flooringCalculator.name',
    descriptionKey: 'tools.flooringCalculator.description',
    category: '24-home-garden',
    component: FlooringCalculator,
  },
  {
    id: '826',
    path: 'tile-calculator',
    nameKey: 'tools.tileCalculator.name',
    descriptionKey: 'tools.tileCalculator.description',
    category: '24-home-garden',
    component: TileCalculator,
  },
  {
    id: '827',
    path: 'furniture-fit-checker',
    nameKey: 'tools.furnitureFitChecker.name',
    descriptionKey: 'tools.furnitureFitChecker.description',
    category: '24-home-garden',
    component: FurnitureFitChecker,
  },
  {
    id: '828',
    path: 'light-bulb-finder',
    nameKey: 'tools.lightBulbFinder.name',
    descriptionKey: 'tools.lightBulbFinder.description',
    category: '24-home-garden',
    component: LightBulbFinder,
  },
  {
    id: '829',
    path: 'energy-usage-calculator',
    nameKey: 'tools.energyUsageCalculator.name',
    descriptionKey: 'tools.energyUsageCalculator.description',
    category: '24-home-garden',
    component: EnergyUsageCalculator,
  },
  {
    id: '830',
    path: 'appliance-wattage-guide',
    nameKey: 'tools.applianceWattageGuide.name',
    descriptionKey: 'tools.applianceWattageGuide.description',
    category: '24-home-garden',
    component: ApplianceWattageGuide,
  },
  {
    id: '831',
    path: 'cleaning-schedule',
    nameKey: 'tools.cleaningSchedule.name',
    descriptionKey: 'tools.cleaningSchedule.description',
    category: '24-home-garden',
    component: CleaningSchedule,
  },
  {
    id: '832',
    path: 'storage-organizer',
    nameKey: 'tools.storageOrganizer.name',
    descriptionKey: 'tools.storageOrganizer.description',
    category: '24-home-garden',
    component: StorageOrganizer,
  },
  {
    id: '833',
    path: 'room-layout-planner',
    nameKey: 'tools.roomLayoutPlanner.name',
    descriptionKey: 'tools.roomLayoutPlanner.description',
    category: '24-home-garden',
    component: RoomLayoutPlanner,
  },
  {
    id: '834',
    path: 'color-swatch-matcher',
    nameKey: 'tools.colorSwatchMatcher.name',
    descriptionKey: 'tools.colorSwatchMatcher.description',
    category: '24-home-garden',
    component: ColorSwatchMatcher,
  },
  {
    id: '835',
    path: 'fabric-calculator',
    nameKey: 'tools.fabricCalculator.name',
    descriptionKey: 'tools.fabricCalculator.description',
    category: '24-home-garden',
    component: FabricCalculator,
  },
  {
    id: '836',
    path: 'window-measurement',
    nameKey: 'tools.windowMeasurement.name',
    descriptionKey: 'tools.windowMeasurement.description',
    category: '24-home-garden',
    component: WindowMeasurement,
  },
  {
    id: '837',
    path: 'curtain-calculator',
    nameKey: 'tools.curtainCalculator.name',
    descriptionKey: 'tools.curtainCalculator.description',
    category: '24-home-garden',
    component: CurtainCalculator,
  },
  {
    id: '838',
    path: 'rug-size-calculator',
    nameKey: 'tools.rugSizeCalculator.name',
    descriptionKey: 'tools.rugSizeCalculator.description',
    category: '24-home-garden',
    component: RugSizeCalculator,
  },
  {
    id: '839',
    path: 'shelf-spacing-calculator',
    nameKey: 'tools.shelfSpacingCalculator.name',
    descriptionKey: 'tools.shelfSpacingCalculator.description',
    category: '24-home-garden',
    component: ShelfSpacingCalculator,
  },
  {
    id: '840',
    path: 'garden-plot-planner',
    nameKey: 'tools.gardenPlotPlanner.name',
    descriptionKey: 'tools.gardenPlotPlanner.description',
    category: '24-home-garden',
    component: GardenPlotPlanner,
  },
  // Category 25: Other/Misc - Additional tools (#841-#860)
  {
    id: '841',
    path: 'birthday-countdown',
    nameKey: 'tools.birthdayCountdown.name',
    descriptionKey: 'tools.birthdayCountdown.description',
    category: '25-other',
    component: BirthdayCountdown,
  },
  {
    id: '842',
    path: 'anniversary-reminder',
    nameKey: 'tools.anniversaryReminder.name',
    descriptionKey: 'tools.anniversaryReminder.description',
    category: '25-other',
    component: AnniversaryReminder,
  },
  {
    id: '843',
    path: 'age-calculator-25',
    nameKey: 'tools.ageCalculator25.name',
    descriptionKey: 'tools.ageCalculator25.description',
    category: '25-other',
    component: Other25AgeCalculator,
  },
  {
    id: '844',
    path: 'day-of-week-finder',
    nameKey: 'tools.dayOfWeekFinder.name',
    descriptionKey: 'tools.dayOfWeekFinder.description',
    category: '25-other',
    component: DayOfWeekFinder,
  },
  {
    id: '845',
    path: 'leap-year-checker',
    nameKey: 'tools.leapYearChecker.name',
    descriptionKey: 'tools.leapYearChecker.description',
    category: '25-other',
    component: LeapYearChecker,
  },
  {
    id: '846',
    path: 'week-number-finder',
    nameKey: 'tools.weekNumberFinder.name',
    descriptionKey: 'tools.weekNumberFinder.description',
    category: '25-other',
    component: WeekNumberFinder,
  },
  {
    id: '847',
    path: 'daylight-hours-calculator',
    nameKey: 'tools.daylightHoursCalculator.name',
    descriptionKey: 'tools.daylightHoursCalculator.description',
    category: '25-other',
    component: DaylightHoursCalculator,
  },
  {
    id: '848',
    path: 'sunrise-sunset-times',
    nameKey: 'tools.sunriseSunsetTimes.name',
    descriptionKey: 'tools.sunriseSunsetTimes.description',
    category: '25-other',
    component: SunriseSunsetTimes,
  },
  {
    id: '849',
    path: 'moon-phase-calculator',
    nameKey: 'tools.moonPhaseCalculator.name',
    descriptionKey: 'tools.moonPhaseCalculator.description',
    category: '25-other',
    component: MoonPhaseCalculator,
  },
  {
    id: '850',
    path: 'zodiac-finder',
    nameKey: 'tools.zodiacFinder.name',
    descriptionKey: 'tools.zodiacFinder.description',
    category: '25-other',
    component: ZodiacFinder,
  },
  {
    id: '851',
    path: 'chinese-zodiac',
    nameKey: 'tools.chineseZodiac.name',
    descriptionKey: 'tools.chineseZodiac.description',
    category: '25-other',
    component: ChineseZodiac,
  },
  {
    id: '852',
    path: 'birthstone-guide',
    nameKey: 'tools.birthstoneGuide.name',
    descriptionKey: 'tools.birthstoneGuide.description',
    category: '25-other',
    component: BirthstoneGuide,
  },
  {
    id: '853',
    path: 'flower-meanings',
    nameKey: 'tools.flowerMeanings.name',
    descriptionKey: 'tools.flowerMeanings.description',
    category: '25-other',
    component: FlowerMeanings,
  },
  {
    id: '854',
    path: 'number-to-words',
    nameKey: 'tools.numberToWords.name',
    descriptionKey: 'tools.numberToWords.description',
    category: '25-other',
    component: NumberToWords,
  },
  {
    id: '855',
    path: 'roman-numeral-quiz',
    nameKey: 'tools.romanNumeralQuiz.name',
    descriptionKey: 'tools.romanNumeralQuiz.description',
    category: '25-other',
    component: RomanNumeralQuiz,
  },
  {
    id: '856',
    path: 'typing-speed-test-25',
    nameKey: 'tools.typingSpeedTest25.name',
    descriptionKey: 'tools.typingSpeedTest25.description',
    category: '25-other',
    component: Other25TypingSpeedTest,
  },
  {
    id: '857',
    path: 'reaction-time-test-25',
    nameKey: 'tools.reactionTimeTest25.name',
    descriptionKey: 'tools.reactionTimeTest25.description',
    category: '25-other',
    component: Other25ReactionTimeTest,
  },
  {
    id: '858',
    path: 'memory-test',
    nameKey: 'tools.memoryTest.name',
    descriptionKey: 'tools.memoryTest.description',
    category: '25-other',
    component: MemoryTest,
  },
  {
    id: '859',
    path: 'color-blindness-test',
    nameKey: 'tools.colorBlindnessTest.name',
    descriptionKey: 'tools.colorBlindnessTest.description',
    category: '25-other',
    component: ColorBlindnessTest,
  },
  {
    id: '860',
    path: 'hearing-frequency-test',
    nameKey: 'tools.hearingFrequencyTest.name',
    descriptionKey: 'tools.hearingFrequencyTest.description',
    category: '25-other',
    component: HearingFrequencyTest,
  },
*/

// NEW CATEGORY TO ADD:
// { id: '24-home-garden', nameKey: 'categories.24-home-garden' },
