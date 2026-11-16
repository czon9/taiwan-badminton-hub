import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { playStyle, preferredWeight, budget, userPrompt, isBeginner } = await req.json();

    // 1. 從 Supabase 資料庫查詢球拍
    let query = supabase.from('rackets').select('*');
    if (playStyle) {
      query = query.eq('play_style', playStyle);
    }
    
    const { data: rackets, error } = await query;
    if (error) {
      console.error('Supabase query error:', error);
    }

    // 2. 提示詞設定：要求 AI 根據打法風格配對球拍 + 羽球線 + 建議顏色
    const systemPrompt = `你是一位專業的台灣羽球教練兼裝備專家。請針對使用者需求推薦球拍，並根據其打法風格（如強力進攻、平抽快攻、精準控球或新手護腕）從七大品牌羽球線（Yonex, Victor, Kizuna, Kawasaki, Gosen, Li-Ning, Mizuno）中挑選最適合的羽球線與具體顏色建議。請務必只輸出純繁體中文 JSON 格式回應（不要加 markdown \`\`\`json 標籤）。`;

    const userContent = `
    使用者需求：
    - 打法類型: ${playStyle || '不限'}
    - 偏好重量: ${preferredWeight || '適中'}
    - 是否為完全新手: ${isBeginner ? '是' : '否'}
    - 預算上限: ${budget ? budget + ' 元' : '無特別限制'}
    - 額外需求與手感偏好: "${userPrompt || '無'}"

    可選球拍資料庫參考: ${JSON.stringify(rackets || [])}

    請輸出繁體中文 JSON 結構如下：
    {
      "recommended_rackets": [
        {
          "name": "球拍名稱與型號",
          "brand": "品牌名稱",
          "reason": "推薦這支球拍給該使用者的具體理由",
          "recommended_string": "推薦搭配的羽球線（含品牌、線種名稱與選用理由，例如：Yonex BG-66 Ultimax）",
          "recommended_string_color": "建議搭配的球線顏色（例如：螢光黃 / 耀目白 / 炫彩粉）",
          "recommended_tension": "建議穿線磅數（例如：23-25 磅）",
          "availability": "市場好買程度說明"
        }
      ],
      "style_pairing_analysis": "針對該使用者打法風格與線拍搭配的專業深度解析",
      "detailed_review": "給予這幾支球拍的綜合打感評價與注意事項短評",
      "beginner_config": {
        "string_lbs": "建議穿線磅數",
        "string_type": "建議線種與顏色搭配",
        "shoes": "羽球鞋選購建議",
        "grip": "握把布建議"
      }
    }
    `;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('尚未在 .env.local 設定 GROQ_API_KEY');
    }

    // 動態獲取 Groq 支援的模型
    let availableModels = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

    try {
      const modelsRes = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (modelsRes.ok) {
        const modelsData = await modelsRes.json();
        if (modelsData.data && Array.isArray(modelsData.data)) {
          const fetchedIds = modelsData.data.map((m: any) => m.id);
          availableModels = Array.from(new Set([...fetchedIds, ...availableModels]));
        }
      }
    } catch (e) {
      console.warn('動態模型獲取失敗，使用預設選單');
    }

    let responseText = '';
    let lastErrorMsg = '';

    for (const model of availableModels) {
      if (model.includes('whisper') || model.includes('vision') || model.includes('guard')) continue;

      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userContent }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.6
          })
        });

        const resData = await res.json();

        if (res.ok && resData.choices?.[0]?.message?.content) {
          responseText = resData.choices[0].message.content;
          break;
        } else {
          lastErrorMsg = resData.error?.message || JSON.stringify(resData);
        }
      } catch (err: any) {
        lastErrorMsg = err.message;
      }
    }

    if (!responseText) {
      throw new Error(`Groq API 呼叫失敗: ${lastErrorMsg}`);
    }

    const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJsonString);

    return NextResponse.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error('API Final Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || '伺服器發生錯誤' }, 
      { status: 500 }
    );
  }
}