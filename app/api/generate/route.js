import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

// ── Rate limit store ──────────────────────────────────────────────────────────
const rateLimitStore = new Map();

function checkRateLimit(userId) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;
  if (!rateLimitStore.has(userId)) {
    rateLimitStore.set(userId, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }
  const userData = rateLimitStore.get(userId);
  if (now > userData.resetAt) {
    rateLimitStore.set(userId, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }
  if (userData.count >= maxRequests) {
    return { allowed: false, waitSeconds: Math.ceil((userData.resetAt - now) / 1000) };
  }
  userData.count++;
  return { allowed: true };
}

// ── Generate cache key ────────────────────────────────────────────────────────
// This is the heart of the caching system
// Same goal + level + hours + months + style = same cache key = free result
function generateCacheKey(data) {
  const normalized = {
    // Normalize goal: lowercase, trim, remove special chars
    goal: data.goal.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " "),
    level: data.level?.toLowerCase().trim() || "beginner",
    hoursPerDay: data.hoursPerDay?.toLowerCase().trim() || "2 hours/day",
    months: data.months?.toLowerCase().trim() || "6 months",
    learningStyle: data.learningStyle?.toLowerCase().trim() || "mixed",
  };

  const keyString = `${normalized.goal}|${normalized.level}|${normalized.hoursPerDay}|${normalized.months}|${normalized.learningStyle}`;

  // Create MD5 hash of the key string
  return crypto.createHash("md5").update(keyString).digest("hex");
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
  const dangerousPattern = /<script|javascript:|on\w+=/i;
  for (const val of [goal, education, level, hoursPerDay, months, learningStyle]) {
    if (dangerousPattern.test(val)) return "Invalid input detected.";
  }
  return null;
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

// ── AI Prompt ─────────────────────────────────────────────────────────────────
function buildPrompt(data) {
  return `You are RiseUpHub's expert AI career coach. Generate a COMPLETE roadmap for the following goal.

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

FORMATTING RULES:
- Use ## for main headings
- Use ### for sub headings
- Use **bold** for important terms
- Use bullet points (- ) for ALL lists
- Use numbered lists (1. 2.) for ordered steps
- Use > for important tips/notes
- Name actual books, YouTube channels, websites

Generate using EXACTLY these section markers:

---OVERVIEW---
3-4 sentences summary. Be encouraging and realistic.

---ESTIMATED_COMPLETION---
- Completion timeline for ${data.hoursPerDay} study
- Key milestone dates
- Expected result/score

---MONTHLY_PLAN---
## Month 1: [Theme]
- **Week 1-2:** [Specific topics]
- **Week 3-4:** [Specific topics]
- **Goal:** [Achievement by month end]
- **Resources:** [2-3 specific resources]

[Continue for all months in ${data.months}]

---WEEKLY_SCHEDULE---
## Sample Weekly Schedule
- **Monday:** [Topic + duration]
- **Tuesday:** [Topic + duration]
- **Wednesday:** [Topic + duration]
- **Thursday:** [Topic + duration]
- **Friday:** [Topic + duration]
- **Saturday:** [Topic + duration]
- **Sunday:** Revision + Rest

---DAILY_STUDY_PLAN---
## Daily Routine for ${data.learningStyle} Learner
- **6:00 AM - 7:00 AM:** [Activity]
- **7:00 AM - 8:00 AM:** [Activity]
[Continue full day]

---SKILLS_ORDER---
## Learn These Skills in Order
1. **[Skill Name]** - [Why first] - ⏱️ [Time needed]
2. **[Skill Name]** - [Why second] - ⏱️ [Time needed]
[Continue for all skills]

---FREE_RESOURCES---
## YouTube Channels
- **[Channel Name]:** [What it covers and why it's great]

## Websites
- **[Website]:** [What it offers]

## Books
- **[Book Title]** by [Author]: [Why read it]

## Practice Platforms
- **[Platform]:** [How to use it]

---RECOMMENDED_COURSES---
1. **[Course Name]** on [Platform] - [Price] - [Why recommended]
2. **[Course Name]** on [Platform] - [Price] - [Why recommended]
3. **[Course Name]** on [Platform] - [Price] - [Why recommended]

---PROJECTS---
## Projects to Build
1. **[Project Name]:** [What to build] - *Skills: [what it demonstrates]*
2. **[Project Name]:** [What to build] - *Skills: [what it demonstrates]*
3. **[Project Name]:** [What to build] - *Skills: [what it demonstrates]*
4. **[Project Name]:** [What to build] - *Skills: [what it demonstrates]*
5. **[Project Name]:** [What to build] - *Skills: [what it demonstrates]*

---CERTIFICATES---
1. **[Certificate]** from [Organization] - 📅 [When to attempt]
2. **[Certificate]** - 📅 [When to attempt]
3. **[Certificate]** - 📅 [When to attempt]

---INTERVIEW_PREP---
## Most Important Topics
- **[Topic]:** [Why it's critical]

## Common Interview Questions
- [Question]
- [Question]
- [Question]

## Last 30 Days Strategy
- **Week 1:** [Focus]
- **Week 2:** [Focus]
- **Week 3:** [Focus]
- **Week 4:** [Focus]

---RESUME_MILESTONES---
1. **Month [X]:** [Achievement to add to resume]
2. **Month [X]:** [Achievement]
3. **Month [X]:** [Achievement]
4. **Month [X]:** [Achievement]
5. **Month [X]:** [Achievement]

---PORTFOLIO_MILESTONES---
1. **Month [X]:** [Portfolio item to create]
2. **Month [X]:** [Portfolio item]
3. **Month [X]:** [Portfolio item]

---INTERNSHIP_PREP---
- **When to apply:** [Specific timing]
- **Where to apply:** [Specific platforms/companies]
- **What to include:** [Application tips]

---BEGINNER_MISTAKES---
1. **[Mistake]:** [How to avoid it]
2. **[Mistake]:** [How to avoid it]
3. **[Mistake]:** [How to avoid it]
4. **[Mistake]:** [How to avoid it]
5. **[Mistake]:** [How to avoid it]
6. **[Mistake]:** [How to avoid it]
7. **[Mistake]:** [How to avoid it]
8. **[Mistake]:** [How to avoid it]

---PRO_TIPS---
1. 💡 **[Tip]:** [Explanation]
2. 💡 **[Tip]:** [Explanation]
3. 💡 **[Tip]:** [Explanation]
4. 💡 **[Tip]:** [Explanation]
5. 💡 **[Tip]:** [Explanation]
6. 💡 **[Tip]:** [Explanation]
7. 💡 **[Tip]:** [Explanation]
8. 💡 **[Tip]:** [Explanation]

---MOTIVATION_STRATEGY---
## Why This Goal is Worth It
- [Reason 1]
- [Reason 2]

## Daily Habits to Stay Consistent
- [Habit 1]
- [Habit 2]
- [Habit 3]

## When You Feel Like Quitting
> [Powerful motivational message specific to ${data.goal}]
- [Strategy 1]
- [Strategy 2]`;
}

// ── MAIN API HANDLER ──────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    // Parse body
    let body;
    try { body = await request.json(); }
    catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

    // Validate
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

    // Rate limit
    const rateCheck = checkRateLimit(user.id);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many requests. Please wait ${rateCheck.waitSeconds} seconds.` },
        { status: 429 }
      );
    }

    // Daily limit (3 per day free)
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("roadmaps")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    if (count >= 3) {
      return NextResponse.json(
        { error: "Daily limit reached (3/day on free plan). Upgrade to Pro for unlimited generations." },
        { status: 429 }
      );
    }

    // ── CACHE CHECK ───────────────────────────────────────────────────────────
    const cacheKey = generateCacheKey(body);

    const { data: cachedResult } = await supabase
      .from("ai_cache")
      .select("*")
      .eq("cache_key", cacheKey)
      .single();

    let roadmapContent;
    let fromCache = false;
    let tokensSaved = 0;

    if (cachedResult) {
      // ✅ CACHE HIT - Return existing content (₹0 cost!)
      roadmapContent = cachedResult.roadmap_content;
      fromCache = true;
      tokensSaved = 8000; // approximate tokens saved

      // Update cache hit count and last used
      await supabase
        .from("ai_cache")
        .update({
          hit_count: cachedResult.hit_count + 1,
          last_used_at: new Date().toISOString(),
        })
        .eq("cache_key", cacheKey);

      // Track cost saving (8000 tokens × $0.000015 ≈ $0.12)
      await supabase.from("ai_cost_tracker").insert({
        event_type: "cache_hit",
        cache_key: cacheKey,
        goal: body.goal,
        tokens_saved: tokensSaved,
        cost_saved_usd: 0.12,
      });

    } else {
      // ❌ CACHE MISS - Call Claude AI (costs ₹2)
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 8000,
        messages: [{ role: "user", content: buildPrompt(body) }],
      });

      roadmapContent = message.content[0].text;

      // Save to cache for ALL future users with same parameters
      await supabase.from("ai_cache").insert({
        cache_key: cacheKey,
        goal: body.goal,
        level: body.level,
        hours_per_day: body.hoursPerDay,
        months: body.months,
        learning_style: body.learningStyle,
        roadmap_content: roadmapContent,
        hit_count: 0,
      });

      // Track cache miss (new generation)
      await supabase.from("ai_cost_tracker").insert({
        event_type: "cache_miss",
        cache_key: cacheKey,
        goal: body.goal,
        tokens_saved: 0,
        cost_saved_usd: 0,
      });
    }

    // Save roadmap to user's account
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

    return NextResponse.json({
      id: saved.id,
      success: true,
      fromCache,
      tokensSaved,
      message: fromCache
        ? "✨ Roadmap loaded from cache (instant & free!)"
        : "🤖 Fresh roadmap generated by AI",
    });

  } catch (error) {
    console.error("Generation error:", error);
    if (error?.status === 401) {
      return NextResponse.json({ error: "AI service authentication failed." }, { status: 500 });
    }
    if (error?.status === 429) {
      return NextResponse.json({ error: "AI service busy. Please try again." }, { status: 429 });
    }
    return NextResponse.json({ error: "Failed to generate roadmap. Please try again." }, { status: 500 });
  }
}