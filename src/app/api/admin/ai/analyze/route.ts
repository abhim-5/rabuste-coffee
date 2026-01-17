// Superadmin AI Analytics API - Main Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
import { validateSQLSafety, normalizeSQL } from '@/lib/ai/sql-validator';
import { DATABASE_SCHEMA, BUSINESS_CONTEXT } from '@/lib/ai/schema-context';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const QUESTION_CLASSIFIER_PROMPT = `You are a question classifier for Rabuste Café's AI Analytics system.

Analyze the question and determine if it requires database query OR can be answered directly.

## Categories:

**DATA_QUERY**: Questions that need actual data from the database
Examples:
- "What's my revenue for last 7 days?"
- "How many customers this week?"
- "Top 5 selling items?"
- "Workshop attendance rate?"
- Any question asking for numbers, statistics, counts, trends from the database

**BUSINESS_ADVICE**: Questions about coffee, café operations, business strategy (answer directly, NO SQL)
Examples:
- "How do I improve my café?"
- "What coffee drinks should I add?"
- "Best practices for running a café?"
- "How to market my workshops?"
- Any questions about coffee knowledge, business advice, industry best practices

**OUT_OF_SCOPE**: Random questions unrelated to café/coffee business
Examples:
- "What is the capital of France?"
- "Tell me a joke"
- "Who won the world cup?"
- Any general knowledge questions

Respond with ONLY one word: DATA_QUERY, BUSINESS_ADVICE, or OUT_OF_SCOPE

Question: "{{QUESTION}}"
Category:`;

const SQL_GENERATOR_PROMPT = `You are a PostgreSQL expert for Rabuste Café's business analytics system.

**CRITICAL**: Study the COMPLETE database schema below BEFORE generating any query. All tables and columns are listed here.

${DATABASE_SCHEMA}

${BUSINESS_CONTEXT}

## Your Role
Generate ONLY valid PostgreSQL SELECT queries to answer analytical questions.

## Rules
1. **READ the full schema above** - don't assume tables/columns exist
2. Generate ONLY SELECT or WITH...SELECT statements  
3. NO: INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, GRANT, REVOKE
4. NEVER select: email, phone, dob, date_of_birth (PII restricted)
5. NEVER query auth.users table
6. Always use proper JOIN syntax
7. **ALWAYS add LIMIT** to prevent huge results (default LIMIT 100)
8. Use aggregation for customer insights (COUNT, SUM, AVG, GROUP BY)
9. Use date functions for time-based analysis
10. Return ONLY the SQL query, nothing else

## Example Questions & Queries

Question: "What's my revenue for last 7 days?"
Query:
SELECT 
  DATE(created_at) as date,
  COUNT(*) as orders,
  SUM(total) as revenue
FROM orders
WHERE created_at >= NOW() - INTERVAL '7 days'
  AND status != 'cancelled'
  AND payment_status = 'paid'
GROUP BY DATE(created_at)
ORDER BY date DESC;

Question: "Top 5 selling items this month?"
Query:
SELECT 
  menu_item_name,
  SUM(quantity) as units_sold,
  COUNT(DISTINCT order_id) as orders,
  SUM(subtotal) as revenue
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE o.created_at >= DATE_TRUNC('month', CURRENT_DATE)
  AND o.status != 'cancelled'
GROUP BY menu_item_name
ORDER BY units_sold DESC
LIMIT 5;

Question: "How many new vs returning customers this week?"
Query:
WITH week_customers AS (
  SELECT DISTINCT user_id
  FROM orders
  WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)
    AND status != 'cancelled'
    AND user_id IS NOT NULL
),
previous_customers AS (
  SELECT DISTINCT user_id
  FROM orders
  WHERE created_at < DATE_TRUNC('week', CURRENT_DATE)
    AND user_id IS NOT NULL
)
SELECT
  COUNT(CASE WHEN pc.user_id IS NULL THEN 1 END) as new_customers,
  COUNT(CASE WHEN pc.user_id IS NOT NULL THEN 1 END) as returning_customers,
  COUNT(*) as total_customers
FROM week_customers wc
LEFT JOIN previous_customers pc ON wc.user_id = pc.user_id;

Now generate a query for the following question.`;

const INSIGHTS_ANALYZER_PROMPT = `You are the AI Business Intelligence Analyst for Rabuste Café - Surat's premier dark roast robusta coffee destination.

## Your Identity & Role
You are deeply aligned with Rabuste's vision of delivering exceptional coffee experiences while building a thriving community space. You provide strategic insights that help the business grow while staying true to its values.

## Rabuste Coffee Context
**Location**: Surat, Gujarat, India
**Brand**: "Surat's 1st Dark Roast Robusta Café"
**Vision**: Premium café combining quality coffee, art gallery, and community workshops
**Core Values**: Quality, Community, Artistry, Excellence
**Revenue Streams**: Coffee & Food, Workshops, Art Gallery, Loyalty Points
**Customer Base**: Coffee enthusiasts, students, professionals, artists, workshop participants

## Currency & Formatting Rules
**CRITICAL**: All monetary values MUST be displayed in **Indian Rupees (₹)**.
- Format: ₹X,XXX or ₹XX,XXX (use Indian number formatting with commas)
- Examples: ₹7,077 or ₹25,000 (NOT $7,077 or 7077 rupees)
- Average order values should reflect Indian pricing (typically ₹200-₹700)
- Never use $ or USD - always use ₹ (rupee symbol)

## Your Response Format
Provide a JSON object with:
{
  "summary": "2-3 sentence executive summary with ₹ for all amounts",
  "key_metrics": [
    { "label": "Metric Name", "value": "₹X,XXX or descriptive text", "context": "Brief explanation" }
  ],
  "insights": [
    "Actionable insight 1 aligned with Rabuste's vision",
    "Actionable insight 2 considering local market context"
  ],
  "recommendations": [
    "Strategic recommendation 1 for Surat market",
    "Recommendation 2 aligned with premium café positioning"
  ],
  "confidence": 0.85
}

## Guidelines
- **Be Rabuste-Aware**: Reference the café's unique position as Surat's dark roast specialist
- **Local Context**: Consider Surat's market, Indian consumer behavior, local festivals/seasons
- **Currency**: ALWAYS use ₹ symbol for all monetary values
- **Vision-Aligned**: Recommendations should align with quality and community focus
- **Executive-Friendly**: Concise, actionable, strategic insights
- **Focus on "So What?"**: Not just "what" but "why it matters" and "what to do"
- **Confidence**: 0.7-1.0 based on data quality and sample size
- **Transparency**: Clearly state if data is insufficient or inconclusive

## Question Refusals
Refuse these with: { "error": "This question is outside my analytical scope" }:
- Personal questions ("Who is...?", "What is the capital...?")
- Non-business data requests
- Requests for actions (sending emails, deleting data)
- Individual user PII requests
- Questions unrelated to Rabuste's business operations

## Example Response Style
"Rabuste Café generated ₹25,450 in revenue this week, with an average order value of ₹385. The weekend saw 40% higher footfall, suggesting strong demand for the café as a leisure destination. Consider expanding workshop offerings on Saturdays to capitalize on this trend while staying aligned with the community-focused vision."`;

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate as superadmin
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 });
    }

    // Check superadmin role
    const { data: isSuperadmin, error: roleError } = await supabase
      .rpc('is_superadmin');
    
    if (roleError || !isSuperadmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Superadmin access required' 
      }, { status: 403 });
    }

    // 2. Get question from request
    const { question } = await request.json();
    
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Question is required' 
      }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'AI service not configured' 
      }, { status: 500 });
    }

    // 3. Initialize Gemini model
    let model;
    try {
      // Use models/gemini-2.5-flash - correct model name for v1beta API
      model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
    } catch (e) {
      console.error('Model initialization failed:', e);
      return NextResponse.json({ 
        success: false, 
        error: 'AI model unavailable. Please verify your GEMINI_API_KEY is valid and has Gemini API enabled in Google Cloud Console.',
        details: 'Visit https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com'
      }, { status: 500 });
    }
    
    // Helper function for retry logic with exponential backoff
    const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await fn();
        } catch (error: any) {
          const isLastRetry = i === maxRetries - 1;
          const is503 = error.message?.includes('503') || error.message?.includes('overloaded');
          
          if (!is503 || isLastRetry) {
            throw error; // If not 503 or last retry, throw the error
          }
          
          // Wait with exponential backoff: 1s, 2s, 4s
          const waitTime = Math.pow(2, i) * 1000;
          console.log(`Gemini API overloaded, retrying in ${waitTime}ms (attempt ${i + 1}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    };
    
    // 4. Classify the question first
    const classifierPrompt = QUESTION_CLASSIFIER_PROMPT.replace('{{QUESTION}}', question);
    const classificationResult = await retryWithBackoff(() => model.generateContent(classifierPrompt));
    const category = classificationResult.response.text().trim().toUpperCase();
    
    console.log(`Question classified as: ${category}`);
    
    // 4a. Handle non-data questions
    if (category.includes('OUT_OF_SCOPE')) {
      return NextResponse.json({
        success: false,
        error: 'Question out of scope',
        details: 'This AI Analytics system is designed for business data analysis only. Please ask questions about your café\'s orders, revenue, customers, workshops, art sales, or other business metrics.'
      }, { status: 400 });
    }
    
    if (category.includes('BUSINESS_ADVICE')) {
      // Answer business advice questions directly without SQL
      const advicePrompt = `${INSIGHTS_ANALYZER_PROMPT}\n\nBusiness Question: "${question}"\n\nProvide helpful advice as JSON (no SQL query needed):`;
      const adviceResult = await retryWithBackoff(() => model.generateContent(advicePrompt));
      let adviceText = adviceResult.response.text().trim()
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const advice = JSON.parse(adviceText);
      
      return NextResponse.json({
        success: true,
        question: question,
        sql_executed: null, // No SQL for advice questions
        raw_results: null,
        insights: advice,
        timestamp: new Date().toISOString(),
        type: 'business_advice'
      });
    }
    
    // 5. Generate SQL for DATA_QUERY questions
    const sqlPrompt = `${SQL_GENERATOR_PROMPT}\n\nQuestion: "${question}"\n\nSQL Query:`;
    const sqlResult = await retryWithBackoff(() => model.generateContent(sqlPrompt));
    let generatedSQL = sqlResult.response.text().trim();
    
    console.log('🤖 AI Generated SQL (raw):', generatedSQL);
    
    // Clean up SQL (remove markdown code blocks if present)
    generatedSQL = generatedSQL
      .replace(/```sql\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    console.log('🧹 Cleaned SQL:', generatedSQL);
    
    const normalizedSQL = normalizeSQL(generatedSQL);
    console.log('✨ Normalized SQL:', normalizedSQL);

    // 4. Validate SQL safety
    const validation = validateSQLSafety(normalizedSQL);
    if (!validation.safe) {
      console.error('SQL Safety Validation Failed:', {
        reason: validation.reason,
        sql: normalizedSQL,
        question: question
      });
      return NextResponse.json({ 
        success: false, 
        error: 'Generated query failed safety validation',
        reason: validation.reason,
        details: `The AI generated a query that violates safety rules: ${validation.reason}. Try rephrasing your question or ask about different data.`,
        sql: normalizedSQL
      }, { status: 400 });
    }

    // 5. Execute SQL query
    const { data: queryResults, error: queryError } = await supabase
      .rpc('execute_readonly_query', { query_text: normalizedSQL });
    
    if (queryError) {
      console.error('Query execution error:', queryError);
      return NextResponse.json({ 
        success: false, 
        error: 'Query execution failed',
        details: queryError.message,
        sql: normalizedSQL
      }, { status: 500 });
    }

    // 6. Generate insights using Gemini (reuse same model)
    const insightsPrompt = `${INSIGHTS_ANALYZER_PROMPT}

Question: "${question}"

SQL Executed:
\`\`\`sql
${normalizedSQL}
\`\`\`

Results:
\`\`\`json
${JSON.stringify(queryResults, null, 2)}
\`\`\`

Provide your analysis as JSON:`;

    const insightsResult = await retryWithBackoff(() => model.generateContent(insightsPrompt));
    let insightsText = insightsResult.response.text().trim();
    
    // Clean up JSON (remove markdown if present)
    insightsText = insightsText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const insights = JSON.parse(insightsText);

    // 7. Save to history (don't block on this - save async)
    try {
      await supabase
        .from('ai_analytics_history')
        .insert({
          user_id: user.id,
          question: question,
          sql_executed: normalizedSQL,
          insights: insights,
          raw_results: queryResults
        });
    } catch (historyError) {
      // Log but don't fail the request if history save fails
      console.error('Failed to save analytics history:', historyError);
    }

    // 8. Return complete response
    return NextResponse.json({
      success: true,
      question: question,
      sql_executed: normalizedSQL,
      raw_results: queryResults,
      insights: insights,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('AI Analytics Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Analysis failed',
      details: error.message
    }, { status: 500 });
  }
}
