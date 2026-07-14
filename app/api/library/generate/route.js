import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const POPULAR_ROADMAPS = [
  { goal: "JEE Main", category: "After Class 12", subcategory: "Engineering", education_required: "Class 11-12 (PCM)", difficulty: "Hard", duration: "12 months", tags: ["engineering", "iit", "nit", "jee"] },
  { goal: "JEE Advanced (IIT)", category: "After Class 12", subcategory: "Engineering", education_required: "Class 11-12 (PCM)", difficulty: "Very Hard", duration: "18 months", tags: ["engineering", "iit", "jee"] },
  { goal: "NEET UG", category: "After Class 12", subcategory: "Medical", education_required: "Class 11-12 (PCB)", difficulty: "Hard", duration: "12 months", tags: ["medical", "mbbs", "doctor", "neet"] },
  { goal: "UPSC Civil Services (IAS/IPS/IFS)", category: "After Graduation", subcategory: "UPSC", education_required: "Any Graduate", difficulty: "Very Hard", duration: "24 months", tags: ["upsc", "ias", "ips", "civil services"] },
  { goal: "SSC CGL", category: "After Graduation", subcategory: "SSC", education_required: "Any Graduate", difficulty: "Medium", duration: "6 months", tags: ["ssc", "government job", "cgl"] },
  { goal: "IBPS PO", category: "After Graduation", subcategory: "Banking", education_required: "Any Graduate", difficulty: "Medium", duration: "6 months", tags: ["banking", "ibps", "po", "bank"] },
  { goal: "SBI PO", category: "After Graduation", subcategory: "Banking", education_required: "Any Graduate", difficulty: "Medium", duration: "6 months", tags: ["banking", "sbi", "po", "bank"] },
  { goal: "Railway Group D", category: "After Class 10", subcategory: "Government Jobs", education_required: "Class 10 Pass", difficulty: "Easy", duration: "3 months", tags: ["railway", "rrb", "group d", "government"] },
  { goal: "CAT (MBA)", category: "After Graduation", subcategory: "MBA", education_required: "Any Graduate", difficulty: "Hard", duration: "12 months", tags: ["cat", "mba", "iim", "management"] },
  { goal: "Python Programming", category: "Career & Skill Paths", subcategory: "Programming", education_required: "Anyone", difficulty: "Beginner", duration: "3 months", tags: ["python", "programming", "coding", "tech"] },
  { goal: "Data Science & Machine Learning", category: "Career & Skill Paths", subcategory: "Tech", education_required: "Anyone", difficulty: "Medium", duration: "6 months", tags: ["data science", "ml", "ai", "python"] },
  { goal: "Web Development (Full Stack)", category: "Career & Skill Paths", subcategory: "Tech", education_required: "Anyone", difficulty: "Medium", duration: "6 months", tags: ["web dev", "javascript", "react", "nodejs"] },
  { goal: "GATE (Computer Science)", category: "Engineering & Science PG", subcategory: "GATE", education_required: "B.Tech/BE", difficulty: "Hard", duration: "12 months", tags: ["gate", "cs", "engineering", "mtech"] },
  { goal: "IELTS (7.0+ Band)", category: "International Exams", subcategory: "English", education_required: "Anyone", difficulty: "Medium", duration: "3 months", tags: ["ielts", "english", "abroad", "canada"] },
  { goal: "GRE (320+ Score)", category: "International Exams", subcategory: "Graduate", education_required: "Graduate", difficulty: "Hard", duration: "3 months", tags: ["gre", "usa", "ms", "abroad"] },
  { goal: "CA Foundation", category: "After Class 12", subcategory: "Commerce", education_required: "Class 12", difficulty: "Hard", duration: "8 months", tags: ["ca", "chartered accountant", "icai", "finance"] },
  { goal: "NDA (National Defence Academy)", category: "After Class 12", subcategory: "Defence", education_required: "Class 11-12", difficulty: "Hard", duration: "12 months", tags: ["nda", "army", "navy", "airforce", "defence"] },
  { goal: "CTET (Central Teacher Eligibility)", category: "Teaching Exams", subcategory: "Teaching", education_required: "Graduate + B.Ed", difficulty: "Medium", duration: "4 months", tags: ["ctet", "teacher", "teaching", "school"] },
  { goal: "Japanese Language (N5 to N2)", category: "Human Languages", subcategory: "Language", education_required: "Anyone", difficulty: "Medium", duration: "12 months", tags: ["japanese", "jlpt", "language", "japan"] },
  { goal: "Agniveer (Army)", category: "After Class 10", subcategory: "Government Jobs", education_required: "Class 10 Pass", difficulty: "Medium", duration: "3 months", tags: ["agniveer", "army", "defence", "military"] },
];

function buildPrompt(r) {
  return `You are RiseUpHub's expert AI career coach. Generate a COMPLETE roadmap for ${r.goal}.

Assume: Beginner level, 3-4 hours/day, mixed learning style, ${r.duration} timeline.

Use bullet points (- ) for lists, numbered (1. 2.) for steps, MONTH 1: format, Monday:/Tuesday: for schedules.

---OVERVIEW---
3-4 sentences summary.

---ESTIMATED_COMPLETION---
- Timeline for 3-4 hours/day
- Key milestones
- Expected result

---MONTHLY_PLAN---
MONTH 1: [Theme]
- Week 1-2: [Topics]
- Week 3-4: [Topics]
- Goal: [Achievement]
- Resources: [2-3 resources]
[Continue all months for ${r.duration}]

---WEEKLY_SCHEDULE---
- Monday: [Topic + time]
- Tuesday: [Topic + time]
- Wednesday: [Topic + time]
- Thursday: [Topic + time]
- Friday: [Topic + time]
- Saturday: [Topic + time]
- Sunday: [Revision]

---DAILY_STUDY_PLAN---
- 6:00 AM: [Activity]
- 7:00 AM: [Activity]
[Full day schedule]

---SKILLS_ORDER---
1. [Skill] - [Why] - [Time]
2. [Skill] - [Why] - [Time]
[All skills in order]

---FREE_RESOURCES---
YOUTUBE CHANNELS:
- [Channel]: [What it covers]
WEBSITES:
- [Website]: [What it offers]
BOOKS:
- [Book] by [Author]: [Why]
PRACTICE PLATFORMS:
- [Platform]: [How to use]

---RECOMMENDED_COURSES---
1. [Course] on [Platform] - [Price] - [Why]
2. [Course] on [Platform] - [Price] - [Why]
3. [Course] on [Platform] - [Price] - [Why]

---PROJECTS---
1. [Project]: [Build] - [Skills]
2. [Project]: [Build] - [Skills]
3. [Project]: [Build] - [Skills]
4. [Project]: [Build] - [Skills]
5. [Project]: [Build] - [Skills]

---CERTIFICATES---
1. [Cert] from [Org] - [When]
2. [Cert] - [When]
3. [Cert] - [When]

---INTERVIEW_PREP---
IMPORTANT TOPICS:
- [Topic]: [Why]
COMMON QUESTIONS:
- [Question]
- [Question]
- [Question]
LAST 30 DAYS:
- Week 1: [Focus]
- Week 2: [Focus]
- Week 3: [Focus]
- Week 4: [Focus]

---RESUME_MILESTONES---
1. [Month X]: [Achievement]
2. [Month X]: [Achievement]
3. [Month X]: [Achievement]
4. [Month X]: [Achievement]
5. [Month X]: [Achievement]

---PORTFOLIO_MILESTONES---
1. [Month X]: [Item]
2. [Month X]: [Item]
3. [Month X]: [Item]

---INTERNSHIP_PREP---
- [Advice]
- [When to apply]
- [Top targets]

---BEGINNER_MISTAKES---
1. [Mistake]: [How to avoid]
2. [Mistake]: [How to avoid]
3. [Mistake]: [How to avoid]
4. [Mistake]: [How to avoid]
5. [Mistake]: [How to avoid]
6. [Mistake]: [How to avoid]
7. [Mistake]: [How to avoid]
8. [Mistake]: [How to avoid]

---PRO_TIPS---
1. [Tip]
2. [Tip]
3. [Tip]
4. [Tip]
5. [Tip]
6. [Tip]
7. [Tip]
8. [Tip]

---MOTIVATION_STRATEGY---
- Why this goal matters:
  - [Reason 1]
  - [Reason 2]
- Daily habits:
  - [Habit 1]
  - [Habit 2]
- When you feel like quitting:
  - [Strategy 1]
  - [Strategy 2]`;
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in" }, { status: 403 });
    }

    const { index } = await request.json();

    if (index === undefined || index < 0 || index >= POPULAR_ROADMAPS.length) {
      return NextResponse.json({ error: "Invalid index" }, { status: 400 });
    }

    const r = POPULAR_ROADMAPS[index];

    // Check if already exists
    const { data: existing } = await supabase
      .from("roadmap_library")
      .select("id")
      .eq("goal", r.goal)
      .single();

    if (existing) {
      return NextResponse.json({ success: true, skipped: true, goal: r.goal });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      messages: [{ role: "user", content: buildPrompt(r) }],
    });

    const content = message.content[0].text;

    await supabase.from("roadmap_library").insert({
      goal: r.goal,
      category: r.category,
      subcategory: r.subcategory,
      education_required: r.education_required,
      difficulty: r.difficulty,
      duration: r.duration,
      tags: r.tags,
      roadmap_content: content,
      is_featured: true,
      search_keywords: r.tags.join(" ") + " " + r.goal.toLowerCase(),
    });

    return NextResponse.json({ success: true, goal: r.goal });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    total: POPULAR_ROADMAPS.length,
    roadmaps: POPULAR_ROADMAPS.map((r, i) => ({ index: i, goal: r.goal, category: r.category, difficulty: r.difficulty, duration: r.duration }))
  });
}