// Each pool contains 2 variant scenarios for the same race phase.
// generateRaceScenarios() picks one at random from each pool,
// giving 2^5 = 32 unique race combinations across sessions.

const SCENARIO_POOLS = [
  // ── Pool 1: Early Race (lap ~11-12) ──
  [
    {
      lap: 12,
      totalLaps: 58,
      title: "WEATHER CALL",
      situation:
        "Dell-powered weather telemetry showing precipitation arriving in 3-4 laps. Currently running P4 on medium compound tires with good pace.",
      timerSeconds: 10,
      options: [
        { id: "a", label: "BOX BOX BOX", subtitle: "Pit for intermediate tires now", optimalPoints: 3 },
        { id: "b", label: "STAY OUT", subtitle: "Gamble the rain holds off", optimalPoints: 0 },
      ],
      optimalChoice: 0,
      fallbackIntro:
        "OK driver, Dell weather models are lighting up. We're looking at precipitation in three to four laps. You're on mediums, running P4 with good pace. We can box now for inters or stay out and gamble. Your call.",
    },
    {
      lap: 11,
      totalLaps: 58,
      title: "UNDERCUT WINDOW",
      situation:
        "Dell pit analytics show car ahead (P3) is about to box this lap. You're P4 with a 1.8s gap. If you pit first, the undercut could jump them on the out-lap. If you stay out, you keep clean air but risk losing the positional advantage.",
      timerSeconds: 10,
      options: [
        { id: "a", label: "PIT NOW", subtitle: "Undercut for P3 on the out-lap", optimalPoints: 3 },
        { id: "b", label: "STAY OUT", subtitle: "Keep clean air, pit later", optimalPoints: 0 },
      ],
      optimalChoice: 0,
      fallbackIntro:
        "Driver, Dell pit analytics show P3 is about to box. Gap is 1.8 seconds. If we pit now we can undercut them on the out-lap, or we stay out and keep the clean air. What's the call?",
    },
  ],

  // ── Pool 2: Early-Mid Race (lap ~22-24) ──
  [
    {
      lap: 24,
      totalLaps: 58,
      title: "DEFENSE MODE",
      situation:
        "Running P4. Dell real-time analytics show car behind (P5) has DRS and is 0.4s back, closing every lap. Data confirms they've been faking moves to the inside all session but their car is stronger on corner exit.",
      timerSeconds: 8,
      options: [
        { id: "a", label: "COVER INSIDE", subtitle: "Defend the braking zone into T1", optimalPoints: 0 },
        { id: "b", label: "COVER OUTSIDE", subtitle: "Block the chicane switch-back", optimalPoints: 3 },
      ],
      optimalChoice: 1,
      fallbackIntro:
        "Driver, Dell tracking data confirms car behind has DRS and is closing fast, 0.4 seconds back. They've been faking to the inside but they're strong on corner exit. We need to decide our defensive line. What do you want to do?",
    },
    {
      lap: 22,
      totalLaps: 58,
      title: "TIRE MANAGEMENT",
      situation:
        "Dell tire telemetry shows rear degradation 15% higher than expected. You're P3 with strong pace but the tires won't last the planned stint. Push now to build a gap before pitting early, or manage the tires to make the original strategy work.",
      timerSeconds: 8,
      options: [
        { id: "a", label: "PUSH NOW", subtitle: "Build a gap, pit early", optimalPoints: 0 },
        { id: "b", label: "MANAGE TIRES", subtitle: "Nurse the rubber, stick to strategy", optimalPoints: 3 },
      ],
      optimalChoice: 1,
      fallbackIntro:
        "Driver, Dell tire data is showing rear deg 15 percent above model. You're P3 with pace but the rubber won't last the stint. We push now and pit early, or we manage tires and stick to the plan. Your call.",
    },
  ],

  // ── Pool 3: Mid Race (lap ~33-35) ──
  [
    {
      lap: 35,
      totalLaps: 58,
      title: "SAFETY CAR",
      situation:
        "Safety car deployed for debris in sector 2. Currently P3 on medium tires with 23 laps remaining. Dell pit strategy simulation shows the window is open for 1 more lap. Pitting drops you to P7 but gives you fresh soft tires.",
      timerSeconds: 10,
      options: [
        { id: "a", label: "BOX FOR SOFTS", subtitle: "Fresh tires, drop to P7", optimalPoints: 3 },
        { id: "b", label: "STAY OUT P3", subtitle: "Keep position on old mediums", optimalPoints: 0 },
      ],
      optimalChoice: 0,
      fallbackIntro:
        "Safety car, safety car. Dell strategy sim says we've got one more lap in the pit window. Boxing drops us to P7 on fresh softs, or we stay out P3 on old mediums with 23 to go. We need a decision now.",
    },
    {
      lap: 33,
      totalLaps: 58,
      title: "VIRTUAL SAFETY CAR",
      situation:
        "Virtual safety car deployed for a stranded car at Turn 6. Currently P4 on hard tires with 25 laps remaining. Dell strategy simulation shows pitting under VSC saves 12 seconds versus a normal stop. You'd drop to P6 but on fresh mediums.",
      timerSeconds: 10,
      options: [
        { id: "a", label: "PIT UNDER VSC", subtitle: "Fresh mediums, drop to P6", optimalPoints: 3 },
        { id: "b", label: "STAY OUT P4", subtitle: "Keep position on old hards", optimalPoints: 0 },
      ],
      optimalChoice: 0,
      fallbackIntro:
        "VSC, VSC. Dell strategy sim says pitting now saves us 12 seconds over a normal stop. We drop to P6 on fresh mediums, or hold P4 on these hards with 25 to go. Quick decision, driver.",
    },
  ],

  // ── Pool 4: Late Race (lap ~46-48) ──
  [
    {
      lap: 48,
      totalLaps: 58,
      title: "ENERGY DEPLOY",
      situation:
        "Dell-powered ERS management system shows battery at 14%. Car ahead is struggling with rear tire degradation, gap is 0.6 seconds. You have one realistic overtake window on the back straight. Alternatively, harvest energy now for full deployment in the defensive final 5 laps.",
      timerSeconds: 7,
      options: [
        { id: "a", label: "OVERTAKE MODE", subtitle: "Dump everything, one shot to pass", optimalPoints: 3 },
        { id: "b", label: "HARVEST & DEFEND", subtitle: "Save battery for final stint defense", optimalPoints: 0 },
      ],
      optimalChoice: 0,
      fallbackIntro:
        "Dell ERS system reads 14 percent battery. Car ahead is struggling with rear deg, gap is 0.6 seconds. We can dump everything for one overtake attempt on the back straight, or harvest now and defend the final laps. Your call, driver.",
    },
    {
      lap: 46,
      totalLaps: 58,
      title: "PENALTY ADVANTAGE",
      situation:
        "Dell real-time data shows the car ahead (P2) just received a 5-second penalty for unsafe pit release. You're P3, gap is 3.2 seconds. Push hard to get within 5 seconds at the flag and inherit P2, or save tires and secure P3.",
      timerSeconds: 7,
      options: [
        { id: "a", label: "PUSH FOR P2", subtitle: "Close the gap, exploit the penalty", optimalPoints: 3 },
        { id: "b", label: "SECURE P3", subtitle: "Save tires, bank the podium", optimalPoints: 0 },
      ],
      optimalChoice: 0,
      fallbackIntro:
        "Driver, Dell data confirms P2 just got a 5-second penalty for unsafe release. Gap is 3.2 seconds. If we push and get within 5 at the flag, that's P2. Or we save rubber and bank P3. What do you want?",
    },
  ],

  // ── Pool 5: Final Lap (lap ~56-57) ──
  [
    {
      lap: 57,
      totalLaps: 58,
      title: "LAST LAP",
      situation:
        "Final lap. Running P2, 0.7s behind P1 who has a damaged front wing from earlier contact. Dell aero simulation data shows Turn 11 is where their damaged wing costs them the most downforce. Two options: late lunge on brakes into T11, or carry superior exit speed and try to drag race to the line.",
      timerSeconds: 6,
      options: [
        { id: "a", label: "LATE BRAKE T11", subtitle: "Dive bomb on the brakes", optimalPoints: 0 },
        { id: "b", label: "EXIT SPEED", subtitle: "Outrun them to the finish line", optimalPoints: 3 },
      ],
      optimalChoice: 1,
      fallbackIntro:
        "Final lap. P2, 0.7 behind the leader who's nursing a damaged front wing. Dell aero sims confirm Turn 11 is where their wing damage hurts most. We can try a late brake into 11 or carry exit speed and drag race to the line. This is it.",
    },
    {
      lap: 56,
      totalLaps: 58,
      title: "TEAM ORDERS",
      situation:
        "Two laps to go. You're P3, your teammate is P2 ahead by 0.3 seconds. Team principal is asking you to hold position to secure a double podium. But Dell telemetry shows you have a significant tire advantage and a real shot at overtaking for P2.",
      timerSeconds: 6,
      options: [
        { id: "a", label: "HOLD POSITION", subtitle: "Respect team orders, double podium", optimalPoints: 0 },
        { id: "b", label: "ATTACK", subtitle: "Go for P2, risk contact", optimalPoints: 3 },
      ],
      optimalChoice: 1,
      fallbackIntro:
        "Two to go. Your teammate is P2, you're P3, gap is 0.3 seconds. Team wants you to hold for the double podium. But Dell tire data says you've got the edge. Do you hold or do you go for it? Your call, driver.",
    },
  ],
];

export const TOTAL_SCENARIOS = SCENARIO_POOLS.length;

export function generateRaceScenarios() {
  return SCENARIO_POOLS.map(
    (pool) => pool[Math.floor(Math.random() * pool.length)]
  );
}
