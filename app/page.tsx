'use client';

import { useState } from 'react';

interface Racket {
  id: string;
  brand: string;
  level: 'ENTRY' | 'MID' | 'PRO';
  levelTag: string;
  name: string;
  style: 'Attack' | 'Control' | 'Balanced';
  styleTag: string;
  weight: string;
  balance: string;
  flex: '軟 Soft' | '偏軟 Medium-Soft' | '適中 Medium' | '硬 Stiff' | '特硬 Extra Stiff';
  priceNum: number;
  price: string;
  img: string;
  defaultTension: number;
  maxTension: number;
  shaftScore: number;
  frameType: string;
  recommendedString: string;
  recommendedColor: string;
  desc: string;
  pros: string;
  cons: string;
}

export default function PaiMianV2Page() {
  // 主導覽分頁：home | match | database | wiki | news
  const [activeTab, setActiveTab] = useState<'home' | 'match' | 'database' | 'wiki' | 'news'>('home');

  // 球拍詳情彈窗 (整合規格、配線與購買通路)
  const [detailRacket, setDetailRacket] = useState<Racket | null>(null);

  // 首頁快速搜尋
  const [homeSearch, setHomeSearch] = useState('');

  // ==================== 智慧選拍 6 題互動問卷 State ====================
  const [quizStep, setQuizStep] = useState<number>(1);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [answers, setAnswers] = useState({
    q1_level: 'regular',      // beginner | casual | regular | competitive
    q2_court: 'doubles',      // singles | doubles | both | unsure
    q3_style: 'balanced',     // attack | fast_drive | balanced | control | unsure
    q4_goal: 'speed',         // power | speed | effortless | control | all_round
    q5_pain: 'none',          // clear_hard | slow_swing | weak_smash | unstable | none
    q6_budget: '3000_5000',   // under_1500 | 1500_3000 | 3000_5000 | over_5000 | any
    q7_brand: 'ALL',          // 進階選填：品牌偏好
  });

  // 球拍資料庫篩選與比較 State
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // 知識庫 & 打感座標模擬器 State
  const [activeWikiTopic, setActiveWikiTopic] = useState<'tension' | 'shaft' | 'frame' | 'string' | 'matrix'>('tension');
  const [selectedStringBrand, setSelectedStringBrand] = useState('Yonex');
  const [selectedSimRacket, setSelectedSimRacket] = useState('Astrox 77 Pro');
  const [simWeight, setSimWeight] = useState<'3U' | '4U' | '5U'>('4U');
  const [simTension, setSimTension] = useState<number>(24);
  const [simShaftScore, setSimShaftScore] = useState<number>(55);

  // 五大品牌球拍完整資料庫
  const allRackets: Racket[] = [
    {
      id: 'ax88dp', brand: 'Yonex', level: 'PRO', levelTag: '高階旗艦', name: 'Astrox 88D Pro',
      style: 'Attack', styleTag: '強力進攻', weight: '3U / 4U', balance: '偏頭重', flex: '硬 Stiff',
      priceNum: 5070, price: 'NT$ 5,070', img: '/rackets/88dpro.svg', defaultTension: 26, maxTension: 28, shaftScore: 85,
      frameType: '盒型重殺穩定框', recommendedString: 'Yonex BG-80 (0.68mm)', recommendedColor: '螢光黃 / 珍珠白',
      desc: '後場重殺壓制代表作，頭重感明顯，連續下壓威力強勁。',
      pros: '後場殺球下壓角度尖銳、拍面抗扭穩定性極佳。', cons: '中桿較硬且頭重，平抽防守與被動球需較強小臂發力。'
    },
    {
      id: 'ax100zz', brand: 'Yonex', level: 'PRO', levelTag: '高階旗艦', name: 'Astrox 100ZZ',
      style: 'Attack', styleTag: '極限重殺', weight: '3U / 4U', balance: '頭重', flex: '特硬 Extra Stiff',
      priceNum: 5590, price: 'NT$ 5,590', img: '/rackets/88dpro.svg', defaultTension: 27, maxTension: 28, shaftScore: 95,
      frameType: '緊湊小拍面破風盒框', recommendedString: 'Yonex Exbolt 63 (0.63mm)', recommendedColor: '雪白 / 烈焰紅',
      desc: '頂級實心中桿設計，揮拍風阻小、出球速度極快，專為爆發型選手打造。',
      pros: '揮速快且力量傳導零延遲，連續進攻壓迫感極強。', cons: '拍面甜區較小、中桿極硬，初學或發力不足者極難駕馭。'
    },
    {
      id: 'ax77p', brand: 'Yonex', level: 'PRO', levelTag: '高階旗艦', name: 'Astrox 77 Pro',
      style: 'Balanced', styleTag: '攻守兼備', weight: '3U / 4U', balance: '微頭重', flex: '適中 Medium',
      priceNum: 4870, price: 'NT$ 4,870', img: '/rackets/88dpro.svg', defaultTension: 25, maxTension: 28, shaftScore: 55,
      frameType: '破風盒型複合框', recommendedString: 'Yonex BG-66 Ultimax (0.65mm)', recommendedColor: '耀目白 / 螢光黃',
      desc: '中桿彈性極佳，兼顧後場下壓與中前場連貫，容錯率高的全能型旗艦拍。',
      pros:這份 UI/UX 反饋的切入點非常精準，把原本分散的「AI 選拍、新手配置、購買通路、四象限模擬器」收斂成一條清楚的探索漏斗，無論對一般球友使用還是專題簡報展示都會加分很多。

我已經根據這份 V2 改版建議，幫你把整個 `app/page.tsx` 重新架構並完成程式碼撰寫，包含以下 **六大核心升級**：

1. **全新四大核心入口導覽**：將原本 6 個零散分頁收斂為 **「首頁探索」**、**「智慧選拍」**（整合原本的新手配置）、**「裝備資料庫」**（含多拍規格比較表）、**「羽球知識庫」**（含調整後的「手感配置矩陣」與四大裝備百科）與 **「新品與情報」**[cite: 4]。
2. **首頁改為「產品探索型」版面**：移除一進站就出現的大量教學長文，改為強烈的 主視覺標語（「下一支球拍，從了解自己開始。」）、**快速型號/品牌搜尋框**、**4 個快速探索快捷鍵**，以及**熱門球拍探索卡片**[cite: 5]。
3. **「3 分鐘智慧選拍」6+2 題互動問卷**：採用「一次一題、自動跳轉、進度條顯示」的卡片設計，包含 6 道核心題目（程度、情境、打法、目標、困擾、預算）與 2 道進階選填（偏好品牌、目前球拍）[cite: 7, 8, 9]。
4. **規則篩選＋評分＋AI 混合推薦引擎**：先依預算篩選並透過規格權重算出「**首選推薦 / 偏向進攻的選擇 / 偏向靈活的選擇**」3 支候選球拍（移除容易引起誤解的 `98% 適合度` 假精準分數），並可一鍵呼叫 AI 深度解析推薦理由與建議配線[cite: 10, 11]。
5. **球拍詳情視窗 (Modal) ＆ 球拍 PK 比較功能**：所有推薦結果與資料庫卡片皆可點擊開啟「球拍詳情彈窗」（內含原廠規格、適合族群、推薦線種磅數與購買通路資訊），並支援勾選最多 3 支球拍進行並排規格比較[cite: 4, 11]。
6. **「手感配置矩陣」改版（原四象限模擬器）**：移入「羽球知識庫」的進階工具中，移除未經實測的 `52/100 發力門檻分數` 與 `運動傷害風險等級`，改為更客觀、具專業可信度的「**擊球特性傾向（出球彈性 vs. 落點控制）**」與「**揮拍驅動門檻說明**」。

---

### 更新步驟：替換 `app/page.tsx` 完整程式碼

請在 VS Code 打開 `taiwan-badminton-hub-main/app/page.tsx`，按下 **`Command + A`** 全選刪除舊內容，將以下完整程式碼貼上並按下 **`Command + S`** 存檔：

```tsx
'use client';

import { useState } from 'react';

// ==================== 型別與資料定義 ====================
interface Racket {
  id: string;
  brand: string;
  level: 'ENTRY' | 'MID' | 'PRO';
  levelTag: string;
  name: string;
  style: 'Attack' | 'Control' | 'Balanced' | 'Speed';
  styleTag: string;
  weight: string;
  balance: string;
  flex: string;
  flexScore: number; // 1(極軟) ~ 5(特硬)
  headHeavyScore: number; // 1(頭輕) ~ 5(極頭重)
  maxTension: string;
  priceNum: number;
  price: string;
  img: string;
  defaultTension: number;
  shaftScore: number;
  frameType: string;
  suitableFor: string;
  recommendedString: string;
  desc: string;
  pros: string;
  cons: string;
}

const RACKETS_DATA: Racket[] = [
  {
    id: 'yy-88dp',
    brand: 'Yonex',
    level: 'PRO',
    levelTag: '高階旗艦',
    name: 'Astrox 88D Pro',
    style: 'Attack',
    styleTag: '後場重殺進攻',
    weight: '3U / 4U',
    balance: '頭重 (Head Heavy)',
    flex: '硬 (Stiff)',
    flexScore: 4,
    headHeavyScore: 5,
    maxTension: '4U: 20-28 lbs',
    priceNum: 5070,
    price: 'NT$ 5,070',
    img: '/rackets/88dpro.svg',
    defaultTension: 26,
    shaftScore: 85,
    frameType: '盒型重殺穩定框',
    suitableFor: '具備完整發力基礎、主打雙打後場進攻與單打下壓的球友',
    recommendedString: 'Yonex BG-80 / Exbolt 65 (25-27 lbs)',
    desc: '後場重殺壓制代表作，拍頭配重紮實，連續進攻下壓感極強。',
    pros: '重殺球質極重、拍面穩定抗扭佳',
    cons: '揮重較高，連續防守與平抽需要較佳腕力支撐',
  },
  {
    id: 'yy-100zz',
    brand: 'Yonex',
    level: 'PRO',
    levelTag: '高階旗艦',
    name: 'Astrox 100ZZ',
    style: 'Attack',
    styleTag: '極速連貫重攻',
    weight: '3U / 4U',
    balance: '頭重 (Head Heavy)',
    flex: '特硬 (Extra Stiff)',
    flexScore: 5,
    headHeavyScore: 5,
    maxTension: '4U: 20-28 lbs',
    priceNum: 5590,
    price: 'NT$ 5,590',
    img: '/rackets/88dpro.svg',
    defaultTension: 27,
    shaftScore: 95,
    frameType: '緊湊小拍面破風盒框',
    suitableFor: '爆發力強、揮拍速度快、追求極致連貫進攻的進階選手',
    recommendedString: 'Yonex BG-66UM / Exbolt 63 (26-28 lbs)',
    desc: '頂級旗艦實心超細中桿，揮拍風阻小，回彈恢復速度極快。',
    pros: '連貫進攻節奏極快、點殺尖銳',
    cons: '甜區較集中、中桿極硬，發力門檻為全系列最高',
  },
  {
    id: 'yy-77p',
    brand: 'Yonex',
    level: 'PRO',
    levelTag: '高階旗艦',
    name: 'Astrox 77 Pro',
    style: 'Balanced',
    styleTag: '攻守全面均衡',
    weight: '3U / 4U',
    balance: '微頭重 (Slightly Head Heavy)',
    flex: '適中 (Medium)',
    flexScore: 3,
    headHeavyScore: 4,
    maxTension: '4U: 20-28 lbs',
    priceNum: 4870,
    price: 'NT$ 4,870',
    img: '/rackets/88dpro.svg',
    defaultTension: 25,
    shaftScore: 55,
    frameType: '破風盒型複合框',
    suitableFor: '單雙打皆宜、希望兼具進攻威力與中桿彈性借力的球友',
    recommendedString: 'Yonex Exbolt 65 / BG-66UM (24-26 lbs)',
    desc: '國際賽場高人氣全面型戰拍，中桿彈性優異，拉吊與突擊順暢。',
    pros: '上手門檻相對親民、高遠球與殺球轉換流暢',
    cons: '極限重殺威力略遜於 88D Pro',
  },
  {
    id: 'yy-88g',
    brand: 'Yonex',
    level: 'MID',
    levelTag: '中階進階',
    name: 'Astrox 88 Game',
    style: 'Attack',
    styleTag: '親民進攻入門',
    weight: '4U',
    balance: '微頭重 (Slightly Head Heavy)',
    flex: '適中 (Medium)',
    flexScore: 3,
    headHeavyScore: 4,
    maxTension: '4U: 20-28 lbs',
    priceNum: 2470,
    price: 'NT$ 2,470',
    img: '/rackets/88dpro.svg',
    defaultTension: 23,
    shaftScore: 48,
    frameType: '流線破風混合框',
    suitableFor: '預算三千內、想體驗進攻拍手感但發力仍在成長的進階新手',
    recommendedString: 'Yonex BG-66UM / VBS-66N (22-24 lbs)',
    desc: '承襲 Pro 版框型設計，中桿調校更為親民好借力，性價比出色。',
    pros: '好上手不費力、兼具一定下壓感',
    cons: '高磅數下拍框抗扭穩定度不如旗艦款',
  },
  {
    id: 'yy-arc7p',
    brand: 'Yonex',
    level: 'ENTRY',
    levelTag: '平價入門',
    name: 'Arcsaber 7 Play',
    style: 'Control',
    styleTag: '控球省力甜區大',
    weight: '4U',
    balance: '平衡 (Even Balance)',
    flex: '偏軟 (Hi-Flex)',
    flexScore: 2,
    headHeavyScore: 3,
    maxTension: '4U: 19-27 lbs',
    priceNum: 1430,
    price: 'NT$ 1,430',
    img: '/rackets/88dpro.svg',
    defaultTension: 21,
    shaftScore: 25,
    frameType: '大甜區穩定盒框',
    suitableFor: '剛接觸羽球、重視甜區容錯率與輕鬆打高遠球的初學者',
    recommendedString: 'Yonex BG-65 / Victor VBS-70 (20-22 lbs)',
    desc: '專為控球與穩定度設計，拍面甜區寬廣，非中心點擊球依然穩定。',
    pros: '容錯率極高、價格親民好入手',
    cons: '中桿較軟，高階選手全力重殺時會有形變延遲',
  },
  {
    id: 'vic-ryuga2p',
    brand: 'Victor',
    level: 'PRO',
    levelTag: '高階旗艦',
    name: 'Thruster Ryuga II Pro (龍牙二代)',
    style: 'Attack',
    styleTag: '重砲連續進攻',
    weight: '3U / 4U',
    balance: '頭重 (Head Heavy)',
    flex: '硬 (Stiff)',
    flexScore: 4,
    headHeavyScore: 5,
    maxTension: '4U: ≤ 31 lbs',
    priceNum: 5070,
    price: 'NT$ 5,070',
    img: '/rackets/ryuga2.svg',
    defaultTension: 26,
    shaftScore: 88,
    frameType: '威力盒型進攻框',
    suitableFor: '偏好後場重扣、喜歡懸浮核心握柄清脆濾震手感的進攻球友',
    recommendedString: 'Victor VBS-66N / Yonex BG-80 (25-27 lbs)',
    desc: '搭載懸浮核心科技人造柄，重殺傳導集中且下壓角度尖銳。',
    pros: '爆發力強悍、高磅承受度極高',
    cons: '揮重明顯，雙打前場封網需較快反應',
  },
  {
    id: 'vic-ars9000',
    brand: 'Victor',
    level: 'MID',
    levelTag: '中階進階',
    name: 'Auraspeed 9000 (神速 9000)',
    style: 'Speed',
    styleTag: '極速平抽防守',
    weight: '4U / 5U',
    balance: '頭輕至平衡 (Head Light)',
    flex: '適中 (Medium)',
    flexScore: 3,
    headHeavyScore: 2,
    maxTension: '4U: ≤ 28 lbs',
    priceNum: 2080,
    price: 'NT$ 2,080',
    img: '/rackets/ryuga2.svg',
    defaultTension: 23,
    shaftScore: 45,
    frameType: '極速全破風框',
    suitableFor: '雙打前場封網、中場平抽快攻以及喜歡輕快揮拍節奏的球友',
    recommendedString: 'Victor VBS-63 / Yonex Exbolt 63 (22-24 lbs)',
    desc: '破風框設計大幅降低空氣阻力，出拍速度極快，防守反擊靈活。',
    pros: '揮拍極度輕快、平抽連貫性佳',
    cons: '後場單純靠拍頭重量下壓的借力感較少',
  },
  {
    id: 'vic-tk9500',
    brand: 'Victor',
    level: 'ENTRY',
    levelTag: '平價入門',
    name: 'Challenge 9500 (TK-9500)',
    style: 'Balanced',
    styleTag: '國民耐打入門拍',
    weight: '3U / 4U',
    balance: '微頭重 (Slightly Head Heavy)',
    flex: '偏軟 (Medium-Soft)',
    flexScore: 2,
    headHeavyScore: 3,
    maxTension: '4U: ≤ 26 lbs',
    priceNum: 1280,
    price: 'NT$ 1,280',
    img: '/rackets/ryuga2.svg',
    defaultTension: 21,
    shaftScore: 32,
    frameType: '經典穩定盒型框',
    suitableFor: '學生族群、羽球社團新生以及需要耐敲耐打練習拍的球友',
    recommendedString: 'Victor VBS-70 / Yonex BG-65 (20-22 lbs)',
    desc: '台灣羽球界長青國民入門款，結構堅固耐用，輕鬆打出深遠高遠球。',
    pros: '性價比極高、耐撞耐用、好借力',
    cons: '整體手感較為傳統，細膩網前控球回饋較一般',
  },
  {
    id: 'flt-w1000',
    brand: 'Fleet',
    level: 'PRO',
    levelTag: '高階旗艦',
    name: 'Woven 1000 EVO',
    style: 'Attack',
    styleTag: '破風穩定重攻',
    weight: '3U / 4U',
    balance: '微頭重 (Slightly Head Heavy)',
    flex: '硬 (Stiff)',
    flexScore: 4,
    headHeavyScore: 4,
    maxTension: '4U: 20-28 lbs',
    priceNum: 3800,
    price: 'NT$ 3,800',
    img: '/rackets/woven1000.svg',
    defaultTension: 25,
    shaftScore: 78,
    frameType: '八面破風穩定框',
    suitableFor: '追求高抗扭紮實手感、高性價比旗艦性能的進階與校隊球友',
    recommendedString: 'Gosen G-Tone 5 / Yonex BG-80 (24-26 lbs)',
    desc: '台灣在地口碑旗艦進化版，全拍採用 Woven 編織碳纖維，紮實抗扭。',
    pros: '擊球感紮實穩重、價格較日系旗艦親民',
    cons: '中桿較硬挺，需具備一定揮拍速度才能發揮彈性',
  },
  {
    id: 'flt-pro3000',
    brand: 'Fleet',
    level: 'MID',
    levelTag: '中階進階',
    name: 'Professional 3000 VI',
    style: 'Control',
    styleTag: '流體破風控球',
    weight: '3U / 4U',
    balance: '平衡 (Even Balance)',
    flex: '適中 (Medium)',
    flexScore: 3,
    headHeavyScore: 3,
    maxTension: '4U: 20-28 lbs',
    priceNum: 3200,
    price: 'NT$ 3,200',
    img: '/rackets/woven1000.svg',
    defaultTension: 24,
    shaftScore: 52,
    frameType: '流體破風框',
    suitableFor: '喜歡拉吊突擊、雙打中前場輪轉與精準落點控制的球友',
    recommendedString: 'Kizuna Z63 / Yonex BG-66UM (23-25 lbs)',
    desc: '經典平衡型破風拍，揮速流暢且控球指向性明確。',
    pros: '攻守轉換零負擔、適應期極短',
    cons: '重殺一拍擊穿對手防線的威懾力較溫和',
  },
  {
    id: 'jnc-white',
    brand: 'JNICE',
    level: 'MID',
    levelTag: '中階明星',
    name: '白羽刃 (White Blade)',
    style: 'Speed',
    styleTag: '高顏值雙向破風',
    weight: '4U',
    balance: '平衡 (Even Balance)',
    flex: '適中 (Medium)',
    flexScore: 3,
    headHeavyScore: 3,
    maxTension: '4U: ≤ 28 lbs',
    priceNum: 2680,
    price: 'NT$ 2,680',
    img: '/rackets/woven1000.svg',
    defaultTension: 24,
    shaftScore: 50,
    frameType: '雙向破風框',
    suitableFor: '重視揮拍流暢度、喜歡高彈性中桿與純白外觀設計的球友',
    recommendedString: 'Kizuna Z63 / Yonex BG-66UM (23-25 lbs)',
    desc: '雙向破風框搭配高彈性中桿，平抽快擋輕鬆省力，口碑極佳。',
    pros: '中桿彈性回饋清晰、平抽快擋順手',
    cons: '頭重感較輕，後場重殺需靠自身手腕加速',
  },
  {
    id: 'jnc-wind2000',
    brand: 'JNICE',
    level: 'ENTRY',
    levelTag: '平價入門',
    name: '追風 2000 (Wind Speed)',
    style: 'Speed',
    styleTag: '輕量破風入門',
    weight: '4U',
    balance: '平衡 (Even Balance)',
    flex: '偏軟 (Soft)',
    flexScore: 2,
    headHeavyScore: 2,
    maxTension: '4U: ≤ 26 lbs',
    priceNum: 1280,
    price: 'NT$ 1,280',
    img: '/rackets/woven1000.svg',
    defaultTension: 20,
    shaftScore: 24,
    frameType: '全破風輕量框',
    suitableFor: '力量較小的初學者、女性球友以及重視揮拍輕巧無負擔的新手',
    recommendedString: 'Kawasaki K-65 / Yonex BG-65 (20-22 lbs)',
    desc: '全破風輕量化框型搭配軟中桿，揮拍無壓力，輕鬆打出高遠球。',
    pros: '揮拍極輕省力、預算負擔極低',
    cons: '高階強攻對抗下拍框穩定度較基礎',
  },
];

const BADMINTON_STRINGS = [
  { brand: 'Yonex', name: 'BG-66 Ultimax (BG66UM)', gauge: '0.65 mm', type: '高彈極速', desc: '全球極受歡迎的高彈細線，擊球聲音響亮金屬感強，高遠球與扣殺回彈極快。', colors: ['耀目白', '螢光黃', '炫彩紅', '冰藍', '櫻花粉', '極光黑'] },
  { brand: 'Yonex', name: 'BG-65', gauge: '0.70 mm', type: '耐打長青', desc: '羽球界普及度最高的耐打粗線，耐用度極高，適合新手與學校球隊。', colors: ['經典白', '曜石黑', '活力橘', '寶藍', '草綠', '螢光黃'] },
  { brand: 'Yonex', name: 'Exbolt 63 (EXB63)', gauge: '0.63 mm', type: '極速高彈', desc: '採用鍛造纖維，擁有超強耐久度與極快音速出球打感。', colors: ['雪白', '炫光黃', '烈焰紅'] },
  { brand: 'Yonex', name: 'BG-80', gauge: '0.68 mm', type: '硬彈爆發', desc: '塗層帶有粗糙感，硬挺打感，殺球傳導極度直接紮實。', colors: ['珍珠白', '螢光黃', '深灰'] },
  { brand: 'Victor', name: 'VBS-66 Nano (VBS-66N)', gauge: '0.66 mm', type: '高彈連貫', desc: '高科技奈米碳纖維包裹，具有極佳彈性與優異擊球音。', colors: ['象牙白', '螢光黃', '珊瑚粉', '賽道藍', '炫酷黑'] },
  { brand: 'Victor', name: 'VBS-70', gauge: '0.70 mm', type: '極致耐打', desc: '高集束尼龍芯體，耐磨耐打性能頂級，性價比極高。', colors: ['純白', '螢光黃', '曜石黑', '海藍'] },
  { brand: 'Kizuna', name: 'Z63 Premium (Z63)', gauge: '0.63 mm', type: '日本高彈', desc: '日本製造頂級細線，以超高彈性與高金屬音著稱。', colors: ['高雅白', '螢光黃', '櫻桃紅', '冰雪藍'] },
  { brand: 'Gosen', name: 'G-Tone 5 (GT5)', gauge: '0.65 mm', type: '金屬高音', desc: '日本 GOSEN 獨家科技，金屬擊球音震撼，高彈爆發力強。', colors: ['珍珠白', '螢光黃', '爆裂橘', '炫彩紫', '櫻花粉'] },
  { brand: 'Li-Ning', name: 'No.1 (李寧 1 號線)', gauge: '0.65 mm', type: '高彈主流', desc: '吸震性好、反彈力高，深受雙打與進攻選手歡迎。', colors: ['純白', '螢光黃', '中國紅', '薄荷綠', '酷黑'] },
  { brand: 'Mizuno', name: 'ML65 Smooth', gauge: '0.65 mm', type: '細線高彈', desc: '日本高彈科技塗層，出球乾淨俐落，平抽反應迅速。', colors: ['雪白', '螢光黃', '珊瑚橘'] },
];

export default function PaiMianHomePage() {
  // 主導覽狀態（精簡為五大核心入口：首頁、智慧選拍、裝備資料庫、羽球知識庫、新品情報）
  const [activeTab, setActiveTab] = useState<'home' | 'smart-match' | 'database' | 'wiki' | 'news'>('home');

  // 球拍詳情彈窗 (Modal) & 多拍比較陣列
  const [detailRacket, setDetailRacket] = useState<Racket null |>(null);
  const [compareIds, setCompareIds] = useState<string[]>(['yy-77p', 'yy-88dp']);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // ==================== 智慧選拍 V2：6+2 互動問卷 State ====================
  const [quizStep, setQuizStep] = useState<number>(1); // 1~6 核心題, 7 進階選填, 8 結果頁
  const [answers, setAnswers] = useState({
    level: 'casual', // beginner | casual | regular | competitive
    scenario: 'doubles', // singles | doubles | both | unsure
    playStyle: 'balanced', // attack | speed | balanced | control | unsure
    goal: 'balanced', // power | speed | effortless | control | balanced
    painPoint: 'none', // clear_hard | slow_swing | weak_smash | unstable | none
    budget: 3000, // 1500 | 3000 | 5000 | 99999
    brandPref: 'ALL',
    currentRacket: '',
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<any>(null);

  // ==================== 裝備資料庫篩選 State ====================
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // ==================== 羽球知識庫與「手感配置矩陣」State ====================
  const [activeWikiTopic, setActiveWikiTopic] = useState<'tension' | 'shaft' | 'frame' | 'string' | 'matrix'>('tension');
  const [selectedStringBrand, setSelectedStringBrand] = useState('Yonex');
  const [selectedSimRacket, setSelectedSimRacket] = useState('Astrox 77 Pro');
  const [simWeight, setSimWeight] = useState<'3U' | '4U' | '5U'>('4U');
  const [simTension, setSimTension] = useState<number>(24);
  const [simShaftScore, setSimShaftScore] = useState<number>(55);
  const [simFrameType, setSimFrameType] = useState<string>('破風盒型複合框');

  // 切換比較清單
  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) return [...prev.slice(1), id]; // 最多比較 3 支
      return [...prev, id];
    });
  };

  // ==================== 規則篩選 ＋ 規格評分推薦引擎 ====================
  const getMatchedRackets = () => {
    // 1. 預算優先過濾
    const withinBudget = RACKETS_DATA.filter((r) => r.priceNum <= answers.budget);
    const pool = withinBudget.length >= 3 ? withinBudget : RACKETS_DATA;
    const budgetRelaxed = withinBudget.length < 3;

    // 2. 依據問卷計算每支球拍的規則匹配度（不顯示假精準百分比，僅用於排序與方向分類）
    const scored = pool.map((r) => {
      let score = 0;

      // 程度與操作門檻 (20%)
      if (answers.level === 'beginner') {
        if (r.level === 'ENTRY') score += 30;
        else if (r.level === 'MID') score += 10;
        else score -= 20;
      } else if (answers.level === 'casual') {
        if (r.level === 'ENTRY' || r.level === 'MID') score += 25;
      } else if (answers.level === 'regular') {
        if (r.level === 'MID' || r.level === 'PRO') score += 25;
      } else {
        if (r.level === 'PRO') score += 30;
      }

      // 改善目標 (30%)
      if (answers.goal === 'power' && r.headHeavyScore >= 4) score += 30;
      if (answers.goal === 'speed' && r.style === 'Speed') score += 30;
      if (answers.goal === 'effortless' && r.flexScore <= 2) score += 30;
      if (answers.goal === 'control' && r.style === 'Control') score += 30;
      if (answers.goal === 'balanced' && (r.style === 'Balanced' || r.flexScore === 3)) score += 30;

      // 打法偏好 (25%)
      if (answers.playStyle === 'attack' && r.style === 'Attack') score += 25;
      if (answers.playStyle === 'speed' && r.style === 'Speed') score += 25;
      if (answers.playStyle === 'control' && r.style === 'Control') score += 25;
      if (answers.playStyle === 'balanced' && r.style === 'Balanced') score += 25;

      // 困擾修正 (15%)
      if (answers.painPoint === 'clear_hard' && r.flexScore <= 3) score += 15;
      if (answers.painPoint === 'slow_swing' && r.headHeavyScore <= 3) score += 15;
      if (answers.painPoint === 'weak_smash' && r.headHeavyScore >= 4) score += 15;
      if (answers.painPoint === 'unstable' && r.frameType.includes('盒')) score += 15;

      // 品牌加分 (10%)
      if (answers.brandPref !== 'ALL' && r.brand === answers.brandPref) score += 12;

      return { racket: r, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const primary = scored[0]?.racket || RACKETS_DATA[2];
    const attackAlt =
      scored.find((s) => s.racket.id !== primary.id && (s.racket.style === 'Attack' || s.racket.headHeavyScore >= 4))?.racket ||
      scored[1]?.racket ||
      RACKETS_DATA[0];
    const agileAlt =
      scored.find((s) => s.racket.id !== primary.id && s.racket.id !== attackAlt.id)?.racket ||
      scored[2]?.racket ||
      RACKETS_DATA[6];

    return { primary, attackAlt, agileAlt, budgetRelaxed };
  };

  // 呼叫後端 AI 生成白話推薦理由與配線建議
  const fetchAiMatchDetails = async (matched: { primary: Racket; attackAlt: Racket; agileAlt: Racket }) => {
    setAiLoading(true);
    setAiExplanation(null);
    try {
      const summaryPrompt = `使用者程度:${answers.level}，情境:${answers.scenario}，打法:${answers.playStyle}，目標:${answers.goal}，困擾:${answers.painPoint}，預算上限:${answers.budget}元。系統已篩選出三支候選球拍：首選「${matched.primary.name}」、進攻選擇「${matched.attackAlt.name}」、靈活選擇「${matched.agileAlt.name}」。請以台灣專業羽球教練與穿線師角度，用白話解析這三支球拍各自適合的原因與取捨，並推薦搭配的羽球線與磅數。`;

      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playStyle: answers.playStyle,
          preferredWeight: '4U',
          budget: answers.budget,
          isBeginner: answers.level === 'beginner',
          userPrompt: summaryPrompt,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiExplanation(data.data);
      }
    } catch {
      // 若 API 暫時無回應，前端仍保有完整的規則推薦結果不影響體驗
    } finally {
      setAiLoading(false);
    }
  };

  // 問卷選項點擊處理（一次只問一題，自動推進下一題）
  const handleSelectQuizOption = (field: keyof typeof answers, value: any, nextStep: number) => {
    const updated = { ...answers, [field]: value };
    setAnswers(updated);
    setQuizStep(nextStep);
    if (nextStep === 8) {
      const matched = getMatchedRackets();
      fetchAiMatchDetails(matched);
    }
  };

  // 套用球拍至知識庫中的「手感配置矩陣」
  const handleSelectRacketForSim = (racketName: string) => {
    setSelectedSimRacket(racketName);
    const found = RACKETS_DATA.find((r) => r.name === racketName);
    if (found) {
      setSimTension(found.defaultTension);
      setSimShaftScore(found.shaftScore);
      setSimFrameType(found.frameType);
      if (found.weight.includes('4U')) setSimWeight('4U');
      else if (found.weight.includes('3U')) setSimWeight('3U');
    }
  };

  // 手感配置矩陣客觀物理傾向計算（移除未經實測的精確分數與醫療風險判定）
  const getMatrixCharacteristics = () => {
    const isHighTension = simTension >= 24;
    const isStiffFrame = simShaftScore >= 55;

    let zoneTitle = '';
    let zoneSummary = '';
    let driveThreshold = '';
    let sweetSpotDesc = '';

    if (isStiffFrame && isHighTension) {
      zoneTitle = '高張力控殺象限（高磅 × 硬挺中桿/穩定框）';
      zoneSummary = '線床與中桿形變幅度小，力量傳導直接，網前小球與重殺落點指向性高；由於缺少彈簧借力效應，需要較佳的揮拍速度與小臂鞭甩發力來驅動。';
      driveThreshold = '進階驅動門檻：適合具備完整揮拍發力節奏、追求精準控球與重殺壓制的球友。';
      sweetSpotDesc = '甜區較集中：擊中拍面中心時球質紮實，偏離中心時回饋較直接。';
    } else if (isStiffFrame && !isHighTension) {
      zoneTitle = '借力重殺甜蜜象限（中低磅 × 硬挺中桿/進攻框）';
      zoneSummary = '透過穩定拍框維持擊球方向，同時藉由較低磅數的線床彈性輔助出球，在進攻下壓與高遠球省力之間取得平衡。';
      driveThreshold = '中階驅動門檻：適合想嘗試進攻型球拍、同時希望保留線床彈性輔助的球友。';
      sweetSpotDesc = '甜區適中：兼具一定控球穩定度與非中心點擊球容錯率。';
    } else if (!isStiffFrame && !isHighTension) {
      zoneTitle = '高彈省力友善象限（低磅 × 彈性中桿/破風框）';
      zoneSummary = '線床凹陷回彈與中桿鞭甩效應明顯，輕快揮拍即可將球送至後場底線，對初學者與力量較小者最為友善。';
      driveThreshold = '輕鬆驅動門檻：無需刻意發猛力即可輕鬆借力，適合入門與休閒球友。';
      sweetSpotDesc = '甜區寬廣：容錯率高，非中心點觸球依然能穩定過網。';
    } else {
      zoneTitle = '高速平抽連貫象限（高磅 × 彈性中桿/破風框）';
      zoneSummary = '高磅提供快速出球反應與清脆擊球音，搭配破風框與彈性中桿，適合雙打中前場快速平抽擋與連續突擊。';
      driveThreshold = '中高驅動門檻：適合雙打節奏快、重視出球速度與連續揮拍靈活度的球友。';
      sweetSpotDesc = '甜區偏快彈：出球乾脆俐落，適合快節奏平抽對抗。';
    }

    return {
      zoneTitle,
      zoneSummary,
      driveThreshold,
      sweetSpotDesc,
      xPercent: Math.min(94, Math.max(6, ((simTension - 18) / 12) * 88 + 6)),
      yPercent: Math.min(94, Math.max(6, 100 - (simShaftScore * 0.88 + 6))),
    };
  };

  const matrixInfo = getMatrixCharacteristics();

  const filteredRackets = RACKETS_DATA.filter((racket) => {
    const matchesBrand = selectedBrand === 'ALL' || racket.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesLevel = selectedLevel === 'ALL' || racket.level === selectedLevel;
    const matchesQuery =
      racket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      racket.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      racket.styleTag.includes(searchQuery);
    return matchesBrand && matchesLevel && matchesQuery;
  });

  const filteredStrings = BADMINTON_STRINGS.filter((s) => s.brand === selectedStringBrand);
  const comparedRackets = RACKETS_DATA.filter((r) => compareIds.includes(r.id));

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#222222] font-sans flex flex-col justify-between">
      {/* ==================== 頂部導覽列（收斂為清晰產品架構） ==================== */}
      <header className="border-b border-slate-200/80 bg-[#FAF9F5]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-2.5 cursor-pointer select-none"
          >
            <div className="w-7 h-7 rounded-full border-2 border-[#16382B] flex items-center justify-center bg-white">
              <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></div>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#16382B]">
              拍面 <span className="text-xs font-medium text-slate-500 tracking-widest uppercase ml-1">PaiMian</span>
            </span>
          </div>

          <nav className="flex items-center space-x-1 sm:space-x-6 text-sm font-medium mt-3 sm:mt-0 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'home', label: '首頁探索' },
              { id: 'smart-match', label: '智慧選拍' },
              { id: 'database', label: '裝備資料庫' },
              { id: 'wiki', label: '羽球知識庫' },
              { id: 'news', label: '新品與情報' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 py-1.5 transition-all whitespace-nowrap relative ${
                  activeTab === tab.id
                    ? 'text-[#16382B] font-bold'
                    : 'text-slate-600 hover:text-[#16382B]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#C5A059] rounded-full" />
                )}
              </button>
            ))}

            {/* 浮動球拍比較按鈕 */}
            <button
              onClick={() => setShowCompareModal(true)}
              className="ml-2 px-3 py-1.5 bg-[#16382B] text-white text-xs font-bold rounded-full hover:bg-[#122e23] transition flex items-center space-x-1.5 whitespace-nowrap shadow-sm"
            >
              <span>球拍比較</span>
              <span className="bg-[#C5A059] text-white px-1.5 py-0.2 rounded-full text-[10px]">
                {compareIds.length}
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* ==================== 主要內容區 ==================== */}
      <main className="max-w-6xl mx-auto px-6 py-8 sm:py-12 flex-1 w-full">
        
        {/* ==================== 1. 首頁探索（聚焦核心任務：選拍、搜尋、熱門推薦） ==================== */}
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fade-in">
            {/* Hero 產品主視覺區 */}
            <section className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 shadow-sm relative overflow-hidden">
              <div className="max-w-2xl space-y-6 relative z-10">
                <span className="inline-block px-3 py-1 bg-[#16382B]/10 text-[#16382B] text-xs font-bold rounded-full tracking-wide">
                  羽球裝備探索平台
                </span>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#16382B] leading-[1.15]">
                  下一支球拍，<br />從了解自己開始。
                </h1>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  幫助台灣羽球愛好者，根據打法習慣、程度與預算，找到真正適合自己的球拍與羽球線配置。
                </p>

                {/* 主行動按鈕 + 快速搜尋列 */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      setQuizStep(1);
                      setActiveTab('smart-match');
                    }}
                    className="w-full sm:w-auto px-8 py-4 bg-[#16382B] text-white font-bold rounded-xl hover:bg-[#122e23] transition shadow-md flex items-center justify-center space-x-2 text-base"
                  >
                    <span>開始探索適合我的球拍（3 分鐘問卷）</span>
                    <span>→</span>
                  </button>

                  <div className="relative max-w-md">
                    <input
                      type="text"
                      placeholder="🔍 搜尋球拍型號、品牌、打法（例如：77 Pro、Yonex、進攻）..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setActiveTab('database');
                      }}
                      className="w-full pl-4 pr-20 py-3 bg-[#FAF9F5] border border-slate-300 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-[#16382B] focus:bg-white transition"
                    />
                    <button
                      onClick={() => setActiveTab('database')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700"
                    >
                      搜尋
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 快速探索四大入口卡片 */}
            <section className="space-y-4">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">快速探索</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    setQuizStep(1);
                    setActiveTab('smart-match');
                  }}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-[#16382B] text-left transition shadow-sm group space-y-2"
                >
                  <div className="text-2xl">🎯</div>
                  <div className="font-bold text-[#16382B] group-hover:underline">智慧選拍問卷</div>
                  <p className="text-xs text-slate-500">不懂規格也沒關係，6 題找出適合方向</p>
                </button>

                <button
                  onClick={() => setActiveTab('database')}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-[#16382B] text-left transition shadow-sm group space-y-2"
                >
                  <div className="text-2xl">🗂️</div>
                  <div className="font-bold text-[#16382B] group-hover:underline">進階規格篩選</div>
                  <p className="text-xs text-slate-500">依品牌、預算級別與打法條件篩選</p>
                </button>

                <button
                  onClick={() => setShowCompareModal(true)}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-[#16382B] text-left transition shadow-sm group space-y-2"
                >
                  <div className="text-2xl">⚖️</div>
                  <div className="font-bold text-[#16382B] group-hover:underline">多拍並排比較</div>
                  <p className="text-xs text-slate-500">同框對照重量、平衡點、中桿與價位</p>
                </button>

                <button
                  onClick={() => setActiveTab('wiki')}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-[#16382B] text-left transition shadow-sm group space-y-2"
                >
                  <div className="text-2xl">📘</div>
                  <div className="font-bold text-[#16382B] group-hover:underline">裝備知識與矩陣</div>
                  <p className="text-xs text-slate-500">看懂磅數、中桿、拍框與七大品牌球線</p>
                </button>
              </div>
            </section>

            {/* 熱門球拍探索 */}
            <section className="space-y-5">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-[#16382B]">熱門球拍探索</h2>
                  <p className="text-xs text-slate-500 mt-1">精選各級別具代表性的熱門型號，點擊查看完整規格與購買通路</p>
                </div>
                <button
                  onClick={() => setActiveTab('database')}
                  className="text-sm font-bold text-[#16382B] hover:text-[#C5A059] transition"
                >
                  查看全部 ({RACKETS_DATA.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {RACKETS_DATA.slice(0, 4).map((racket) => (
                  <div
                    key={racket.id}
                    className="bg-white rounded-xl border border-slate-200 hover:border-[#C5A059] transition shadow-sm overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div
                        onClick={() => setDetailRacket(racket)}
                        className="h-44 bg-slate-50 p-4 flex items-center justify-center relative cursor-pointer group border-b border-slate-100"
                      >
                        <img
                          src={racket.img}
                          alt={racket.name}
                          className="h-full object-contain group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute top-3 left-3 text-[11px] font-bold px-2 py-0.5 bg-[#16382B] text-white rounded">
                          {racket.brand}
                        </span>
                        <span className="absolute top-3 right-3 text-[11px] font-semibold px-2 py-0.5 bg-slate-200/80 text-slate-700 rounded">
                          {racket.levelTag}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="text-xs font-semibold text-[#C5A059]">{racket.styleTag}</div>
                        <h3 className="font-bold text-base text-[#16382B]">{racket.name}</h3>
                        <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600 pt-1">
                          <span className="px-2 py-0.5 bg-slate-100 rounded">{racket.weight}</span>
                          <span className="px-2 py-0.5 bg-slate-100 rounded">{racket.flex}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-slate-100">
                      <span className="text-sm font-extrabold text-slate-800">{racket.price}</span>
                      <button
                        onClick={() => setDetailRacket(racket)}
                        className="text-xs font-bold text-[#16382B] hover:underline"
                      >
                        查看詳細規格 →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ==================== 2. 智慧選拍 V2（6+2 互動式問卷與結果頁） ==================== */}
        {activeTab === 'smart-match' && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            {quizStep <= 7 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
                {/* 進度條與返回控制 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                    <span className="text-[#C5A059] tracking-widest uppercase">PAIMIAN / SMART MATCH</span>
                    <span>
                      {quizStep <= 6 ? `基本問卷：第 ${quizStep} 題，共 6 題` : '進階選填（讓結果更貼近習慣）'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (quizStep / 7) * 100)}%` }}
                      className="h-full bg-[#16382B] transition-all duration-300"
                    ></div>
                  </div>
                </div>

                {/* Q1: 程度 */}
                {quizStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-extrabold text-[#16382B]">你目前的羽球程度？</h2>
                      <p className="text-sm text-slate-500">依照平常實際打球的情況選擇即可，系統會據此過濾操作門檻過高的球拍。</p>
                    </div>
                    <div className="space-y-3">
                      {[
                        { val: 'beginner', title: '剛開始接觸', desc: '還在熟悉握拍、發球與基本高遠球動作' },
                        { val: 'casual', title: '偶爾打球', desc: '以休閒運動為主，能基本來回對打' },
                        { val: 'regular', title: '固定打球', desc: '每週固定約球，已有自己的雙打或單打習慣' },
                        { val: 'competitive', title: '有系統訓練或比賽經驗', desc: '校隊、系隊或常參加業餘分級賽，具備完整發力動作' },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          onClick={() => handleSelectQuizOption('level', opt.val, 2)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition flex justify-between items-center ${
                            answers.level === opt.val
                              ? 'border-[#16382B] bg-[#16382B]/5'
                              : 'border-slate-200 hover:border-[#C5A059]'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-[#16382B] text-base">{opt.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                          </div>
                          <span className="text-slate-400">→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Q2: 情境 */}
                {quizStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-extrabold text-[#16382B]">你最常打哪一種賽制？</h2>
                      <p className="text-sm text-slate-500">雙打重視連續揮速與平抽，單打則重視拍頭慣性與拉吊穩定度。</p>
                    </div>
                    <div className="space-y-3">
                      {[
                        { val: 'doubles', title: '以雙打為主', desc: '節奏較快，常需要網前封網、平抽快擋與後場輪轉進攻' },
                        { val: 'singles', title: '以單打為主', desc: '場地覆蓋大，重視高遠球深度、四方球拉吊與一拍重殺' },
                        { val: 'both', title: '單打與雙打都會打', desc: '希望球拍具備良好的全能適應性' },
                        { val: 'unsure', title: '不確定 / 隨意場上輪轉', desc: '目前以輕鬆流汗為主，沒有固定位置' },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          onClick={() => handleSelectQuizOption('scenario', opt.val, 3)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition flex justify-between items-center ${
                            answers.scenario === opt.val
                              ? 'border-[#16382B] bg-[#16382B]/5'
                              : 'border-slate-200 hover:border-[#C5A059]'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-[#16382B] text-base">{opt.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                          </div>
                          <span className="text-slate-400">→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Q3: 打法 */}
                {quizStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-extrabold text-[#16382B]">你比較喜歡哪種打法節奏？</h2>
                      <p className="text-sm text-slate-500">如果不確定也沒關係，選擇「不確定」系統會為你優先挑選均衡好上手的款式。</p>
                    </div>
                    <div className="space-y-3">
                      {[
                        { val: 'attack', title: '強力進攻型', desc: '喜歡在後場起跳殺球、連續下壓主導得分' },
                        { val: 'speed', title: '快速平抽防守型', desc: '喜歡快速連續回球、前場搶點封網與防守反擊' },
                        { val: 'balanced', title: '攻守均衡型', desc: '進攻與防守並重，隨場上機會切換節奏' },
                        { val: 'control', title: '控球落點型', desc: '擅長網前搓放、切球吊球與精準調動對手' },
                        { val: 'unsure', title: '不確定 / 還在摸索風格', desc: '希望先找一支各方面表現穩定的標準球拍' },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          onClick={() => handleSelectQuizOption('playStyle', opt.val, 4)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition flex justify-between items-center ${
                            answers.playStyle === opt.val
                              ? 'border-[#16382B] bg-[#16382B]/5'
                              : 'border-slate-200 hover:border-[#C5A059]'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-[#16382B] text-base">{opt.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                          </div>
                          <span className="text-slate-400">→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Q4: 目標 */}
                {quizStep === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-extrabold text-[#16382B]">換這支球拍，你最希望獲得什麼提升？</h2>
                      <p className="text-sm text-slate-500">這項選擇將作為推薦引擎最核心的評分權重依據。</p>
                    </div>
                    <div className="space-y-3">
                      {[
                        { val: 'effortless', title: '打得更省力好借力', desc: '希望高遠球輕鬆到位，連續揮拍不吃力' },
                        { val: 'power', title: '更有進攻下壓威力', desc: '希望殺球球質更重、更有穿透力' },
                        { val: 'speed', title: '揮拍出拍速度更快', desc: '希望平抽擋與被動防守轉換更敏捷' },
                        { val: 'control', title: '擊球落點更好控制', desc: '希望拍面更穩定，切球與網前手感更清晰' },
                        { val: 'balanced', title: '整體手感全面均衡', desc: '沒有單一極端需求，希望整體好適應' },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          onClick={() => handleSelectQuizOption('goal', opt.val, 5)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition flex justify-between items-center ${
                            answers.goal === opt.val
                              ? 'border-[#16382B] bg-[#16382B]/5'
                              : 'border-slate-200 hover:border-[#C5A059]'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-[#16382B] text-base">{opt.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                          </div>
                          <span className="text-slate-400">→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Q5: 困擾 */}
                {quizStep === 5 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-extrabold text-[#16382B]">目前打球時有遇到什麼困擾嗎？</h2>
                      <p className="text-sm text-slate-500">系統會根據你的痛點，自動避開不適合的規格配置。</p>
                    </div>
                    <div className="space-y-3">
                      {[
                        { val: 'clear_hard', title: '後場高遠球常打不到底線、覺得費力', desc: '系統將優先推薦中桿彈性較佳、甜區寬廣的拍款' },
                        { val: 'slow_swing', title: '雙打平抽時覺得揮拍太慢、跟不上節奏', desc: '系統將避開過重拍頭，優先篩選破風框與均衡配重' },
                        { val: 'weak_smash', title: '殺球感覺飄飄的、壓不下去', desc: '系統將適度增加拍頭配重與拍框穩定度權重' },
                        { val: 'unstable', title: '非甜區擊球時拍面容易晃動不穩', desc: '系統將優先考量盒型穩定框型結構' },
                        { val: 'none', title: '沒有明顯困擾', desc: '目前打球順暢，想正常升級或添購新拍' },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          onClick={() => handleSelectQuizOption('painPoint', opt.val, 6)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition flex justify-between items-center ${
                            answers.painPoint === opt.val
                              ? 'border-[#16382B] bg-[#16382B]/5'
                              : 'border-slate-200 hover:border-[#C5A059]'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-[#16382B] text-base">{opt.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                          </div>
                          <span className="text-slate-400">→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Q6: 預算 */}
                {quizStep === 6 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-extrabold text-[#16382B]">你的購拍預算範圍（不含穿線）？</h2>
                      <p className="text-sm text-slate-500">預算將作為優先篩選門檻，幫你在合理範圍內找出最佳選擇。</p>
                    </div>
                    <div className="space-y-3">
                      {[
                        { val: 1600, title: 'NT$ 1,600 以下（平價入門）', desc: '適合初學者第一支拍，耐打好上手、無經濟負擔' },
                        { val: 3300, title: 'NT$ 1,600 – 3,300（中階高 CP 值）', desc: '具備優異中桿材質與破風結構，適合穩定球友' },
                        { val: 5800, title: 'NT$ 3,300 – 5,800（高階旗艦）', desc: '各大品牌頂級碳纖維科技與選手同款規格' },
                        { val: 99999, title: '不限預算', desc: '從全資料庫中直接依據打法適配度排序' },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          onClick={() => handleSelectQuizOption('budget', opt.val, 7)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition flex justify-between items-center ${
                            answers.budget === opt.val
                              ? 'border-[#16382B] bg-[#16382B]/5'
                              : 'border-slate-200 hover:border-[#C5A059]'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-[#16382B] text-base">{opt.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                          </div>
                          <span className="text-slate-400">→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Q7 & Q8: 進階選填 */}
                {quizStep === 7 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-extrabold text-[#16382B]">進階選填條件（可直接查看結果）</h2>
                      <p className="text-sm text-slate-500">若有偏好的品牌或現有球拍可在此補充，沒有的話直接點擊「查看推薦結果」即可。</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">Q7. 有偏好的品牌嗎？（僅作排序加分）</label>
                        <div className="flex flex-wrap gap-2">
                          {['ALL', 'Yonex', 'Victor', 'Fleet', 'JNICE'].map((b) => (
                            <button
                              key={b}
                              onClick={() => setAnswers({ ...answers, brandPref: b })}
                              className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${
                                answers.brandPref === b
                                  ? 'bg-[#16382B] text-white border-[#16382B]'
                                  : 'bg-white text-slate-700 border-slate-300'
                              }`}
                            >
                              {b === 'ALL' ? '都可以（跨品牌比較）' : b}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">Q8. 目前使用的球拍型號（選填）</label>
                        <input
                          type="text"
                          placeholder="例如：之前打過 Victor TK-9500，希望這支揮拍再輕快一點..."
                          value={answers.currentRacket}
                          onChange={(e) => setAnswers({ ...answers, currentRacket: e.target.value })}
                          className="w-full p-3 border border-slate-300 rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleSelectQuizOption('brandPref', answers.brandPref, 8)}
                        className="flex-1 py-3.5 bg-[#16382B] text-white font-bold rounded-xl hover:bg-[#122e23] transition shadow"
                      >
                        生成我的專屬選拍推薦 →
                      </button>
                    </div>
                  </div>
                )}

                {/* 底部上一題導覽 */}
                {quizStep > 1 && (
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <button
                      onClick={() => setQuizStep(quizStep - 1)}
                      className="text-xs font-bold text-slate-500 hover:text-[#16382B]"
                    >
                      ← 返回上一題
                    </button>
                    {quizStep === 7 && (
                      <button
                        onClick={() => handleSelectQuizOption('brandPref', 'ALL', 8)}
                        className="text-xs font-bold text-[#C5A059] hover:underline"
                      >
                        略過選填，直接看推薦 →
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* ==================== 推薦結果頁（特徵摘要 + 三種方向候選球拍 + 下一步行動） ==================== */
              (() => {
                const matched = getMatchedRackets();
                const candidates = [
                  { tag: '首選推薦方向', badgeColor: 'bg-emerald-700 text-white', racket: matched.primary },
                  { tag: '偏向進攻的選擇', badgeColor: 'bg-amber-700 text-white', racket: matched.attackAlt },
                  { tag: '偏向靈活的選擇', badgeColor: 'bg-slate-700 text-white', racket: matched.agileAlt },
                ];

                return (
                  <div className="space-y-8 animate-fade-in">
                    {/* 頂部特徵摘要卡 */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <span className="text-xs font-bold text-[#C5A059] tracking-widest uppercase">
                          PAIMIAN / YOUR MATCH RESULT
                        </span>
                        <button
                          onClick={() => setQuizStep(1)}
                          className="text-xs font-bold text-slate-500 hover:text-[#16382B] underline"
                        >
                          重新調整問卷條件
                        </button>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16382B]">
                        為你篩選出 3 個最適合探索的球拍方向
                      </h2>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-3 py-1 bg-slate-100 rounded-full font-semibold text-slate-700">
                          程度：{answers.level === 'beginner' ? '剛開始接觸' : answers.level === 'casual' ? '偶爾打球' : answers.level === 'regular' ? '固定打球' : '訓練/比賽經驗'}
                        </span>
                        <span className="px-3 py-1 bg-slate-100 rounded-full font-semibold text-slate-700">
                          預算上限：{answers.budget >= 99999 ? '不限' : `NT$ ${answers.budget.toLocaleString()}`}
                        </span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full font-semibold">
                          建議優先比較規格：{matched.primary.weight} · {matched.primary.flex}
                        </span>
                      </div>

                      {matched.budgetRelaxed && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                          💡 提示：目前資料庫在嚴格預算內的款式較少，已為你一併納入相近價位帶的優質型號供比較參考。
                        </div>
                      )}
                    </div>

                    {/* 三種候選球拍卡片 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {candidates.map((item, idx) => (
                        <div
                          key={idx}
                          className={`bg-white rounded-2xl border-2 p-5 shadow-sm flex flex-col justify-between space-y-4 ${
                            idx === 0 ? 'border-[#16382B]' : 'border-slate-200'
                          }`}
                        >
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${item.badgeColor}`}>
                                {item.tag}
                              </span>
                              <span className="text-xs font-bold text-slate-400">{item.racket.brand}</span>
                            </div>

                            <div className="h-36 bg-slate-50 rounded-xl p-3 flex items-center justify-center">
                              <img src={item.racket.img} alt={item.racket.name} className="h-full object-contain" />
                            </div>

                            <div>
                              <h3 className="text-lg font-extrabold text-[#16382B]">{item.racket.name}</h3>
                              <p className="text-xs text-[#C5A059] font-bold mt-0.5">{item.racket.price}</p>
                            </div>

                            <div className="flex flex-wrap gap-1.5 text-[11px]">
                              <span className="px-2 py-0.5 bg-slate-100 rounded font-medium">{item.racket.weight}</span>
                              <span className="px-2 py-0.5 bg-slate-100 rounded font-medium">{item.racket.balance}</span>
                              <span className="px-2 py-0.5 bg-slate-100 rounded font-medium">{item.racket.flex}</span>
                            </div>

                            <div className="bg-[#FAF9F5] p-3 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                              <div className="font-bold text-[#16382B]">優勢與取捨：</div>
                              <p className="text-slate-600">✅ {item.racket.pros}</p>
                              <p className="text-slate-500">⚖️ {item.racket.cons}</p>
                            </div>

                            <div className="text-xs bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/70 text-emerald-950">
                              <b>建議搭配線種：</b>{item.racket.recommendedString}
                            </div>
                          </div>

                          <div className="pt-2 space-y-2">
                            <button
                              onClick={() => setDetailRacket(item.racket)}
                              className="w-full py-2.5 bg-[#16382B] text-white text-xs font-bold rounded-xl hover:bg-[#122e23] transition"
                            >
                              查看球拍詳情與購買通路 →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI 教練白話解析區塊 */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
                      <h3 className="text-base font-extrabold text-[#16382B] flex items-center space-x-2">
                        <span>🤖</span>
                        <span>AI 教練與穿線師個人化點評</span>
                      </h3>
                      {aiLoading ? (
                        <p className="text-xs text-slate-500 animate-pulse">正在根據你的打法與困擾生成詳細配線建議...</p>
                      ) : aiExplanation ? (
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                          {aiExplanation.detailed_review || aiExplanation.style_pairing_analysis}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          以上三支候選球拍已根據你的程度與預算完成規格篩選。建議優先點擊下方「一鍵並排比較這 3 支球拍」，從平衡點與中桿軟硬度確認最符合你手感的款式。
                        </p>
                      )}
                    </div>

                    {/* 下一步行動引導列 */}
                    <div className="bg-[#16382B] text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div>
                        <div className="font-bold text-base">接下來，你可以直接並排對照這 3 支候選球拍</div>
                        <p className="text-xs text-slate-300 mt-0.5">從重量、平衡點、原廠最高磅數與價格看懂差異</p>
                      </div>
                      <button
                        onClick={() => {
                          setCompareIds([matched.primary.id, matched.attackAlt.id, matched.agileAlt.id]);
                          setShowCompareModal(true);
                        }}
                        className="px-6 py-3 bg-[#C5A059] text-white text-xs font-bold rounded-xl hover:opacity-95 transition whitespace-nowrap"
                      >
                        ⚖️ 並排比較這 3 支球拍
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* ==================== 3. 裝備資料庫（含篩選與多拍比較勾選） ==================== */}
        {activeTab === 'database' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#C5A059] tracking-widest uppercase">EQUIPMENT DATABASE</span>
                <h2 className="text-3xl font-extrabold text-[#16382B]">羽球拍規格與實戰資料庫</h2>
                <p className="text-slate-600 text-sm">支援品牌、預算級別篩選，可勾選最多 3 支球拍進行並排規格比較。</p>
              </div>
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-4 py-2.5 bg-[#16382B] text-white text-xs font-bold rounded-xl hover:bg-[#122e23] transition"
              >
                開啟比較表 ({compareIds.length}/3)
              </button>
            </div>

            {/* 篩選器 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-sm">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-slate-500 mr-2">品牌：</span>
                {['ALL', 'Yonex', 'Victor', 'Fleet', 'JNICE'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                      selectedBrand === b ? 'bg-[#16382B] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {b === 'ALL' ? '全部品牌' : b}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 items-center pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 mr-2">級別：</span>
                {[
                  { id: 'ALL', label: '全部級別' },
                  { id: 'ENTRY', label: '平價入門' },
                  { id: 'MID', label: '中階進階' },
                  { id: 'PRO', label: '高階旗艦' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                      selectedLevel === lvl.id ? 'bg-[#C5A059] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}

                <input
                  type="text"
                  placeholder="搜尋型號或打法關鍵字..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 border border-slate-300 rounded-lg text-xs ml-auto w-full sm:w-52 text-slate-800"
                />
              </div>
            </div>

            {/* 球拍網格列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRackets.map((racket) => {
                const isCompared = compareIds.includes(racket.id);
                return (
                  <div
                    key={racket.id}
                    className="bg-white rounded-xl border border-slate-200 hover:border-[#C5A059] transition shadow-sm overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div
                        onClick={() => setDetailRacket(racket)}
                        className="h-44 bg-slate-50 relative overflow-hidden group flex items-center justify-center p-4 border-b border-slate-100 cursor-pointer"
                      >
                        <img
                          src={racket.img}
                          alt={racket.name}
                          className="h-full object-contain group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-3 left-3 flex space-x-1.5">
                          <span className="text-xs font-bold px-2 py-0.5 bg-[#16382B] text-white rounded">
                            {racket.brand}
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                            {racket.levelTag}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[11px] font-bold text-[#C5A059]">{racket.styleTag}</span>
                            <h3 className="text-lg font-bold text-[#16382B]">{racket.name}</h3>
                          </div>
                          <span className="text-xs font-extrabold text-slate-800">{racket.price}</span>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1 border-t border-b border-slate-100 py-2.5">
                          <div><b>重量 / 平衡：</b>{racket.weight} · {racket.balance}</div>
                          <div><b>中桿 / 框型：</b>{racket.flex} · {racket.frameType}</div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{racket.desc}</p>
                      </div>
                    </div>

                    <div className="px-5 pb-4 flex gap-2">
                      <button
                        onClick={() => setDetailRacket(racket)}
                        className="flex-1 py-2 bg-[#16382B] text-white text-xs font-bold rounded-lg hover:bg-[#122e23] transition"
                      >
                        詳情與通路
                      </button>
                      <button
                        onClick={() => toggleCompare(racket.id)}
                        className={`px-3 py-2 text-xs font-bold rounded-lg border transition ${
                          isCompared
                            ? 'bg-amber-100 border-amber-400 text-amber-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isCompared ? '✓ 已加入比較' : '+ 比較'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== 4. 羽球知識庫（含改良版手感配置矩陣） ==================== */}
        {activeTab === 'wiki' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm animate-fade-in">
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-[#C5A059] tracking-widest uppercase">EQUIPMENT ENCYCLOPEDIA</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16382B]">羽球知識庫與互動配置工具</h2>
              <p className="text-slate-600 text-sm">了解穿線磅數、中桿與拍框的物理特性，並透過「手感配置矩陣」觀察不同參數組合的擊球傾向。</p>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
              {[
                { id: 'tension', label: '1. 穿線磅數解析' },
                { id: 'shaft', label: '2. 中桿軟硬度原理' },
                { id: 'frame', label: '3. 拍框結構分類' },
                { id: 'string', label: '4. 羽球線色彩圖鑑' },
                { id: 'matrix', label: '互動工具：手感配置矩陣' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveWikiTopic(t.id as any)}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition ${
                    activeWikiTopic === t.id
                      ? 'bg-[#16382B] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* 1. 磅數解析 */}
            {activeWikiTopic === 'tension' && (
              <div className="space-y-6 text-slate-700 leading-relaxed">
                <div className="border-l-4 border-[#16382B] pl-4">
                  <h3 className="text-xl font-bold text-[#16382B]">穿線磅數 (Tension / Lbs) 實戰解析</h3>
                  <p className="text-xs text-slate-500 mt-1">磅數應依照個人發力習慣與球拍原廠容許範圍設定，而非盲目追求高磅。</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-emerald-50/70 p-5 rounded-xl border border-emerald-200 space-y-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-emerald-700 text-white rounded">19 – 22 磅｜低磅高彈區</span>
                    <h4 className="font-bold text-[#16382B] text-base">床墊彈簧效應</h4>
                    <p className="text-xs leading-relaxed">
                      球線張力較鬆，擊球瞬間形變大，能產生明顯的回彈借力效果，甜區寬廣、高遠球省力，適合初學者與休閒球友。
                    </p>
                  </div>
                  <div className="bg-amber-50/70 p-5 rounded-xl border border-amber-200 space-y-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-[#C5A059] text-white rounded">23 – 25 磅｜主流業餘區</span>
                    <h4 className="font-bold text-[#16382B] text-base">彈性與控球平衡</h4>
                    <p className="text-xs leading-relaxed">
                      多數具備基礎發力的社團球友集中在此區間，兼顧出球彈性與網前切球、平抽擋的落點穩定度。
                    </p>
                  </div>
                  <div className="bg-slate-100 p-5 rounded-xl border border-slate-300 space-y-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-slate-800 text-white rounded">26 磅以上｜高張力控球區</span>
                    <h4 className="font-bold text-[#16382B] text-base">直接力量傳導</h4>
                    <p className="text-xs leading-relaxed">
                      線床形變極小，力量傳導直接、網前搓放精準，但需要具備完整的小臂鞭甩發力才能打透線床（請留意球拍原廠最高磅數標示）。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. 中桿軟硬度 */}
            {activeWikiTopic === 'shaft' && (
              <div className="space-y-6 text-slate-700 leading-relaxed">
                <div className="border-l-4 border-[#16382B] pl-4">
                  <h3 className="text-xl font-bold text-[#16382B]">中桿軟硬度 (Shaft Flex) 與鞭甩形變</h3>
                  <p className="text-xs text-slate-500 mt-1">中桿決定了揮拍動能如何轉換成擊球初速。</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-[#16382B] text-base">偏軟至適中中桿 (Flexible / Medium)</h4>
                    <p className="text-xs leading-relaxed">
                      較小的揮拍速度即可讓中桿產生彎曲回彈，幫助把球輕鬆送往後場，容錯率高，適合初學者、女性球友或重視連續拉吊節奏的打法。
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-[#16382B] text-base">偏硬至特硬中桿 (Stiff / Extra Stiff)</h4>
                    <p className="text-xs leading-relaxed">
                      抗扭性強、回彈恢復速度極快，能完整傳導爆發力並提升連續重殺與點殺的精準度，適合揮拍速度快、發力集中的進階球友。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. 拍框結構 */}
            {activeWikiTopic === 'frame' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-700">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-[#16382B] text-base">1. 盒型框 (Box Frame)</h4>
                  <p className="text-xs leading-relaxed">截面呈方形結構，拍框抗扭穩定度高，擊球手感紮實、下壓感強，適合重殺進攻與精準控球。</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-[#16382B] text-base">2. 破風框 (Aero Frame)</h4>
                  <p className="text-xs leading-relaxed">截面呈流線水滴或菱形刀鋒狀，揮拍風阻小、揮速極快，非常適合雙打前場封網與高速平抽對抗。</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-[#16382B] text-base">3. 複合式拍框 (Aero-Box)</h4>
                  <p className="text-xs leading-relaxed">結合破風框的低風阻與盒型框的穩定度，兼顧揮拍流暢度與擊球紮實感，為現代主流旗艦設計。</p>
                </div>
              </div>
            )}

            {/* 4. 羽球線圖鑑 */}
            {activeWikiTopic === 'string' && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-600 mr-2">選擇品牌：</span>
                  {['Yonex', 'Victor', 'Kizuna', 'Gosen', 'Li-Ning', 'Mizuno'].map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedStringBrand(brand)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                        selectedStringBrand === brand ? 'bg-[#C5A059] text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredStrings.map((s, idx) => (
                    <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#16382B]">{s.name}</span>
                        <span className="text-xs bg-[#16382B]/10 text-[#16382B] px-2 py-0.5 rounded font-semibold">
                          {s.gauge} | {s.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{s.desc}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {s.colors.map((c, cIdx) => (
                          <span key={cIdx} className="text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. 改良版互動工具：手感配置矩陣 */}
            {activeWikiTopic === 'matrix' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-950">
                  ℹ️ <b>說明：</b>本矩陣為協助理解「穿線磅數（X 軸）」與「中桿/拍框剛性（Y 軸）」交互影響的視覺化教學工具，實際擊球感受仍會依個人發力動作與球線型號而有所不同。
                </div>

                <div className="bg-[#FAF9F5] p-5 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-bold text-[#16382B] mb-1.5">套用球拍預設參數：</label>
                    <select
                      value={selectedSimRacket}
                      onChange={(e) => handleSelectRacketForSim(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-sm font-semibold text-slate-800"
                    >
                      {RACKETS_DATA.map((r) => (
                        <option key={r.id} value={r.name}>
                          [{r.brand}] {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#16382B] mb-1.5">重量規格：</label>
                    <div className="flex space-x-2">
                      {(['3U', '4U', '5U'] as const).map((w) => (
                        <button
                          key={w}
                          onClick={() => setSimWeight(w)}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition ${
                            simWeight === w
                              ? 'bg-[#16382B] text-white border-[#16382B]'
                              : 'bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-[#C5A059] block">參考拍框結構：</span>
                    <span className="font-semibold text-[#16382B]">{simFrameType}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6">
                    <div className="relative w-full aspect-square max-w-[400px] mx-auto bg-gradient-to-br from-emerald-50/50 via-white to-amber-50/50 border-2 border-slate-300 rounded-xl overflow-hidden select-none">
                      <div className="absolute top-3 left-3 text-[11px] font-bold text-slate-400">低磅借力 × 硬桿重殺</div>
                      <div className="absolute top-3 right-3 text-right text-[11px] font-bold text-amber-700/70">高張力控球 × 硬桿重砲</div>
                      <div className="absolute bottom-3 left-3 text-[11px] font-bold text-emerald-700/70">低磅高彈 × 軟桿省力</div>
                      <div className="absolute bottom-3 right-3 text-right text-[11px] font-bold text-blue-700/70">高張力快彈 × 破風平抽</div>

                      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-slate-300 -translate-x-1/2"></div>
                      <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-slate-300 -translate-y-1/2"></div>

                      <span className="absolute top-1.5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-full">
                        ↑ 硬挺中桿 / 穩定盒框
                      </span>
                      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                        ↓ 彈性中桿 / 破風框
                      </span>
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-emerald-700 text-white text-[10px] px-2 py-0.5 rounded">
                        ← 18 lbs
                      </span>
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-amber-700 text-white text-[10px] px-2 py-0.5 rounded">
                        30 lbs →
                      </span>

                      <div
                        style={{ left: `${matrixInfo.xPercent}%`, top: `${matrixInfo.yPercent}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-150 z-20 flex flex-col items-center"
                      >
                        <div className="w-4 h-4 rounded-full bg-[#16382B] border-2 border-[#C5A059] shadow"></div>
                        <div className="mt-1 bg-[#16382B] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                          {selectedSimRacket} ({simTension} lbs)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-5">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex justify-between text-sm font-bold text-[#16382B]">
                        <span>X 軸調整穿線磅數：</span>
                        <span className="text-[#C5A059]">{simTension} lbs</span>
                      </div>
                      <input
                        type="range"
                        min={18}
                        max={30}
                        step={1}
                        value={simTension}
                        onChange={(e) => setSimTension(Number(e.target.value))}
                        className="w-full accent-[#16382B] cursor-pointer"
                      />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex justify-between text-sm font-bold text-[#16382B]">
                        <span>Y 軸調整中桿與拍框剛性：</span>
                        <span className="text-emerald-800">
                          {simShaftScore >= 75 ? '偏硬 / 盒框傾向' : simShaftScore >= 45 ? '適中 / 複合框傾向' : '偏軟 / 破風框傾向'}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        step={5}
                        value={simShaftScore}
                        onChange={(e) => setSimShaftScore(Number(e.target.value))}
                        className="w-full accent-[#C5A059] cursor-pointer"
                      />
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                      <h4 className="text-base font-extrabold text-[#16382B]">{matrixInfo.zoneTitle}</h4>
                      <p className="text-slate-600 leading-relaxed">{matrixInfo.zoneSummary}</p>
                      <div className="pt-2 border-t border-slate-100 space-y-1.5 text-slate-700">
                        <p><b>驅動與發力特性：</b>{matrixInfo.driveThreshold}</p>
                        <p><b>甜區與容錯回饋：</b>{matrixInfo.sweetSpotDesc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== 5. 新品與情報 View ==================== */}
        {activeTab === 'news' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#C5A059] tracking-widest uppercase">MARKET & RELEASES</span>
              <h2 className="text-3xl font-extrabold text-[#16382B]">新品與裝備市場情報</h2>
              <p className="text-slate-600 text-sm">掌握台灣羽球市場主流裝備趨勢與選購提醒。</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
              <span className="text-xs font-bold text-[#C5A059]">2026 裝備趨勢</span>
              <h3 className="font-bold text-[#16382B] text-lg">複合式破風盒框成為中高階球拍主流設計</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                隨著雙打平抽與連貫進攻節奏加快，兼具揮速與抗扭穩定度的複合式框型（如 Yonex Astrox 77 Pro、Fleet Woven 1000 EVO）成為最多業餘進階球友換拍的首選方向。
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ==================== 球拍詳情彈窗 Modal（整合規格、適合族群、推薦線種與購買通路） ==================== */}
      {detailRacket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-[#16382B] text-white rounded">
                  {detailRacket.brand} · {detailRacket.levelTag}
                </span>
                <h3 className="text-2xl font-extrabold text-[#16382B] mt-2">{detailRacket.name}</h3>
                <p className="text-sm font-bold text-[#C5A059] mt-0.5">參考售價：{detailRacket.price}</p>
              </div>
              <button
                onClick={() => setDetailRacket(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="h-48 bg-slate-50 rounded-xl p-4 flex items-center justify-center border border-slate-100">
                <img src={detailRacket.img} alt={detailRacket.name} className="h-full object-contain" />
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-slate-50 rounded-lg"><b>打法定位：</b>{detailRacket.styleTag}</div>
                <div className="p-2.5 bg-slate-50 rounded-lg"><b>重量規格：</b>{detailRacket.weight}</div>
                <div className="p-2.5 bg-slate-50 rounded-lg"><b>平衡點：</b>{detailRacket.balance}</div>
                <div className="p-2.5 bg-slate-50 rounded-lg"><b>中桿軟硬：</b>{detailRacket.flex}</div>
                <div className="p-2.5 bg-slate-50 rounded-lg"><b>原廠建議磅數：</b>{detailRacket.maxTension}</div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-[#FAF9F5] rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-[#16382B]">🎯 適合族群：</div>
                <p className="text-slate-600 leading-relaxed">{detailRacket.suitableFor}</p>
              </div>

              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
                <div className="font-bold text-emerald-950">🏸 建議搭配羽球線與磅數：</div>
                <p className="text-emerald-900">{detailRacket.recommendedString}</p>
              </div>

              {/* 整合原本獨立的購買通路至球拍詳情頁 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-[#16382B]">🏪 實體經銷與穿線通路建議：</div>
                <ul className="text-slate-600 space-y-1 list-disc pl-4">
                  <li><b>大台北地區：</b>大翔羽球專賣店、一線花羽球（提供五大品牌現貨與專業電腦穿線服務）</li>
                  <li><b>中台灣地區：</b>無差別體育羽球專賣（支援現場握把試揮與客製化配線諮詢）</li>
                  <li><b>購拍提醒：</b>建議現場確認握把粗細（G5/G6）並依原廠容許磅數穿線。</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  toggleCompare(detailRacket.id);
                  setDetailRacket(null);
                  setShowCompareModal(true);
                }}
                className="flex-1 py-3 bg-[#16382B] text-white text-xs font-bold rounded-xl hover:bg-[#122e23]"
              >
                加入並排規格比較
              </button>
              <button
                onClick={() => {
                  handleSelectRacketForSim(detailRacket.name);
                  setDetailRacket(null);
                  setActiveWikiTopic('matrix');
                  setActiveTab('wiki');
                }}
                className="flex-1 py-3 border border-[#16382B] text-[#16382B] text-xs font-bold rounded-xl hover:bg-slate-50"
              >
                帶入手感配置矩陣
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 多拍並排規格比較彈窗 Modal ==================== */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#16382B]">球拍規格並排比較表（最多 3 支）</h3>
                <p className="text-xs text-slate-500 mt-0.5">可在「裝備資料庫」中勾選或取消要比較的型號</p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
              >
                ✕
              </button>
            </div>

            {comparedRackets.length === 0 ? (
              <div className="text-center py-10 text-sm text-slate-500">
                目前尚未選擇任何球拍，請先到「裝備資料庫」點擊「+ 比較」。
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 px-3 text-slate-400 font-bold w-28">比較項目</th>
                      {comparedRackets.map((r) => (
                        <th key={r.id} className="py-3 px-3 font-extrabold text-[#16382B] text-sm">
                          <div className="flex justify-between items-center">
                            <span>{r.name}</span>
                            <button
                              onClick={() => toggleCompare(r.id)}
                              className="text-[11px] text-red-500 hover:underline font-normal ml-2"
                            >
                              移除
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-600">品牌 / 級別</td>
                      {comparedRackets.map((r) => (
                        <td key={r.id} className="py-3 px-3">{r.brand} · {r.levelTag}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-600">參考售價</td>
                      {comparedRackets.map((r) => (
                        <td key={r.id} className="py-3 px-3 font-bold text-[#C5A059]">{r.price}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-600">打法定位</td>
                      {comparedRackets.map((r) => (
                        <td key={r.id} className="py-3 px-3">{r.styleTag}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-600">重量規格</td>
                      {comparedRackets.map((r) => (
                        <td key={r.id} className="py-3 px-3">{r.weight}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-600">平衡點</td>
                      {comparedRackets.map((r) => (
                        <td key={r.id} className="py-3 px-3">{r.balance}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-600">中桿軟硬</td>
                      {comparedRackets.map((r) => (
                        <td key={r.id} className="py-3 px-3">{r.flex}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-600">拍框結構</td>
                      {comparedRackets.map((r) => (
                        <td key={r.id} className="py-3 px-3">{r.frameType}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-600">推薦配線</td>
                      {comparedRackets.map((r) => (
                        <td key={r.id} className="py-3 px-3 text-emerald-800 font-medium">{r.recommendedString}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== 頁尾 ==================== */}
      <footer className="bg-[#16382B] text-slate-300 py-8 text-center text-xs border-t border-emerald-900 mt-16">
        <div className="max-w-6xl mx-auto px-6 space-y-2">
          <p className="font-medium">拍面 PaiMian | 羽球裝備探索與智慧選拍平台</p>
          <p className="text-slate-400">規格資料彙整自各品牌公開資訊，實際手感因個人發力習慣而異，建議至實體專賣店試揮確認。</p>
        </div>
      </footer>
    </div>
  );
}