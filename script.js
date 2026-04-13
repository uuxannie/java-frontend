const BACKEND_BASE_URL = "https://evergreen-box-backend.onrender.com/api";

const questionInput = document.getElementById("questionInput");
const summaryOutput = document.getElementById("summaryOutput");
const solutionOutput = document.getElementById("solutionOutput");

const summarizeBtn = document.getElementById("summarizeBtn");
const solveBtn = document.getElementById("solveBtn");
const copyBtn = document.getElementById("copyBtn");
const statusText = document.getElementById("statusText");

function setStatus(message) {
  statusText.textContent = message;
}

function setLoading(isLoading) {
  summarizeBtn.disabled = isLoading;
  solveBtn.disabled = isLoading;
}

async function summarizeQuestion() {
  const questionText = questionInput.value.trim();

  if (!questionText) {
    setStatus("Paste a question first.");
    return;
  }

  setLoading(true);
  setStatus("Summarizing...");
  summaryOutput.value = "";

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/java/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question_text: questionText })
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    summaryOutput.value = data.summary || "";
    setStatus("Summary ready.");
  } catch (error) {
    console.error(error);
    setStatus("Summarize failed.");
  } finally {
    setLoading(false);
  }
}

async function generateSolution() {
  const summaryText = summaryOutput.value.trim();

  if (!summaryText) {
    setStatus("Create or paste a summary first.");
    return;
  }

  setLoading(true);
  setStatus("Generating...");
  solutionOutput.value = "";

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/java/solve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ summary_text: summaryText })
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    solutionOutput.value = data.solution || "";
    setStatus("Code ready.");
  } catch (error) {
    console.error(error);
    setStatus("Generation failed.");
  } finally {
    setLoading(false);
  }
}

async function copySolution() {
  const text = solutionOutput.value.trim();

  if (!text) {
    setStatus("Nothing to copy.");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setStatus("Copied.");
  } catch (error) {
    console.error(error);
    setStatus("Copy failed.");
  }
}

summarizeBtn.addEventListener("click", summarizeQuestion);
solveBtn.addEventListener("click", generateSolution);
copyBtn.addEventListener("click", copySolution);