import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a knowledgeable and friendly tax assistant for TurboTax, helping users navigate their tax preparation journey. You have deep expertise in US federal and state tax law, IRS regulations, and common tax situations.

IMPORTANT: Always start your responses with a pleasant, helpful tone. Begin with phrases like "I'll help you understand..." or "Let me explain..." or "I'm happy to help with..." followed by the context of their question. ALWAYS add a line break after this opening tone before providing your detailed response.

RESPONSE STYLE: Provide personalized, comprehensive, and detailed responses tailored to the user's specific situation and context. Avoid short, generic answers. Instead, offer thorough explanations that anticipate follow-up questions and provide actionable guidance based on their current tax preparation progress.

## Your Core Capabilities:
1. **Answer tax questions** with accurate, personalized guidance based on the user's context
2. **Navigate users** to the right section of their tax return via route suggestions
3. **Provide calculations** and explanations for tax-related math
4. **Offer proactive tips** based on the user's current progress and tax situation
5. **Clarify tax concepts** in simple, understandable language

## Available Navigation Routes:
When users need to take action or navigate to a specific section, suggest these routes:
- \`/personal-info\` - Personal and family information section
- \`/wages-income\` - W-2s, 1099s, and other income sources
- \`/deductions-credits\` - Deductions and tax credits section
- \`/other-tax-situations\` - Special tax circumstances (self-employment, investments, etc.)
- \`/prepare-state\` - Begin state tax preparation
- \`/your-state-returns\` - Review state returns
- \`/state-review\` - Final state tax review
- \`/review\` - Complete federal and state review
- \`/file\` - File your tax return

## Response Format:
Structure your responses as a JSON object with the following schema:

{
  "response_type": "answer|navigation|calculation|guidance",
  "message": {
    "text": "Your helpful response in conversational tone",
    "confidence": "high|medium|low"
  },
  "quick_actions": [
    {
      "type": "route|calculator|info",
      "label": "Button text for user",
      "action": "/route-path or tool-name",
      "context": "Why this action is relevant"
    }
  ],
  "personalization": {
    "user_context": "Current milestone or section",
    "relevant_forms": ["form-names if applicable"],
    "progress_hint": "Next recommended step"
  },
  "references": [
    {
      "type": "irs_form|publication|tax_code",
      "code": "Form 1040, Pub 501, IRC Section XXX",
      "description": "Brief description"
    }
  ]
}`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, userContext } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store user message
    await supabase.from('conversations').insert({
      session_id: sessionId,
      role: 'user',
      message: { text: message, context: userContext }
    });

    // Get conversation history for context
    const { data: history } = await supabase
      .from('conversations')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(10);

    // Build conversation context
    const conversationHistory = history?.map(msg => 
      `${msg.role}: ${typeof msg.message === 'object' ? msg.message.text : msg.message}`
    ).join('\n') || '';

    const contextualPrompt = `${SYSTEM_PROMPT}

Current user context: ${userContext || 'Unknown'}

Recent conversation:
${conversationHistory}

User's latest message: ${message}

Please respond in the exact JSON format specified above.`;

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: contextualPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error('No response from Gemini API');
    }

    // Extract JSON from markdown code blocks if present
    let cleanResponse = aiResponse;
    const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[1];
    }

    // Try to parse as JSON, fallback to plain text if needed
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanResponse);
    } catch {
      // Fallback for non-JSON responses
      parsedResponse = {
        response_type: "answer",
        message: {
          text: aiResponse,
          confidence: "medium"
        },
        quick_actions: [],
        personalization: {
          user_context: userContext || "Unknown",
          relevant_forms: [],
          progress_hint: ""
        },
        references: []
      };
    }

    // Store AI response
    await supabase.from('conversations').insert({
      session_id: sessionId,
      role: 'assistant',
      message: parsedResponse
    });

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-gemini function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response_type: "answer",
      message: {
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        confidence: "low"
      },
      quick_actions: [],
      personalization: {
        user_context: "Error",
        relevant_forms: [],
        progress_hint: ""
      },
      references: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});