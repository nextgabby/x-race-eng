import { useState, useCallback } from "react";

export function useGrok() {
  const [loading, setLoading] = useState(false);

  const callGrok = useCallback(async (endpoint, body) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/grok/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("useGrok error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getScenarioIntro = useCallback(
    (scenarioIndex, scenario, priorDecisions) =>
      callGrok("scenario-intro", { scenarioIndex, scenario, priorDecisions }),
    [callGrok]
  );

  const getDecisionFeedback = useCallback(
    (scenarioIndex, scenario, chosenOption, wasTimeout, optimalChoice, choiceIndex, priorDecisions) =>
      callGrok("decision-feedback", {
        scenarioIndex,
        scenario,
        chosenOption,
        wasTimeout,
        optimalChoice,
        choiceIndex,
        priorDecisions,
      }),
    [callGrok]
  );

  const getRaceDebrief = useCallback(
    (totalPoints, maxPoints, resultTier, decisions) =>
      callGrok("race-debrief", { totalPoints, maxPoints, resultTier, decisions }),
    [callGrok]
  );

  return { loading, getScenarioIntro, getDecisionFeedback, getRaceDebrief };
}
