'use client';

import { useState } from 'react';

export default function HomePage() {
  const [playStyle, setPlayStyle] = useState('Attack');
  const [preferredWeight, setPreferredWeight] = useState('4U');
  const [budget, setBudget] = useState('3000');
  const [isBeginner, setIsBeginner] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    setResult(null);

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
        setResult(data.data);
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
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 標頭 */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900">
            🏸 台灣羽球百科 & AI 智慧選拍工具
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            結合球拍資料庫與 AI 語意分析，為你打造最適合的手感裝備推薦
          </p>
        </header>

        {/* 選拍條件表單 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-3">🎯 輸入你的選拍需求</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 text-sm">打法風格：</label>
              <select 
                value={playStyle} 
                onChange={(e) => setPlayStyle(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800"
              >
                <option value="Attack">主導進攻 / 強力扣殺 (Attack)</option>
                <option value="Control">精準控球 / 拉吊防守 (Control)</option>
                <option value="Balanced">攻守兼備 / 全面型 (Balanced)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700 text-sm">球拍重量偏好：</label>
              <select 
                value={preferredWeight} 
                onChange={(e) => setPreferredWeight(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800"
              >
                <option value="3U">3U (約 85-89g, 適合力量大者)</option>
                <option value="4U">4U (約 80-84g, 最主流標準重)</option>
                <option value="5U">5U (約 75-79g, 輕量靈巧型)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-slate-700 text-sm">預算上限 (NTD)：</label>
            <input 
              type="number" 
              value={budget} 
              onChange={(e) => setBudget(e.target.value)}
              placeholder="例如 3000"
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <input 
              type="checkbox" 
              id="beginner" 
              checked={isBeginner} 
              onChange={(e) => setIsBeginner(e.target.checked)} 
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="beginner" className="font-medium text-slate-800 text-sm cursor-pointer">
              我是剛接觸羽球的新手 (需要客製化全套線種/磅數/球鞋建議)
            </label>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-slate-700 text-sm">
              補充手感偏好 (AI 語意分析)：
            </label>
            <textarea 
              placeholder="例如：發力較小、想要揮拍快一點、希望包含 FLEET 或久奈司 JNICE 的 CP 值高的拍子..." 
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg h-24 text-slate-800 text-sm"
            />
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 active:bg-blue-800 transition shadow-md disabled:bg-blue-300"
          >
            {loading ? '🤖 AI 正在比對球拍資料庫與分析手感...' : '🚀 開始 AI 智慧推薦'}
          </button>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              {errorMsg}
            </div>
          )}
        </div>

        {/* AI 分析結果區塊 */}
        {result && (
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 space-y-6">
            <h2 className="text-2xl font-extrabold text-blue-900 border-b border-blue-200 pb-3">
              🎉 AI 推薦結果與打感報告
            </h2>

            {/* 推薦球拍卡片 */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg">Recommended Rackets 推薦球拍</h3>
              {result.recommended_rackets?.map((racket: any, idx: number) => (
                <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-2">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded mr-2">
                        {racket.brand}
                      </span>
                      <span className="text-lg font-bold text-slate-900">{racket.name}</span>
                    </div>
                    <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      {racket.availability || '市場好入手'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{racket.reason}</p>
                </div>
              ))}
            </div>

            {/* AI 專業心得 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-800 border-b pb-2 text-base">💡 專業選拍心得與打感短評</h3>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {result.detailed_review}
              </p>
            </div>

            {/* 新手建議配置 */}
            {isBeginner && result.beginner_config && (
              <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 space-y-2">
                <h3 className="font-bold text-amber-900 text-base">🐣 新手客製化入門裝備推薦</h3>
                <ul className="list-disc pl-5 text-sm space-y-1.5 text-amber-900">
                  <li><b>建議穿線磅數：</b>{result.beginner_config.string_lbs}</li>
                  <li><b>建議羽球線：</b>{result.beginner_config.string_type}</li>
                  <li><b>羽球鞋注意事項：</b>{result.beginner_config.shoes}</li>
                  <li><b>握把布建議：</b>{result.beginner_config.grip}</li>
                </ul>
              </div>
            )}

            {/* 實體店家購買資訊 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-800 text-base">🏪 優質購買店家導覽 (高評價專賣店優先)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800">一線花羽球 / 大翔羽球專賣店</div>
                  <div className="text-xs text-amber-600 font-semibold">★ 4.8 顆星以上 | 富力特 FLEET / JNICE 經銷</div>
                  <div className="text-xs text-slate-500 mt-1">地址優惠：提供現場專業穿線服務與球拍折扣</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800">各大地區口碑實體羽球專賣店</div>
                  <div className="text-xs text-amber-600 font-semibold">★ 4.9 顆星 | 新手選購諮詢友善店</div>
                  <div className="text-xs text-slate-500 mt-1">優惠資訊：買球拍通常免費加贈穿線與握把布</div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}