import { useState, useEffect, useCallback } from "react";
import IntroScreen from "./components/IntroScreen";
import BriefingScreen from "./components/BriefingScreen";
import RaceScreen from "./components/RaceScreen";
import FeedbackScreen from "./components/FeedbackScreen";
import ResultsScreen from "./components/ResultsScreen";
import { generateRaceScenarios, TOTAL_SCENARIOS } from "./data/scenarios";
import { useGrok } from "./hooks/useGrok";
import { getResult } from "./utils/scoring";

const SCREENS = {
  SPLASH: "splash",
  INTRO: "intro",
  BRIEFING: "briefing",
  RACE: "race",
  FEEDBACK: "feedback",
  RESULTS: "results",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.SPLASH);
  const [scenarios, setScenarios] = useState(() => generateRaceScenarios());
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [introMessage, setIntroMessage] = useState(null);
  const [introLive, setIntroLive] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [feedbackLive, setFeedbackLive] = useState(true);
  const [debriefMessage, setDebriefMessage] = useState(null);
  const [debriefLive, setDebriefLive] = useState(true);

  const { getScenarioIntro, getDecisionFeedback, getRaceDebrief } = useGrok();

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => setScreen(SCREENS.INTRO), 1800);
    return () => clearTimeout(timer);
  }, []);

  const scenario = scenarios[scenarioIndex];

  // Fetch scenario intro when entering race screen
  useEffect(() => {
    if (screen !== SCREENS.RACE) return;
    let stale = false;

    setIntroMessage(null);
    setIntroLive(true);

    const priorDecisions = decisions.map((d) => ({
      scenario: d.scenario,
      choice: d.choice,
    }));

    getScenarioIntro(scenarioIndex, scenarios[scenarioIndex], priorDecisions).then((result) => {
      if (stale) return;
      if (result) {
        setIntroMessage(result.message);
        setIntroLive(result.live);
      } else {
        setIntroMessage(scenarios[scenarioIndex].fallbackIntro);
        setIntroLive(false);
      }
    });

    return () => { stale = true; };
  }, [screen, scenarioIndex]);

  const handleDecision = useCallback(
    async (choiceIndex, wasTimeout) => {
      const points = wasTimeout ? 0 : scenario.options[choiceIndex]?.optimalPoints ?? 0;
      const choiceLabel = wasTimeout
        ? "TIMED OUT"
        : scenario.options[choiceIndex].label;

      const decision = {
        scenario: scenario.title,
        choice: choiceLabel,
        points,
        wasOptimal: choiceIndex === scenario.optimalChoice,
        choiceIndex,
        wasTimeout,
      };

      setCurrentFeedback(decision);
      setFeedbackMessage(null);
      setFeedbackLive(true);
      setScreen(SCREENS.FEEDBACK);

      // Fire feedback API call
      const priorDecisions = [...decisions, decision].map((d) => ({
        scenario: d.scenario,
        choice: d.choice,
      }));
      const result = await getDecisionFeedback(
        scenarioIndex,
        scenario,
        choiceLabel,
        wasTimeout,
        scenario.optimalChoice,
        choiceIndex,
        priorDecisions
      );
      if (result) {
        setFeedbackMessage(result.message);
        setFeedbackLive(result.live);
      } else {
        const fallback = wasTimeout
          ? "We lost the window. The team needed a call and we didn't get one. Let's move on."
          : decision.wasOptimal
            ? "Good call. That's exactly what we needed. Let's keep pushing."
            : "Copy that. Not the call I would have made, but we'll manage it. Stay focused.";
        setFeedbackMessage(fallback);
        setFeedbackLive(false);
      }
    },
    [scenario, scenarioIndex, decisions, getDecisionFeedback]
  );

  const handleNextScenario = useCallback(() => {
    const newDecisions = [...decisions, currentFeedback];
    setDecisions(newDecisions);

    if (scenarioIndex >= scenarios.length - 1) {
      // Go to results
      const totalPoints = newDecisions.reduce((sum, d) => sum + d.points, 0);
      const result = getResult(totalPoints);
      setCurrentFeedback(null);
      setDebriefMessage(null);
      setDebriefLive(true);
      setScreen(SCREENS.RESULTS);

      // Fire debrief API call
      getRaceDebrief(
        totalPoints,
        15,
        result.title,
        newDecisions.map((d) => ({
          scenario: d.scenario,
          choice: d.choice,
          points: d.points,
          wasOptimal: d.wasOptimal,
        }))
      ).then((res) => {
        if (res) {
          setDebriefMessage(res.message);
          setDebriefLive(res.live);
        } else {
          const fallback =
            totalPoints >= 13
              ? "Brilliant drive today. The strategy calls were spot on and we maximized every opportunity. That's a race winner's performance. Well done, driver."
              : totalPoints >= 10
                ? "Solid race. A few calls could have gone differently but we brought home a podium. Good work out there."
                : totalPoints >= 6
                  ? "We finished in the points. Some of those strategy calls cost us, but we'll debrief and come back stronger."
                  : "Tough day at the office. We left too many points on the table. We need to be sharper. Back to the simulator.";
          setDebriefMessage(fallback);
          setDebriefLive(false);
        }
      });
    } else {
      setScenarioIndex((i) => i + 1);
      setScreen(SCREENS.RACE);
    }
  }, [decisions, currentFeedback, scenarioIndex, scenarios, getRaceDebrief]);

  const handleRestart = () => {
    setScenarios(generateRaceScenarios());
    setScenarioIndex(0);
    setDecisions([]);
    setCurrentFeedback(null);
    setIntroMessage(null);
    setFeedbackMessage(null);
    setDebriefMessage(null);
    setScreen(SCREENS.INTRO);
  };

  const allDecisions = decisions.concat(currentFeedback ? [currentFeedback] : []);

  if (screen === SCREENS.SPLASH) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <h1 className="font-display text-2xl font-black tracking-wider text-neutral-300">
            RACE DAY
          </h1>
          <div className="text-xs font-mono tracking-widest text-neutral-600 text-center mt-1">
            with GROK ✖
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[520px] mx-auto">
      {screen === SCREENS.INTRO && (
        <IntroScreen onStart={() => setScreen(SCREENS.BRIEFING)} />
      )}
      {screen === SCREENS.BRIEFING && (
        <BriefingScreen onStart={() => setScreen(SCREENS.RACE)} />
      )}
      {screen === SCREENS.RACE && (
        <RaceScreen
          key={scenarioIndex}
          scenario={scenario}
          scenarioIndex={scenarioIndex}
          totalScenarios={scenarios.length}
          grokMessage={introMessage}
          grokLive={introLive}
          onDecision={handleDecision}
        />
      )}
      {screen === SCREENS.FEEDBACK && currentFeedback && (
        <FeedbackScreen
          scenario={scenario}
          choiceIndex={currentFeedback.choiceIndex}
          wasTimeout={currentFeedback.wasTimeout}
          points={currentFeedback.points}
          grokMessage={feedbackMessage}
          grokLive={feedbackLive}
          onNext={handleNextScenario}
          isLast={scenarioIndex >= scenarios.length - 1}
        />
      )}
      {screen === SCREENS.RESULTS && (
        <ResultsScreen
          totalPoints={allDecisions.reduce((s, d) => s + d.points, 0)}
          decisions={allDecisions.map((d) => ({
            scenario: d.scenario,
            choice: d.choice,
            points: d.points,
            wasOptimal: d.wasOptimal,
          }))}
          debriefMessage={debriefMessage}
          debriefLive={debriefLive}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
