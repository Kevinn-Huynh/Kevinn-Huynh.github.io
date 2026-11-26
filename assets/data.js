/* =====================================================================
   KEVIN'S SITE CONTENT
   Everything on the site comes from this file. To add a project:
     1. Drop your pictures into the images/ folder.
     2. Copy one of the entries in PROJECTS below, paste it where you want it
        to appear (the order here is the order on the site), and edit it.
     3. Give it a unique "slug" using lowercase letters, numbers and hyphens.
        The project page will be project.html#your-slug
   Fields (all optional except slug, title and date):
     featured: true        shows on the home page
     cover: "images/x.jpg" card picture (add coverFit: "contain" to avoid cropping)
     summary, highlights[] (bullet points), tags[]
     links: [ { label: "Report (PDF)", url: "files/report.pdf" } ]
     media: pictures and charts shown on the project page:
       { type: "image", src: "images/x.jpg", alt: "what it shows", caption: "label", wide: true }
       { type: "chart", title: "...", xLabel: "Time (s)", yLabel: "Current (A)",
         x: [0, 10, 20], series: [ { name: "Pack current", y: [5, 40, 32] } ] }
   ===================================================================== */

/* Circuit model of the high voltage indicator (used by the home page instrument and its charts). */
window.HVModel = (function () {
  var RS = 5000 + 5000 + 2700 + 715, RL = 460, VZ = 12;
  function at(v) {
    var open = v * RL / (RS + RL), vn, is, iz;
    if (open < VZ) { vn = open; is = v / (RS + RL); iz = 0; }
    else { vn = VZ; is = (v - VZ) / RS; iz = is - VZ / RL; }
    return { v: v, vn: vn, is: is, il: vn / RL, iz: iz, pr: is * is * 5000 };
  }
  return { RS: RS, RL: RL, VZ: VZ, at: at, knee: VZ * (RS + RL) / RL };
})();

window.SITE = {
  name: "Kevin Huynh",
  email: "huynh23@uwindsor.ca",
  linkedin: "https://linkedin.com/in/kevinn-huynh",
  location: "Windsor, Ontario",
  stats: [
    { value: "470 V", label: "Accumulator designed" },
    { value: "100+", label: "Cells monitored by custom BMS board" },
    { value: "30", label: "Students on the battery subteam" },
    { value: "1st", label: "Team battery inspection sticker" }
  ],
  experience: [
    {
      role: "Cell Assembly Engineer Co-op",
      org: "LG Energy Solution",
      place: "Windsor, ON",
      dates: "May 2026 – Aug 2026",
      bullets: [
        "Supported production optimization and quality improvement for LFP battery cell manufacturing.",
        "Analyzed equipment downtime to optimize work, contributing to a $1M increase in annual production yield.",
        "Ran time studies and workflow analyses to drive continuous improvement.",
        "Executed 3R5S initiatives for workplace organization, efficiency and process consistency.",
        "Directed implementation of a plant-wide 1 µm filtration process to reduce contamination."
      ]
    },
    {
      role: "FSAE Battery Subteam Lead",
      org: "University of Windsor Formula SAE electric",
      place: "Windsor, ON",
      dates: "Sep 2024 – Present",
      bullets: [
        "Lead a team of 30 students designing a 470 V accumulator for an electric racecar.",
        "Earned the team's first Formula SAE battery technical inspection sticker."
      ],
      link: { label: "See the project", url: "project.html#fsae-battery-subteam-lead" }
    }
  ],
  more: [
    { role: "Summer Day Camp Counsellor", org: "Municipality of Leamington", dates: "May 2024 – Aug 2025", text: "Oversaw 150 campers daily, ensuring safety and entertainment while following camp rules." },
    { role: "Customer Service", org: "Wongs 2 go, Leamington", dates: "May 2022 – Sep 2025", text: "Advised new workers on how to do tasks while ensuring safety procedures were followed." }
  ],
  education: { degree: "B.A.Sc. Honours Electrical Engineering, Co-op", school: "University of Windsor, Windsor, ON", dates: "Sep 2024 – Aug 2028" },
  skills: [
    { group: "Technical", items: ["High voltage testing", "Test bench validation", "PCB design", "Soldering"] },
    { group: "Tools", items: ["Altium", "AutoCAD", "LTspice", "Optimum Lap", "Logisim", "Git", "Microsoft Office"] },
    { group: "Languages", items: ["Python", "C++", "MATLAB", "Simulink"] }
  ]
};

(function () {
  var SWEEP = [];
  for (var v = 280; v <= 470; v += 10) SWEEP.push(window.HVModel.at(v));
  function col(key, k) { return SWEEP.map(function (r) { return +(r[key] * (k || 1)).toFixed(3); }); }
  var xs = SWEEP.map(function (r) { return r.v; });

/* Endurance simulation, current pack: per-lap results from the team mastersheet. */
var LAPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
var LAP_PEAK = [52.344, 52.701, 52.987, 53.312, 53.83, 54.468, 55.008, 55.469, 56.007, 56.582, 57.224, 57.99, 58.67, 59.314, 60.006, 60.749, 61.512, 62.386, 63.38, 66.601, 75.428, 81.414];
var LAP_MEAN = [32.268, 32.702, 32.903, 33.084, 33.348, 33.722, 34.093, 34.399, 34.708, 35.062, 35.41, 35.876, 36.316, 36.715, 37.143, 37.573, 38.049, 38.554, 39.063, 40.243, 43.394, 53.309];
var LAP_SOC = [95.9, 91.7, 87.5, 83.2, 79.0, 74.7, 70.3, 65.9, 61.4, 57.0, 52.4, 47.8, 43.2, 38.5, 33.7, 28.9, 24.0, 19.1, 14.1, 8.9, 3.4, 2.5];

  window.PROJECTS = [
    {
      slug: "fsae-battery-subteam-lead",
      title: "FSAE Battery Subteam Lead",
      date: "Sep 2024 – Present",
      featured: true,
      cover: "images/fsae-team-michigan.jpg",
      summary: "Leading the battery subteam of the University of Windsor Formula SAE electric team through design, integration and testing of a 470 V accumulator.",
      highlights: [
        "Lead a team of 30 students designing a 470 V accumulator for an electric racecar.",
        "Validated the 470 V precharge circuit on a high-voltage test bench.",
        "Reviewed schematics, checked design rules and validated the electrical side of battery integration with the other subsystems.",
        "Led accumulator testing and validation, earning the team's first Formula SAE battery technical inspection sticker."
      ],
      tags: ["High voltage testing", "Test bench validation", "Team lead"],
      media: [
        { type: "image", src: "images/fsae-team-michigan.jpg", alt: "The University of Windsor Formula SAE electric team and car in front of the Michigan International Speedway sign", caption: "The University of Windsor Formula SAE electric team at Michigan International Speedway", wide: true }
      ]
    },
    {
      slug: "cell-sensing-board-adbms6830b",
      title: "Custom Cell Sensing Board for BMS",
      date: "Aug 2025 – Present",
      featured: true,
      cover: "images/cell-sensing-16-layout.jpg",
      summary: "A 16-cell sensing board built around the ADBMS6830B, which monitors the voltage and temperature of 100+ cells across the pack.",
      highlights: [
        "Designed a 4-layer PCB with attention to signal integrity, noise reduction and high-voltage isolation.",
        "Added galvanic isolation to protect the I2C link between the high-voltage and low-voltage systems.",
        "Researched the chip and designed the board in Altium."
      ],
      tags: ["ADBMS6830B", "Altium", "PCB design", "I2C isolation"],
      media: [
        { type: "image", src: "images/cell-sensing-16-layout.jpg", alt: "PCB layout of the 16-cell ADBMS6830B sensing board with cell connectors along the top edge", caption: "ADBMS6830B 16-cell board, layout", wide: true },
        { type: "image", src: "images/cell-sensing-16-schematic.jpg", alt: "Schematic of the ADBMS6830B sensing board", caption: "Schematic", wide: true }
      ]
    },
    {
      slug: "bq79616-sensing-board",
      title: "BQ79616 10-Cell Sensing Board",
      date: "Formula SAE electric team",
      featured: true,
      cover: "images/bq79616-connector-side.jpg",
      summary: "A second sensing board for the team, built around the BQ79616PAPRQ1. I analyzed the design, soldered the boards and tested them.",
      highlights: [
        "Analyzed the design.",
        "Soldered the boards.",
        "Tested the assembled boards."
      ],
      tags: ["BQ79616", "Soldering", "Board bring-up"],
      media: [
        { type: "image", src: "images/bq79616-connector-side.jpg", alt: "Two assembled BQ79616 sensing boards, connector side up", caption: "Connector side" },
        { type: "image", src: "images/bq79616-chip-side.jpg", alt: "Two assembled BQ79616 sensing boards, chip side up", caption: "Chip side" }
      ]
    },
    {
      slug: "hv-indicator-light",
      title: "High Voltage Indicator Light",
      date: "Aug 2026 – Present",
      featured: true,
      cover: "images/hv-indicator-3d.jpg",
      summary: "An indicator PCB for the 470 V accumulator that senses the high voltage and regulates it down to drive an LED. The instrument on the home page runs on this circuit.",
      highlights: [
        "Selected and sized the zener diode, resistors and LED from voltage, current and power dissipation limits.",
        "Simulated the circuit across the 280–470 V accumulator range in LTspice to confirm the regulation and LED operating point."
      ],
      tags: ["LTspice", "Zener regulation", "Altium", "PCB design"],
      media: [
        { type: "image", src: "images/hv-indicator-3d.jpg", alt: "3D render of the high voltage indicator PCB", caption: "Indicator PCB, 3D view", wide: true },
        { type: "image", src: "images/hv-indicator-ltspice-schematic.jpg", alt: "LTspice schematic with four series resistors, a TDZV12 zener diode and an LED resistor", caption: "LTspice schematic" },
        { type: "image", src: "images/hv-indicator-ltspice-sweep.jpg", alt: "LTspice DC sweep from 280 V to 470 V", caption: "LTspice DC sweep, 280 to 470 V" },
        { type: "chart", title: "Node voltage across the pack range", xLabel: "Accumulator voltage (V)", yLabel: "Node voltage (V)", x: xs,
          series: [{ name: "Regulated node", y: col("vn") }], note: "Calculated from the schematic with an ideal 12 V zener." },
        { type: "chart", title: "Where the current goes", xLabel: "Accumulator voltage (V)", yLabel: "Current (mA)", x: xs,
          series: [{ name: "Series string", y: col("is", 1000) }, { name: "LED branch", y: col("il", 1000) }, { name: "Zener", y: col("iz", 1000) }],
          note: "Above 362 V the zener takes the extra current and the LED branch stays flat." }
      ]
    },
    {
      slug: "openlap-energy-and-current-study",
      title: "OpenLap Energy and Current Study",
      date: "Formula SAE electric · Simulation",
      featured: true,
      cover: "images/openlap-laptime-sweep.jpg",
      summary: "Lap simulation for the electric car, used to see how much energy endurance takes and what the battery has to deliver.",
      highlights: [
        "Ran OpenLap for acceleration, endurance and autocross lap times.",
        "Swept power limit and speed limit against a 245 Wh per lap energy budget. The fastest lap that fits the budget is 60.4 s at 35 kW and 22 m/s, which costs 4.0 s against the unlimited 56.5 s lap that needs about 388 Wh.",
        "Used the endurance simulation to estimate energy consumption over the event: 13.05 Ah and 5186 Wh drawn over 22 laps.",
        "Took the OpenLap data into Batemo to find the current pull throughout endurance: peak pack current 81.4 A (16.3 A per cell) on the last lap, with mean and RMS of 36.0 A and 43.5 A.",
        "With the current pack the car finishes 21.1 of 22 laps and ends at 2.5% state of charge. I also modelled a proposed pack at 235 Wh per lap."
      ],
      tags: ["OpenLap", "Batemo", "MATLAB", "Simulation"],
      media: [
        { type: "image", src: "images/openlap-endurance-pack-current.jpg", alt: "Endurance simulation plots of pack current, state of charge, pack voltage and per-lap peak current over 22 laps", caption: "Endurance run: pack current, SOC, pack voltage and peak current per lap", wide: true },
        { type: "chart", title: "Pack current by lap", xLabel: "Lap (#)", yLabel: "Current (A)", x: LAPS,
          series: [{ name: "Peak current", y: LAP_PEAK }, { name: "Mean current", y: LAP_MEAN }],
          note: "Current rises each lap as the pack voltage sags, then jumps over the last three laps." },
        { type: "chart", title: "State of charge at end of each lap", xLabel: "Lap (#)", yLabel: "SOC (%)", x: LAPS,
          series: [{ name: "State of charge", y: LAP_SOC }], yMin: 0, yMax: 100,
          note: "From the endurance simulation with the current pack." },
        { type: "image", src: "images/openlap-laptime-sweep.jpg", alt: "3D surface of lap time against power limit and speed limit, coloured by battery energy per lap", caption: "Lap time sweep against power and speed limit" },
        { type: "image", src: "images/openlap-laptime-energy-contours.jpg", alt: "Contour plot of lap time with battery energy contours and the 245 Wh per lap budget outlined in red", caption: "Lap time with energy contours, 245 Wh per lap budget in red" }
      ]
    },
    {
      slug: "autonomous-robot-car",
      title: "Autonomous Robot Car",
      date: "Jan 2025 – Apr 2025",
      summary: "A 2-degree-of-freedom robot car that drives itself using Arduino and closed-loop control.",
      highlights: [
        "Built the car on Arduino with closed-loop control logic.",
        "Integrated ultrasonic and line-following sensors for navigation and obstacle detection.",
        "Wrote the requirements, schedule and budget documentation used to track milestones."
      ],
      tags: ["Arduino", "C++", "Closed-loop control"],
      cover: "images/robot-car-side.jpg",
      media: [
        { type: "image", src: "images/robot-car-side.jpg", alt: "Side view of the robot car: an Arduino chassis with yellow wheels towing a black and grey LEGO trailer with a paper tube on top", caption: "Side view" },
        { type: "image", src: "images/robot-car-top.jpg", alt: "Top view of the robot car and LEGO trailer with its servo and wiring", caption: "Top view" }
      ]
    }
  ];
})();
