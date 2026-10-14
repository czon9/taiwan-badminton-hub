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
  const [activeWikiTopic, setActiveWikiTopic] = useState<'tension' | 'string' | 'shaft' | 'frame'>('tension');

  // 球拍資料庫 State (品牌 + 價位篩選 + 搜尋)
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 五大品牌全級別完整資料清單
  const allRackets = [
    // Yonex
    { brand: 'Yonex', level: 'PRO', levelTag: '高階旗艦', name: 'Astrox 88D Pro', style: '進攻型 Attack', weight: '3U / 4U', flex: '硬 Stiff', price: '$5,070', market: '熱銷中', desc: '後場重殺壓制神拍，頭重感明顯，雙打後場砲手首選。' },
    { brand: 'Yonex', level: 'PRO', levelTag: '高階旗艦', name: 'Astrox 100ZZ', style: '進攻型 Attack', weight: '3U / 4U', flex: '硬 Stiff', price: '$5,590', market: '熱銷預購', desc: '頂級旗艦實心中桿，揮拍極速，強攻重殺代表作。' },
    { brand: 'Yonex', level: 'PRO', levelTag: '高階旗艦', name: 'Astrox 77 Pro', style: '全面型 Balanced', weight: '3U / 4U', flex: '適中 Medium', price: '$4,870', market: '好入手', desc: '黃雅瓊指定拍，中桿彈性極佳，連續攻防拉吊極為順手。' },
    { brand: 'Yonex', level: 'MID', levelTag: '中階進階', name: 'Astrox 88 Game', style: '進攻型 Attack', weight: '4U', flex: '適中 Medium', price: '$2,470', market: '好入手', desc: 'Pro 版降階款，好上手不費力，進攻與性價比完美平衡。' },
    { brand: 'Yonex', level: 'MID', levelTag: '中階進階', name: 'Nanoflare 800 Game', style: '全面型 Balanced', weight: '4U', flex: '適中 Medium', price: '$2,470', market: '好入手', desc: '破風框輕鬆揮拍，彈性佳，適合雙打快攻平抽。' },
    { brand: 'Yonex', level: 'MID', levelTag: '中階進階', name: 'Nanoflare 370 Speed', style: '全面型 Balanced', weight: '4U', flex: '適中 Medium', price: '$2,080', market: '好入手', desc: '破風框揮拍輕快，回彈速度快，適合平抽快攻連貫。' },
    { brand: 'Yonex', level: 'ENTRY', levelTag: '平價入門', name: 'Arcsaber 7 Play', style: '控球型 Control', weight: '4U', flex: '軟 Soft', price: '$1,430', market: '好入手', desc: '甜區大中桿軟，極度好打輕鬆打高遠球，初學者超強首選！' },
    { brand: 'Yonex', level: 'ENTRY', levelTag: '平價入門', name: 'Astrox 0.7DG (High Tension)', style: '進攻型 Attack', weight: '4U', flex: '適中 Medium', price: '$1,560', market: '好入手', desc: '可承受高磅數，耐用高 CP 值進攻入門拍。' },
    { brand: 'Yonex', level: 'ENTRY', levelTag: '平價入門', name: 'Astrox 3 DG', style: '進攻型 Attack', weight: '4U', flex: '硬 Stiff', price: '$1,690', market: '好入手', desc: '高張力耐打設計，適合預算有限但喜歡重殺下壓的球友。' },
    { brand: 'Yonex', level: 'ENTRY', levelTag: '平價入門', name: 'Nanoflare Drive', style: '全面型 Balanced', weight: '4U', flex: '軟 Soft', price: '$1,170', market: '好入手', desc: '揮拍極度輕盈不傷手，超低門檻新手練習神拍。' },

    // VICTOR
    { brand: 'Victor', level: 'PRO', levelTag: '高階旗艦', name: 'Thruster Ryuga II Pro (龍牙二代)', style: '進攻型 Attack', weight: '3U / 4U', flex: '硬 Stiff', price: '$5,070', market: '熱銷中', desc: '李梓嘉戰拍，懸浮核心科技握柄，重殺連續下壓極強。' },
    { brand: 'Victor', level: 'PRO', levelTag: '高階旗艦', name: 'Thruster F Claw (TK-F 隼)', style: '進攻型 Attack', weight: '3U / 4U', flex: '硬 Stiff', price: '$4,870', market: '熱銷中', desc: '戴資穎前戰拍，變速攻擊與精準控球兼備的經典神拍。' },
    { brand: 'Victor', level: 'MID', levelTag: '中階進階', name: 'Auraspeed 9000 (神速 9000)', style: '全面型 Balanced', weight: '4U/5U', flex: '適中 Medium', price: '$2,080', market: '好入手', desc: '揮拍極度輕快，專為平抽快攻與防守打造。' },
    { brand: 'Victor', level: 'MID', levelTag: '中階進階', name: 'Auraspeed 30H', style: '全面型 Balanced', weight: '4U', flex: '適中 Medium', price: '$1,820', market: '好入手', desc: '可耐高磅數，出球速度快且具備良好吸震性。' },
    { brand: 'Victor', level: 'ENTRY', levelTag: '平價入門', name: 'Challenge 9500 (TK-9500)', style: '進攻型 Attack', weight: '3U / 4U', flex: '適中 Medium', price: '$1,280', market: '熱銷神拍', desc: '台灣銷量極高的國民入門神拍，耐打穩定 CP 值爆表！' },
    { brand: 'Victor', level: 'ENTRY', levelTag: '平價入門', name: 'DriveX 1L', style: '全面型 Balanced', weight: '4U', flex: '適中 Medium', price: '$1,430', market: '好入手', desc: '手感舒適好借力，專為剛剛接觸羽球的新手設計。' },
    { brand: 'Victor', level: 'ENTRY', levelTag: '平價入門', name: 'Challenger 7000', style: '全面型 Balanced', weight: '4U', flex: '軟 Soft', price: '$1,170', market: '熱銷神拍', desc: '耐打耐用，初學者入坑羽球最無負擔的平價首選。' },

    // FLEET
    { brand: 'Fleet', level: 'PRO', levelTag: '高階旗艦', name: 'Woven 1000 EVO', style: '進攻型 Attack', weight: '3U / 4U', flex: '硬 Stiff', price: '$3,800', market: '好入手', desc: '台灣神拍 EVO 進化版，高剛性 Woven 編織碳纖維，打感紮實。' },
    { brand: 'Fleet', level: 'PRO', levelTag: '高階旗艦', name: 'Woven 1000 VI', style: '進攻型 Attack', weight: '3U / 4U', flex: '硬 Stiff', price: '$3,400', market: '好入手', desc: '六代經典 Woven 編織碳纖維，打感重殺紮實抗扭力極佳。' },
    { brand: 'Fleet', level: 'MID', levelTag: '中階進階', name: 'Professional 3000 VI', style: '控球型 Control', weight: '3U / 4U', flex: '適中 Medium', price: '$3,200', market: '好入手', desc: '平球快攻與精準拉吊控球利器，破風框揮拍速度流暢。' },
    { brand: 'Fleet', level: 'MID', levelTag: '中階進階', name: 'Professional 6000', style: '控球型 Control', weight: '3U / 4U', flex: '適中 Medium', price: '$2,900', market: '好入手', desc: '破風結構搭配穩定中桿，拉吊落點精準、防守輕鬆。' },
    { brand: 'Fleet', level: 'MID', levelTag: '中階進階', name: 'High Tension 1000', style: '全面型 Balanced', weight: '4U', flex: '適中 Medium', price: '$2,500', market: '好入手', desc: '耐高磅數設計，高 CP 值，新手到中階均適合。' },
    { brand: 'Fleet', level: 'ENTRY', levelTag: '平價入門', name: 'Nano Power 100', style: '全面型 Balanced', weight: '4U', flex: '軟 Soft', price: '$1,380', market: '好入手', desc: '富力特平價長青款，中桿軟省力，高遠球輕鬆出球遠。' },
    { brand: 'Fleet', level: 'ENTRY', levelTag: '平價入門', name: 'Tank Power 100', style: '進攻型 Attack', weight: '4U', flex: '適中 Medium', price: '$1,380', market: '好入手', desc: '坦克系列主打堅固耐用，適合剛接觸羽球常敲拍的新手。' },

    // MIZUNO
    { brand: 'Mizuno', level: 'PRO', levelTag: '高階旗艦', name: 'Fortius 11 Power', style: '進攻型 Attack', weight: '4U', flex: '硬 Stiff', price: '$5,070', market: '中等庫存', desc: '日本美津濃頂級旗艦，極致力量重殺型。' },
    { brand: 'Mizuno', level: 'PRO', levelTag: '高階旗艦', name: 'Altius 01 Speed', style: '全面型 Balanced', weight: '3U / 4U', flex: '硬 Stiff', price: '$4,870', market: '好入手', desc: '出球極速順暢，持球手感細膩，防守轉進攻速度極快。' },
    { brand: 'Mizuno', level: 'MID', levelTag: '中階進階', name: 'CarboSonic 85', style: '全面型 Balanced', weight: '4U', flex: '適中 Medium', price: '$2,730', market: '好入手', desc: '美津濃進階拍，平抽快攻與控球表現穩定。' },
    { brand: 'Mizuno', level: 'MID', levelTag: '中階輕量', name: 'Fortius 50 Swift', style: '全面型 Balanced', weight: '5U', flex: '適中 Medium', price: '$2,920', market: '好入手', desc: '5U 超輕量設計，快速揮拍靈巧，專為雙打前場設計。' },
    { brand: 'Mizuno', level: 'ENTRY', levelTag: '平價入門', name: 'Technoblade 660', style: '全面型 Balanced', weight: '4U', flex: '軟 Soft', price: '$1,450', market: '好入手', desc: '高彈性破風框，極度平價且好揮拍的美津濃入門選擇。' },

    // JNICE
    { brand: 'JNICE', level: 'PRO', levelTag: '高階旗艦', name: '神魔 (SNIPER 90)', style: '進攻型 Attack', weight: '3U / 4U', flex: '硬 Stiff', price: '$3,280', market: '好入手', desc: '久奈司旗艦重殺戰拍，破風兼具頭重感，殺球急墜。' },
    { brand: 'JNICE', level: 'MID', levelTag: '中階明星', name: '白羽刃 (White Blade)', style: '全面型 Balanced', weight: '4U', flex: '適中 Medium', price: '$2,680', market: '熱銷中', desc: '絕美白銀配色，中桿彈性極佳好借力，高 CP 值進階首選。' },
    { brand: 'JNICE', level: 'MID', levelTag: '中階進階', name: '火羽刃 (Fire Blade)', style: '進攻型 Attack', weight: '4U', flex: '適中 Medium', price: '$2,680', market: '好入手', desc: '搶眼烈焰塗裝，結合破風下壓力道，平抽與殺球表現出色。' },
    { brand: 'JNICE', level: 'MID', levelTag: '中階輕量', name: '鋒速 100', style: '全面型 Balanced', weight: '5U 輕量', flex: '軟 Soft', price: '$1,980', market: '好入手', desc: '超輕量 5U 設計，適合女生或發力較小的新手輕鬆打球。' },
    { brand: 'JNICE', level: 'ENTRY', levelTag: '平價入門', name: '追風 2000 (Wind Speed)', style: '全面型 Balanced', weight: '4U', flex: '軟 Soft', price: '$1,280', market: '好入手', desc: '千元出頭親民款，中桿軟好揮拍，買了不傷荷包。' },
    { brand: 'JNICE', level: 'ENTRY', levelTag: '平價入門', name: '風神 3000', style: '全面型 Balanced', weight: '4U', flex: '軟 Soft', price: '$1,380', market: '好入手', desc: '專為新手設計，揮拍靈巧，借力輕鬆打出高遠球。' },
  ];

  const filteredRackets = allRackets.filter((racket) => {
    const matchesBrand = selectedBrand === 'ALL' || racket.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesLevel = selectedLevel === 'ALL' || racket.level === selectedLevel;
    const matchesQuery = racket.name.toLowerCase().includes(searchQuery.toLowerCase()) || racket.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesLevel && matchesQuery;
  });

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
              { id: 'ai', label: 'AI 選拍' },
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
                找到握在手裡真正合適的那一支拍
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                涵蓋高階旗艦、中階進階與千元平價入門拍。瀏覽 Yonex, Victor, Fleet, Mizuno, JNICE 資料庫與 AI 智慧選拍。
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('ai')}
                  className="px-6 py-3 bg-[#16382B] text-white font-medium rounded hover:bg-[#122e23] transition shadow-sm"
                >
                  開始 AI 選拍
                </button>
                <button
                  onClick={() => setActiveTab('database')}
                  className="px-6 py-3 border border-[#16382B] text-[#16382B] font-medium rounded hover:bg-[#16382B]/5 transition"
                >
                  瀏覽全級別資料庫
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
                    球拍資料庫 (含高/中/低階)
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    規格、心得、平價入門與高階，收錄 Yonex, Victor, Fleet, Mizuno, JNICE 全級別。
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('ai')}
                  className="bg-white/80 p-6 rounded border border-slate-200/80 hover:border-[#C5A059] hover:shadow-md transition cursor-pointer space-y-3 group"
                >
                  <h3 className="text-lg font-bold text-[#16382B] group-hover:text-[#C5A059] transition">
                    AI 選拍工具
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    用一句話描述你的打法與預算，交給 AI 智慧比對適合你的球拍與心得。
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
                    一次給整套千元入門球拍、球線磅數與專業羽球鞋選購與原因。
                  </p>
                </div>
              </div>
            </div>

            {/* 羽球裝備知識百科 Section */}
            <div className="bg-white rounded border border-slate-200 p-8 space-y-8 shadow-sm">
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2 text-[#C5A059] font-semibold text-xs tracking-widest uppercase">
                  <span className="w-6 h-[2px] bg-[#C5A059]"></span>
                  <span>BADMINTON KNOWLEDGE</span>
                </div>
                <h2 className="text-2xl font-bold text-[#16382B]">羽球裝備小百科：選拍前必須知道的事</h2>
                <p className="text-slate-600 text-sm">理解球拍參數，選拍不再踩雷。點擊下方頁籤看詳細圖文解析：</p>
              </div>

              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                {[
                  { id: 'tension', label: '1. 穿線磅數 (Tension)' },
                  { id: 'string', label: '2. 羽球線種類 (Strings)' },
                  { id: 'shaft', label: '3. 中桿軟硬度 (Flex)' },
                  { id: 'frame', label: '4. 拍框形狀與風阻 (Frame)' },
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
                {activeWikiTopic === 'tension' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="text-xl font-bold text-[#16382B]">穿線磅數 (Lbs) 是什麼？如何選擇？</h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      球線拉緊的張力單位為磅 (Lbs)。磅數高低決定了球拍甜區的大小、回彈省力程度以及控球精準度：
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                        <div className="font-bold text-[#16382B]">低磅 (18 - 22 磅)</div>
                        <div className="text-xs text-[#C5A059] font-semibold">適合：初學者、發力較小的球友</div>
                        <p className="text-slate-600 text-xs">線彈性好、甜區較大，揮拍輕鬆就能將球打遠，且較不容易傷手腕或發炎。</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                        <div className="font-bold text-[#16382B]">中磅 (23 - 26 磅)</div>
                        <div className="text-xs text-[#C5A059] font-semibold">適合：進階球友、校隊/俱樂部常客</div>
                        <p className="text-slate-600 text-xs">擊球手感紮實，兼具彈性與落點控制，是台灣一般羽球愛好者最主流的磅數範圍。</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                        <div className="font-bold text-[#16382B]">高磅 (27 磅以上)</div>
                        <div className="text-xs text-[#C5A059] font-semibold">適合：高階選手、發力姿勢極標準者</div>
                        <p className="text-slate-600 text-xs">甜區極小，需要強大且標準爆發力；球感直接、出球極快，控球精準度極高。</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeWikiTopic === 'string' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="text-xl font-bold text-[#16382B]">羽球線的種類與線徑細節</h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      羽球線的「粗細（線徑）」與「結構編織」直接影響擊球聲音、彈性與耐用度：
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                        <div className="font-bold text-[#16382B]">高彈細線 (0.61 - 0.65 mm)</div>
                        <p className="text-slate-600 text-xs"><b>代表線種：</b>YY BG-66 Ultimax, Exbolt 63, Fleet BS-66</p>
                        <p className="text-slate-600 text-xs">優點是聲音金屬響亮、擊球回彈極快；缺點是較易耗損切線。</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                        <div className="font-bold text-[#16382B]">全面均衡線 (0.66 - 0.68 mm)</div>
                        <p className="text-slate-600 text-xs"><b>代表線種：</b>YY NBG-95, Victor VBS-68</p>
                        <p className="text-slate-600 text-xs">完美的性能平衡，既有不錯的回彈感，同時保有滿意的壽命。</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                        <div className="font-bold text-[#16382B]">耐打粗線 (0.69 - 0.70 mm)</div>
                        <p className="text-slate-600 text-xs"><b>代表線種：</b>YY BG-65, JNICE JS-69</p>
                        <p className="text-slate-600 text-xs">新手及學校球隊首選，極度耐打不易斷線，經濟實惠。</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeWikiTopic === 'shaft' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="text-xl font-bold text-[#16382B]">中桿軟硬度 (Flex) 與鞭甩發力</h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      中桿是球拍的靈魂，負責傳送身體的力量。中桿軟硬度影響擊球時的「鞭甩借力」：
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-2 text-slate-700">
                      <li><b>偏軟 (Soft Shaft)：</b>揮拍時中桿彎曲幅度大，能在擊球瞬間產生強烈鞭甩效應。非常適合力量較小、仰賴借力打高遠球的新手與防守型玩家。</li>
                      <li><b>適中 (Medium Shaft)：</b>軟硬兼備，好上手且提供穩定的控球，如 Fleet Woven 1000 EVO 或 Victor TK-9500 的中桿配置。</li>
                      <li><b>偏硬 (Stiff Shaft)：</b>彎曲幅度小、形變恢復極快，力量傳遞零延遲，適合瞬間爆發力強、偏好強攻重殺的高階選手。</li>
                    </ul>
                  </div>
                )}

                {activeWikiTopic === 'frame' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="text-xl font-bold text-[#16382B]">拍框形狀與風阻設計</h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      拍框設計決定了風阻與擊球時的穩定度：
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                        <div className="font-bold text-[#16382B]">盒型框 (Box Frame)</div>
                        <p className="text-slate-600 text-xs">結構紮實抗扭力強，擊球感清晰穩定，適合強調控球與進攻力量的球拍。</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                        <div className="font-bold text-[#16382B]">流線破風框 (Aerodynamic)</div>
                        <p className="text-slate-600 text-xs">風阻極低，大幅加快揮拍速度，特別適合前場平球快攻與平擋連貫。</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== AI 選拍 View ==================== */}
        {activeTab === 'ai' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#C5A059] font-semibold text-xs tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-[#C5A059]"></span>
                <span>AI RACKET FINDER</span>
              </div>
              <h2 className="text-3xl font-bold text-[#16382B]">AI 智慧選拍工具</h2>
              <p className="text-slate-600 text-sm">
                輸入您的打法習慣與預算（包含千元平價入門拍），AI 將即時連線全級別資料庫並為您生成推薦。
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
                    <option value="Balanced">攻守兼備 / 全面型 (Balanced)</option>
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
                  我是剛接觸羽球的新手 (需要客製化千元入門拍/磅數/球鞋建議)
                </label>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-2 text-sm">手感補充說明 (AI 語意分析)：</label>
                <textarea 
                  placeholder="例如：第一次打羽球發力較小、想要找 1000-2000 元好揮拍高 CP 值的牌子..." 
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
                {loading ? '🤖 AI 正在比對全級別球拍資料庫...' : '開始 AI 智慧推薦'}
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
                  🎯 AI 為您推薦的球拍方案
                </h3>

                <div className="space-y-4">
                  {aiResult.recommended_rackets?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-white p-5 rounded border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg text-[#16382B]">{item.name}</span>
                        <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded">
                          {item.availability || '好入手'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.reason}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-5 rounded border border-slate-200 space-y-2">
                  <h4 className="font-bold text-[#16382B]">💡 綜合心得與打感點評</h4>
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                    {aiResult.detailed_review}
                  </p>
                </div>

                {isBeginner && aiResult.beginner_config && (
                  <div className="bg-amber-50 p-5 rounded border border-amber-200 space-y-2">
                    <h4 className="font-bold text-amber-900">🐣 新手入場客製化全套建議</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1 text-amber-900">
                      <li><b>建議穿線磅數：</b>{aiResult.beginner_config.string_lbs}</li>
                      <li><b>建議羽球線：</b>{aiResult.beginner_config.string_type}</li>
                      <li><b>羽球鞋注意事項：</b>{aiResult.beginner_config.shoes}</li>
                      <li><b>握把布建議：</b>{aiResult.beginner_config.grip}</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================== 球拍資料庫 View (支援品牌 + 價位篩選) ==================== */}
        {activeTab === 'database' && (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#C5A059] font-semibold text-xs tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-[#C5A059]"></span>
                <span>RACKET DATABASE</span>
              </div>
              <h2 className="text-3xl font-bold text-[#16382B]">全級別球拍資料庫</h2>
              <p className="text-slate-600 text-sm">包含 Yonex, Victor, Fleet, Mizuno, JNICE 的高階旗艦、中階進階與平價入門拍。</p>
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

            {/* 球拍卡片列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRackets.map((racket, idx) => (
                <div key={idx} className="bg-white p-6 rounded border border-slate-200 hover:border-[#C5A059] transition shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-[#16382B] rounded">
                        {racket.brand}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        racket.level === 'ENTRY' ? 'bg-green-100 text-green-800' :
                        racket.level === 'MID' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {racket.levelTag}
                      </span>
                    </div>
                    <span className="text-xs text-[#C5A059] font-bold">市售價 {racket.price}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#16382B]">{racket.name}</h3>
                  <div className="text-xs text-slate-500 space-y-1 border-t border-b py-2 my-2">
                    <div>打法風格：{racket.style}</div>
                    <div>重量/中桿：{racket.weight} | {racket.flex}</div>
                    <div>購買難易：<span className="text-emerald-700 font-semibold">{racket.market}</span></div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{racket.desc}</p>
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
                  <h3 className="font-bold text-[#16382B]">2. 穿線磅數：建議 20 - 22 磅</h3>
                  <p className="text-xs text-slate-600 mt-1">新手發力尚未標準，20-22磅甜區大且省力，高磅數容易造成手腕與手臂拉傷。</p>
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
                { name: '大翔羽球專賣店 / 一線花羽球', rating: '4.9 ★', region: '大台北地區', promo: '買球拍常附贈免費專業穿線與握把布', brands: 'Yonex, Victor, Fleet, Mizuno, JNICE 全系列現貨' },
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
              <h2 className="text-3xl font-bold text-[#16382B]">最新球拍發佈與消息摘要</h2>
              <p className="text-slate-600 text-sm">追蹤各大品牌最新裝備動態。</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded border border-slate-200 space-y-2 shadow-sm">
                <span className="text-xs text-[#C5A059] font-bold">2026 新品動態</span>
                <h3 className="font-bold text-[#16382B] text-lg">Yonex, Victor 與 Fleet 等平價入門拍深受初學者熱愛</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  包含 Victor TK-9500、Yonex Arcsaber 7 Play 與 JNICE 追風系列持續佔據千元價位熱銷榜。
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 頁尾 Footer */}
      <footer className="bg-[#16382B] text-slate-300 py-8 text-center text-xs border-t border-emerald-900 mt-16">
        <div className="max-w-6xl mx-auto px-6 space-y-2">
          <p className="font-medium">拍面 PaiMian | 台灣羽球指南 & AI 智慧選拍</p>
          <p className="text-slate-400">球拍資料與心得整理僅供參考，實際手感因人而異，建議至專賣店試拍後再購買。</p>
        </div>
      </footer>
    </div>
  );
}