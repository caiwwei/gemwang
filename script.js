const THOUGHT_TEMPLATES = {
  hungry: [
    "I have {hunger}% snack battery remaining.",
    "Your {snack} is now community property.",
    "Give. Me. Food."
  ],
  "judging you": [
    "You came to campus dressed like *that*?",
    "I observe your mistakes silently.",
    "I know what you did on Piazza."
  ],
  chaotic: [
    "If I sprint fast enough, physics cannot catch me.",
    "I will climb that tree. And fall. And climb again.",
    "Crow, fight me."
  ],
  tired: [
    "Emotionally I am one (1) leaf.",
    "I slept zero hours, but I run anyway.",
    "Please let me nap on the ground."
  ],
  scheming: [
    "Step one: approach. Step two: steal. Step three: vanish.",
    "I am planning a donut heist.",
    "Trust me. You fool."
  ]
};

const SNACKS = ["donut", "bagel", "granola bar", "bubble tea", "panini"];

function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function genStats() {
    return {
        hunger: 50 + Math.floor(Math.random() * 50),
        chaos: 30 + Math.floor(Math.random() * 70),
        friendliness: 20 + Math.floor(Math.random() * 80)
    };
}

function generateTranslation(scenario) {
    const mood = scenario || rand(Object.keys(THOUGHT_TEMPLATES));
    const stats = genStats();
    let template = rand(THOUGHT_TEMPLATES[mood]);

    template = template
        .replace("{hunger}", stats.hunger)
        .replace("{snack}", rand(SNACKS));

    return {
        mood,
        main: template,
        side: [
            "I have no concept of tuition, only crumbs.",
            "If you drop it, it was always meant for me."
        ],
        stats
    };
}

// ---- DOM Logic ---- //

const fileInput = document.getElementById("fileInput");
const previewImg = document.getElementById("previewImg");
const placeholder = document.getElementById("placeholder");
const translateBtn = document.getElementById("translateBtn");
const scenarioSelect = document.getElementById("scenario");
const outputBox = document.getElementById("outputBox");

// show image preview
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    previewImg.src = url;
    previewImg.style.display = "block";
    placeholder.style.display = "none";
});

// generate translation
translateBtn.addEventListener("click", () => {
    if (!previewImg.src) {
        alert("Upload a squirrel first!");
        return;
    }

    const result = generateTranslation(scenarioSelect.value);

    outputBox.innerHTML = `
        <div class="mood">Mood: ${result.mood}</div>
        <h3>“${result.main}”</h3>
        <ul>
            <li>${result.side[0]}</li>
            <li>${result.side[1]}</li>
        </ul>
        <p class="stats">
            Hunger: ${result.stats.hunger}% •
            Chaos: ${result.stats.chaos}% •
            Friendliness: ${result.stats.friendliness}%
        </p>
    `;
});
