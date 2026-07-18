const auditQuestions = [
    { type: "text", q: "1. What is your name?", options: [] },
    { type: "choice", q: "2. How old are you?", options: ["20 to 30 years old", "31 to 40 years old", "41 to 50 years old"] },
    { type: "choice", q: "3. Where do you live?", options: ["India", "Abroad"] },
    { type: "choice", q: "4. How do you track monthly streaming apps and memberships?", options: ["I track every app manually on a spreadsheet.", "I use premium subscription manager tools to find deals.", "I just wait for the bank text message to tell me.", "I have no clue what apps are charging my card."] },
    { type: "choice", q: "5. What happens when you sign up for a free online trial?", options: ["I never sign up if they ask for my card details.", "I set an alarm to cancel it before the free week ends.", "I always forget to cancel it and end up paying."] },
    { type: "choice", q: "6. Why do you buy things online that you did not plan to buy?", options: ["I never buy online unless it is on my strict list.", "It was on sale, and I didn't want to miss the deal.", "I saw a friend or influencer talk about it."] },
    { type: "choice", q: "7. How do you pay for your daily small expenses?", options: ["Cash or debit card (seeing money leave helps me stop).", "Credit card (to collect reward points and cashback).", "Quick scan-and-pay phone apps (UPI, Apple Pay)."] },
    { type: "choice", q: "8. Where does most of your money secretly disappear?", options: ["My accounts are tightly locked down; nothing leaks.", "Buying items in bulk just because they are discounted.", "Small daily buys (snacks, food delivery, cab rides)."] },
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
    if (currentIndex === 0) collectedResponses.name = selectedText;
    if (currentIndex === 1) collectedResponses.age = selectedText;
    if (currentIndex === 2) collectedResponses.geo = selectedText;
    if (currentIndex === 3) collectedResponses.q4 = selectedText;
    if (currentIndex === 4) collectedResponses.q5 = selectedText;
    if (currentIndex === 5) collectedResponses.q6 = selectedText;
    if (currentIndex === 6) collectedResponses.q7 = selectedText;
    if (currentIndex === 7) collectedResponses.q8 = selectedText;
    if (currentIndex === 8) collectedResponses.q9 = selectedText;

    if (currentIndex >= 3) { 
        if (currentIndex === 3) {
            // Evaluates Question 4 options down to 1, 2, or 3 points
            if (choiceIndex === 0) totalAccumulatedScore += 1; 
            else if (choiceIndex === 1 || choiceIndex === 2) totalAccumulatedScore += 2; 
            else if (choiceIndex === 3) totalAccumulatedScore += 3; 
        } else {
            // Evaluates Questions 5-9 sequentially (Index 0 = 1pt, Index 1 = 2pt, Index 2 = 3pt)
            totalAccumulatedScore += (choiceIndex + 1); 
        }
    }
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
    const activeBox = document.querySelector(".active-persona-box");

    document.querySelectorAll(".matrix-row").forEach(el => el.className = "matrix-row");

            if (totalAccumulatedScore >= 5 && totalAccumulatedScore <= 8) {
        calculatedPersona = "The Defensive Saver";
        titleArea.innerText = "🛡️ " + calculatedPersona;
        
        descArea.innerHTML = `
            <div style="display: inline-flex; align-items: center; background: #0f172a; color: #ffffff; border-radius: 6px; padding: 5px 12px; font-size: 12px; font-weight: 600; margin-bottom: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); font-family: sans-serif;">
                <span style="color: #94a3b8; margin-right: 8px; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">PARTICIPANT</span>
                <span style="border-left: 1px solid #334155; height: 12px; margin-right: 8px;"></span>
                <span style="letter-spacing: 0.2px;">${collectedResponses.name}</span>
            </div>
            <p style="margin: 0; padding: 0; line-height: 1.5;">You maintain strict, manual control over your money to prevent hidden account leaks. You are completely safe from modern app traps, but you miss out on free rewards and cash back.</p>
        `;
        highlightMatrixBracket("bracket-guardian");
        if(activeBox) {
            activeBox.style.borderColor = "#6366f1";
            activeBox.style.boxShadow = "none";
            activeBox.style.backgroundColor = "#f5f3ff";
        }
    } else if (totalAccumulatedScore >= 9 && totalAccumulatedScore <= 11) {
        calculatedPersona = "The Strategic Spender";
        titleArea.innerText = "🏆 " + calculatedPersona;
        
        descArea.innerHTML = `
            <div style="display: inline-flex; align-items: center; background: #0f172a; color: #ffffff; border-radius: 6px; padding: 5px 12px; font-size: 12px; font-weight: 600; margin-bottom: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); font-family: sans-serif;">
                <span style="color: #94a3b8; margin-right: 8px; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">PARTICIPANT</span>
                <span style="border-left: 1px solid #334155; height: 12px; margin-right: 8px;"></span>
                <span style="letter-spacing: 0.2px;">${collectedResponses.name}</span>
            </div>
            <p style="margin: 0; padding: 0; line-height: 1.5;">You use modern tools strategically to collect points, cash back, and the best discounts. You enjoy the speed of tech platforms without letting them trick you into overspending.</p>
        `;
        highlightMatrixBracket("bracket-optimizer");
        if(activeBox) {
            activeBox.style.borderColor = "#10b981";
            activeBox.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.15)";
            activeBox.style.backgroundColor = "#f0fdf4";
        }
    } else {
        calculatedPersona = "The Instant Buyer";
        titleArea.innerText = "🎯 " + calculatedPersona;
        
        descArea.innerHTML = `
            <div style="display: inline-flex; align-items: center; background: #0f172a; color: #ffffff; border-radius: 6px; padding: 5px 12px; font-size: 12px; font-weight: 600; margin-bottom: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); font-family: sans-serif;">
                <span style="color: #94a3b8; margin-right: 8px; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">PARTICIPANT</span>
                <span style="border-left: 1px solid #334155; height: 12px; margin-right: 8px;"></span>
                <span style="letter-spacing: 0.2px;">${collectedResponses.name}</span>
            </div>
            <p style="margin: 0; padding: 0; line-height: 1.5;">You are highly vulnerable to one-click checkouts, instant scanning apps, and targeted social media ads. Your money disappears quickly because tech platforms make spending completely effortless.</p>
        `;
        highlightMatrixBracket("bracket-target");
        if(activeBox) {
            activeBox.style.borderColor = "#ef4444";
            activeBox.style.boxShadow = "none";
            activeBox.style.backgroundColor = "#fdf2f2";
        }
    }

            // INJECT THE NEW SPENDING RISK REPORT CARD WITH CHOICE TEXTS
        // INJECT THE NEW SPENDING RISK REPORT CARD WITH CHOSEN HEADINGS
    let graphDashboard = document.getElementById("spending-risk-report-card");
    if (!graphDashboard) {
        graphDashboard = document.createElement("div");
        graphDashboard.id = "spending-risk-report-card";
        graphDashboard.className = "analytics-dashboard";
        graphDashboard.style.background = "#0f172a";
        graphDashboard.style.color = "#ffffff";
        graphDashboard.style.padding = "25px";
        graphDashboard.style.borderRadius = "12px";
        graphDashboard.style.marginTop = "25px";
        graphDashboard.style.fontFamily = "sans-serif";
        graphDashboard.style.border = "1px solid #1e293b";
        
        graphDashboard.innerHTML = `
            <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #1e293b; padding-bottom: 12px; display: flex; align-items: center; gap: 8px; color: #ffffff;">📊 Your Spending Risk Report</h3>
            
            <div class="visual-bar-group" style="margin-bottom: 24px;">
                <div class="bar-label" style="font-weight: 700; font-size: 14px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; color: #ffffff;">🛒 Fast Buying Risk</div>
                <div style="font-size: 12.5px; color: #94a3b8; margin-bottom: 10px; line-height: 1.4;">Shows how easily quick phone apps and online ads trick you into buying things instantly. A high number means you spend too fast without thinking.</div>
                <div class="mock-bar" style="background: #1e293b; border-radius: 6px; overflow: hidden; height: 24px;">
                    <div id="india-bar" class="fill-bar" style="background: #6366f1; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; transition: width 0.8s ease-out; width: 0%;">0%</div>
                </div>
            </div>

            <div class="visual-bar-group">
                <div class="bar-label" style="font-weight: 700; font-size: 14px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; color: #ffffff;">💸 Hidden Bill Leak</div>
                <div style="font-size: 12.5px; color: #94a3b8; margin-bottom: 10px; line-height: 1.4;">Tracks if you are wasting cash on forgotten apps or free trials every month. A low number means your monthly bills are perfectly safe and locked down.</div>
                <div class="mock-bar" style="background: #1e293b; border-radius: 6px; overflow: hidden; height: 24px;">
                    <div id="global-bar" class="fill-bar" style="background: #10b981; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; transition: width 0.8s ease-out; width: 0%;">0%</div>
                </div>
            </div>
        `;
        
        const resultWrapper = document.getElementById("audit-result");
        if (resultWrapper) {
            resultWrapper.appendChild(graphDashboard);
        }
    }



        let paymentVulnerabilityIndex = Math.round((totalAccumulatedScore / 15) * 100);
    let subscriptionLeakIndex = 30; 
    
    // Checks if the user selected the high-risk option for Q4
    if (collectedResponses.q4 === "I have no clue what apps are charging my card.") {
        subscriptionLeakIndex += 35;
    }
    // Checks if the user selected the high-risk option for Q5
    if (collectedResponses.q5 === "I always forget to cancel it and end up paying.") {
        subscriptionLeakIndex += 35;
    }
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

    let solutionBox = document.getElementById("dynamic-solutions-box");
    if (!solutionBox) {
        solutionBox = document.createElement("div");
        solutionBox.id = "dynamic-solutions-box";
        solutionBox.className = "active-persona-box";
        solutionBox.style.marginTop = "25px";
        solutionBox.style.backgroundColor = "#ffffff";
        solutionBox.style.borderWidth = "2px";
        solutionBox.style.borderStyle = "solid";
        solutionBox.style.borderRadius = "8px";
        solutionBox.style.padding = "25px";
        
        solutionBox.innerHTML = `
            <h2 id="solution-heading" style="font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">🔍 Personal Risk Breakdown & Action Plan</h2>
            <div id="solution-content-area" style="font-size: 14.5px; color: #334155; display: flex; flex-direction: column; gap: 15px;"></div>
        `;
        
        const resetBtn = document.querySelector(".reset-btn");
        if (resetBtn && resetBtn.parentNode) {
            resetBtn.parentNode.insertBefore(solutionBox, resetBtn);
        }
    }

    const solutionHeading = document.getElementById("solution-heading");
    const solutionContent = document.getElementById("solution-content-area");

    if (solutionContent && solutionHeading) {
        let explanationText = "";
        let actionSteps = "";

        if (paymentVulnerabilityIndex >= 70) {
            explanationText += `<p>🚨 <strong>What's happening (Payment Index: ${paymentVulnerabilityIndex}%):</strong> Your guard is completely down against smooth digital payment pathways. Because quick one-click checkouts, UPI scans, and saved cards remove all physical friction, your brain bypasses financial reflection, driving high impulse spending.</p>`;
            actionSteps += `<li><strong>Add deliberate friction:</strong> Delete saved credit cards from your Amazon and food delivery apps so you have to type them out every single time.</li>`;
        } else {
            explanationText += `<p>✅ <strong>What's happening (Payment Index: ${paymentVulnerabilityIndex}%):</strong> You maintain solid mental checkpoints over your payment channels and rarely fall victim to impulse checkout buttons or emotional spending triggers.</p>`;
        }

        if (subscriptionLeakIndex >= 60) {
            explanationText += `<p>⚠️ <strong>What's happening (Leakage Index: ${subscriptionLeakIndex}%):</strong> Your wallet is experiencing silent financial bleeding. Tech companies are capitalising on your forgetfulness by locking you into automated billing trial loops for digital tools you aren't actively using.</p>`;
            actionSteps += `<li><strong>Run a leak audit:</strong> Open your banking app right now, list every transaction under ₹500, and cancel at least two streaming/app accounts you haven't opened this week.</li>`;
        } else {
            explanationText += `<p>🛡️ <strong>What's happening (Leakage Index: ${subscriptionLeakIndex}%):</strong> Your recurring subscription management is exceptionally clean. You actively intercept trial loops and keep your cash securely locked within your own boundaries.</p>`;
        }

        if (actionSteps !== "") {
            solutionHeading.innerText = "🚨 Identified Budget Leaks & Quick Solutions";
            solutionHeading.style.color = "#ef4444";
            solutionBox.style.borderColor = "#ef4444";
            solutionBox.style.backgroundColor = "#fffdfd";
            
            solutionContent.innerHTML = explanationText + `
                <div style="background: #fff5f5; padding: 15px; border-radius: 6px; border-left: 4px solid #ef4444; margin-top: 10px;">
                    <strong style="color: #991b1b; display: block; margin-bottom: 8px;">🛠️ Immediate Corrections Required:</strong>
                    <ul style="margin-left: 20px; display: flex; flex-direction: column; gap: 8px; padding-left: 5px;">
                        ${actionSteps}
                    </ul>
                </div>
            `;
        } else {
            solutionHeading.innerText = "🏆 Premium Financial Profile Maintained";
            solutionHeading.style.color = "#10b981";
            solutionBox.style.borderColor = "#10b981";
            solutionBox.style.backgroundColor = "#f0fdf4";
            
            solutionContent.innerHTML = explanationText + `
                <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981; margin-top: 10px;">
                    <strong style="color: #065f46; display: block;">💡 Pro Tip to Maintain This Excellence:</strong>
                    <p style="color: #065f46; margin-top: 5px; font-size: 13.5px;">Keep leveraging reward tools and points optimization systems, but ensure you schedule a single 10-minute automated baseline review every quarter to keep things tight.</p>
                </div>
            `;
        }
    }
    // =========================================================================

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
    
    const oldSolutionBox = document.getElementById("dynamic-solutions-box");
    if (oldSolutionBox) { oldSolutionBox.remove(); }

    const oldGraphDashboard = document.getElementById("spending-risk-report-card");
    if (oldGraphDashboard) { oldGraphDashboard.remove(); }

    
    document.getElementById("audit-result").classList.add("hidden");
    document.getElementById("audit-intro").classList.remove("hidden");
}

function dispatchFormToBackend(personaString) {
    const formId = "1FAIpQLScwuRgP27tLBrOs8Swhg8k-s4b0gy-Zz5NSsLCC2z2SBJqcwA"; 
    const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

        // Use URLSearchParams for application/x-www-form-urlencoded encoding
    const params = new URLSearchParams();
   params.append("entry.2108368405", String(collectedResponses.name || collectedResponses.q1 || ""));   
    params.append("entry.48214385", String(collectedResponses.age || collectedResponses.q2 || ""));     
    params.append("entry.1777157549", String(collectedResponses.geo || collectedResponses.q3 || ""));   
    
    // Audit questions: Smart-matches either sequential or shifted question numbering
    params.append("entry.1931755500", String(collectedResponses.q4 || collectedResponses.q1 || ""));    
    params.append("entry.533743517", String(collectedResponses.q5 || collectedResponses.q2 || ""));     
    params.append("entry.598789064", String(collectedResponses.q6 || collectedResponses.q3 || ""));     
    params.append("entry.1058348873", String(collectedResponses.q7 || collectedResponses.q4 || ""));    
    params.append("entry.778956994", String(collectedResponses.q8 || collectedResponses.q5 || ""));     
    params.append("entry.1061432342", String(collectedResponses.q9 || collectedResponses.q6 || ""));    

    fetch(formUrl, { 
        method: "POST", 
        mode: "no-cors", 
        body: params // Fetch automatically sets the correct Content-Type for URLSearchParams
    })
    .then(() => console.log("Google Sheet synchronized smoothly!"))
    .catch((error) => console.error("Pipeline upload error:", error));
}
