const fileInput = document.getElementById("fileInput");
const previewImg = document.getElementById("previewImg");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const translateBtn = document.getElementById("translateBtn");
const statusEl = document.getElementById("status");
const outputCard = document.getElementById("outputCard");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  previewImg.src = url;
  previewImg.style.display = "block";
  uploadPlaceholder.style.display = "none";
});

translateBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please upload a squirrel photo first!");
    return;
  }

  translateBtn.disabled = true;
  statusEl.textContent = "Asking OpenAI what the squirrel is thinking… 🐿️🧠";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch("http://localhost:3069/api/squirrel", {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Request failed");
    }

    const data = await res.json();
    renderResult(data);
    statusEl.textContent = "Translation complete ✨";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error: " + err.message;
    outputCard.innerHTML = `<p class="placeholder-text">Something went wrong asking the squirrel. Try again!</p>`;
  } finally {
    translateBtn.disabled = false;
  }
});

function renderResult(result) {
  const { mood, mainThought, sideThoughts, stats } = result;

  const safeSide = Array.isArray(sideThoughts) ? sideThoughts : [];
  const sideHtml = safeSide
    .map((t) => `<li class="output-side">• ${escapeHtml(t)}</li>`)
    .join("");

  outputCard.innerHTML = `
    <div class="output-mood">Mood: ${escapeHtml(mood || "vibing")}</div>
    <div class="output-main">“${escapeHtml(mainThought || "..." )}”</div>
    <ul>${sideHtml}</ul>
    <p class="output-stats">
      Hunger: ${(stats && stats.hunger) ?? "?"}% ·
      Chaos: ${(stats && stats.chaos) ?? "?"}% ·
      Friendliness: ${(stats && stats.friendliness) ?? "?"}%
    </p>
  `;
}

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
