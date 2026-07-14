import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// ── Rate limit store (in-memory, resets on server restart) ───────────────────
const rateLimitStore = new Map();

function checkRateLimit(userId) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 3; // max 3 requests per minute per user

  if (!rateLimitStore.has(userId)) {
    rateLimitStore.set(userId, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  const userData = rateLimitStore.get(userId);

  // Reset if window expired
  if (now > userData.resetAt) {
    rateLimitStore.set(userId, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  // Check limit
  if (userData.count >= maxRequests) {
    const waitSeconds = Math.ceil((userData.resetAt - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  // Increment
  userData.count++;
  return { allowed: true };
}

// ── Validate input ────────────────────────────────────────────────────────────
function validateInput(data) {
  const { goal, education, level, hoursPerDay, months, learningStyle } = data;

  if (!goal || typeof goal !== "string" || goal.length < 2 || goal.length > 200) {
    return "Invalid goal. Must be 2-200 characters.";
  }
  if (!education || typeof education !== "string") return "Education is required.";
  if (!level || typeof level !== "string") return "Level is required.";
  if (!hoursPerDay || typeof hoursPerDay !== "string") return "Hours per day is required.";
  if (!months || typeof months !== "string") return "Months is required.";
  if (!learningStyle || typeof learningStyle !== "string") return "Learning style is required.";

  // Sanitize — remove any HTML/script tags
  const dangerousPattern = /<script|javascript:|on\w+=/i;
  for (const val of [goal, education, level, hoursPerDay, months, learningStyle]) {
    if (dangerousPattern.test(val)) return "Invalid input detected.";
  }

  return null; // no error
}

// ── Supabase client ───────────────────────────────────────────────────────────
async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

// ── AI Prompt builder ─────────────────────────────────────────────────────────
function buildPrompt(data) {
  return `You are RiseUpHub's expert AI career coach. Generate a COMPLETE, DETAILED, HIGHLY PERSONALIZED roadmap.

USER DETAILS:
- GOAL: ${data.goal}
- EDUCATION: ${data.education}
- KNOWLEDGE LEVEL: ${data.level}
- DAILY STUDY TIME: ${data.hoursPerDay}
- AVAILABLE TIME: ${data.months}
- TARGET DATE: ${data.targetDate || "Not specified"}
- LEARNING STYLE: ${data.learningStyle}
- FOCUS AREA: ${data.focusArea || "None"}
- CURRENT SKILLS: ${data.currentSkills || "None mentioned"}
- MOTIVATION: ${data.motivation || "Not specified"}

IMPORTANT FORMATTING RULES:
1. Use bullet points (- ) for ALL lists so they become interactive checkboxes
2. Use numbered lists (1. 2. 3.) for ordered steps
3. Use MONTH 1:, MONTH 2: format for monthly plans
4. Use Day 1:, Day 2: format for daily plans
5. Use Week 1:, Week 2: for weekly plans
6. Be extremely specific - name actual books, YouTube channels, websites

Generate the roadmap using EXACTLY these section markers:

---OVERVIEW---
3-4 sentences summarizing the complete journey. Be encouraging and realistic.

---ESTIMATED_COMPLETION---
- Expected completion date based on ${data.hoursPerDay} study
- Key milestone dates
- What level they will reach

---MONTHLY_PLAN---
MONTH 1: [Theme]
- Week 1-2: [Specific topics]
- Week 3-4: [Specific topics]  
- Goal: [Achievement by month end]
- Resources: [2-3 specific resources]

MONTH 2: [Theme]
[Continue for all months in ${data.months}]

---WEEKLY_SCHEDULE---
A detailed week schedule for ${data.hoursPerDay} study:
- Monday: [Specific topic and duration]
- Tuesday: [Specific topic and duration]
- Wednesday: [Specific topic and duration]
- Thursday: [Specific topic and duration]
- Friday: [Specific topic and duration]
- Saturday: [Specific topic and duration]
- Sunday: [Revision and rest]

---DAILY_STUDY_PLAN---
Sample daily routine optimized for ${data.learningStyle}:
- [Time slot]: [Activity]
- [Time slot]: [Activity]
- [Time slot]: [Activity]

---SKILLS_ORDER---
Learn these skills in this exact order:
1. [Skill name] - [Why first] - [Time needed]
2. [Skill name] - [Why second] - [Time needed]
[Continue for all skills]

---FREE_RESOURCES---
YOUTUBE CHANNELS:
- [Channel name]: [What it covers and why it's good]
- [Channel name]: [What it covers]

WEBSITES:
- [Website]: [What it offers]

BOOKS (Free/Affordable):
- [Book title] by [Author]: [Why read it]

PRACTICE PLATFORMS:
- [Platform]: [How to use it]

MOBILE APPS:
- [App]: [How it helps]

---RECOMMENDED_COURSES---
1. [Course name] on [Platform] - [Price] - [Why recommended]
2. [Course name] on [Platform] - [Price] - [Why recommended]
3. [Course name] on [Platform] - [Price] - [Why recommended]

---PROJECTS---
Build these projects in order:
1. [Project name]: [What to build] - [Skills demonstrated]
2. [Project name]: [What to build] - [Skills demonstrated]
3. [Project name]: [What to build] - [Skills demonstrated]
4. [Project name]: [What to build] - [Skills demonstrated]
5. [Project name]: [What to build] - [Skills demonstrated]

---CERTIFICATES---
Earn these certificates in order:
1. [Certificate name] from [Platform/Organization] - [When to attempt]
2. [Certificate name] - [When to attempt]
3. [Certificate name] - [When to attempt]

---INTERVIEW_PREP---
IMPORTANT TOPICS:
- [Topic 1]: [Why important]
- [Topic 2]: [Why important]

COMMON INTERVIEW QUESTIONS:
- [Question 1]
- [Question 2]
- [Question 3]

LAST 30 DAYS STRATEGY:
- Week 1: [Focus]
- Week 2: [Focus]
- Week 3: [Focus]
- Week 4: [Focus]

MOCK TEST STRATEGY:
- [Specific advice]

---RESUME_MILESTONES---
Add these to your resume at each stage:
1. [Month X]: [Achievement to add]
2. [Month X]: [Achievement to add]
3. [Month X]: [Achievement to add]
4. [Month X]: [Achievement to add]
5. [Month X]: [Achievement to add]

---PORTFOLIO_MILESTONES---
1. [Month X]: [Portfolio item to create]
2. [Month X]: [Portfolio item to create]
3. [Month X]: [Portfolio item to create]
4. [Month X]: [Portfolio item to create]

---INTERNSHIP_PREP---
- [Specific advice for finding internships in this field]
- [When to start applying]
- [What to include in applications]
- [Top companies/organizations to target]

---BEGINNER_MISTAKES---
Avoid these common mistakes:
1. [Mistake]: [How to avoid it]
2. [Mistake]: [How to avoid it]
3. [Mistake]: [How to avoid it]
4. [Mistake]: [How to avoid it]
5. [Mistake]: [How to avoid it]
6. [Mistake]: [How to avoid it]
7. [Mistake]: [How to avoid it]
8. [Mistake]: [How to avoid it]

---PRO_TIPS---
Insider tips to accelerate your progress:
1. [Specific non-obvious tip]
2. [Specific non-obvious tip]
3. [Specific non-obvious tip]
4. [Specific non-obvious tip]
5. [Specific non-obvious tip]
6. [Specific non-obvious tip]
7. [Specific non-obvious tip]
8. [Specific non-obvious tip]

---MOTIVATION_STRATEGY---
- Your "why": [Personalized based on their motivation]
- Daily habits to stay consistent:
  - [Habit 1]
  - [Habit 2]
  - [Habit 3]
- When you feel like quitting:
  - [Strategy 1]
  - [Strategy 2]
- Weekly review process:
  - [Step 1]
  - [Step 2]`;
}

// ── Main API Handler ──────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    // Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Validate input
    const validationError = validateInput(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Auth check
    const supabase = await getSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated. Please log in." }, { status: 401 });
    }

    // Rate limit check
    const rateCheck = checkRateLimit(user.id);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many requests. Please wait ${rateCheck.waitSeconds} seconds.` },
        { status: 429 }
      );
    }

    // Daily limit check (3 per day free)
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("roadmaps")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    if (count >= 3) {
      return NextResponse.json(
        { error: "You have reached your 3 roadmaps/day limit on the free plan. Upgrade to Pro for unlimited generations." },
        { status: 429 }
      );
    }

    // Call Claude AI
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      messages: [{ role: "user", content: buildPrompt(body) }],
    });

    const roadmapContent = message.content[0].text;

    // Save to database
    const { data: saved, error: saveError } = await supabase
      .from("roadmaps")
      .insert({
        user_id: user.id,
        goal: body.goal,
        education: body.education,
        level: body.level,
        hours_per_day: body.hoursPerDay,
        months: body.months,
        target_date: body.targetDate || null,
        learning_style: body.learningStyle,
        focus_area: body.focusArea || null,
        current_skills: body.currentSkills || null,
        motivation: body.motivation || null,
        roadmap_content: roadmapContent,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Save error:", saveError);
      return NextResponse.json({ error: "Failed to save roadmap." }, { status: 500 });
    }

    return NextResponse.json({ id: saved.id, success: true });

  } catch (error) {
    console.error("Generation error:", error);

    // Handle Anthropic specific errors
    if (error?.status === 401) {
      return NextResponse.json({ error: "AI service authentication failed. Please contact support." }, { status: 500 });
    }
    if (error?.status === 429) {
      return NextResponse.json({ error: "AI service is busy. Please try again in a moment." }, { status: 429 });
    }

    return NextResponse.json({ error: "Failed to generate roadmap. Please try again." }, { status: 500 });
  }
}