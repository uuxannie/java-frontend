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
    setStatus("Please paste a Java question first.");
    return;
  }

  setLoading(true);
  setStatus("Summarizing question...");
  summaryOutput.value = "";
  solutionOutput.textContent = "Your Java solution will appear here...";

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
    setStatus("Summary generated.");
  } catch (error) {
    console.error(error);
    setStatus("Failed to summarize the question.");
  } finally {
    setLoading(false);
  }
}

async function generateSolution() {
  const summaryText = summaryOutput.value.trim();

  if (!summaryText) {
    setStatus("Please generate or paste a summary first.");
    return;
  }

  setLoading(true);
  setStatus("Generating Java solution...");
  solutionOutput.textContent = "Generating solution...";

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
    solutionOutput.textContent = data.solution || "No solution returned.";
    setStatus("Java solution generated.");
  } catch (error) {
    console.error(error);
    solutionOutput.textContent = "Failed to generate solution.";
    setStatus("Failed to generate the Java solution.");
  } finally {
    setLoading(false);
  }
}

async function copySolution() {
  const text = solutionOutput.textContent.trim();

  if (!text || text === "Your Java solution will appear here..." || text === "Generating solution...") {
    setStatus("There is no solution to copy yet.");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setStatus("Solution copied to clipboard.");
  } catch (error) {
    console.error(error);
    setStatus("Failed to copy the solution.");
  }
}

summarizeBtn.addEventListener("click", summarizeQuestion);
solveBtn.addEventListener("click", generateSolution);
copyBtn.addEventListener("click", copySolution);