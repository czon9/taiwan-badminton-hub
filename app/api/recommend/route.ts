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
      throw new Error('無法從資料庫讀取球拍資料');
    }

    // 2. 提示詞設定
    const systemPrompt = `你是一位專業的台灣羽球教練兼裝備專家。請針對使用者需求推薦球拍並提供選購指南。請務必只輸出純繁體中文 JSON 格式回應（不要加 markdown \`\`\`json 標籤）。`;

    const userContent = `
    使用者需求：
    - 打法類型: ${playStyle || '不限'}
    - 偏好重量: ${preferredWeight || '適中'}
    - 是否為完全新手: ${isBeginner ? '是' : '否'}
    - 預算上限: ${budget ? budget + ' 元' : '無特別限制'}
    - 額外需求與手感偏好: "${userPrompt || '無'}"

    可選球拍資料庫清單: ${JSON.stringify(rackets || [])}

    JSON 結構格式要求：
    {
      "recommended_rackets": [
        {
          "name": "球拍名稱與型號",
          "brand": "品牌名稱",
          "reason": "推薦這支球拍給該使用者的具體理由",
          "availability": "市場好買程度說明"
        }
      ],
      "detailed_review": "給予這幾支球拍的綜合打感評價與注意事項短評",
      "beginner_config": {
        "string_lbs": "建議穿線磅數",
        "string_type": "建議線種",
        "shoes": "羽球鞋選購建議",
        "grip": "握把布建議"
      }
    }
    `;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('尚未在 .env.local 設定 GROQ_API_KEY');
    }

    // 3. 動態獲取 Groq 目前你的帳號支援的模型清單
    let availableModels: string[] = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'openai/gpt-oss-20b'];

    try {
      const modelsRes = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (modelsRes.ok) {
        const modelsData = await modelsRes.json();
        if (modelsData.data && Array.isArray(modelsData.data)) {
          // 過濾出可用模型 ID
          const fetchedIds = modelsData.data.map((m: any) => m.id);
          console.log('成功向 Groq 取得可用模型清單:', fetchedIds);
          // 將動態取得的模型放優先
          availableModels = Array.from(new Set([...fetchedIds, ...availableModels]));
        }
      }
    } catch (e) {
      console.warn('自動取得模型清單失敗，改用預設選單');
    }

    let responseText = '';
    let lastErrorMsg = '';

    // 4. 進行模型對話請求
    for (const model of availableModels) {
      // 避免嘗試語音 (whisper) 或視覺模型
      if (model.includes('whisper') || model.includes('vision') || model.includes('guard')) continue;

      try {
        console.log(`正在呼叫 Groq AI [模型: ${model}]...`);
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
          console.log(`✅ Groq AI [${model}] 生成成功！`);
          break;
        } else {
          const errDetail = resData.error?.message || JSON.stringify(resData);
          console.warn(`Groq [${model}] 錯誤:`, errDetail);
          lastErrorMsg = errDetail;
        }
      } catch (err: any) {
        console.warn(`Fetch Groq [${model}] 失敗:`, err.message);
        lastErrorMsg = err.message;
      }
    }

    if (!responseText) {
      throw new Error(`Groq API 呼叫失敗: ${lastErrorMsg}`);
    }

    // 解析 JSON
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