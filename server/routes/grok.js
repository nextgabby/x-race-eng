import { Router } from "express";
import {
  SCENARIO_INTRO_PROMPT,
  DECISION_FEEDBACK_PROMPT,
  RACE_DEBRIEF_PROMPT,
} from "../prompts/raceEngineer.js";

const router = Router();

const XAI_API_URL = "https://api.x.ai/v1/chat/completions";
const MODEL = "grok-3";
const REQUEST_TIMEOUT_MS = 15000;

async function callGrok(systemPrompt, userContent) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(XAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        max_tokens: 200,
        temperature: 0.85,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Grok API ${res.status}: ${errorBody}`);
    }

    const data = await res.json();
    return { message: data.choices[0].message.content, live: true };
  } catch (err) {
    if (err.name === "AbortError") {
      console.error("Grok API call timed out");
    } else {
      console.error("Grok API error:", err.message);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

// POST /api/grok/scenario-intro
router.post("/scenario-intro", async (req, res) => {
  const { scenarioIndex, scenario, priorDecisions } = req.body;

  const userContent = `Scenario ${scenarioIndex + 1} of 5.
Lap ${scenario.lap}/${scenario.totalLaps}.
Title: ${scenario.title}
Situation: ${scenario.situation}
Option A: ${scenario.options[0].label} - ${scenario.options[0].subtitle}
Option B: ${scenario.options[1].label} - ${scenario.options[1].subtitle}
Prior decisions this race: ${JSON.stringify(priorDecisions || [])}`;

  const result = await callGrok(SCENARIO_INTRO_PROMPT, userContent);

  if (result) {
    return res.json(result);
  }

  res.json({ message: scenario.fallbackIntro || getFallbackIntro(scenarioIndex), live: false });
});

// POST /api/grok/decision-feedback
router.post("/decision-feedback", async (req, res) => {
  const { scenarioIndex, scenario, chosenOption, wasTimeout, optimalChoice, choiceIndex, priorDecisions } = req.body;

  const wasOptimal = choiceIndex === optimalChoice;
  const userContent = `Scenario: ${scenario.title} (Lap ${scenario.lap}/${scenario.totalLaps})
Situation: ${scenario.situation}
Driver chose: "${chosenOption}"
Was this the optimal call: ${wasOptimal ? "YES" : "NO"}
Did the driver time out (fail to decide): ${wasTimeout ? "YES" : "NO"}
Prior decisions: ${JSON.stringify(priorDecisions || [])}`;

  const result = await callGrok(DECISION_FEEDBACK_PROMPT, userContent);

  if (result) {
    return res.json(result);
  }

  const fallback = wasTimeout
    ? "We lost the window. The team needed a call and we didn't get one. Let's move on."
    : wasOptimal
      ? "Good call. That's exactly what we needed. Let's keep pushing."
      : "Copy that. Not the call I would have made, but we'll manage it. Stay focused.";

  res.json({ message: fallback, live: false });
});

// POST /api/grok/race-debrief
router.post("/race-debrief", async (req, res) => {
  const { totalPoints, maxPoints, resultTier, decisions } = req.body;

  const userContent = `Race result: ${resultTier}
Score: ${totalPoints}/${maxPoints}
Decisions made:
${decisions.map((d, i) => `${i + 1}. ${d.scenario}: chose "${d.choice}" - ${d.points} points - ${d.wasOptimal ? "OPTIMAL" : "SUBOPTIMAL"}`).join("\n")}`;

  const result = await callGrok(RACE_DEBRIEF_PROMPT, userContent);

  if (result) {
    return res.json(result);
  }

  const fallback = totalPoints >= 13
    ? "Brilliant drive today. The strategy calls were spot on and we maximized every opportunity. That's a race winner's performance. Well done, driver."
    : totalPoints >= 10
      ? "Solid race. A few calls could have gone differently but we brought home a podium. Good work out there, let's build on this."
      : totalPoints >= 6
        ? "We finished in the points and that's something to work with. Some of those strategy calls cost us, but we'll debrief and come back stronger."
        : "Tough day at the office. We left too many points on the table with those calls. We need to be sharper. Back to the simulator.";

  res.json({ message: fallback, live: false });
});

function getFallbackIntro(index) {
  const fallbacks = [
    "OK driver, Dell weather models are lighting up. We're looking at precipitation in three to four laps. You're on mediums, running P4 with good pace. We can box now for inters or stay out and gamble. Your call.",
    "Driver, Dell tracking data confirms car behind has DRS and is closing fast, 0.4 seconds back. They've been faking to the inside but they're strong on corner exit. We need to decide our defensive line. What do you want to do?",
    "Safety car, safety car. Dell strategy sim says we've got one more lap in the pit window. Boxing drops us to P7 on fresh softs, or we stay out P3 on old mediums with 23 to go. We need a decision now.",
    "Dell ERS system reads 14 percent battery. Car ahead is struggling with rear deg, gap is 0.6 seconds. We can dump everything for one overtake attempt on the back straight, or harvest now and defend the final laps. Your call, driver.",
    "Final lap. P2, 0.7 behind the leader who's nursing a damaged front wing. Dell aero sims confirm Turn 11 is where their wing damage hurts most. We can try a late brake into 11 or carry exit speed and drag race to the line. This is it.",
  ];
  return fallbacks[index] || fallbacks[0];
}

export default router;
