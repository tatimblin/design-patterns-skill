type Theme = "light" | "dark";

function createButton(theme: Theme, label: string) {
  if (theme === "light") {
    return { label, bg: "#ffffff", color: "#000000", border: "1px solid #ccc" };
  } else {
    return { label, bg: "#1e1e1e", color: "#ffffff", border: "1px solid #555" };
  }
}

function createCheckbox(theme: Theme, checked: boolean) {
  if (theme === "light") {
    return { checked, fill: "#ffffff", checkColor: "#0066ff", border: "1px solid #aaa" };
  } else {
    return { checked, fill: "#2a2a2a", checkColor: "#66bbff", border: "1px solid #666" };
  }
}

function createModal(theme: Theme, title: string) {
  if (theme === "light") {
    return { title, bg: "#ffffff", overlay: "rgba(0,0,0,0.3)", shadow: "0 2px 8px rgba(0,0,0,0.15)" };
  } else {
    return { title, bg: "#2d2d2d", overlay: "rgba(0,0,0,0.7)", shadow: "0 2px 8px rgba(0,0,0,0.5)" };
  }
}

// --- run ---
const submitBtn = createButton("dark", "Submit");
const agreeBox = createCheckbox("light", false);
const confirmDialog = createModal("dark", "Confirm Action");

console.log("[Button]", submitBtn);
console.log("[Checkbox]", agreeBox);
console.log("[Modal]", confirmDialog);
console.log("Mixed themes in one view — no consistency guarantee.");
