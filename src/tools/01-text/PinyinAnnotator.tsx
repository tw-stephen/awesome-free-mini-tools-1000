import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

// Common Chinese characters to Pinyin mapping (simplified for frontend-only use)
const pinyinMap: Record<string, string> = {
  // Common characters
  '的': 'de', '一': 'yī', '是': 'shì', '不': 'bù', '了': 'le', '在': 'zài', '人': 'rén', '有': 'yǒu',
  '我': 'wǒ', '他': 'tā', '这': 'zhè', '中': 'zhōng', '大': 'dà', '来': 'lái', '上': 'shàng', '国': 'guó',
  '个': 'gè', '到': 'dào', '说': 'shuō', '们': 'men', '为': 'wèi', '子': 'zǐ', '和': 'hé', '你': 'nǐ',
  '地': 'dì', '出': 'chū', '道': 'dào', '也': 'yě', '时': 'shí', '年': 'nián', '得': 'de', '就': 'jiù',
  '那': 'nà', '要': 'yào', '下': 'xià', '以': 'yǐ', '生': 'shēng', '会': 'huì', '自': 'zì', '着': 'zhe',
  '去': 'qù', '之': 'zhī', '过': 'guò', '家': 'jiā', '学': 'xué', '对': 'duì', '可': 'kě', '她': 'tā',
  '里': 'lǐ', '后': 'hòu', '小': 'xiǎo', '么': 'me', '心': 'xīn', '多': 'duō', '天': 'tiān', '而': 'ér',
  '能': 'néng', '好': 'hǎo', '都': 'dōu', '然': 'rán', '没': 'méi', '日': 'rì', '于': 'yú', '起': 'qǐ',
  '还': 'hái', '发': 'fā', '成': 'chéng', '事': 'shì', '只': 'zhǐ', '作': 'zuò', '当': 'dāng', '想': 'xiǎng',
  '看': 'kàn', '文': 'wén', '无': 'wú', '开': 'kāi', '手': 'shǒu', '十': 'shí', '用': 'yòng', '主': 'zhǔ',
  '行': 'xíng', '方': 'fāng', '又': 'yòu', '如': 'rú', '前': 'qián', '所': 'suǒ', '本': 'běn', '见': 'jiàn',
  '经': 'jīng', '头': 'tóu', '面': 'miàn', '把': 'bǎ', '最': 'zuì', '同': 'tóng', '从': 'cóng',
  '现': 'xiàn', '世': 'shì', '界': 'jiè', '明': 'míng', '听': 'tīng', '觉': 'jué', '气': 'qì', '动': 'dòng',
  '两': 'liǎng', '少': 'shǎo', '公': 'gōng', '新': 'xīn', '名': 'míng', '女': 'nǚ', '男': 'nán', '老': 'lǎo',
  '已': 'yǐ', '间': 'jiān', '长': 'zhǎng', '问': 'wèn', '知': 'zhī', '话': 'huà', '意': 'yì', '情': 'qíng',
  '点': 'diǎn', '很': 'hěn', '回': 'huí', '三': 'sān', '进': 'jìn', '却': 'què', '再': 'zài', '位': 'wèi',
  '等': 'děng', '东': 'dōng', '西': 'xī', '南': 'nán', '北': 'běi', '高': 'gāo', '月': 'yuè', '几': 'jǐ',
  '电': 'diàn', '水': 'shuǐ', '山': 'shān', '真': 'zhēn', '定': 'dìng', '今': 'jīn', '理': 'lǐ', '此': 'cǐ',
  '外': 'wài', '内': 'nèi', '先': 'xiān', '因': 'yīn', '次': 'cì', '向': 'xiàng', '性': 'xìng', '但': 'dàn',
  '儿': 'ér', '全': 'quán', '力': 'lì', '实': 'shí', '打': 'dǎ', '些': 'xiē', '白': 'bái', '给': 'gěi',
  '相': 'xiāng', '让': 'ràng', '太': 'tài', '路': 'lù', '接': 'jiē', '运': 'yùn', '系': 'xì', '第': 'dì',
  '使': 'shǐ', '走': 'zǒu', '分': 'fēn', '门': 'mén', '死': 'sǐ', '活': 'huó', '快': 'kuài', '百': 'bǎi',
  '站': 'zhàn', '叫': 'jiào', '五': 'wǔ', '六': 'liù', '七': 'qī', '八': 'bā', '九': 'jiǔ', '四': 'sì',
  '二': 'èr', '光': 'guāng', '期': 'qī', '城': 'chéng', '产': 'chǎn', '物': 'wù', '机': 'jī',
  '王': 'wáng', '比': 'bǐ', '合': 'hé', '书': 'shū', '安': 'ān', '命': 'mìng', '身': 'shēn', '言': 'yán',
  '夜': 'yè', '正': 'zhèng', '果': 'guǒ', '原': 'yuán', '华': 'huá', '才': 'cái', '每': 'měi', '青': 'qīng',
  '象': 'xiàng', '代': 'dài', '海': 'hǎi', '车': 'chē', '民': 'mín', '红': 'hóng', '变': 'biàn', '爱': 'ài',
  '关': 'guān', '父': 'fù', '母': 'mǔ', '常': 'cháng', '入': 'rù', '直': 'zhí', '应': 'yīng', '场': 'chǎng',
  '即': 'jí', '特': 'tè', '党': 'dǎng', '建': 'jiàn', '求': 'qiú', '部': 'bù', '立': 'lì',
  '边': 'biān', '种': 'zhǒng', '便': 'biàn', '更': 'gèng', '总': 'zǒng', '由': 'yóu', '加': 'jiā', '马': 'mǎ',
  '金': 'jīn', '写': 'xiě', '别': 'bié', '认': 'rèn', '军': 'jūn', '者': 'zhě', '完': 'wán', '令': 'lìng',
  '反': 'fǎn', '什': 'shén', '级': 'jí', '决': 'jué', '任': 'rèn', '务': 'wù', '精': 'jīng', '通': 'tōng',
  '该': 'gāi', '教': 'jiào', '眼': 'yǎn', '候': 'hòu', '报': 'bào', '数': 'shù', '设': 'shè', '术': 'shù',
  '带': 'dài', '望': 'wàng', '政': 'zhèng', '将': 'jiāng', '亲': 'qīn', '制': 'zhì', '口': 'kǒu', '笑': 'xiào',
  '思': 'sī', '议': 'yì', '近': 'jìn', '远': 'yuǎn', '管': 'guǎn', '张': 'zhāng', '李': 'lǐ', '林': 'lín',
  '呢': 'ne', '吗': 'ma', '吧': 'ba', '啊': 'a', '哦': 'ó', '嗯': 'ń', '哪': 'nǎ', '谁': 'shuí',
  '怎': 'zěn', '样': 'yàng', '若': 'ruò', '被': 'bèi', '它': 'tā', '早': 'zǎo', '晚': 'wǎn', '午': 'wǔ',
  '黑': 'hēi', '飞': 'fēi', '住': 'zhù', '坐': 'zuò', '放': 'fàng', '拿': 'ná', '送': 'sòng', '买': 'mǎi',
  '卖': 'mài', '找': 'zhǎo', '算': 'suàn', '选': 'xuǎn', '记': 'jì', '忘': 'wàng', '怕': 'pà', '跑': 'pǎo',
  '影': 'yǐng', '落': 'luò', '春': 'chūn', '夏': 'xià', '秋': 'qiū', '冬': 'dōng', '热': 'rè', '冷': 'lěng',
  '风': 'fēng', '雨': 'yǔ', '雪': 'xuě', '云': 'yún', '花': 'huā', '草': 'cǎo', '树': 'shù', '木': 'mù',
  '石': 'shí', '土': 'tǔ', '火': 'huǒ', '河': 'hé', '江': 'jiāng', '湖': 'hú', '井': 'jǐng', '村': 'cūn',
  '鸟': 'niǎo', '鱼': 'yú', '虫': 'chóng', '狗': 'gǒu', '猫': 'māo', '牛': 'niú', '羊': 'yáng', '猪': 'zhū',
  '鸡': 'jī', '龙': 'lóng', '虎': 'hǔ', '蛇': 'shé', '兔': 'tù', '猴': 'hóu', '鼠': 'shǔ',
  '衣': 'yī', '帽': 'mào', '鞋': 'xié', '袜': 'wà', '裙': 'qún', '裤': 'kù', '衫': 'shān', '布': 'bù',
  '米': 'mǐ', '饭': 'fàn', '菜': 'cài', '肉': 'ròu', '蛋': 'dàn', '奶': 'nǎi', '茶': 'chá',
  '酒': 'jiǔ', '糖': 'táng', '盐': 'yán', '油': 'yóu', '醋': 'cù', '汤': 'tāng', '饺': 'jiǎo', '饼': 'bǐng',
  '苹': 'píng', '香': 'xiāng', '蕉': 'jiāo', '桃': 'táo', '梨': 'lí', '葡': 'pú', '萄': 'táo',
  '橙': 'chéng', '瓜': 'guā', '柿': 'shì', '枣': 'zǎo', '杏': 'xìng', '桂': 'guì', '梅': 'méi',
  '笔': 'bǐ', '纸': 'zhǐ', '刀': 'dāo', '剪': 'jiǎn', '尺': 'chǐ', '桌': 'zhuō', '椅': 'yǐ', '床': 'chuáng',
  '窗': 'chuāng', '灯': 'dēng', '钟': 'zhōng', '表': 'biǎo', '镜': 'jìng', '碗': 'wǎn', '盘': 'pán', '杯': 'bēi',
  '瓶': 'píng', '壶': 'hú', '锅': 'guō', '勺': 'sháo', '筷': 'kuài', '叉': 'chā', '钥': 'yào', '匙': 'shi',
  '爸': 'bà', '妈': 'mā', '爷': 'yé', '哥': 'gē', '姐': 'jiě', '弟': 'dì', '妹': 'mèi',
  '叔': 'shū', '婶': 'shěn', '伯': 'bó', '姑': 'gū', '舅': 'jiù', '姨': 'yí', '侄': 'zhí', '孙': 'sūn',
  '友': 'yǒu', '朋': 'péng', '邻': 'lín', '居': 'jū', '客': 'kè', '宾': 'bīn', '医': 'yī', '护': 'hù',
  '病': 'bìng', '药': 'yào', '痛': 'tòng', '累': 'lèi', '困': 'kùn', '饿': 'è', '渴': 'kě', '饱': 'bǎo',
  '睡': 'shuì', '梦': 'mèng', '醒': 'xǐng', '忙': 'máng', '闲': 'xián', '乐': 'lè', '苦': 'kǔ', '甜': 'tián',
  '酸': 'suān', '辣': 'là', '咸': 'xián', '淡': 'dàn', '臭': 'chòu', '美': 'měi', '丑': 'chǒu',
  '胖': 'pàng', '瘦': 'shòu', '矮': 'ǎi', '壮': 'zhuàng', '弱': 'ruò', '强': 'qiáng', '聪': 'cōng', '笨': 'bèn',
  '傻': 'shǎ', '懒': 'lǎn', '勤': 'qín', '慢': 'màn', '脏': 'zāng', '净': 'jìng', '干': 'gān', '湿': 'shī',
  '轻': 'qīng', '重': 'zhòng', '软': 'ruǎn', '硬': 'yìng', '厚': 'hòu', '薄': 'báo', '宽': 'kuān', '窄': 'zhǎi',
  '深': 'shēn', '浅': 'qiǎn', '松': 'sōng', '紧': 'jǐn', '粗': 'cū', '细': 'xì', '左': 'zuǒ', '右': 'yòu',
  '旁': 'páng', '底': 'dǐ', '顶': 'dǐng', '角': 'jiǎo', '弯': 'wān', '圆': 'yuán',
  '扁': 'biǎn', '尖': 'jiān', '平': 'píng', '歪': 'wāi', '斜': 'xié', '倒': 'dǎo', '翻': 'fān', '滚': 'gǔn',
  '拉': 'lā', '推': 'tuī', '抬': 'tái', '举': 'jǔ', '扔': 'rēng', '拾': 'shí', '捡': 'jiǎn', '扫': 'sǎo',
  '擦': 'cā', '洗': 'xǐ', '刷': 'shuā', '切': 'qiē', '剥': 'bāo', '削': 'xuē', '煮': 'zhǔ', '炒': 'chǎo',
  '烤': 'kǎo', '蒸': 'zhēng', '炸': 'zhá', '烧': 'shāo', '煎': 'jiān', '焖': 'mèn', '炖': 'dùn', '拌': 'bàn',
  '穿': 'chuān', '脱': 'tuō', '戴': 'dài', '摘': 'zhāi', '解': 'jiě', '扣': 'kòu', '挂': 'guà',
  '躺': 'tǎng', '蹲': 'dūn', '跪': 'guì', '踢': 'tī', '跳': 'tiào', '爬': 'pá', '滑': 'huá', '游': 'yóu',
  '骑': 'qí', '划': 'huá', '追': 'zhuī', '赶': 'gǎn', '逃': 'táo', '藏': 'cáng', '躲': 'duǒ', '玩': 'wán',
  '唱': 'chàng', '画': 'huà', '读': 'dú', '念': 'niàn', '背': 'bèi', '抄': 'chāo', '答': 'dá',
  '考': 'kǎo', '试': 'shì', '题': 'tí', '课': 'kè', '班': 'bān', '组': 'zǔ', '排': 'pái', '队': 'duì',
  '欢': 'huān', '喜': 'xǐ', '怒': 'nù', '哀': 'āi', '惧': 'jù', '惊': 'jīng', '恨': 'hèn', '羞': 'xiū',
  '慌': 'huāng', '急': 'jí', '静': 'jìng', '温': 'wēn', '柔': 'róu', '刚': 'gāng', '猛': 'měng',
  '拥': 'yōng', '抱': 'bào', '握': 'wò', '摸': 'mō', '捏': 'niē', '掐': 'qiā', '拍': 'pāi',
  '敲': 'qiāo', '按': 'àn', '压': 'yā', '挤': 'jǐ', '撕': 'sī', '折': 'zhé', '包': 'bāo', '裹': 'guǒ',
  '绑': 'bǎng', '捆': 'kǔn', '缠': 'chán', '织': 'zhī', '编': 'biān', '钉': 'dīng', '锤': 'chuí', '磨': 'mó',
  '割': 'gē', '砍': 'kǎn', '劈': 'pī', '凿': 'záo', '钻': 'zuān', '挖': 'wā', '填': 'tián', '埋': 'mái',
  '搜': 'sōu', '查': 'chá', '验': 'yàn', '测': 'cè', '量': 'liàng', '称': 'chēng', '秤': 'chèng',
  // Traditional variants (for bidirectional support)
  '這': 'zhè', '國': 'guó', '個': 'gè', '說': 'shuō', '為': 'wèi', '時': 'shí', '會': 'huì', '過': 'guò',
  '對': 'duì', '裡': 'lǐ', '後': 'hòu', '開': 'kāi', '經': 'jīng', '頭': 'tóu', '現': 'xiàn', '問': 'wèn',
  '話': 'huà', '點': 'diǎn', '東': 'dōng', '電': 'diàn', '實': 'shí', '給': 'gěi', '讓': 'ràng', '運': 'yùn',
  '書': 'shū', '華': 'huá', '車': 'chē', '紅': 'hóng', '變': 'biàn', '愛': 'ài', '關': 'guān', '應': 'yīng',
  '場': 'chǎng', '黨': 'dǎng', '邊': 'biān', '種': 'zhǒng', '馬': 'mǎ', '認': 'rèn', '軍': 'jūn', '決': 'jué',
  '務': 'wù', '該': 'gāi', '報': 'bào', '數': 'shù', '設': 'shù', '術': 'shù', '帶': 'dài', '將': 'jiāng',
  '親': 'qīn', '製': 'zhì', '議': 'yì', '遠': 'yuǎn', '張': 'zhāng', '飛': 'fēi', '買': 'mǎi', '賣': 'mài',
  '選': 'xuǎn', '記': 'jì', '風': 'fēng', '雲': 'yún', '樹': 'shù', '鳥': 'niǎo', '魚': 'yú', '貓': 'māo',
  '雞': 'jī', '龍': 'lóng', '襪': 'wà', '褲': 'kù', '飯': 'fàn', '雜': 'zá', '餃': 'jiǎo', '餅': 'bǐng',
  '蘋': 'píng', '紙': 'zhǐ', '鐘': 'zhōng', '鍋': 'guō', '鑰': 'yào', '醫': 'yī', '護': 'hù', '藥': 'yào',
  '夢': 'mèng', '閑': 'xián', '樂': 'lè', '聰': 'cōng', '懶': 'lǎn', '髒': 'zāng', '淨': 'jìng', '濕': 'shī',
  '輕': 'qīng', '軟': 'ruǎn', '寬': 'kuān', '頂': 'dǐng', '彎': 'wān', '圓': 'yuán', '滾': 'gǔn',
  '歡': 'huān', '驚': 'jīng', '擁': 'yōng', '織': 'zhī', '編': 'biān',
  '錘': 'chuí', '驗': 'yàn', '測': 'cè', '稱': 'chēng'
}

// Add pinyin annotations to Chinese text
const annotatePinyin = (text: string, format: 'parentheses' | 'brackets' | 'ruby'): string => {
  if (!text) return ''

  let result = ''
  for (const char of text) {
    const pinyin = pinyinMap[char]
    if (pinyin) {
      if (format === 'parentheses') {
        result += `${char}(${pinyin})`
      } else if (format === 'brackets') {
        result += `${char}[${pinyin}]`
      } else {
        result += `<ruby>${char}<rp>(</rp><rt>${pinyin}</rt><rp>)</rp></ruby>`
      }
    } else {
      result += char
    }
  }
  return result
}

export default function PinyinAnnotator() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [format, setFormat] = useState<'parentheses' | 'brackets' | 'ruby'>('parentheses')
  const { copied, copy } = useClipboard()

  const output = annotatePinyin(input, format)

  const handleClear = () => {
    setInput('')
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center gap-4 mb-3">
          <label className="text-sm font-medium text-slate-700">
            {t('tools.pinyinAnnotator.format')}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('parentheses')}
              className={`px-3 py-1 text-sm rounded ${format === 'parentheses' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {t('tools.pinyinAnnotator.parentheses')}
            </button>
            <button
              onClick={() => setFormat('brackets')}
              className={`px-3 py-1 text-sm rounded ${format === 'brackets' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {t('tools.pinyinAnnotator.brackets')}
            </button>
            <button
              onClick={() => setFormat('ruby')}
              className={`px-3 py-1 text-sm rounded ${format === 'ruby' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {t('tools.pinyinAnnotator.ruby')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('tools.pinyinAnnotator.input')}
            </label>
          </div>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('tools.pinyinAnnotator.inputPlaceholder')}
            rows={10}
          />
          <div className="mt-3 flex justify-end">
            <Button variant="secondary" onClick={handleClear} disabled={!input}>
              {t('common.clear')}
            </Button>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('tools.pinyinAnnotator.output')}
            </label>
          </div>
          {format === 'ruby' ? (
            <div
              className="w-full min-h-[250px] p-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 font-mono text-sm overflow-auto"
              dangerouslySetInnerHTML={{ __html: output || `<span class="text-slate-400">${t('tools.pinyinAnnotator.placeholder')}</span>` }}
            />
          ) : (
            <TextArea
              value={output}
              readOnly
              placeholder={t('tools.pinyinAnnotator.placeholder')}
              rows={10}
              className="font-mono"
            />
          )}
          <div className="mt-3 flex justify-end">
            <Button onClick={() => copy(output)} disabled={!output}>
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <p className="text-sm text-slate-500">
          {t('tools.pinyinAnnotator.hint')}
        </p>
      </div>
    </div>
  )
}
