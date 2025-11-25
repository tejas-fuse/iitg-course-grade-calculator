// Configuration based on uploaded PDFs
const courses = {
    da101: {
        pt: [20, 20, 20, 20, 20, 20], // Assuming PT6 is 20 like others
        nt: [10, 10, 10, 10, 10, 10]
    },
    da102: {
        pt: [10, 10, 10, 10, 10, 10],
        nt: [10, 10, 10, 10, 10, 10]
    },
    da103: {
        pt: [10, 10, 10, 10, 10, 10],
        nt: [4, 10, 10, 10, 10, 10] // NPT1 was 4 in PDF
    },
    da104: {
        pt: [15, 15, 20, 20, 20, 20], // Mixed Max Marks
        nt: [20, 20, 20, 20, 20, 20]
    },
    custom: {
        pt: [100, 100, 100, 100, 100, 100],
        nt: [100, 100, 100, 100, 100, 100]
    }
};

const gradingScale = [
    { grade: 'AA', min: 90, point: 10 },
    { grade: 'AB', min: 80, point: 9 },
    { grade: 'BB', min: 70, point: 8 },
    { grade: 'BC', min: 60, point: 7 },
    { grade: 'CC', min: 50, point: 6 },
    { grade: 'CD', min: 40, point: 5 },
    { grade: 'DD', min: 30, point: 4 },
    { grade: 'F',  min: 0,  point: 0 }
];

let marksChart = null;

function init() {
    loadCourseData();
}

function loadCourseData() {
    const courseKey = document.getElementById('courseSelect').value;
    const config = courses[courseKey];
    renderInputs('pt', config.pt);
    renderInputs('nt', config.nt);
    document.getElementById('result-section').style.display = 'none';
}

function renderInputs(type, maxMarksArray) {
    const container = document.getElementById(`${type}-inputs`);
    container.innerHTML = '';
    
    maxMarksArray.forEach((max, index) => {
        const num = index + 1;
        const label = type.toUpperCase() + ' ' + num;
        
        // Check if this is PT6 to add special instructions
        const isPT6 = (type === 'pt' && index === 5);
        const idAttr = isPT6 ? 'id="pt6-input"' : '';
        
        // Customize placeholder and helper text for PT6
        const placeholder = isPT6 ? "If released" : "Obtained";
        const helperText = isPT6 ? `<div style="font-size: 0.75em; color: #e67e22; margin-top: 4px; font-weight:500;">Only enter if marks are declared</div>` : '';
        
        const html = `
            <div class="input-row" style="${isPT6 ? 'align-items:flex-start' : ''}">
                <label style="${isPT6 ? 'padding-top:10px' : ''}">${label}</label>
                <div style="flex:1">
                    <div class="input-wrapper">
                        <input type="number" class="${type}-score" ${idAttr} min="0" max="${max}" placeholder="${placeholder}" data-max="${max}">
                        <span class="max-mark-label">/ ${max}</span>
                    </div>
                    ${helperText}
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

function getScoreData(type) {
    const inputs = document.querySelectorAll(`.${type}-score`);
    let data = [];
    
    inputs.forEach(input => {
        const val = input.value === '' ? null : parseFloat(input.value);
        const max = parseFloat(input.dataset.max);
        
        // Calculate percentage for this specific test
        // If value is null (not entered), percentage is 0 for ranking purposes
        const percent = val !== null ? (val / max) * 100 : 0;
        
        data.push({
            obtained: val, // Keep raw value (can be null)
            max: max,
            percent: percent,
            isFilled: val !== null
        });
    });
    return data;
}

function calculateBest5Avg(scoreDataArray) {
    // Clone to sort without affecting original order
    let sorted = [...scoreDataArray].sort((a, b) => b.percent - a.percent);
    let best5 = sorted.slice(0, 5);
    
    let sumPercent = best5.reduce((sum, item) => sum + item.percent, 0);
    return sumPercent / 5;
}

function determineGrade(percent) {
    for (let g of gradingScale) {
        if (percent >= g.min) return g;
    }
    return gradingScale[gradingScale.length - 1];
}

function calculate() {
    const ptData = getScoreData('pt');
    const ntData = getScoreData('nt');

    // 1. Basic Calculation
    const avgBest5PT = calculateBest5Avg(ptData);
    const avgBest5NT = calculateBest5Avg(ntData);

    const ptContrib = avgBest5PT * 0.9;
    const ntContrib = avgBest5NT * 0.1;
    const totalPercent = ptContrib + ntContrib;

    const currentGrade = determineGrade(totalPercent);

    // 2. Update UI Results
    document.getElementById('res-percent').innerText = totalPercent.toFixed(2) + '%';
    document.getElementById('res-grade').innerText = currentGrade.grade;
    document.getElementById('res-pointer').innerText = currentGrade.point;

    document.getElementById('td-pt-avg').innerText = avgBest5PT.toFixed(2) + '%';
    document.getElementById('td-nt-avg').innerText = avgBest5NT.toFixed(2) + '%';
    document.getElementById('td-pt-contrib').innerText = ptContrib.toFixed(2);
    document.getElementById('td-nt-contrib').innerText = ntContrib.toFixed(2);
    document.getElementById('td-total').innerText = totalPercent.toFixed(2);

    // 3. PT6 Prediction Logic
    const pt6Input = document.getElementById('pt6-input');
    const pt6Max = parseFloat(pt6Input.dataset.max);
    
    // Only run prediction if PT6 is empty
    if (pt6Input.value === '') {
        runPT6Prediction(ptData, ntContrib, currentGrade, pt6Max);
    } else {
        document.getElementById('pt6-analysis').innerHTML = `<h4>Status: Final</h4><p>You have entered a score for PT6. The results above are your final calculated grades.</p>`;
        document.getElementById('pt6-analysis').className = 'analysis-box';
    }

    // 4. Update Chart
    updateChart(ptData, ntData);
    document.getElementById('result-section').style.display = 'block';
}

function runPT6Prediction(currentPTData, ntContrib, currentGrade, pt6Max) {
    // Find next grade
    const currentIndex = gradingScale.findIndex(g => g.grade === currentGrade.grade);
    const box = document.getElementById('pt6-analysis');
    
    if (currentIndex === 0) {
        // Already AA
        box.innerHTML = `<h4>🎉 Excellent!</h4><p>You are already at the highest grade (AA). Even with 0 in PT6, check if you maintain it.</p>`;
        box.className = 'analysis-box';
        return;
    }

    const nextGrade = gradingScale[currentIndex - 1];
    const targetTotal = nextGrade.min;

    // We need: (NewPTAvg * 0.9) + ntContrib >= targetTotal
    // NewPTAvg >= (targetTotal - ntContrib) / 0.9
    const neededPTAvg = (targetTotal - ntContrib) / 0.9;

    // Simulation:
    // We have 5 existing PT scores (excluding PT6 since it's empty/0).
    // To maximize average, PT6 must replace the LOWEST of the top 5, 
    // OR if we only have 5 valid scores, it acts as the 6th and we drop the lowest of the 6.
    
    // Let's take the best 5 from the first 5 exams.
    // Actually, we need to solve:
    // sum(Best4_Current_Percents) + PT6_Percent >= neededPTAvg * 5
    
    // Get all percents except PT6
    let existingPercents = currentPTData.slice(0, 5).map(d => d.percent).sort((a,b) => b-a); // Sort Desc
    
    // Sum of top 4 existing
    let sumTop4 = existingPercents.slice(0, 4).reduce((a,b) => a+b, 0);
    
    // Equation: (sumTop4 + PT6_Percent) / 5 = neededPTAvg
    // PT6_Percent = (neededPTAvg * 5) - sumTop4
    
    let requiredPercent = (neededPTAvg * 5) - sumTop4;
    let requiredRaw = (requiredPercent / 100) * pt6Max;

    // Validation
    // If the required percent is lower than the 5th best score we already have,
    // then PT6 won't even count in the top 5 (unless it replaces a lower one).
    // However, if we need to IMPROVE, PT6 usually needs to be high.

    let msg = "";
    let cssClass = "analysis-box";

    if (requiredRaw > pt6Max) {
        msg = `<h4>🚀 Target: ${nextGrade.grade}</h4>
               <p>Unfortunately, it is mathematically impossible to reach <strong>${nextGrade.grade}</strong>. 
               Even with ${pt6Max}/${pt6Max} in PT6, your max possible average falls short.</p>`;
        cssClass = "analysis-box warning";
    } else if (requiredRaw <= 0) {
         msg = `<h4>🚀 Target: ${nextGrade.grade}</h4>
               <p>You are very close! You are practically guaranteed to reach <strong>${nextGrade.grade}</strong> provided your NT scores hold up.</p>`;
    } else {
        msg = `<h4>🚀 Target: ${nextGrade.grade}</h4>
               <p>To upgrade from <strong>${currentGrade.grade}</strong> to <strong>${nextGrade.grade}</strong>, you need to score at least:</p>
               <p style="font-size: 1.5em; font-weight:bold; color: var(--accent); margin:5px 0;">
                 ${Math.ceil(requiredRaw)} / ${pt6Max} 
                 <span style="font-size:0.6em; color:#666; font-weight:normal;">(approx ${requiredPercent.toFixed(1)}%)</span>
               </p>
               <p>This score will replace your lowest PT in the calculation.</p>`;
    }

    box.innerHTML = msg;
    box.className = cssClass;
}

function updateChart(ptData, ntData) {
    const ctx = document.getElementById('marksChart').getContext('2d');
    const ptPercents = ptData.map(d => d.percent);
    const ntPercents = ntData.map(d => d.percent);

    if (marksChart) marksChart.destroy();

    marksChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5', '6'],
            datasets: [
                {
                    label: 'PT Performance (%)',
                    data: ptPercents,
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: '#2980b9',
                    borderWidth: 1
                },
                {
                    label: 'NPT Performance (%)',
                    data: ntPercents,
                    backgroundColor: 'rgba(46, 204, 113, 0.7)',
                    borderColor: '#27ae60',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, max: 100, title: {display: true, text: 'Percentage Scored'} }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.raw.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    });
}

// Initialize
window.onload = init;
