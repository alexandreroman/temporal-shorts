// ===================== 5. LOCKED IN A SANDBOX
// The block keeps every name declared in this file local to this scene.
{
  scene({
    chapter: 5, title: 'Locked in a sandbox',
    subs: [
      {
        text: "August 2025: malware turned the AI assistants on developers' computers into key and password thieves.",
      },
      { text: "Those assistants ran with full access: every file, every saved password, the whole network." },
      {
        text: "With Temporal, risky work, like code the AI wrote, goes to a <b>sandbox</b>: "
          + "a sealed Worker with no keys.",
      },
      { text: "If the code misbehaves, the damage stays in the box. The box is thrown away; the Workflow carries on." },
    ],
    // subtitles only: no visuals yet
    build() {},
    update() {}
  });
}
