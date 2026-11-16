'use client';

import { useState } from 'react';

export default function PaiMianHomePage() {
  const [activeTab, setActiveTab] = useState('home');

  // AI 選拍 State
  const [playStyle, setPlayStyle] = useState('Attack');
  const [preferredWeight, setPreferredWeight] = useState('4U');
  const [budget, setBudget] = useState('3000');
  const [isBeginner, setIsBeginner] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 知識庫 Tab 選單
  const [activeWikiTopic, setActiveWikiTopic] = useState<'matrix' | 'tension' | 'shaft' | 'frame' | 'string'>('matrix');
  const [selectedStringBrand, setSelectedStringBrand] = useState('Yonex');

  // ==================== 十字象限座標模擬器 State ====================
  const [selectedSimRacket, setSelectedSimRacket] = useState('Astrox 77 Pro');
  const [simWeight, setSimWeight] = useState<'3U' | '4U' | '5U'>('4U');
  const [simTension, setSimTension] = useState<number>(24); // X軸：磅數 (18 ~ 30)
  const [simShaftScore, setSimShaftScore] = useState<number>(55); // Y軸：中桿與拍框剛性 (0=極軟破風 ~ 100=極硬盒框)
  const [simFrameType, setSimFrameType] = useState<string>('破風盒型複合框');

  // 球拍資料庫 State
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 七大品牌羽球線完整資料庫
  const badmintonStrings = [
    { brand: 'Yonex', name: 'BG-66 Ultimax (BG66UM)', gauge: '0.65 mm', type: '高彈極速', desc: '全球極受歡迎的高彈細線，擊球聲音響亮金屬感強，高遠球與扣殺回彈極快。', colors: ['耀目白 (Metallic White)', '螢光黃 (Neon Yellow)', '炫彩紅 (Red)', '冰藍 (Cool Blue)', '櫻花粉 (Pink)', '極光黑 (Black)'] },
    { brand: 'Yonex', name: 'BG-65', gauge: '0.70 mm', type: '耐打長青', desc: '羽球界普及度最高的耐打粗線，耐用度極高，適合新手與學校球隊。', colors: ['經典白 (White)', '曜石黑 (Black)', '活力橘 (Orange)', '寶藍 (Blue)', '草綠 (Green)', '螢光黃 (Yellow)'] },
    { brand: 'Yonex', name: 'Exbolt 63 (EXB63)', gauge: '0.63 mm', type: '極速高彈', desc: '採用鍛造纖維 (Forged Fiber)，擁有超強耐久度與極快音速出球打感。', colors: ['雪白 (White)', '炫光黃 (Yellow)', '烈焰紅 (Red)'] },
    { brand: 'Yonex', name: 'Exbolt 65 (EXB65)', gauge: '0.65 mm', type: '控球高彈', desc: '高彈性與耐打兼具，提供優異的控球持球感與出球連貫性。', colors: ['純白 (White)', '酷黑 (Black)', '螢光綠 (Yellow-Green)'] },
    { brand: 'Yonex', name: 'BG-80', gauge: '0.68 mm', type: '硬彈爆發', desc: '塗層帶有粗糙感，硬挺打感，殺球傳導極度直接紮實，進攻型球友最愛。', colors: ['珍珠白 (White)', '螢光黃 (Yellow)', '深灰 (Dark Grey)'] },
    { brand: 'Yonex', name: 'Aerobite (AB 異徑雙色線)', gauge: '主線 0.67mm / 橫線 0.61mm', type: '持球切球', desc: '橫豎線不同線徑與聚氨酯塗層，咬球極深，切球與網前搓球落點極度精準。', colors: ['紅白雙色 (Red/White)', '藍白雙色 (Blue/White)', '綠白雙色 (Green/White)'] },
    { brand: 'Victor', name: 'VBS-66 Nano (VBS-66N)', gauge: '0.66 mm', type: '高彈連貫', desc: '高科技奈米碳纖維包裹，具有極佳彈性與優異的擊球音，平抽快攻連貫順暢。', colors: ['象牙白 (White)', '螢光黃 (Yellow)', '珊瑚粉 (Pink)', '賽道藍 (Blue)', '炫酷黑 (Black)'] },
    { brand: 'Victor', name: 'VBS-70', gauge: '0.70 mm', type: '極致耐打', desc: '高集束尼龍芯體，耐磨耐打性能頂級，性價比極高。', colors: ['純白 (White)', '螢光黃 (Yellow)', '曜石黑 (Black)', '海藍 (Blue)'] },
    { brand: 'Victor', name: 'VBS-63', gauge: '0.63 mm', type: '極速高音', desc: '超細線徑帶來清脆響亮的擊球聲，揮拍出球乾淨俐落。', colors: ['雪白 (White)', '亮黃 (Yellow)', '玫紅 (Pink)'] },
    { brand: 'Kizuna', name: 'Z63 Premium (Z63)', gauge: '0.63 mm', type: '日本高彈', desc: '日本製造頂級細線，以超高彈性與高金屬音著稱，深受懂線球友喜愛。', colors: ['高雅白 (White)', '螢光黃 (Yellow)', '櫻桃紅 (Red)', '冰雪藍 (Blue)'] },
    { brand: 'Kizuna', name: 'Z58 Premium (Z58)', gauge: '0.58 mm', type: '極致超細線', desc: '世界級極細線徑 0.58mm，回彈極速、切音極響，揮拍風阻極小。', colors: ['純白 (White)', '螢光綠 (Yellow-Green)'] },
    { brand: 'Kawasaki', name: 'K-65 Rapid', gauge: '0.65 mm', type: '高彈平價', desc: '高性價比高彈線，回彈迅速，適合一般練習與進階平抽。', colors: ['亮白 (White)', '螢光黃 (Yellow)', '薄荷綠 (Mint Green)'] },
    { brand: 'Kawasaki', name: 'K-70 Durable', gauge: '0.70 mm', type: '超耐打款', desc: '高強度耐磨外層，專為高頻率練習與初學者設計。', colors: ['白色 (White)', '黑色 (Black)', '藍色 (Blue)'] },
    { brand: 'Gosen', name: 'G-Tone 5 (GT5)', gauge: '0.65 mm', type: '金屬高音', desc: '日本 GOSEN 獨家 Micro Fusion 科技，金屬擊球音震撼，高彈爆發力強。', colors: ['珍珠白 (White)', '螢光黃 (Yellow)', '爆裂橘 (Orange)', '炫彩紫 (Purple)', '櫻花粉 (Pink)'] },
    { brand: 'Gosen', name: 'G-Tone 9 (GT9)', gauge: '0.69 mm', type: '紮實耐打', desc: '超高耐久度與穩定手感，適合爆發力大且高頻率擊球者。', colors: ['白色 (White)', '黑色 (Black)', '黃色 (Yellow)'] },
    { brand: 'Li-Ning', name: 'No.1 (李寧 1 號線)', gauge: '0.65 mm', type: '高彈主流', desc: '李寧國家隊選用高彈線，吸震性好、反彈力高，深受專業選手歡迎。', colors: ['純白 (White)', '螢光黃 (Yellow)', '中國紅 (Red)', '薄荷綠 (Green)', '酷黑 (Black)'] },
    { brand: 'Li-Ning', name: 'No.5 (李寧 5 號線)', gauge: '0.69 mm', type: '全能耐打', desc: '耐打與彈性均衡，擊球音渾厚紮實。', colors: ['白色 (White)', '黃色 (Yellow)', '黑色 (Black)'] },
    { brand: 'Mizuno', name: 'ML65 Smooth', gauge: '0.65 mm', type: '細線高彈', desc: '日本高彈科技塗層，出球乾淨俐落，平抽快攻反應迅速。', colors: ['雪白 (White)', '螢光黃 (Yellow)', '珊瑚橘 (Orange)'] },
    { brand: 'Mizuno', name: 'MZ66', gauge: '0.66 mm', type: '均衡全面', desc: '手感清晰且具備良好耐久度，落點控制精準。', colors: ['純白 (White)', '黑色 (Black)'] },
  ];

  // 五大品牌全級別完整球拍資料清單
  const allRackets = [
    { brand: 'Yonex', level: 'PRO', levelTag: '高階旗艦', name: 'Astrox 88D Pro', style: '進攻型 Attack', weight: '3U / 4U', flex: '硬 Stiff', price: '$5,070', market: '熱銷中', img: '/rackets/88dpro.svg', defaultTension: 26, shaftScore: 85, frameType: '盒型重殺穩定框', desc: '後場重殺壓制神拍，頭重感明顯，雙打後場砲手首選。' },
    { brand: 'Yonex', level: 'PRO', levelTag: '高階旗艦', name: 'Astrox 100ZZ', style: '進攻型 Attack', weight: '3U / 4U', flex: '特硬 Extra Stiff', price: '$5,590', market: '熱銷預購', img: '/rackets/88dpro.svg', defaultTension: 27, shaftScore: 95, frameType: '緊湊小拍面破風盒框', desc: '頂級旗艦實心中桿，揮拍極速，強攻重殺代表作。' },
    { brand: 'Yonex', level: 'PRO', levelTag: '高階旗艦', name: 'Astrox 77 Pro', style: '全面型 Balanced', weight: '3U / 4U', flex: '適中 Medium', price: '$4,870', market: '好入手', img: '/rackets/88dpro.svg', defaultTension: 25, shaftScore: 55, frameType: '破風盒型複合框', desc: '黃雅瓊指定拍，中桿彈性極佳，連續攻防拉吊極為順手。' },
    { brand: 'Yonex', level: 'MID', levelTag: '中階進階', name: 'Astrox 88 Game', style: '進攻型 Attack', weight: '4U', flex: '適中 Medium', price: '$2,470', market: '好入手', img: '/rackets/88dpro.svg', defaultTension: 23, shaftScore: 48, frameType: '流線破風混合框', desc: 'Pro 版降階款，好上手不費力，進攻與性價比完美平衡。' },
    { brand: 'Yonex', level: 'ENTRY', levelTag: '平價入門', name: 'Arcsaber 7 Play', style: '控球型 Control', weight: '4U', flex: '軟 Soft', price: '$1,430', market: '好入手', img: '/rackets/88dpro.svg', defaultTension: 21, shaftScore: 25, frameType: '大甜區穩定盒框', desc: '甜區大中桿軟，極度好打輕鬆打高遠球，初學者超強首選！' },
    { brand: 'Victor', level: 'PRO', levelTag: '高階旗艦', name: 'Thruster Ryuga II Pro (龍牙二代)', style: '進攻型 Attack', weight: '3U / 4U', flex: '硬 Stiff', price: '$5,070', market: '熱銷中', img: '/rackets/ryuga2.svg', defaultTension: 26, shaftScore: 88, frameType: '威力盒型進攻框', desc: '李梓嘉戰拍，懸浮核心科技握柄，重殺連續下壓極強。' },
    { brand: 'Victor', level: 'MID', levelTag: '中階進階', name: 'Auraspeed 9000 (神速 9000)', style: '全面型 Balanced', weight: '4U/5U', flex: '適中 Medium', price: '$2,080', market: '好入手', img: '/rackets/ryuga2.svg', defaultTension: 23, shaftScore: 45, frameType: '極速全破風框', desc: '揮拍極度輕快，專為平抽快攻與防守打造。' },
    { brand: 'Victor', level: 'ENTRY', levelTag: '平價入門', name: 'Challenge 9500 (TK-9500)', style: '進攻型 Attack', weight: '3U / 4U', flex: '偏軟 Medium-Soft', price: '$1,280', market: '熱銷神拍', img: '/rackets/ryuga2.svg', defaultTension: 21, shaftScore: 32, frameType: '經典穩定盒型框', desc: '台灣銷量極高的國民入門神拍，耐打穩定 CP 值爆表！' },
    { brand: 'Fleet', level: 'PRO', levelTag: '高階旗艦', name: 'Woven 1000 EVO', style: '進攻型 Attack', weight: '3U / 4U', flex: '硬 Stiff', price: '$3,800', market: '好入手', img: '/rackets/woven1000.svg', defaultTension: 25, shaftScore: 78, frameType: '八面破風穩定框', desc: '台灣神拍 EVO 進化版，高剛性 Woven 編織碳纖維，打感紮實。' },
    { brand: 'Fleet', level: 'MID', levelTag: '中階進階', name: 'Professional 3000 VI', style: '控球型 Control', weight: '3U / 4U', flex: '適中 Medium', price: '$3,200', market: '好入手', img: '/rackets/woven1000.svg', defaultTension: 24, shaftScore: 52, frameType: '流體破風框', desc: '平球快攻與精準拉吊控球利器，破風框揮拍速度流暢。' },
    { brand: 'Fleet', level: 'ENTRY', levelTag: '平價入門', name: 'Nano Power 100', style: '全面型 Balanced', weight: '4U', flex: '軟 Soft', price: '$1,380', market: '好入手', img: '/rackets/woven1000.svg', defaultTension: 20, shaftScore: 22, frameType: '輕量化破風框', desc: '富力特平價長青款，中桿軟省力，高遠球輕鬆出球遠。' },
    { brand: 'Mizuno', level: 'PRO', levelTag: '高階旗艦', name: 'Fortius 11 Power', style: '進攻型 Attack', weight: '4U', flex: '硬 Stiff', price: '$5,070', market: '中等庫存', img: '/rackets/88dpro.svg', defaultTension: 26, shaftScore: 84, frameType: '高張力重擊盒框', desc: '日本美津濃頂級旗艦，極致力量重殺型。' },
    { brand: 'Mizuno', level: 'ENTRY', levelTag: '平價入門', name: 'Technoblade 660', style: '全面型 Balanced', weight: '4U', flex: '軟 Soft', price: '$1,450', market: '好入手', img: '/rackets/88dpro.svg', defaultTension: 21, shaftScore: 28, frameType: '低風阻破風框', desc: '高彈性破風框，極度平價且好揮拍的美津濃入門選擇。' },
    { brand: 'JNICE', level: 'PRO', levelTag: '高階旗艦', name: '神魔 (SNIPER 90)', style: '進攻型 Attack', weight: '3U / 4U', flex: '硬 Stiff', price: '$3,280', market: '好入手', img: '/rackets/woven1000.svg', defaultTension: 25, shaftScore: 80, frameType: '菱形破風進攻框', desc: '久奈司旗艦重殺戰拍，破風兼具頭重感，殺球急墜。' },
    { brand: 'JNICE', level: 'MID', levelTag: '中階明星', name: '白羽刃 (White Blade)', style: '全面型 Balanced', weight: '4U', flex: '適中 Medium', price: '$2,680', market: '熱銷中', img: '/rackets/woven1000.svg', defaultTension: 24, shaftScore: 50, frameType: '雙向破風框', desc: '絕美白銀配色，中桿彈性極佳好借力，高 CP 值進階首選。' },
    { brand: 'JNICE', level: 'ENTRY', levelTag: '平價入門', name: '追風 2000 (Wind Speed)', style: '全面型 Balanced', weight: '4U', flex: '軟 Soft', price: '$1,280', market: '好入手', img: '/rackets/woven1000.svg', defaultTension: 20, shaftScore: 24, frameType: '全破風輕量框', desc: '千元出頭親民款，中桿軟好揮拍，買了不傷荷包。' },
  ];

  // 套用球拍到十字象限模擬器
  const handleSelectRacketForSim = (racketName: string) => {
    setSelectedSimRacket(racketName);
    const found = allRackets.find((r) => r.name === racketName);
    if (found) {
      setSimTension(found.defaultTension);
      setSimShaftScore(found.shaftScore);
      setSimFrameType(found.frameType);
      if (found.weight.includes('4U')) setSimWeight('4U');
      else if (found.weight.includes('3U')) setSimWeight('3U');
    }
  };

  // 動態計算十字座標與發力指標
  const getSimulationMetrics = () => {
    const weightBonus = simWeight === '3U' ? 12 : simWeight === '4U' ? 0 : -10;
    const tensionScore = ((simTension - 18) / 12) * 55;
    const shaftFactor = (simShaftScore / 100) * 45;
    const totalPowerReq = Math.min(100, Math.max(5, Math.round(tensionScore + shaftFactor + weightBonus)));

    const isRight = simTension >= 24;
    const isTop = simShaftScore >= 55;

    let quadrantName = '';
    let quadrantDesc = '';
    let powerRequirementText = '';
    let sweetSpotText = '';
    let wristRiskText = '';

    if (isTop && isRight) {
      quadrantName = '第一象限：硬核重砲控殺區（高磅 ＋ 硬桿/穩定框）';
      quadrantDesc = '擊球瞬間形變極小，力量傳導最直接！殺球尖銳且網前搓放落點極度精準，但完全沒有「床墊彈簧效應」，純靠使用者自身爆發力驅動。';
    } else if (isTop && !isRight) {
      quadrantName = '第二象限：借力重殺甜蜜區（中低磅 ＋ 硬桿/進攻框）';
      quadrantDesc = '透過硬中桿穩定拍面方向，同時利用較低磅數的線床彈性輔助出球，兼顧進攻下壓威力與高遠球輕鬆度，非常適合想打進攻拍但發力尚未達頂尖的球友。';
    } else if (!isTop && !isRight) {
      quadrantName = '第三象限：新手友善高彈省力區（低磅 ＋ 軟彈/破風框）';
      quadrantDesc = '甜區最大化、揮拍風阻最小！輕輕一揮就能利用線床與中桿的雙重鞭甩彈性把球送到後場底線，容錯率最高、最保護手腕與手肘。';
    } else {
      quadrantName = '第四象限：高速平抽連貫區（高磅 ＋ 軟彈/破風框）';
      quadrantDesc = '雙打前場與中場平抽快攻利器！高磅提供極快出球反應與清脆金屬音，搭配彈性中桿與破風框，能打出一拍接一拍的閃電連貫壓制。';
    }

    if (totalPowerReq >= 75) {
      powerRequirementText = '極高（需具備完整內旋鞭甩發力與小臂爆發力，建議球齡 2 年以上進階球友）';
      sweetSpotText = '偏小且集中（打中甜區威力驚人，打偏震手感明顯）';
      wristRiskText = '⚠️ 偏高：若動作不標準或熱身不足，容易引發手腕與網球肘疲勞';
    } else if (totalPowerReq >= 45) {
      powerRequirementText = '中等適中（一般系隊、社團球友皆可駕馭，兼具控球與彈性）';
      sweetSpotText = '適中均衡（容錯率與精準度取得良好平衡）';
      wristRiskText = '✅ 正常：符合多數業餘球友肌肉負荷範圍';
    } else {
      powerRequirementText = '輕鬆省力（無需刻意發猛力，依靠拍線與中桿彈性即可輕鬆借力）';
      sweetSpotText = '超大甜區（非中心點擊球依然能穩定過網）';
      wristRiskText = '🛡️ 極低：吸震緩衝佳，最適合初學者與復健保護期';
    }

    return {
      totalPowerReq,
      quadrantName,
      quadrantDesc,
      powerRequirementText,
      sweetSpotText,
      wristRiskText,
      xPercent: Math.min(95, Math.max(5, ((simTension - 18) / 12) * 90 + 5)),
      yPercent: Math.min(95, Math.max(5, 100 - (simShaftScore * 0.9 + 5))),
    };
  };

  const simMetrics = getSimulationMetrics();

  const filteredRackets = allRackets.filter((racket) => {
    const matchesBrand = selectedBrand === 'ALL' || racket.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesLevel = selectedLevel === 'ALL' || racket.level === selectedLevel;
    const matchesQuery = racket.name.toLowerCase().includes(searchQuery.toLowerCase()) || racket.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesLevel && matchesQuery;
  });

  const filteredStrings = badmintonStrings.filter((s) => s.brand === selectedStringBrand);

  const handleAiSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    setAiResult(null);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playStyle,
          preferredWeight,
          budget: Number(budget),
          isBeginner,
          userPrompt,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiResult(data.data);
      } else {
        setErrorMsg(data.error || '分析失敗，請稍後再試。');
      }
    } catch (err) {
      setErrorMsg('連線異常，請確認網路與伺服器狀態。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#222222] font-sans flex flex-col justify-between">
      {/* 頁首 Header Navigation */}
      <header className="border-b border-gray-200/60 bg-[#FAF9F5]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center">
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-2.5 cursor-pointer select-none"
          >
            <div className="w-6 h-6 rounded-full border-2 border-[#16382B] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full border border-[#16382B]"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#16382B]">
              拍面 <span className="text-sm font-normal text-slate-500 tracking-wide">PaiMian</span>
            </span>
          </div>

          <nav className="flex space-x-1 sm:space-x-6 text-sm font-medium mt-3 sm:mt-0 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'home', label: '首頁與百科' },
              { id: 'database', label: '球拍資料庫' },
              { id: 'ai', label: 'AI 選拍與配線' },
              { id: 'beginner', label: '新手配置' },
              { id: 'stores', label: '購買通路' },
              { id: 'news', label: '新拍資訊' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 py-1.5 transition-all duration-200 whitespace-nowrap relative ${
                  activeTab === tab.id
                    ? 'text-[#16382B] font-semibold'
                    : 'text-slate-600 hover:text-[#16382B]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A059] rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 主要內容區塊 */}
      <main className="max-w-6xl mx-auto px-6 py-8 sm:py-12 flex-1 w-full space-y-16">
        
        {/* ==================== 首頁與深度知識百科 View ==================== */}
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fade-in">
            <div className="py-6 sm:py-10 space-y-6 max-w-3xl">
              <div className="flex items-center space-x-2 text-[#C5A059] font-medium text-sm">
                <span className="w-8 h-[2px] bg-[#C5A059]"></span>
                <span>台灣羽球拍指南</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#16382B] leading-tight">
                找到握在手裡真正合適的那一支拍與線
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                涵蓋五大品牌球拍與七大品牌羽球線全顏色細節。透過互動式四象限手感模擬器與 AI 智慧選拍，精準掌握磅數、中桿與拍框的黃金搭配。
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('ai')}
                  className="px-6 py-3 bg-[#16382B] text-white font-medium rounded hover:bg-[#122e23] transition shadow-sm"
                >
                  開始 AI 選拍與配線
                </button>
                <button
                  onClick={() => setActiveTab('database')}
                  className="px-6 py-3 border border-[#16382B] text-[#16382B] font-medium rounded hover:bg-[#16382B]/5 transition"
                >
                  瀏覽球拍資料庫
                </button>
              </div>
            </div>

            {/* 羽球裝備深度百科 & 十字象限座標模擬器 */}
            <div className="bg-white rounded border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm">
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2 text-[#C5A059] font-semibold text-xs tracking-widest uppercase">
                  <span className="w-6 h-[2px] bg-[#C5A059]"></span>
                  <span>INTERACTIVE MATRIX & ENCYCLOPEDIA</span>
                </div>
                <h2 className="text-2xl font-bold text-[#16382B]">羽球裝備深度百科 ＆ 四象限手感座標模擬器</h2>
                <p className="text-slate-600 text-sm">點擊下方頁籤，可互動拖曳調整「磅數 × 中桿 × 拍框」象限座標，或深入閱讀各項裝備物理原理：</p>
              </div>

              {/* 知識頁籤 */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                {[
                  { id: 'matrix', label: '🎯 四象限手感座標模擬器（可拉動）' },
                  { id: 'tension', label: '1. 穿線磅數深度解析 (Tension)' },
                  { id: 'shaft', label: '2. 中桿軟硬度與鞭甩原理 (Flex)' },
                  { id: 'frame', label: '3. 拍框結構與空氣力學 (Frame)' },
                  { id: 'string', label: '4. 七大品牌羽球線色彩圖鑑' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveWikiTopic(t.id as any)}
                    className={`px-4 py-2 text-sm font-medium rounded transition ${
                      activeWikiTopic === t.id
                        ? 'bg-[#16382B] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                {/* ==================== Tab 0: 十字象限 XY 座標互動模擬器 ==================== */}
                {activeWikiTopic === 'matrix' && (
                  <div className="space-y-8 animate-fade-in">
                    {/* 頂部：快速套用球拍與規格控制列 */}
                    <div className="bg-[#FAF9F5] p-5 rounded border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                      <div>
                        <label className="block text-xs font-bold text-[#16382B] mb-1.5">
                          🏸 選擇要套用的球拍型號：
                        </label>
                        <select
                          value={selectedSimRacket}
                          onChange={(e) => handleSelectRacketForSim(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded bg-white text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#16382B]"
                        >
                          {allRackets.map((r, i) => (
                            <option key={i} value={r.name}>
                              [{r.brand}] {r.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#16382B] mb-1.5">
                          ⚖️ 球拍重量規格 (U數)：
                        </label>
                        <div className="flex space-x-2">
                          {(['3U', '4U', '5U'] as const).map((w) => (
                            <button
                              key={w}
                              onClick={() => setSimWeight(w)}
                              className={`flex-1 py-2 text-xs font-bold rounded border transition ${
                                simWeight === w
                                  ? 'bg-[#16382B] text-white border-[#16382B]'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {w} {w === '3U' ? '(重砲)' : w === '4U' ? '(標準)' : '(輕快)'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs bg-white p-2.5 rounded border border-slate-200 text-slate-600">
                        <span className="font-bold text-[#C5A059] block">目前拍框結構屬性：</span>
                        <span className="font-semibold text-[#16382B]">{simFrameType}</span>
                      </div>
                    </div>

                    {/* 中央核心區：左側 X/Y 十字座標圖 ＋ 右側控制滑桿與即時結果 */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      
                      {/* 左側：X/Y 十字象限視覺座標圖 */}
                      <div className="lg:col-span-6 space-y-2">
                        <div className="relative w-full aspect-square max-w-[420px] mx-auto bg-gradient-to-br from-emerald-50/60 via-white to-amber-50/60 border-2 border-slate-300 rounded-lg shadow-inner overflow-hidden select-none">
                          
                          {/* 四個象限背景浮水印文字 */}
                          <div className="absolute top-3 left-3 text-[11px] font-bold text-slate-400">
                            第二象限<br /><span className="font-normal text-[10px]">低磅借力 × 硬桿重殺</span>
                          </div>
                          <div className="absolute top-3 right-3 text-right text-[11px] font-bold text-amber-700/60">
                            第一象限<br /><span className="font-normal text-[10px]">高磅控球 × 硬桿重砲</span>
                          </div>
                          <div className="absolute bottom-3 left-3 text-[11px] font-bold text-emerald-700/60">
                            第三象限<br /><span className="font-normal text-[10px]">低磅高彈 × 軟桿省力</span>
                          </div>
                          <div className="absolute bottom-3 right-3 text-right text-[11px] font-bold text-blue-700/60">
                            第四象限<br /><span className="font-normal text-[10px]">高磅快彈 × 破風平抽</span>
                          </div>

                          {/* 十字中心軸線 (X軸與Y軸) */}
                          <div className="absolute top-0 bottom-0 left-1/2 w-[1.5px] bg-slate-400/70 -translate-x-1/2"></div>
                          <div className="absolute left-0 right-0 top-1/2 h-[1.5px] bg-slate-400/70 -translate-y-1/2"></div>

                          {/* 座標軸端點標籤 */}
                          <span className="absolute top-1 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                            ↑ 硬中桿 / 盒型重殺框
                          </span>
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-slate-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                            ↓ 軟中桿 / 破風高彈框
                          </span>
                          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-emerald-700 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                            ← 低磅 (18Lbs)
                          </span>
                          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-amber-700 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                            高磅 (30Lbs) →
                          </span>

                          {/* 動態座標點 */}
                          <div
                            style={{
                              left: `${simMetrics.xPercent}%`,
                              top: `${simMetrics.yPercent}%`,
                            }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-150 z-20 flex flex-col items-center"
                          >
                            <div className="w-10 h-10 rounded-full bg-[#C5A059]/30 animate-ping absolute"></div>
                            <div className="w-5 h-5 rounded-full bg-[#16382B] border-2 border-[#C5A059] shadow-lg relative z-10"></div>
                            <div className="mt-1.5 bg-[#16382B] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                              {selectedSimRacket} ({simWeight} / {simTension}磅)
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 右側：左右/上下拉動滑桿 ＆ 即時發力與手感分析儀表板 */}
                      <div className="lg:col-span-6 space-y-6">
                        
                        {/* 滑桿 1：X軸 左右拉動穿線磅數 */}
                        <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-[#16382B]">
                              ↔️ X軸拉動【穿線磅數】：<span className="text-lg text-[#C5A059] font-extrabold">{simTension} 磅 (Lbs)</span>
                            </label>
                            <span className="text-xs text-slate-500">往左低磅省力 / 往右高磅精準</span>
                          </div>
                          <input
                            type="range"
                            min={18}
                            max={30}
                            step={1}
                            value={simTension}
                            onChange={(e) => setSimTension(Number(e.target.value))}
                            className="w-full accent-[#16382B] cursor-pointer h-2 bg-slate-200 rounded-lg"
                          />
                          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                            <span>18磅 (新手彈性)</span>
                            <span>24磅 (進階分水嶺)</span>
                            <span>27磅 (校隊重殺)</span>
                            <span>30磅 (職業選手)</span>
                          </div>
                        </div>

                        {/* 滑桿 2：Y軸 上下拉動中桿硬度與拍框剛性 */}
                        <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-[#16382B]">
                              ↕️ Y軸調整【中桿硬度 ＆ 拍框剛性】：<span className="text-sm text-emerald-800 font-extrabold">
                                {simShaftScore >= 75 ? '硬挺 / 重殺盒框' : simShaftScore >= 45 ? '適中 / 攻守平衡框' : '柔軟高彈 / 破風框'}
                              </span>
                            </label>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={100}
                            step={5}
                            value={simShaftScore}
                            onChange={(e) => setSimShaftScore(Number(e.target.value))}
                            className="w-full accent-[#C5A059] cursor-pointer h-2 bg-slate-200 rounded-lg"
                          />
                          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                            <span>極軟破風 (輕鬆借力)</span>
                            <span>適中混合框</span>
                            <span>極硬盒型框 (極致重殺)</span>
                          </div>
                        </div>

                        {/* 即時動態計算結果面板 */}
                        <div className="bg-white p-5 rounded border-2 border-[#16382B]/20 space-y-4 shadow-sm">
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-[#C5A059] uppercase">📍 目前落點象限解析</span>
                            <h4 className="text-base font-extrabold text-[#16382B]">{simMetrics.quadrantName}</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">{simMetrics.quadrantDesc}</p>
                          </div>

                          {/* 發力要求進度條 */}
                          <div className="space-y-1.5 border-t border-slate-100 pt-3">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-slate-700">💪 使用者所需「發力門檻」指數：</span>
                              <span className={simMetrics.totalPowerReq >= 75 ? 'text-red-600' : 'text-[#16382B]'}>
                                {simMetrics.totalPowerReq} / 100 分
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${simMetrics.totalPowerReq}%` }}
                                className={`h-full transition-all duration-300 ${
                                  simMetrics.totalPowerReq >= 75 ? 'bg-red-500' :
                                  simMetrics.totalPowerReq >= 45 ? 'bg-[#C5A059]' : 'bg-emerald-600'
                                }`}
                              ></div>
                            </div>
                            <p className="text-xs text-slate-700 pt-1"><b>發力要求：</b>{simMetrics.powerRequirementText}</p>
                            <p className="text-xs text-slate-700"><b>甜區表現：</b>{simMetrics.sweetSpotText}</p>
                            <p className="text-xs text-slate-700"><b>運動傷害風險：</b>{simMetrics.wristRiskText}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ==================== Tab 1: 穿線磅數深度解析 ==================== */}
                {activeWikiTopic === 'tension' && (
                  <div className="space-y-6 animate-fade-in text-slate-700 leading-relaxed">
                    <div className="border-l-4 border-[#16382B] pl-4 space-y-1">
                      <h3 className="text-xl font-bold text-[#16382B]">穿線磅數 (Tension / Lbs) 深度物理與實戰解析</h3>
                      <p className="text-xs text-slate-500">穿線師常說「三分拍、七分線」，磅數是決定球拍好不好打的第一關鍵。</p>
                    </div>

                    <p className="text-sm">
                      穿線磅數指的是穿線機拉緊羽球線時的張力大小（單位為磅 Lbs）。許多初學者容易陷入「職業選手都拉 30 磅，所以我拉高磅數殺球才會強」的迷思，但事實上<strong>高磅數本身並不會增加球拍的威力，反而會大幅縮小甜區並考驗發力技術</strong>。
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-emerald-50/70 p-5 rounded border border-emerald-200 space-y-2">
                        <span className="text-xs font-bold px-2 py-0.5 bg-emerald-700 text-white rounded">19 – 22 磅｜低磅高彈區</span>
                        <h4 className="font-bold text-[#16382B] text-base">床墊彈簧效應（Trampoline Effect）</h4>
                        <p className="text-xs leading-relaxed">
                          球線張力較鬆，擊球瞬間球線會產生較大的凹陷形變，隨後像彈簧一樣把球「彈」出去。<strong>優點：</strong>甜區極大、高遠球非常省力、吸震護腕；<strong>缺點：</strong>球在線床上停留時間長，網前小球與殺球落點較難精準控制，容易出現「球亂飛」的情況。
                        </p>
                      </div>

                      <div className="bg-amber-50/70 p-5 rounded border border-amber-200 space-y-2">
                        <span className="text-xs font-bold px-2 py-0.5 bg-[#C5A059] text-white rounded">23 – 25 磅｜黃金業餘進階區</span>
                        <h4 className="font-bold text-[#16382B] text-base">彈性與控球的最佳平衡點</h4>
                        <p className="text-xs leading-relaxed">
                          全台 80% 具備基礎發力（能輕鬆打到後場底線）的社團與系隊球友集中在此區間。線床保有適度彈性，同時具備足夠的張力讓切球、吊球與平抽擋指哪打哪，擊球聲音也開始變得清脆響亮。
                        </p>
                      </div>

                      <div className="bg-red-50/70 p-5 rounded border border-red-200 space-y-2">
                        <span className="text-xs font-bold px-2 py-0.5 bg-red-700 text-white rounded">26 – 30+ 磅｜高磅精準競技區</span>
                        <h4 className="font-bold text-[#16382B] text-base">零延遲直接傳導（Zero Delay）</h4>
                        <p className="text-xs leading-relaxed">
                          線床緊繃如鼓面，幾乎沒有形變延遲，力量 100% 傳導至球頭，網前搓放與重殺落點極度精準。<strong>警告：</strong>若本身尚未掌握「小臂內旋鞭甩發力」，打高磅數會感覺像拿鐵板撞球，不僅球飛不遠，更極易導致手腕肌腱炎與網球肘。
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ==================== Tab 2: 中桿軟硬度深度解析 ==================== */}
                {activeWikiTopic === 'shaft' && (
                  <div className="space-y-6 animate-fade-in text-slate-700 leading-relaxed">
                    <div className="border-l-4 border-[#16382B] pl-4 space-y-1">
                      <h3 className="text-xl font-bold text-[#16382B]">中桿軟硬度 (Shaft Flex) 與「鞭甩形變」物理原理</h3>
                      <p className="text-xs text-slate-500">中桿是連接握柄與拍框的引擎，決定了你的揮拍能量如何轉換成球速。</p>
                    </div>

                    <p className="text-sm">
                      在揮拍擊球的 0.05 秒內，中桿會經歷「向後彎曲蓄力 → 向前加速回彈鞭甩」的過程。<strong>選購中桿的核心原則只有一個：「你的揮拍爆發力，必須足以把這根中桿打彎！」</strong>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 p-5 rounded border border-slate-200 space-y-2">
                        <h4 className="font-bold text-[#16382B] text-base">🟢 偏軟中桿 (Flexible / Soft)</h4>
                        <ul className="text-xs space-y-1.5 list-disc pl-4">
                          <li><strong>物理特性：</strong>較小的揮拍速度即可讓中桿產生明顯彎曲，利用中桿回彈的「鞭甩力」把球甩向後場。</li>
                          <li><strong>適合對象：</strong>初學者、女性球友、力量較小者，或喜歡輕鬆拉高遠球、防守挑球的打法。</li>
                          <li><strong>限制：</strong>當全力重殺或高速平抽時，過軟的中桿會因為「回彈速度跟不上揮拍節奏」而產生晃動感，導致殺球威力被吃掉、落點發飄。</li>
                        </ul>
                      </div>

                      <div className="bg-slate-50 p-5 rounded border border-slate-200 space-y-2">
                        <h4 className="font-bold text-[#16382B] text-base">🔥 偏硬 / 特硬中桿 (Stiff / Extra Stiff)</h4>
                        <ul className="text-xs space-y-1.5 list-disc pl-4">
                          <li><strong>物理特性：</strong>高剛性碳纖維（如 M40X、實心中桿）抗扭性極強，揮拍瞬間形變小、回彈恢復速度極快，力量幾乎無損耗傳導。</li>
                          <li><strong>適合對象：</strong>爆發力強、揮拍速度快、擅長後場連續重殺與前場閃腕點殺的進階選手（代表拍款：Yonex 100ZZ、Victor 龍牙二代）。</li>
                          <li><strong>限制：</strong>若揮拍速度不夠快，中桿根本不會彎曲，打起來會覺得像「拿著一根燒火棍」，被動球極難擺脫。</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* ==================== Tab 3: 拍框形狀深度解析 ==================== */}
                {activeWikiTopic === 'frame' && (
                  <div className="space-y-6 animate-fade-in text-slate-700 leading-relaxed">
                    <div className="border-l-4 border-[#16382B] pl-4 space-y-1">
                      <h3 className="text-xl font-bold text-[#16382B]">拍框截面形狀 (Frame Structure) 與空氣動力學</h3>
                      <p className="text-xs text-slate-500">拍框決定了揮拍的風阻速度、擊球瞬間的穩定度以及拍頭重量分佈。</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 p-5 rounded border border-slate-200 space-y-2">
                        <h4 className="font-bold text-[#16382B] text-base">1. 盒型框 (Box Frame)</h4>
                        <p className="text-xs leading-relaxed">
                          <strong>截面呈方形結構：</strong>拍框剛性與抗扭力最強！擊球瞬間拍面極度穩定不晃動，能承受高磅數並提供最紮實的「重殺下壓感」與控球精準度。缺點是正面迎風面積較大，揮拍風阻較高（代表：Yonex 88D Pro、傳統進攻拍）。
                        </p>
                      </div>

                      <div className="bg-slate-50 p-5 rounded border border-slate-200 space-y-2">
                        <h4 className="font-bold text-[#16382B] text-base">2. 破風框 (Aero / Sword Frame)</h4>
                        <p className="text-xs leading-relaxed">
                          <strong>截面呈菱形刀鋒或流線水滴狀：</strong>大幅降低揮拍時的空氣阻力，揮速極快！非常適合雙打前場封網、中半場高速平抽擋與被動防守反擊。缺點是擊球瞬間拍框較薄、穩定度略遜於盒型框（代表：Victor 亮劍/神速系列）。
                        </p>
                      </div>

                      <div className="bg-slate-50 p-5 rounded border border-slate-200 space-y-2">
                        <h4 className="font-bold text-[#16382B] text-base">3. 複合式拍框 (Aero-Box)</h4>
                        <p className="text-xs leading-relaxed">
                          <strong>現代主流旗艦設計：</strong>結合上述兩者優點——通常在拍框上半部採用「破風設計」提升揮速，下半部或三通處採用「盒型結構」增強抗扭與爆發力，實現揮拍快又打得重的全能表現（代表：Yonex Astrox 77 Pro）。
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ==================== Tab 4: 七大品牌羽球線色彩圖鑑 ==================== */}
                {activeWikiTopic === 'string' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-wrap gap-2 items-center bg-slate-50 p-3 rounded border border-slate-200">
                      <span className="text-xs font-bold text-slate-600 mr-2">選擇品牌：</span>
                      {['Yonex', 'Victor', 'Kizuna', 'Kawasaki', 'Gosen', 'Li-Ning', 'Mizuno'].map((brand) => (
                        <button
                          key={brand}
                          onClick={() => setSelectedStringBrand(brand)}
                          className={`px-3 py-1.5 text-xs font-bold rounded transition ${
                            selectedStringBrand === brand
                              ? 'bg-[#C5A059] text-white shadow-sm'
                              : 'bg-white text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredStrings.map((s, idx) => (
                        <div key={idx} className="bg-slate-50 p-5 rounded border border-slate-200 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#16382B] text-base">{s.name}</span>
                            <span className="text-xs bg-[#16382B]/10 text-[#16382B] px-2 py-0.5 rounded font-semibold">
                              {s.gauge} | {s.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                          <div className="border-t border-slate-200/80 pt-2 space-y-1">
                            <span className="text-[11px] font-bold text-[#C5A059] block">🎨 可選顏色列表：</span>
                            <div className="flex flex-wrap gap-1.5">
                              {s.colors.map((c, cIdx) => (
                                <span key={cIdx} className="text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== AI 選拍與配線 View ==================== */}
        {activeTab === 'ai' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#C5A059] font-semibold text-xs tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-[#C5A059]"></span>
                <span>AI RACKET & STRING MATCH</span>
              </div>
              <h2 className="text-3xl font-bold text-[#16382B]">AI 智慧選拍 ＋ 打法風格球線搭配</h2>
              <p className="text-slate-600 text-sm">
                輸入您的打法習慣與偏好，AI 將為您推薦最適合的「球拍 ＋ 羽球線 ＋ 顏色建議 ＋ 穿線磅數」。
              </p>
            </div>

            <div className="bg-white p-8 rounded border border-slate-200 space-y-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-bold text-slate-800 block mb-2 text-sm">打法偏好：</label>
                  <select 
                    value={playStyle} 
                    onChange={(e) => setPlayStyle(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-[#16382B] text-slate-800 text-sm bg-white"
                  >
                    <option value="Attack">主導進攻 / 強力扣殺 (Attack)</option>
                    <option value="Control">精準控球 / 拉吊防守 (Control)</option>
                    <option value="Balanced">攻守兼備 / 全面平抽 (Balanced)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-2 text-sm">球拍重量偏好：</label>
                  <select 
                    value={preferredWeight} 
                    onChange={(e) => setPreferredWeight(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-[#16382B] text-slate-800 text-sm bg-white"
                  >
                    <option value="3U">3U (約 85-89g, 適合力量大者)</option>
                    <option value="4U">4U (約 80-84g, 最主流標準重)</option>
                    <option value="5U">5U (約 75-79g, 輕量靈巧型)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-2 text-sm">預算上限 (NTD)：</label>
                <input 
                  type="number" 
                  value={budget} 
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="例如 1500 (平價) 或 3000 (中階)"
                  className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-[#16382B] text-slate-800 text-sm"
                />
              </div>

              <div className="flex items-center space-x-3 bg-[#FAF9F5] p-4 rounded border border-slate-200">
                <input 
                  type="checkbox" 
                  id="beginner-check" 
                  checked={isBeginner} 
                  onChange={(e) => setIsBeginner(e.target.checked)} 
                  className="w-4 h-4 text-[#16382B] rounded"
                />
                <label htmlFor="beginner-check" className="font-medium text-slate-800 text-sm cursor-pointer">
                  我是剛接觸羽球的新手 (需要客製化高彈防傷手球線與配線顏色)
                </label>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-2 text-sm">打法手感與顏色風格偏好 (AI 語意分析)：</label>
                <textarea 
                  placeholder="例如：喜歡打後場重殺、喜歡金屬高音，希望能推薦螢光黃或櫻花粉色系的球線搭配..." 
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded h-28 text-slate-800 text-sm"
                />
              </div>

              <button 
                onClick={handleAiSubmit} 
                disabled={loading}
                className="w-full bg-[#16382B] text-white py-3.5 rounded font-bold hover:bg-[#122e23] transition shadow disabled:opacity-50"
              >
                {loading ? '🤖 AI 正在智慧分析球拍 ＋ 線種與顏色搭配...' : '開始 AI 智慧推薦球拍與羽球線'}
              </button>

              {errorMsg && (
                <div className="p-4 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
                  {errorMsg}
                </div>
              )}
            </div>

            {aiResult && (
              <div className="bg-[#FAF9F5] p-8 rounded border border-[#C5A059]/40 space-y-6 shadow-sm">
                <h3 className="text-2xl font-bold text-[#16382B] border-b border-slate-200 pb-3">
                  🎯 AI 推薦：最佳球拍 ＋ 球線 ＋ 顏色組合
                </h3>

                <div className="space-y-4">
                  {aiResult.recommended_rackets?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-white p-5 rounded border border-slate-200 space-y-3">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-bold text-lg text-[#16382B]">{item.name}</span>
                        <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded">
                          {item.availability || '好入手'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.reason}</p>
                      
                      <div className="bg-[#FAF9F5] p-3 rounded border border-amber-200/80 space-y-1.5 text-xs text-slate-700">
                        <div className="font-bold text-[#16382B] flex items-center space-x-1">
                          <span>🏸 推薦搭配羽球線：</span>
                          <span className="text-[#C5A059] font-extrabold">{item.recommended_string}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div><b>建議配色：</b><span className="px-2 py-0.5 bg-amber-100 font-semibold rounded text-amber-900">{item.recommended_string_color || '螢光黃 / 耀目白'}</span></div>
                          <div><b>建議磅數：</b><span className="font-semibold text-emerald-800">{item.recommended_tension || '22-24 磅'}</span></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {aiResult.style_pairing_analysis && (
                  <div className="bg-emerald-50 p-5 rounded border border-emerald-200 space-y-2">
                    <h4 className="font-bold text-emerald-900">💡 個人打法風格與線拍搭配解析</h4>
                    <p className="text-emerald-900 text-xs leading-relaxed">
                      {aiResult.style_pairing_analysis}
                    </p>
                  </div>
                )}

                <div className="bg-white p-5 rounded border border-slate-200 space-y-2">
                  <h4 className="font-bold text-[#16382B]">💡 綜合心得與打感點評</h4>
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                    {aiResult.detailed_review}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== 球拍資料庫 View ==================== */}
        {activeTab === 'database' && (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#C5A059] font-semibold text-xs tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-[#C5A059]"></span>
                <span>RACKET DATABASE</span>
              </div>
              <h2 className="text-3xl font-bold text-[#16382B]">全級別球拍外觀資料庫</h2>
              <p className="text-slate-600 text-sm">包含 Yonex, Victor, Fleet, Mizuno, JNICE 的規格與手感評價，點擊卡片可一鍵帶入「四象限手感模擬器」！</p>
            </div>

            <div className="bg-white p-5 rounded border border-slate-200 space-y-4 shadow-sm">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-slate-500 mr-2">品牌：</span>
                {[
                  { id: 'ALL', label: '全部品牌' },
                  { id: 'Yonex', label: 'Yonex (YY)' },
                  { id: 'Victor', label: 'VICTOR (勝利)' },
                  { id: 'Fleet', label: 'FLEET (富力特)' },
                  { id: 'Mizuno', label: 'MIZUNO (美津濃)' },
                  { id: 'JNICE', label: 'JNICE (久奈司)' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(b.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded transition ${
                      selectedBrand === b.id
                        ? 'bg-[#16382B] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 mr-2">價位級別：</span>
                {[
                  { id: 'ALL', label: '全部級別' },
                  { id: 'ENTRY', label: '🌱 平價入門 ($1,000 - $1,800)' },
                  { id: 'MID', label: '⚡ 中階進階 ($2,000 - $3,500)' },
                  { id: 'PRO', label: '🔥 高階旗艦 ($3,800+)' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded transition ${
                      selectedLevel === lvl.id
                        ? 'bg-[#C5A059] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}

                <input 
                  type="text" 
                  placeholder="搜尋型號..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-1.5 border rounded text-xs ml-auto w-full sm:w-40 text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRackets.map((racket, idx) => (
                <div key={idx} className="bg-white rounded border border-slate-200 hover:border-[#C5A059] transition shadow-sm overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="h-44 bg-slate-50 relative overflow-hidden group flex items-center justify-center p-4 border-b border-slate-100">
                      <img 
                        src={racket.img} 
                        alt={racket.name} 
                        className="h-full object-contain group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute top-3 left-3 flex space-x-1.5">
                        <span className="text-xs font-bold px-2 py-0.5 bg-[#16382B] text-white rounded">
                          {racket.brand}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          racket.level === 'ENTRY' ? 'bg-green-600 text-white' :
                          racket.level === 'MID' ? 'bg-blue-600 text-white' : 'bg-amber-600 text-white'
                        }`}>
                          {racket.levelTag}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-[#16382B]">{racket.name}</h3>
                        <span className="text-xs text-[#C5A059] font-bold">{racket.price}</span>
                      </div>
                      
                      <div className="text-xs text-slate-500 space-y-1 border-t border-b py-2 my-2">
                        <div>打法風格：{racket.style}</div>
                        <div>重量/中桿：{racket.weight} | {racket.flex}</div>
                        <div>拍框結構：{racket.frameType}</div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{racket.desc}</p>
                    </div>
                  </div>

                  <div className="px-5 pb-4">
                    <button
                      onClick={() => {
                        handleSelectRacketForSim(racket.name);
                        setActiveWikiTopic('matrix');
                        setActiveTab('home');
                      }}
                      className="w-full py-2 bg-[#FAF9F5] hover:bg-[#16382B] text-[#16382B] hover:text-white border border-[#16382B]/30 text-xs font-bold rounded transition"
                    >
                      🎯 套用至四象限座標模擬器測試磅數
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 新手配置 View ==================== */}
        {activeTab === 'beginner' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#C5A059] font-semibold text-xs tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-[#C5A059]"></span>
                <span>BEGINNER GUIDE</span>
              </div>
              <h2 className="text-3xl font-bold text-[#16382B]">新手入門平價裝備建議</h2>
              <p className="text-slate-600 text-sm">幫助羽球新手一次購齊正確裝備，不花冤枉錢。</p>
            </div>

            <div className="bg-white p-8 rounded border border-slate-200 space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded border-l-4 border-[#16382B]">
                  <h3 className="font-bold text-[#16382B]">1. 初學平價神拍推薦 ($1,200 - $1,800)</h3>
                  <p className="text-xs text-slate-600 mt-1">如 Victor TK-9500、Yonex Arcsaber 7 Play、JNICE 追風 2000。中桿偏軟甜區大，輕鬆打遠。</p>
                </div>
                <div className="p-4 bg-slate-50 rounded border-l-4 border-[#C5A059]">
                  <h3 className="font-bold text-[#16382B]">2. 穿線磅數與顏色搭配：建議 20 - 22 磅 (高彈粗線)</h3>
                  <p className="text-xs text-slate-600 mt-1">新手建議選擇 YY BG-65 或 Victor VBS-70 螢光黃/耀目白，耐打不傷手臂。</p>
                </div>
                <div className="p-4 bg-slate-50 rounded border-l-4 border-[#16382B]">
                  <h3 className="font-bold text-[#16382B]">3. 生膠底專業羽球鞋 (必備)</h3>
                  <p className="text-xs text-slate-600 mt-1">切勿穿慢跑鞋下場！慢跑鞋缺少側向支撐極易扭傷腳踝。羽球鞋具備生膠止滑與防扭功能。</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 購買通路 View ==================== */}
        {activeTab === 'stores' && (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#C5A059] font-semibold text-xs tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-[#C5A059]"></span>
                <span>STORES & STOCK</span>
              </div>
              <h2 className="text-3xl font-bold text-[#16382B]">實體購買通路與店家評分</h2>
              <p className="text-slate-600 text-sm">精選全台高評價羽球專賣店，現場提供專業穿線與選購建議。</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: '大翔羽球專賣店 / 一線花羽球', rating: '4.9 ★', region: '大台北地區', promo: '買球拍常附贈免費專業穿線（七大品牌線種齊全）與握把布', brands: 'Yonex, Victor, Fleet, Mizuno, JNICE 全系列現貨' },
                { name: '無差別體育羽球專賣', rating: '4.8 ★', region: '台中 / 中台灣', promo: 'Fleet Woven 及 JNICE 系列促銷特惠中', brands: 'Fleet, JNICE, Mizuno 經銷據點' },
              ].map((store, idx) => (
                <div key={idx} className="bg-white p-6 rounded border border-slate-200 space-y-3 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[#16382B] text-lg">{store.name}</h3>
                    <span className="text-amber-600 font-bold text-sm">{store.rating}</span>
                  </div>
                  <div className="text-xs text-slate-500">地區：{store.region}</div>
                  <div className="text-xs bg-amber-50 text-amber-900 p-2.5 rounded border border-amber-200">
                    <b>門市優惠：</b>{store.promo}
                  </div>
                  <p className="text-xs text-slate-600"><b>主要經銷：</b>{store.brands}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 新拍資訊 View ==================== */}
        {activeTab === 'news' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#C5A059] font-semibold text-xs tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-[#C5A059]"></span>
                <span>LATEST RACKET NEWS</span>
              </div>
              <h2 className="text-3xl font-bold text-[#16382B]">最新球拍與球線發佈消息</h2>
              <p className="text-slate-600 text-sm">追蹤各大品牌最新裝備動態。</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded border border-slate-200 space-y-2 shadow-sm">
                <span className="text-xs text-[#C5A059] font-bold">2026 新品動態</span>
                <h3 className="font-bold text-[#16382B] text-lg">Yonex, Kizuna 與 Victor 高彈彩色羽球線廣受年輕球友喜愛</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  包含 BG66UM 螢光黃/櫻花粉、Kizuna Z63 以及 Victor VBS-66N 多彩線種，成為羽球場上兼具性能與視覺亮點的熱門穿線選擇。
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 頁尾 Footer */}
      <footer className="bg-[#16382B] text-slate-300 py-8 text-center text-xs border-t border-emerald-900 mt-16">
        <div className="max-w-6xl mx-auto px-6 space-y-2">
          <p className="font-medium">拍面 PaiMian | 台灣羽球指南 & AI 智慧選拍配線</p>
          <p className="text-slate-400">球拍資料與心得整理僅供參考，實際手感因人而異，建議至專賣店試拍後再購買。</p>
        </div>
      </footer>
    </div>
  );
}