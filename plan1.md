# Plan 1：基礎處理工具 (#001-#200)

> 包含分類 01-05：文字處理、圖片處理、影音處理、檔案處理、開發者工具

---

## 分類 01：文字處理工具 (#001-#040)

文字轉換、編碼解碼、格式化等基礎文字處理功能。

| 編號 | 工具名稱 | 功能說明 | 技術重點 | 難度 | 狀態 |
|-----|---------|---------|---------|-----|------|
| #001 | 大小寫轉換器 | 轉換文字大小寫（全大寫、全小寫、首字母大寫、句首大寫、交替大小寫） | String API | L1 | [ ] |
| #002 | 文字計數器 | 計算字數、字元數、單詞數、句子數、段落數、閱讀時間 | Regex, String API | L1 | [ ] |
| #003 | 文字比較器 | 比較兩段文字差異，高亮顯示不同處 | diff 演算法 | L2 | [ ] |
| #004 | 重複文字移除 | 移除重複的行或單詞 | Set, Array | L1 | [ ] |
| #005 | 文字排序工具 | 按字母、數字、長度排序文字行 | Array.sort | L1 | [ ] |
| #006 | 文字反轉器 | 反轉整段文字或逐行反轉 | String.reverse | L1 | [x] |
| #007 | 空白清理器 | 移除多餘空白、空行、首尾空白 | Regex, trim | L1 | [x] |
| #008 | 換行轉換器 | 轉換 Windows/Unix/Mac 換行符號 | Regex | L1 | [x] |
| #009 | 文字截取器 | 按字數或位元組截取文字 | String.slice | L1 | [x] |
| #010 | 文字分割器 | 按分隔符號分割文字為多行 | String.split | L1 | [x] |
| #011 | 文字合併器 | 將多行文字合併為單行 | Array.join | L1 | [ ] |
| #012 | 行號添加器 | 為每行文字添加行號 | Array.map | L1 | [ ] |
| #013 | 縮排轉換器 | Tab 與空格互轉，調整縮排寬度 | Regex | L1 | [ ] |
| #014 | Unicode 轉換器 | 文字與 Unicode 編碼互轉 | charCodeAt, fromCharCode | L1 | [ ] |
| #015 | HTML 實體轉換 | HTML 實體編碼與解碼 | DOM API | L1 | [ ] |
| #016 | URL 編碼轉換 | URL 編碼與解碼 | encodeURI, decodeURI | L1 | [ ] |
| #017 | Base64 編碼轉換 | Base64 編碼與解碼 | btoa, atob | L1 | [ ] |
| #018 | 進位轉換器 | 二進位、八進位、十進位、十六進位互轉 | parseInt, toString | L1 | [ ] |
| #019 | ASCII 藝術產生器 | 將文字轉換為 ASCII 藝術字 | figlet.js | L2 | [ ] |
| #020 | 摩斯密碼轉換 | 文字與摩斯密碼互轉 | 對照表 | L1 | [ ] |
| #021 | ROT13 加密 | ROT13 編碼與解碼 | String API | L1 | [ ] |
| #022 | 豬拉丁文轉換 | 轉換為 Pig Latin | Regex | L1 | [ ] |
| #023 | 全形半形轉換 | 全形與半形字元互轉 | charCode 轉換 | L1 | [ ] |
| #024 | 簡繁轉換器 | 簡體中文與繁體中文互轉 | OpenCC.js | L2 | [ ] |
| #025 | 拼音標註器 | 為中文標註拼音 | pinyin.js | L2 | [ ] |
| #026 | 注音標註器 | 為中文標註注音符號 | 注音對照表 | L2 | [ ] |
| #027 | 文字轉語音 | 將文字轉換為語音播放 | Web Speech API | L2 | [ ] |
| #028 | 語音轉文字 | 語音識別轉換為文字 | Web Speech API | L2 | [ ] |
| #029 | Lorem Ipsum 產生器 | 產生假文填充文字 | 隨機產生 | L1 | [ ] |
| #030 | 隨機文字產生器 | 產生隨機字母、數字、符號 | Math.random | L1 | [ ] |
| #031 | 密碼產生器 | 產生隨機安全密碼 | Crypto.random | L2 | [ ] |
| #032 | 正則表達式測試 | 測試正則表達式匹配 | RegExp | L2 | [ ] |
| #033 | 正則表達式產生器 | 視覺化建立正則表達式 | RegExp | L3 | [ ] |
| #034 | 文字模板引擎 | 變數替換模板產生 | Template literals | L2 | [ ] |
| #035 | Markdown 預覽器 | 即時預覽 Markdown 渲染 | marked.js | L2 | [ ] |
| #036 | Markdown 轉 HTML | Markdown 轉換為 HTML | marked.js | L2 | [ ] |
| #037 | HTML 轉 Markdown | HTML 轉換為 Markdown | turndown.js | L2 | [ ] |
| #038 | 文字加密器 | 簡單文字加密（凱薩密碼等） | 加密演算法 | L2 | [ ] |
| #039 | 文字隱寫術 | 在文字中隱藏訊息 | 零寬字元 | L2 | [ ] |
| #040 | 文字雜湊計算 | 計算文字的各種雜湊值 | SubtleCrypto | L2 | [ ] |

---

## 分類 02：圖片處理工具 (#041-#080)

圖片編輯、轉換、壓縮、濾鏡等圖片處理功能。

| 編號 | 工具名稱 | 功能說明 | 技術重點 | 難度 | 狀態 |
|-----|---------|---------|---------|-----|------|
| #041 | 圖片格式轉換 | JPG/PNG/WebP/GIF/BMP 格式互轉 | Canvas, toBlob | L2 | [ ] |
| #042 | 圖片壓縮器 | 壓縮圖片檔案大小 | Canvas, WASM | L3 | [ ] |
| #043 | 圖片裁切器 | 自由裁切圖片區域 | Canvas, Cropper.js | L2 | [ ] |
| #044 | 圖片縮放器 | 調整圖片尺寸 | Canvas | L2 | [ ] |
| #045 | 圖片旋轉器 | 旋轉與翻轉圖片 | Canvas transform | L2 | [ ] |
| #046 | 批量圖片處理 | 批量處理多張圖片 | Promise.all, Worker | L3 | [ ] |
| #047 | 圖片濾鏡效果 | 套用各種濾鏡效果 | Canvas filter, WebGL | L3 | [ ] |
| #048 | 圖片亮度調整 | 調整圖片亮度 | Canvas ImageData | L2 | [ ] |
| #049 | 圖片對比度調整 | 調整圖片對比度 | Canvas ImageData | L2 | [ ] |
| #050 | 圖片飽和度調整 | 調整圖片飽和度 | Canvas ImageData | L2 | [ ] |
| #051 | 圖片色相調整 | 調整圖片色相 | Canvas ImageData, HSL | L2 | [ ] |
| #052 | 圖片模糊效果 | 高斯模糊效果 | Canvas, WebGL | L3 | [ ] |
| #053 | 圖片銳利化 | 銳利化圖片 | Convolution | L3 | [ ] |
| #054 | 圖片灰階轉換 | 轉換為灰階圖片 | Canvas ImageData | L2 | [ ] |
| #055 | 圖片反色效果 | 圖片顏色反轉 | Canvas ImageData | L2 | [ ] |
| #056 | 圖片懷舊效果 | 復古懷舊濾鏡 | Canvas ImageData | L2 | [ ] |
| #057 | 圖片馬賽克效果 | 添加馬賽克效果 | Canvas 像素處理 | L2 | [ ] |
| #058 | 圖片浮雕效果 | 浮雕濾鏡效果 | Convolution | L3 | [ ] |
| #059 | 圖片邊緣檢測 | 檢測圖片邊緣 | Sobel 演算法 | L3 | [ ] |
| #060 | 圖片去背景 | 移除圖片背景 | WASM, WebGPU, AI | L4 | [ ] |
| #061 | 圖片合併器 | 合併多張圖片 | Canvas | L2 | [ ] |
| #062 | 圖片拼貼器 | 建立圖片拼貼 | Canvas, Grid | L2 | [ ] |
| #063 | 圖片浮水印 | 添加文字或圖片浮水印 | Canvas | L2 | [ ] |
| #064 | 圖片 EXIF 檢視 | 檢視圖片 EXIF 資訊 | exif-js | L2 | [ ] |
| #065 | 圖片 EXIF 移除 | 移除圖片 EXIF 資訊 | Canvas 重繪 | L2 | [ ] |
| #066 | 圖片轉 Base64 | 圖片轉 Base64 編碼 | FileReader | L1 | [ ] |
| #067 | Base64 轉圖片 | Base64 轉圖片檔案 | Canvas, Blob | L1 | [ ] |
| #068 | 圖片轉 ASCII | 圖片轉 ASCII 藝術 | Canvas, 字元映射 | L3 | [ ] |
| #069 | 圖片取色器 | 從圖片提取顏色 | Canvas getImageData | L2 | [ ] |
| #070 | 圖片色板產生 | 從圖片生成調色板 | 色彩量化演算法 | L3 | [ ] |
| #071 | 圖片顏色統計 | 統計圖片顏色分布 | Canvas, 直方圖 | L2 | [ ] |
| #072 | 圖片尺寸資訊 | 檢視圖片尺寸、大小、類型 | Image API | L1 | [ ] |
| #073 | 圖片比較器 | 並排比較兩張圖片 | Canvas, Slider | L2 | [ ] |
| #074 | 圖片差異檢測 | 檢測兩張圖片差異 | Canvas 像素比對 | L3 | [ ] |
| #075 | GIF 製作器 | 將多張圖片製作成 GIF | gif.js | L3 | [ ] |
| #076 | GIF 分解器 | 將 GIF 分解為單幀圖片 | gif.js | L2 | [ ] |
| #077 | 圖示產生器 | 產生各尺寸 Favicon/App Icon | Canvas | L2 | [ ] |
| #078 | 佔位圖產生器 | 產生指定尺寸的佔位圖片 | Canvas | L1 | [ ] |
| #079 | 圖片圓角處理 | 為圖片添加圓角 | Canvas clip | L2 | [ ] |
| #080 | 圖片邊框添加 | 為圖片添加邊框 | Canvas | L2 | [ ] |

---

## 分類 03：影音處理工具 (#081-#120)

影片、音訊編輯、轉換、擷取等多媒體處理功能。

| 編號 | 工具名稱 | 功能說明 | 技術重點 | 難度 | 狀態 |
|-----|---------|---------|---------|-----|------|
| #081 | 影片格式轉換 | MP4/WebM/AVI 格式轉換 | FFmpeg.wasm | L4 | [ ] |
| #082 | 影片壓縮器 | 壓縮影片檔案大小 | FFmpeg.wasm | L4 | [ ] |
| #083 | 影片裁切器 | 裁切影片時間區段 | FFmpeg.wasm | L3 | [ ] |
| #084 | 影片合併器 | 合併多個影片檔案 | FFmpeg.wasm | L3 | [ ] |
| #085 | 影片分割器 | 將影片分割為多個片段 | FFmpeg.wasm | L3 | [ ] |
| #086 | 影片轉 GIF | 影片片段轉換為 GIF | FFmpeg.wasm | L3 | [ ] |
| #087 | 影片截圖器 | 從影片擷取畫面 | Canvas, Video | L2 | [ ] |
| #088 | 影片縮圖產生 | 產生影片縮圖預覽 | Canvas, Video | L2 | [ ] |
| #089 | 影片解析度調整 | 調整影片解析度 | FFmpeg.wasm | L3 | [ ] |
| #090 | 影片旋轉器 | 旋轉影片方向 | FFmpeg.wasm | L3 | [ ] |
| #091 | 影片速度調整 | 調整影片播放速度 | FFmpeg.wasm | L3 | [ ] |
| #092 | 影片倒放器 | 影片倒轉播放 | FFmpeg.wasm | L3 | [ ] |
| #093 | 影片靜音處理 | 移除影片聲音 | FFmpeg.wasm | L2 | [ ] |
| #094 | 影片提取音訊 | 從影片提取音訊 | FFmpeg.wasm | L2 | [ ] |
| #095 | 影片加浮水印 | 為影片添加浮水印 | FFmpeg.wasm | L3 | [ ] |
| #096 | 影片加字幕 | 為影片燒錄字幕 | FFmpeg.wasm | L4 | [ ] |
| #097 | 影片資訊檢視 | 檢視影片詳細資訊 | FFmpeg.wasm | L2 | [ ] |
| #098 | 音訊格式轉換 | MP3/WAV/OGG/FLAC 格式轉換 | FFmpeg.wasm | L3 | [ ] |
| #099 | 音訊壓縮器 | 壓縮音訊檔案 | FFmpeg.wasm | L3 | [ ] |
| #100 | 音訊裁切器 | 裁切音訊片段 | Web Audio API | L2 | [ ] |
| #101 | 音訊合併器 | 合併多個音訊檔案 | Web Audio API | L3 | [ ] |
| #102 | 音訊淡入淡出 | 添加淡入淡出效果 | Web Audio API | L2 | [ ] |
| #103 | 音訊音量調整 | 調整音訊音量 | Web Audio API | L2 | [ ] |
| #104 | 音訊速度調整 | 調整音訊播放速度 | Web Audio API | L2 | [ ] |
| #105 | 音訊反轉器 | 音訊倒轉播放 | Web Audio API | L2 | [ ] |
| #106 | 音訊波形顯示 | 顯示音訊波形圖 | Web Audio API, Canvas | L3 | [ ] |
| #107 | 音訊頻譜分析 | 顯示音訊頻譜 | Web Audio API, Canvas | L3 | [ ] |
| #108 | 音訊降噪 | 減少音訊雜訊 | Web Audio API | L4 | [ ] |
| #109 | 音訊均衡器 | 調整音訊頻率均衡 | Web Audio API | L3 | [ ] |
| #110 | 音訊混響效果 | 添加混響效果 | Web Audio API | L3 | [ ] |
| #111 | 音訊資訊檢視 | 檢視音訊詳細資訊 | Web Audio API | L2 | [ ] |
| #112 | 錄音機 | 瀏覽器錄音功能 | MediaRecorder API | L2 | [ ] |
| #113 | 錄影機 | 瀏覽器錄影功能 | MediaRecorder API | L2 | [ ] |
| #114 | 螢幕錄製 | 錄製螢幕畫面 | Screen Capture API | L3 | [ ] |
| #115 | 節拍器 | 音樂節拍器 | Web Audio API | L2 | [ ] |
| #116 | 調音器 | 樂器調音工具 | Web Audio API, FFT | L3 | [ ] |
| #117 | 音高檢測 | 檢測音訊音高 | Web Audio API, FFT | L3 | [ ] |
| #118 | 音訊視覺化 | 音訊視覺化效果 | Web Audio API, Canvas | L3 | [ ] |
| #119 | 白噪音產生器 | 產生白噪音/粉噪音 | Web Audio API | L2 | [ ] |
| #120 | 音調產生器 | 產生指定頻率音調 | Web Audio API | L2 | [ ] |

---

## 分類 04：檔案處理工具 (#121-#160)

檔案轉換、壓縮、分析、比較等檔案處理功能。

| 編號 | 工具名稱 | 功能說明 | 技術重點 | 難度 | 狀態 |
|-----|---------|---------|---------|-----|------|
| #121 | 檔案大小檢視 | 檢視檔案大小與詳細資訊 | File API | L1 | [ ] |
| #122 | 檔案類型檢測 | 檢測檔案真實類型 | Magic Number | L2 | [ ] |
| #123 | 檔案雜湊計算 | 計算檔案 MD5/SHA 雜湊 | SubtleCrypto, Worker | L2 | [ ] |
| #124 | 檔案比較器 | 比較兩個檔案是否相同 | ArrayBuffer 比對 | L2 | [ ] |
| #125 | ZIP 壓縮器 | 壓縮檔案為 ZIP | JSZip | L2 | [ ] |
| #126 | ZIP 解壓縮 | 解壓縮 ZIP 檔案 | JSZip | L2 | [ ] |
| #127 | GZIP 壓縮 | GZIP 壓縮與解壓縮 | pako.js | L2 | [ ] |
| #128 | 檔案分割器 | 將大檔案分割為小檔 | File.slice | L2 | [ ] |
| #129 | 檔案合併器 | 合併分割的檔案 | Blob | L2 | [ ] |
| #130 | 檔案編碼轉換 | 轉換文字檔案編碼 | TextDecoder | L2 | [ ] |
| #131 | PDF 預覽器 | 預覽 PDF 檔案內容 | PDF.js | L2 | [ ] |
| #132 | PDF 合併器 | 合併多個 PDF 檔案 | pdf-lib | L3 | [ ] |
| #133 | PDF 分割器 | 分割 PDF 為多檔 | pdf-lib | L3 | [ ] |
| #134 | PDF 頁面提取 | 提取 PDF 指定頁面 | pdf-lib | L3 | [ ] |
| #135 | PDF 頁面旋轉 | 旋轉 PDF 頁面 | pdf-lib | L2 | [ ] |
| #136 | PDF 壓縮器 | 壓縮 PDF 檔案大小 | pdf-lib | L3 | [ ] |
| #137 | PDF 加密 | 為 PDF 添加密碼保護 | pdf-lib | L3 | [ ] |
| #138 | PDF 解密 | 移除 PDF 密碼保護 | pdf-lib | L3 | [ ] |
| #139 | PDF 轉圖片 | PDF 頁面轉為圖片 | PDF.js, Canvas | L3 | [ ] |
| #140 | 圖片轉 PDF | 將圖片合併為 PDF | pdf-lib | L2 | [ ] |
| #141 | PDF 文字提取 | 從 PDF 提取文字 | PDF.js | L2 | [ ] |
| #142 | Word 轉 PDF | DOCX 轉 PDF | docx.js, pdf-lib | L4 | [ ] |
| #143 | Excel 預覽器 | 預覽 Excel 檔案 | SheetJS | L2 | [ ] |
| #144 | CSV 預覽器 | 預覽 CSV 檔案 | PapaParse | L2 | [ ] |
| #145 | CSV 轉 Excel | CSV 轉換為 Excel | SheetJS | L2 | [ ] |
| #146 | Excel 轉 CSV | Excel 轉換為 CSV | SheetJS | L2 | [ ] |
| #147 | JSON 轉 Excel | JSON 轉換為 Excel | SheetJS | L2 | [ ] |
| #148 | Excel 轉 JSON | Excel 轉換為 JSON | SheetJS | L2 | [ ] |
| #149 | 字幕轉換器 | SRT/VTT/ASS 字幕格式轉換 | 解析器 | L2 | [ ] |
| #150 | 字幕時間調整 | 調整字幕時間軸 | 解析器 | L2 | [ ] |
| #151 | 電子書轉換 | EPUB/MOBI 格式轉換 | epub.js | L4 | [ ] |
| #152 | EPUB 閱讀器 | 線上閱讀 EPUB | epub.js | L3 | [ ] |
| #153 | SVG 預覽器 | 預覽 SVG 檔案 | DOM | L1 | [ ] |
| #154 | SVG 轉 PNG | SVG 轉換為 PNG | Canvas | L2 | [ ] |
| #155 | SVG 優化器 | 優化 SVG 檔案大小 | SVGO | L2 | [ ] |
| #156 | 字型預覽器 | 預覽字型檔案 | FontFace API | L2 | [ ] |
| #157 | 字型轉換器 | TTF/OTF/WOFF 格式轉換 | opentype.js | L3 | [ ] |
| #158 | 字型子集化 | 提取字型子集 | fontmin | L4 | [ ] |
| #159 | 3D 模型預覽 | 預覽 GLTF/OBJ 模型 | Three.js | L3 | [ ] |
| #160 | 檔案重新命名 | 批量重新命名檔案 | File API | L1 | [ ] |

---

## 分類 05：開發者工具 (#161-#200)

程式碼格式化、轉換、產生器等開發輔助功能。

| 編號 | 工具名稱 | 功能說明 | 技術重點 | 難度 | 狀態 |
|-----|---------|---------|---------|-----|------|
| #161 | JSON 格式化 | 格式化與美化 JSON | JSON.parse | L1 | [ ] |
| #162 | JSON 壓縮 | 壓縮 JSON 移除空白 | JSON.stringify | L1 | [ ] |
| #163 | JSON 驗證器 | 驗證 JSON 格式是否正確 | JSON.parse | L1 | [ ] |
| #164 | JSON 路徑查詢 | JSONPath 查詢工具 | jsonpath | L2 | [ ] |
| #165 | JSON 比較器 | 比較兩個 JSON 差異 | diff 演算法 | L2 | [ ] |
| #166 | JSON 轉 TypeScript | 從 JSON 產生 TypeScript 型別 | 解析器 | L2 | [ ] |
| #167 | JSON Schema 產生 | 從 JSON 產生 Schema | 解析器 | L2 | [ ] |
| #168 | JavaScript 格式化 | 格式化 JavaScript 程式碼 | Prettier | L2 | [ ] |
| #169 | JavaScript 壓縮 | 壓縮 JavaScript 程式碼 | Terser | L2 | [ ] |
| #170 | TypeScript 轉譯 | TypeScript 轉 JavaScript | TypeScript | L3 | [ ] |
| #171 | CSS 格式化 | 格式化 CSS 程式碼 | Prettier | L2 | [ ] |
| #172 | CSS 壓縮 | 壓縮 CSS 程式碼 | cssnano | L2 | [ ] |
| #173 | SCSS 轉 CSS | SCSS 編譯為 CSS | sass.js | L3 | [ ] |
| #174 | CSS 前綴添加 | 自動添加瀏覽器前綴 | autoprefixer | L2 | [ ] |
| #175 | HTML 格式化 | 格式化 HTML 程式碼 | Prettier | L2 | [ ] |
| #176 | HTML 壓縮 | 壓縮 HTML 程式碼 | html-minifier | L2 | [ ] |
| #177 | HTML 轉義 | HTML 特殊字元轉義 | DOM API | L1 | [ ] |
| #178 | SQL 格式化 | 格式化 SQL 語句 | sql-formatter | L2 | [ ] |
| #179 | XML 格式化 | 格式化 XML 程式碼 | DOMParser | L2 | [ ] |
| #180 | XML 驗證器 | 驗證 XML 格式 | DOMParser | L1 | [ ] |
| #181 | YAML 轉 JSON | YAML 與 JSON 互轉 | js-yaml | L2 | [ ] |
| #182 | TOML 轉 JSON | TOML 與 JSON 互轉 | toml.js | L2 | [ ] |
| #183 | Cron 表達式產生 | 視覺化建立 Cron 表達式 | cron-parser | L2 | [ ] |
| #184 | UUID 產生器 | 產生各版本 UUID | crypto.randomUUID | L1 | [ ] |
| #185 | ULID 產生器 | 產生 ULID | ulid | L1 | [ ] |
| #186 | JWT 解碼器 | 解碼 JWT Token | base64 | L1 | [ ] |
| #187 | JWT 產生器 | 產生 JWT Token | jose | L2 | [ ] |
| #188 | URL 解析器 | 解析 URL 各部分 | URL API | L1 | [ ] |
| #189 | 查詢字串解析 | 解析 Query String | URLSearchParams | L1 | [ ] |
| #190 | User Agent 解析 | 解析 UA 字串 | ua-parser | L2 | [ ] |
| #191 | 程式碼差異比較 | 比較程式碼差異 | diff2html | L2 | [ ] |
| #192 | 程式碼截圖 | 將程式碼轉為圖片 | Canvas, highlight.js | L3 | [ ] |
| #193 | API 測試工具 | 簡易 API 測試工具 | Fetch API | L2 | [ ] |
| #194 | WebSocket 測試 | WebSocket 連線測試 | WebSocket API | L2 | [ ] |
| #195 | 正則視覺化 | 正則表達式視覺化 | regexper | L3 | [ ] |
| #196 | 色碼轉換器 | HEX/RGB/HSL 色碼轉換 | 色彩轉換 | L1 | [ ] |
| #197 | 時間戳轉換 | Unix 時間戳與日期互轉 | Date API | L1 | [ ] |
| #198 | 位元計算器 | 位元運算工具 | 位元運算 | L1 | [ ] |
| #199 | 程式碼行數統計 | 統計程式碼行數 | 文字處理 | L1 | [ ] |
| #200 | .gitignore 產生 | 產生 .gitignore 檔案 | 模板 | L1 | [ ] |

---

## 本部分進度統計

| 分類 | 已完成 | 開發中 | 計劃中 | 完成度 |
|-----|-------|-------|-------|-------|
| 01 文字處理 | 0 | 0 | 40 | 0% |
| 02 圖片處理 | 0 | 0 | 40 | 0% |
| 03 影音處理 | 0 | 0 | 40 | 0% |
| 04 檔案處理 | 0 | 0 | 40 | 0% |
| 05 開發者工具 | 0 | 0 | 40 | 0% |
| **總計** | **0** | **0** | **200** | **0%** |

---

> 返回 [plan.md](plan.md) | 下一部分 [plan2.md](plan2.md)
