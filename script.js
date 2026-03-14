// Elderly Mobility Scale Calculator
const form = document.getElementById('emsForm');
const calculateBtn = document.getElementById('calculateBtn');
const printBtn = document.getElementById('printBtn');
const resultsSection = document.getElementById('resultsSection');

// Set today's date in the assessment date field
document.getElementById('assessmentDate').valueAsDate = new Date();

// Calculate button click event
calculateBtn.addEventListener('click', calculateScore);

// Print button click event
printBtn.addEventListener('click', () => {
    window.print();
});

// Reset form event
form.addEventListener('reset', () => {
    resultsSection.classList.add('hidden');
});

function calculateScore() {
    // Validate patient name
    const patientName = document.getElementById('patientName').value.trim();
    if (!patientName) {
        alert('Please enter patient name');
        return;
    }

    // Collect scores
    const scores = [];
    let totalScore = 0;
    let allAnswered = true;

    for (let i = 1; i <= 7; i++) {
        const selectedRadio = document.querySelector(`input[name="item${i}"]:checked`);
        
        if (!selectedRadio) {
            allAnswered = false;
            break;
        }

        const score = parseInt(selectedRadio.value);
        scores.push(score);
        totalScore += score;
    }

    // Validate all items answered
    if (!allAnswered) {
        alert('Please answer all assessment items');
        return;
    }

    // Display results
    displayResults(totalScore, scores);
}

function displayResults(totalScore, scores) {
    // Patient information
    const patientName = document.getElementById('patientName').value;
    const patientAge = document.getElementById('patientAge').value || 'Not specified';
    const assessmentDate = document.getElementById('assessmentDate').value;

    // Format date
    const dateObj = new Date(assessmentDate + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Update result fields
    document.getElementById('resultPatientName').textContent = patientName;
    document.getElementById('resultAge').textContent = patientAge;
    document.getElementById('resultDate').textContent = formattedDate;

    // Update detailed scores
    for (let i = 0; i < scores.length; i++) {
        document.getElementById(`score${i + 1}`).textContent = scores[i];
    }

    // Update totals
    document.getElementById('totalScore').textContent = totalScore;
    document.getElementById('tableTotal').textContent = totalScore;

    // Interpretation and recommendations
    const interpretationBox = document.getElementById('interpretationBox');
    const recommendationsBox = document.getElementById('recommendationsBox');

    let interpretation = '';
    let recommendations = '';
    let boxClass = '';

    if (totalScore >= 14) {
        interpretation = `<strong>Score: ${totalScore} (14-20 range)</strong><br><br>
            <strong>Interpretation:</strong> Patient is INDEPENDENT in basic activities of daily living (ADLs). 
            The patient demonstrates good mobility and functional independence. Generally safe at home with minimal support needed.`;
        
        recommendations = `
            <ul style="margin-left: 20px;">
                <li>✓ Patient is able to manage most daily activities independently</li>
                <li>✓ Continue current exercise and activity level</li>
                <li>✓ Fall prevention strategies: maintain balance exercises</li>
                <li>✓ Regular monitoring recommended (every 3-6 months)</li>
                <li>✓ Encourage continued physical activity to maintain independence</li>
            </ul>
        `;
        boxClass = 'low';
    } else if (totalScore >= 10) {
        interpretation = `<strong>Score: ${totalScore} (10-13 range)</strong><br><br>
            <strong>Interpretation:</strong> Patient has BORDERLINE MOBILITY AND INDEPENDENCE. 
            Some assistance is required for certain activities. The patient may be at increased risk of falls and loss of independence.`;
        
        recommendations = `
            <ul style="margin-left: 20px;">
                <li>⚠ Moderate supervision and assistance recommended</li>
                <li>⚠ Intensive physiotherapy assessment and intervention</li>
                <li>⚠ Fall prevention program: environmental modifications</li>
                <li>⚠ Assistive devices may be beneficial (cane, walker)</li>
                <li>⚠ Monitor closely for functional decline (monthly assessment)</li>
                <li>⚠ Consider occupational therapy evaluation</li>
                <li>⚠ Home safety assessment recommended</li>
            </ul>
        `;
        boxClass = 'high';
    } else {
        interpretation = `<strong>Score: ${totalScore} (Below 10)</strong><br><br>
            <strong>Interpretation:</strong> Patient is DEPENDENT and requires SIGNIFICANT ASSISTANCE for basic mobility and ADLs. 
            High risk for falls and complications. Consideration for long-term care or intensive support may be necessary.`;
        
        recommendations = `
            <ul style="margin-left: 20px;">
                <li>🔴 Requires substantial supervision and physical assistance</li>
                <li>🔴 Specialized care environment may be appropriate (assisted living, nursing home)</li>
                <li>🔴 Intensive rehabilitation program recommended</li>
                <li>🔴 Comprehensive fall prevention protocol required</li>
                <li>🔴 Assistive devices and mobility aids essential</li>
                <li>🔴 Regular medical assessment for complications</li>
                <li>🔴 Caregiver training and support essential</li>
                <li>🔴 Nutritional assessment recommended</li>
                <li>🔴 Mental health assessment (depression screening)</li>
            </ul>
        `;
        boxClass = 'low';
    }

    interpretationBox.innerHTML = interpretation;
    interpretationBox.className = `interpretation-box ${boxClass}`;
    recommendationsBox.innerHTML = recommendations;

    // Show results section
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Local storage functionality (optional - save assessments)
function saveAssessment() {
    const patientName = document.getElementById('patientName').value;
    const assessmentDate = document.getElementById('assessmentDate').value;
    
    if (!patientName) return;

    const assessments = JSON.parse(localStorage.getItem('emsAssessments')) || [];
    
    const scores = [];
    for (let i = 1; i <= 7; i++) {
        const selectedRadio = document.querySelector(`input[name="item${i}"]:checked`);
        if (selectedRadio) {
            scores.push(parseInt(selectedRadio.value));
        }
    }

    const totalScore = scores.reduce((a, b) => a + b, 0);

    const assessment = {
        id: Date.now(),
        patientName,
        assessmentDate,
        scores,
        totalScore,
        timestamp: new Date().toISOString()
    };

    assessments.push(assessment);
    localStorage.setItem('emsAssessments', JSON.stringify(assessments));
}

// Save assessment after calculation
calculateBtn.addEventListener('click', () => {
    saveAssessment();
});
