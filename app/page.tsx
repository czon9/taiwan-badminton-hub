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
  const [activeWikiTopic, setActiveWikiTopic] = useState<'tension' | 'string' | 'shaft' | 'frame'>('string');
  const [selectedStringBrand, setSelectedStringBrand] = useState('Yonex');

  // 球拍資料庫 State (品牌 + 價位篩選 + 搜尋)
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 七大品牌羽球線完整資料庫 (含顏色與打感)
  const badmintonStrings = [
    // Yonex (YY)
    { brand: 'Yonex', name: 'BG-66 Ultimax (BG66UM)', gauge: '0.65 mm', type: '高彈極速', desc: '全球極受歡迎的高彈細線，擊球聲音響亮金屬感強，高遠球與扣殺回彈極快。', colors: ['耀目白 (Metallic White)', '螢光黃 (Neon Yellow)', '炫彩紅 (Red)', '冰藍 (Cool Blue)', '櫻花粉 (Pink)', '極光黑 (Black)'] },
    { brand: 'Yonex', name: 'BG-65', gauge: '0.70 mm', type: '耐打長青', desc: '羽球界普及度最高的耐打粗線，耐用度極高，適合新手與學校球隊。', colors: ['經典白 (White)', '曜石黑 (Black)', '活力橘 (Orange)', '寶藍 (Blue)', '草綠 (Green)', '螢光黃 (Yellow)'] },
    { brand: 'Yonex', name: 'Exbolt 63 (EXB63)', gauge: '0.63 mm', type: '極速高彈', desc: '採用鍛造纖維 (Forged Fiber)，擁有超強耐久度與極快音速出球打感。', colors: ['雪白 (White)', '炫光黃 (Yellow)', '烈焰紅 (Red)'] },
    { brand: 'Yonex', name: 'Exbolt 65 (EXB65)', gauge: '0.65 mm', type: '控球高彈', desc: '高彈性與耐打兼具，提供優異的控球持球感與出球連貫性。', colors: ['純白 (White)', '酷黑 (Black)', '螢光綠 (Yellow-Green)'] },
    { brand: 'Yonex', name: 'BG-80', gauge: '0.68 mm', type: '硬彈爆發', desc: '塗層帶有粗糙感，硬挺打感，殺球傳導極度直接紮實，進攻型球友最愛。', colors: ['珍珠白 (White)', '螢光黃 (Yellow)', '深灰 (Dark Grey)'] },
    { brand: 'Yonex', name: 'BG-80 Power', gauge: '0.68 mm', type: '重殺強攻', desc: '高強度 Vectran 纖維包裹，專為後場重殺壓制設計。', colors: ['亮白 (White)', '橘紅 (Orange)'] },
    { brand: 'Yonex', name: 'Aerobite (AB 異徑雙色線)', gauge: '主線 0.67mm / 橫線 0.61mm', type: '持球切球', desc: '橫豎線不同線徑與聚氨酯塗層，咬球極深，切球與網前搓球落點極度精準。', colors: ['紅白雙色 (Red/White)', '藍白雙色 (Blue/White)', '綠白雙色 (Green/White)'] },

    // VICTOR (勝利)
    { brand: 'Victor', name: 'VBS-66 Nano (VBS-66N)', gauge: '0.66 mm', type: '高彈連貫', desc: '高科技奈米碳纖維包裹，具有極佳彈性與優異的擊球音，平抽快攻連貫順暢。', colors: ['象牙白 (White)', '螢光黃 (Yellow)', '珊瑚粉 (Pink)', '賽道藍 (Blue)', '炫酷黑 (Black)'] },
    { brand: 'Victor', name: 'VBS-70', gauge: '0.70 mm', type: '極致耐打', desc: '高集束尼龍芯體，耐磨耐打性能頂級，性價比極高。', colors: ['純白 (White)', '螢光黃 (Yellow)', '曜石黑 (Black)', '海藍 (Blue)'] },
    { brand: 'Victor', name: 'VBS-63', gauge: '0.63 mm', type: '極速高音', desc: '超細線徑帶來清脆響亮的擊球聲，揮拍出球乾淨俐落。', colors: ['雪白 (White)', '亮黃 (Yellow)', '玫紅 (Pink)'] },
    { brand: 'Victor', name: 'VBS-68 Control', gauge: '0.68 mm', type: '精準控球', desc: '特殊側面側捲樹酯，提供絕佳咬球手感與拉吊精準度。', colors: ['珍珠白 (White)', '冷灰 (Grey)'] },

    // KIZUNA (吉綱)
    { brand: 'Kizuna', name: 'Z63 Premium (Z63)', gauge: '0.63 mm', type: '日本高彈', desc: '日本製造頂級細線，以超高彈性與高金屬音著稱，深受懂線球友喜愛。', colors: ['高雅白 (White)', '螢光黃 (Yellow)', '櫻桃紅 (Red)', '冰雪藍 (Blue)'] },
    { brand: 'Kizuna', name: 'Z58 Premium (Z58)', gauge: '0.58 mm', type: '極致超細線', desc: '世界級極細線徑 0.58mm，回彈極速、切音極響，揮拍風阻極小。', colors: ['純白 (White)', '螢光綠 (Yellow-Green)'] },
    { brand: 'Kizuna', name: 'D61 Duty', gauge: '0.61 mm', type: '高彈耐打', desc: '兼具細線高彈與優於同級線徑的耐久度。', colors: ['耀白 (White)', '黑色 (Black)'] },

    // KAWASAKI (川崎)
    { brand: 'Kawasaki', name: 'K-65 Rapid', gauge: '0.65 mm', type: '高彈平價', desc: '高性價比高彈線，回彈迅速，適合一般練習與進階平抽。', colors: ['亮白 (White)', '螢光黃 (Yellow)', '薄荷綠 (Mint Green)'] },
    { brand: 'Kawasaki', name: 'K-70 Durable', gauge: '0.70 mm', type: '超耐打款', desc: '高強度耐磨外層，專為高頻率練習與初學者設計。', colors: ['白色 (White)', '黑色 (Black)', '藍色 (Blue)'] },

    // GOSEN (高神)
    { brand: 'Gosen', name: 'G-Tone 5 (GT5)', gauge: '0.65 mm', type: '金屬高音', desc: '日本 GOSEN 獨家 Micro Fusion 科技，金屬擊球音震撼，高彈爆發力強。', colors: ['珍珠白 (White)', '螢光黃 (Yellow)', '爆裂橘 (Orange)', '炫彩紫 (Purple)', '櫻花粉 (Pink)'] },
    { brand: 'Gosen', name: 'G-Tone 9 (GT9)', gauge: '0.69 mm', type: '紮實耐打', desc: '超高耐久度與穩定手感，適合爆發力大且高頻率擊球者。', colors: ['白色 (White)', '黑色 (Black)', '黃色 (Yellow)'] },
    { brand: 'Gosen', name: 'R4X Momone (百音)', gauge: '0.66 mm', type: '柔彈舒適', desc: '吸震感優異，擊球手感舒適不傷手，控球與拉吊表現佳。', colors: ['粉白 (Pink/White)', '天藍 (Sky Blue)'] },

    // Li-Ning (李寧)
    { brand: 'Li-Ning', name: 'No.1 (李寧 1 號線)', gauge: '0.65 mm', type: '高彈主流', desc: '李寧國家隊選用高彈線，吸震性好、反彈力高，深受專業選手歡迎。', colors: ['純白 (White)', '螢光黃 (Yellow)', '中國紅 (Red)', '薄荷綠 (Green)', '酷黑 (Black)'] },
    { brand: 'Li-Ning', name: 'No.5 (李寧 5 號線)', gauge: '0.69 mm', type: '全能耐打', desc: '耐打與彈性均衡，擊球音渾厚紮實。', colors: ['白色 (White)', '黃色 (Yellow)', '黑色 (Black)'] },
    { brand: 'Li-Ning', name: 'No.7 (李寧 7 號線)', gauge: '0.70 mm', type: '極致耐磨', desc: '超高耐久度，適合重殺擊球與長時間高強度訓練。', colors: ['白色 (White)', '藍色 (Blue)', '黃色 (Yellow)'] },

    // MIZUNO (美津濃)
    { brand: 'Mizuno', name: 'ML65 Smooth', gauge: '0.65 mm', type: '細線高彈', desc: '日本高彈科技塗層，出球乾淨俐落，平抽快攻反應迅速。', colors: ['雪白 (White)', '螢光黃 (Yellow)', '珊瑚橘 (Orange)'] },
    { brand: 'Mizuno', name: 'MZ66', gauge: '0.66 mm', type: '均衡全面', desc: '手感清晰且具備良好耐久度，落點控制精準。', colors: ['純白 (White)', '黑色 (Black)'] },
  ];

  // 五大品牌全級別完整球拍資料清單 (含圖片連結與外觀)
  const allRackets = [
    // Yonex
    { brand: 'Yonex', level: 'PRO', levelTag: '高階旗艦', name: 'Astrox 88D Pro', style: '進攻型 Attack', weight: '3U / 4U', flex: '硬 Stiff', price: '$5,070', market: '熱銷中', img: 'https://images.unsplash.com/photo-1626225967045-9410dd9913d0?w=500&auto=format&fit=crop&q=60', desc: '後場重殺壓制神拍，頭重感明顯，雙打後場砲手首選。' },
    { brand: 'Yonex', level: 'PRO', levelTag: '高階旗艦', name: 'Astrox 100ZZ', style: '進攻型 Attack', weight: '3U / 4U', flex: '硬 Stiff', price: '$5,590', market: '熱銷預購', img: 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=500&auto=format&fit=crop&q=60', desc: '頂級旗艦實心中桿，揮拍極速，強攻重殺代表作。' },
    { brand: 'Yonex', level: 'PRO', levelTag: '高階旗艦', name: 'Astrox 77 Pro', style: '全面型 Balanced', weight: '3U / 4U', flex: '適中 Medium', price: '$4,870', market: '好入手', img: 'https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?w=500&auto=format&fit=crop&q=60', desc: '黃雅瓊指定拍，中桿彈性極佳，連續攻防拉吊極為順手。' },
    { brand: 'Yonex', level: 'MID', levelTag: '中階進階', name: 'Astrox 88 Game', style: '進攻型 Attack', weight: '4U', flex: '適中 Medium', price: '$2,470', market: '好入手', img: 'https://images.unsplash.com/photo-1626225967045-9410dd9913d0?w=500&auto=format&fit=crop&q=60', desc: 'Pro 版降階款，好上手不費力，進攻與性價比完美平衡。' },
    { brand: 'Yonex', level: 'ENTRY', levelTag: '平價入門', name: 'Arcsaber 7 Play', style: '控球型 Control', weight: '4U', flex: '軟 Soft', price: '$1,430', market: '好入手', img: 'https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?w=500&auto=format&fit=crop&q=60', desc: '甜區大中桿軟，極度好打輕鬆打高遠球，初學者超強首選！' },

    // VICTOR
    { brand: 'Victor', level: 'PRO', levelTag: '高階旗艦', name: 'Thruster Ryuga II Pro (龍牙二代)', style: '進攻型 Attack', weight: '3U / 4U', flex: '硬 Stiff', price: '$5,070', market: '熱銷中', img: 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=500&auto=format&fit=crop&q=60', desc: '李梓嘉戰拍，懸浮核心科技握柄，重殺連續下壓極強。' },
    { brand: 'Victor', level: 'MID', levelTag: '中階進階', name: 'Auraspeed 9000 (神速 9000)', style: '全面型 Balanced', weight: '4U/5U', flex: '適中 Medium', price: '$2,080', market: '好入手', img: 'https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?w=500&auto=format&fit=crop&q=60', desc: '揮拍極度輕快，專為平抽快攻與防守打造。' },
    { brand: 'Victor', level: 'ENTRY', levelTag: '平價入門', name: 'Challenge 9500 (TK-9500)', style: '進攻型 Attack', weight: '3U / 4U', flex: '適中 Medium', price: '$1,280', market: '熱銷神拍', img: 'https://images.unsplash.com/photo-1626225967045-9410dd9913d0?w=500&auto=format&fit=crop&q=60', desc: '台灣銷量極高的國民入門神拍，耐打穩定 CP 值爆表！' },

    // FLEET
    { brand: 'Fleet', level: 'PRO', levelTag: '高階旗艦', name: 'Woven 1000 EVO', style: '進攻型 Attack', weight: '3U / 4U', flex: '硬 Stiff', price: '$3,800', market: '好入手', img: 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=500&auto=format&fit=crop&q=60', desc: '台灣神拍 EVO 進化版，高剛性 Woven 編織碳纖維，打感紮實。' },
    { brand: 'Fleet', level: 'MID', levelTag: '中階進階', name: 'Professional 3000 VI', style: '控球型 Control', weight: '3U / 4U', flex: '適中 Medium', price: '$3,200', market: '好入手', img: 'https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?w=500&auto=format&fit=crop&q=60', desc: '平球快攻與精準拉吊控球利器，破風框揮拍速度流暢。' },
    { brand: 'Fleet', level: 'ENTRY', levelTag: '平價入門', name: 'Nano Power 100', style: '全面型 Balanced', weight: '4U', flex: '軟 Soft', price: '$1,380', market: '好入手', img: 'https://images.unsplash.com/photo-1626225967045-9410dd9913d0?w=500&auto=format&fit=crop&q=60', desc: '富力特平價長青款，中桿軟省力，高遠球輕鬆出球遠。' },

    // MIZUNO
    { brand: 'Mizuno', level: 'PRO', levelTag: '高階旗艦', name: 'Fortius 11 Power', style: '進攻型 Attack', weight: '4U', flex: '硬 Stiff', price: '$5,070', market: '中等庫存', img: 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=500&auto=format&fit=crop&q=60', desc: '日本美津濃頂級旗艦，極致力量重殺型。' },
    { brand: 'Mizuno', level: 'ENTRY', levelTag: '平價入門', name: 'Technoblade 660', style: '全面型 Balanced', weight: '4U', flex: '軟 Soft', price: '$1,450', market: '好入手', img: 'https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?w=500&auto=format&fit=crop&q=60', desc: '高彈性破風框，極度平價且好揮拍的美津濃入門選擇。' },

    // JNICE
    { brand: 'JNICE', level: 'PRO', levelTag: '高階旗艦', name: '神魔 (SNIPER 90)', style: '進攻型 Attack', weight: '3U / 4U', flex: '硬 Stiff', price: '$3,280', market: '好入手', img: 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=500&auto=format&fit=crop&q=60', desc: '久奈司旗艦重殺戰拍，破風兼具頭重感，殺球急墜。' },
    { brand: 'JNICE', level: 'MID', levelTag: '中階明星', name: '白羽刃 (White Blade)', style: '全面型 Balanced', weight: '4U', flex: '適中 Medium', price: '$2,680', market: '熱銷中', img: 'https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?w=500&auto=format&fit=crop&q=60', desc: '絕美白銀配色，中桿彈性極佳好借力，高 CP 值進階首選。' },
    { brand: 'JNICE', level: 'ENTRY', levelTag: '平價入門', name: '追風 2000 (Wind Speed)', style: '全面型 Balanced', weight: '4U', flex: '軟 Soft', price: '$1,280', market: '好入手', img: 'https://images.unsplash.com/photo-1626225967045-9410dd9913d0?w=500&auto=format&fit=crop&q=60', desc: '千元出頭親民款，中桿軟好揮拍，買了不傷荷包。' },
  ];

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
              { id: 'home', label: '首頁' },
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
        
        {/* ==================== 首頁 View ==================== */}
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
                涵蓋五大品牌球拍與七大品牌羽球線全顏色細節。用 AI 選拍工具依個人打法風格自動配對球拍、羽球線、線色與建議磅數。
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
                  瀏覽球拍外觀資料庫
                </button>
              </div>
            </div>

            {/* Quick Links Block */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-[#C5A059] font-semibold text-xs tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-[#C5A059]"></span>
                <span>QUICK LINKS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  onClick={() => setActiveTab('database')}
                  className="bg-white/80 p-6 rounded border border-slate-200/80 hover:border-[#C5A059] hover:shadow-md transition cursor-pointer space-y-3 group"
                >
                  <h3 className="text-lg font-bold text-[#16382B] group-hover:text-[#C5A059] transition">
                    球拍外觀資料庫
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    規格、心得、球拍照片預覽，收錄 Yonex, Victor, Fleet, Mizuno, JNICE 全級別。
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('ai')}
                  className="bg-white/80 p-6 rounded border border-slate-200/80 hover:border-[#C5A059] hover:shadow-md transition cursor-pointer space-y-3 group"
                >
                  <h3 className="text-lg font-bold text-[#16382B] group-hover:text-[#C5A059] transition">
                    AI 選拍 + 打法風格配線
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    用一句話描述你的打法，AI 智慧比對適合你的「球拍 ＋ 羽球線 ＋ 建議線色 ＋ 磅數」。
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('beginner')}
                  className="bg-white/80 p-6 rounded border border-slate-200/80 hover:border-[#C5A059] hover:shadow-md transition cursor-pointer space-y-3 group"
                >
                  <h3 className="text-lg font-bold text-[#16382B] group-hover:text-[#C5A059] transition">
                    新手裝備建議
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    一次給整套千元入門球拍、羽球線顏色與專業羽球鞋選購與原因。
                  </p>
                </div>
              </div>
            </div>

            {/* 羽球裝備與七大品牌羽球線顏色百科 */}
            <div className="bg-white rounded border border-slate-200 p-8 space-y-8 shadow-sm">
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2 text-[#C5A059] font-semibold text-xs tracking-widest uppercase">
                  <span className="w-6 h-[2px] bg-[#C5A059]"></span>
                  <span>BADMINTON KNOWLEDGE & STRINGS</span>
                </div>
                <h2 className="text-2xl font-bold text-[#16382B]">羽球線百科：七大品牌全線種與顏色大全</h2>
                <p className="text-slate-600 text-sm">涵蓋 Yonex、Victor、Kizuna、Kawasaki、Gosen、Li-Ning、Mizuno 各線種打感與全顏色清單：</p>
              </div>

              {/* 知識頁籤 */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                {[
                  { id: 'string', label: '1. 七大品牌羽球線全色彩圖鑑' },
                  { id: 'tension', label: '2. 穿線磅數 (Tension)' },
                  { id: 'shaft', label: '3. 中桿軟硬度 (Flex)' },
                  { id: 'frame', label: '4. 拍框形狀 (Frame)' },
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

              <div className="space-y-6 pt-2">
                {activeWikiTopic === 'string' && (
                  <div className="space-y-6 animate-fade-in">
                    {/* 七大品牌切換 */}
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

                    {/* 線種卡片列表 */}
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

                {activeWikiTopic === 'tension' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="text-xl font-bold text-[#16382B]">穿線磅數 (Lbs) 如何選擇？</h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      球線拉緊的張力單位為磅 (Lbs)。磅數高低決定了球拍甜區的大小、回彈省力程度以及控球精準度。
                    </p>
                  </div>
                )}

                {activeWikiTopic === 'shaft' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="text-xl font-bold text-[#16382B]">中桿軟硬度 (Flex) 與鞭甩發力</h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      中桿是球拍的靈魂，偏軟中桿適合輕鬆借力打高遠球，偏硬中桿傳導直接適合重殺。
                    </p>
                  </div>
                )}

                {activeWikiTopic === 'frame' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="text-xl font-bold text-[#16382B]">拍框形狀與風阻設計</h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      盒型框穩定抗扭，流線破風框風阻低平抽極快。
                    </p>
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

            {/* AI 結果展示 */}
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
                      
                      {/* 球線與顏色最佳搭配展示區 */}
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

        {/* ==================== 球拍資料庫 View (含外觀預覽) ==================== */}
        {activeTab === 'database' && (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#C5A059] font-semibold text-xs tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-[#C5A059]"></span>
                <span>RACKET DATABASE</span>
              </div>
              <h2 className="text-3xl font-bold text-[#16382B]">全級別球拍外觀資料庫</h2>
              <p className="text-slate-600 text-sm">包含 Yonex, Victor, Fleet, Mizuno, JNICE 的球拍圖示、外觀與手感規格。</p>
            </div>

            {/* 品牌與價位層級過濾列 */}
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

            {/* 球拍卡片列表（含圖片） */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRackets.map((racket, idx) => (
                <div key={idx} className="bg-white rounded border border-slate-200 hover:border-[#C5A059] transition shadow-sm overflow-hidden flex flex-col justify-between">
                  <div>
                    {/* 球拍外觀預覽圖 */}
                    <div className="h-44 bg-slate-100 relative overflow-hidden group">
                      <div className="w-full h-full bg-[#16382B]/5 flex items-center justify-center relative">
  <svg className="w-20 h-20 text-[#16382B] opacity-80 group-hover:scale-110 transition duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    {/* 拍框 */}
    <ellipse cx="12" cy="8" rx="6" ry="7" />
    {/* 拍網網格 */}
    <line x1="9" y1="3" x2="9" y2="13" strokeWidth="0.5" opacity="0.6" />
    <line x1="12" y1="1" x2="12" y2="15" strokeWidth="0.5" opacity="0.6" />
    <line x1="15" y1="3" x2="15" y2="13" strokeWidth="0.5" opacity="0.6" />
    <line x1="6" y1="6" x2="18" y2="6" strokeWidth="0.5" opacity="0.6" />
    <line x1="6" y1="9" x2="18" y2="9" strokeWidth="0.5" opacity="0.6" />
    {/* 中桿與柄 */}
    <line x1="12" y1="15" x2="12" y2="21" strokeWidth="2" />
    <rect x="11" y="21" width="2" height="2" fill="currentColor" />
  </svg>
  <span className="absolute bottom-2 text-[10px] text-slate-400 font-medium tracking-wider uppercase">
    {racket.brand} Preview
  </span>
</div>
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
                        <div>購買難易：<span className="text-emerald-700 font-semibold">{racket.market}</span></div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{racket.desc}</p>
                    </div>
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