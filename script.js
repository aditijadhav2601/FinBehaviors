const auditQuestions = [
    { type: "text", q: "1. What is your name?", options: [] },
    { type: "choice", q: "2. How old are you?", options: ["20 to 30 years old", "31 to 40 years old", "41 to 50 years old"] },
    { type: "choice", q: "3. Where do you live?", options: ["India", "Outside India (Abroad)"] },
    { type: "choice", q: "4. How do you track monthly streaming apps and memberships?", options: ["I use a list or spreadsheet to track payments.", "I wait for the bank text message to tell me.", "I have no idea how many apps are charging me."] },
    { type: "choice", q: "5. What happens when you sign up for a free online trial?", options: ["I set an alarm to cancel it before the free week ends.", "I always forget to cancel it and end up paying.", "I never sign up if they ask for my card details."] },
    { type: "choice", q: "6. Why do you buy things online that you did not plan to buy?", options: ["I saw a friend or influencer talk about it.", "It was on sale, and I didn't want to miss the deal.", "I was bored and scrolling social media ads."] },
    { type: "choice", q: "7. How do you pay for your daily small expenses?", options: ["Cash or debit card (seeing money leave helps me stop).", "Credit card (to collect reward points and cashback).", "Quick scan-and-pay phone apps (UPI, Apple Pay)."] },
    { type: "choice", q: "8. Where does most of your money secretly disappear?", options: ["Apps or video accounts that I don't even open.", "Buying items in bulk just because they are discounted.", "Small daily buys (snacks, food delivery, cab rides)."] },
    { type: "choice", q: "9. What do you do with items left in your shopping cart?", options: ["I close the app and completely forget about them.", "I leave them there hoping the store sends a discount.", "I buy them immediately because I can't stop thinking about it."] }
];

let currentIndex = 0;
let totalAccumulatedScore = 0;
let collectedResponses = { name: "", age: "", geo: "", q4: "", q5: "", q6: "", q7: "", q8: "", q9: "" };

function startAudit() {
    document.getElementById("audit-intro").classList.add("hidden");
    document.getElementById("audit-card").classList.remove("hidden");
    currentIndex = 0;
    totalAccumulatedScore = 0;
    renderMetric();
}

function renderMetric() {
    const questionNode = auditQuestions[currentIndex];
    const textContainer = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const indicator = document.getElementById("progress-indicator");
    const indexDisplay = document.getElementById("current-index-display");

    indexDisplay.innerText = currentIndex + 1;
    indicator.style.width = `${(currentIndex / auditQuestions.length) * 100}%`;
    textContainer.innerText = questionNode.q;
    optionsContainer.innerHTML = "";

    if (questionNode.type === "text") {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter your name...";
        input.className = "audit-input";
        input.id = "audit-name-field";
        
        const continueBtn = document.createElement("button");
        continueBtn.className = "btn";
        continueBtn.innerText = "Initialize Audit Tracking";
        continueBtn.onclick = () => {
            const entryValue = document.getElementById("audit-name-field").value.trim();
            const finalName = entryValue ? entryValue : "Anonymous Participant";
            // FIXED: Triggers data validation tracking loop for Name immediately 
            saveStepMetrics(finalName, 0);
        };
        optionsContainer.appendChild(input);
        optionsContainer.appendChild(continueBtn);
    } else {
        questionNode.options.forEach((optionText, choiceIndex) => {
            const optionBtn = document.createElement("button");
            optionBtn.className = "option-btn";
            optionBtn.innerText = optionText;
            optionBtn.onclick = () => saveStepMetrics(optionText, choiceIndex);
            optionsContainer.appendChild(optionBtn);
        });
    }
}

function saveStepMetrics(selectedText, choiceIndex) {
    // FIXED: Chronological index array alignment maps inputs accurately without skipping fields
    if (currentIndex === 0) collectedResponses.name = selectedText;
    if (currentIndex === 1) collectedResponses.age = selectedText;
    if (currentIndex === 2) collectedResponses.geo = selectedText;
    if (currentIndex === 3) collectedResponses.q4 = selectedText;
    if (currentIndex === 4) collectedResponses.q5 = selectedText;
    if (currentIndex === 5) collectedResponses.q6 = selectedText;
    if (currentIndex === 6) collectedResponses.q7 = selectedText;
    if (currentIndex === 7) collectedResponses.q8 = selectedText;
    if (currentIndex === 8) collectedResponses.q9 = selectedText;

    if (currentIndex >= 3) { totalAccumulatedScore += (choiceIndex + 1); }
    progressAudit();
}

function progressAudit() {
    currentIndex++;
    if (currentIndex < auditQuestions.length) { renderMetric(); } 
    else { compileInsightsDashboard(); }
}

function compileInsightsDashboard() {
    document.getElementById("audit-card").classList.add("hidden");
    document.getElementById("audit-result").classList.remove("hidden");
    document.getElementById("progress-indicator").style.width = "100%";
    document.getElementById("user-score-display").innerText = totalAccumulatedScore;

    const titleArea = document.getElementById("persona-title-area");
    const descArea = document.getElementById("persona-desc-area");
    let calculatedPersona = "The Algorithmic Target";

    document.querySelectorAll(".matrix-row").forEach(el => el.className = "matrix-row");

    if (totalAccumulatedScore >= 5 && totalAccumulatedScore <= 8) {
        calculatedPersona = "The Financial Guardian";
        titleArea.innerText = "🛡️ " + calculatedPersona;
        descArea.innerText = `Subject Profile: ${collectedResponses.name}. You maintain strict, conscious boundaries with your capital. You resist impulse digital upgrades and closely monitor automated account leaks.`;
        highlightMatrixBracket("bracket-guardian");
    } else if (totalAccumulatedScore >= 9 && totalAccumulatedScore <= 11) {
        calculatedPersona = "The Value Optimizer";
        titleArea.innerText = "🏆 " + calculatedPersona;
        descArea.innerText = `Subject Profile: ${collectedResponses.name}. You treat personal finance strategically. You track metrics, maximize credit rewards, and consciously balance modern convenience with savings.`;
        highlightMatrixBracket("bracket-optimizer");
    } else {
        calculatedPersona = "The Algorithmic Target";
        titleArea.innerText = "🎯 " + calculatedPersona;
        descArea.innerText = `Subject Profile: ${collectedResponses.name}. Frictionless tech platforms easily catch your budget. Digital wallets, automated trials, and hyper-targeted loops deeply influence your daily cash flow.`;
        highlightMatrixBracket("bracket-target");
    }

    let paymentVulnerabilityIndex = Math.round((totalAccumulatedScore / 15) * 100);
    let subscriptionLeakIndex = 30; 
    if (collectedResponses.q4 === "I have no idea how many apps are charging me.") subscriptionLeakIndex += 35;
    if (collectedResponses.q5 === "I always forget to cancel it and end up paying.") subscriptionLeakIndex += 35;
    if (subscriptionLeakIndex > 100) subscriptionLeakIndex = 100;

    const indiaBarElement = document.getElementById("india-bar");
    const globalBarElement = document.getElementById("global-bar");

    if(indiaBarElement && globalBarElement) {
        setTimeout(() => {
            indiaBarElement.style.width = paymentVulnerabilityIndex + "%";
            indiaBarElement.innerText = paymentVulnerabilityIndex + "%";
            globalBarElement.style.width = subscriptionLeakIndex + "%";
            globalBarElement.innerText = subscriptionLeakIndex + "%";
        }, 150);
    }
    dispatchFormToBackend(calculatedPersona);
}

function highlightMatrixBracket(targetId) {
    document.querySelectorAll(".matrix-row").forEach(el => {
        if (el.id === targetId) el.classList.add("selected-bracket");
        else el.classList.add("dimmed-bracket");
    });
}

function resetAudit() {
    currentIndex = 0;
    totalAccumulatedScore = 0;
    collectedResponses = { name: "", age: "", geo: "", q4: "", q5: "", q6: "", q7: "", q8: "", q9: "" };
    document.getElementById("progress-indicator").style.width = "0%";
    document.getElementById("india-bar").style.width = "0%";
    document.getElementById("global-bar").style.width = "0%";
    document.querySelectorAll(".matrix-row").forEach(el => el.className = "matrix-row");
    document.getElementById("audit-result").classList.add("hidden");
    document.getElementById("audit-intro").classList.remove("hidden");
}

function dispatchFormToBackend(personaString) {
    const formId = "1FAIpQLScwuRgP27tLBrOs8Swhg8k-s4b0gy-Zz5NSsLCC2z2SBJqcwA"; 
    const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

        // Use URLSearchParams for application/x-www-form-urlencoded encoding
    const params = new URLSearchParams();
    params.append("entry.1931755500", String(collectedResponses.q1 || ""));    
    params.append("entry.533743517", String(collectedResponses.q2 || ""));     
    params.append("entry.598789064", String(collectedResponses.q3 || ""));     
    params.append("entry.1058348873", String(collectedResponses.q4 || ""));    
    params.append("entry.778956994", String(collectedResponses.q5 || ""));     
    params.append("entry.1061432342", String(collectedResponses.q6 || ""));    

    fetch(formUrl, { 
        method: "POST", 
        mode: "no-cors", 
        body: params // Fetch automatically sets the correct Content-Type for URLSearchParams
    })
    .then(() => console.log("Google Sheet synchronized smoothly!"))
    .catch((error) => console.error("Pipeline upload error:", error));
}
