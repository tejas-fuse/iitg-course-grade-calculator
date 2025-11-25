# IITG Course Grade Calculator

A web-based calculator designed to help students of Indian Institute of Technology Guwahati (IITG) compute their course grades and predict target scores needed for grade upgrades.

## Overview

This application calculates your final course grade based on:
- **PT Scores** (Periodic Tests): 90% weightage
- **NPT Scores** (Non-Periodic Tests): 10% weightage

The calculator uses your **best 5 scores** from each category to compute the final percentage and corresponding grade.

## Features

✅ **Multiple Course Support** - Pre-configured courses (DA101, DA102, DA103, DA104)  
✅ **Custom Course Entry** - Manual entry option for any course  
✅ **PT6 Target Prediction** - Calculates the minimum score needed in PT6 to achieve the next grade  
✅ **Visual Performance Chart** - Bar chart displaying all PT and NPT scores  
✅ **Grade Breakdown Table** - Detailed view of score calculations  
✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices  
✅ **Real-time Calculations** - Instant results as you enter scores  

## File Structure

```
iitg-course-grade-calculator/
├── index.html          # Main HTML structure and UI layout
├── styles.css          # All CSS styling and responsive design
├── scripts.js          # JavaScript logic and calculations
└── README.md           # Documentation (this file)
```

### File Descriptions

#### `index.html`
- Contains the complete HTML structure of the application
- Links to external dependencies (Chart.js for visualization)
- References external CSS and JavaScript files
- **Key Elements:**
  - Course selector dropdown with pre-configured courses
  - Input sections for PT and NPT scores
  - Calculate button to trigger computations
  - Results section displaying grades and analysis
  - Score breakdown table
  - Performance chart canvas

#### `styles.css`
- All styling and visual presentation
- CSS custom properties (variables) for consistent color scheme
- Responsive grid layout using CSS Grid
- Mobile-first design approach with media queries
- Component styles for:
  - Input fields and groups
  - Summary cards showing results
  - Analysis boxes for PT6 predictions
  - Tables and charts
  - Buttons and interactive elements

#### `scripts.js`
- Complete application logic and calculations
- **Key Functions:**
  - `loadCourseData()` - Loads configuration for selected course
  - `renderInputs()` - Dynamically creates input fields
  - `getScoreData()` - Retrieves and validates score inputs
  - `calculateBest5Avg()` - Computes best 5 score average
  - `determine Grade()` - Maps percentage to letter grade
  - `calculate()` - Main calculation function
  - `runPT6Prediction()` - Predicts PT6 target score
  - `updateChart()` - Updates visual performance chart

## How to Use

### 1. **Select Your Course**
   - Choose from predefined courses or select "Custom / Manual Entry"
   - Max marks for each test are auto-populated

### 2. **Enter Your Scores**
   - Fill in the obtained marks for PT1-PT5
   - Fill in the obtained marks for NPT1-NPT5
   - PT6 is optional (only enter if marks are declared)

### 3. **Calculate Your Grade**
   - Click the "📊 Calculate Final Grade & PT6 Target" button
   - Results will display instantly

### 4. **Review Results**
   - **Final Percentage**: Your calculated percentage
   - **Current Grade**: Letter grade (AA, AB, BB, BC, CC, CD, DD, or F)
   - **Grade Point**: Numerical value of your grade
   - **PT6 Analysis**: Shows the score needed to upgrade your grade
   - **Score Breakdown**: Table showing how calculations are done
   - **Performance Chart**: Visual comparison of all your scores

## Grading Scale

| Grade | Percentage Range | Grade Point |
|-------|-----------------|-------------|
| AA    | 90 - 100%       | 10          |
| AB    | 80 - 89%        | 9           |
| BB    | 70 - 79%        | 8           |
| BC    | 60 - 69%        | 7           |
| CC    | 50 - 59%        | 6           |
| CD    | 40 - 49%        | 5           |
| DD    | 30 - 39%        | 4           |
| F     | 0 - 29%         | 0           |

## Calculation Methodology

### Final Grade Calculation
1. **Best 5 Average**: Select the 5 highest scores from each category (PT and NPT)
2. **Weighted Calculation**:
   - PT Contribution = Best 5 PT Average × 0.9
   - NPT Contribution = Best 5 NPT Average × 0.1
   - **Final Percentage = PT Contribution + NPT Contribution**

### PT6 Target Prediction
- **If PT6 is empty**: The calculator predicts the minimum marks needed to achieve the next grade level
- **Formula**: 
  - Determines the percentage required for the next grade
  - Calculates how much PT6 score is needed (assuming it will replace your lowest PT)
  - Shows if the target is achievable or impossible

### Example Scenario
```
If you have:
- PT Scores: 18, 17, 16, 15, 14 (out of 20 each)
- NPT Scores: 9, 8, 8, 7, 6 (out of 10 each)

Calculations:
- Best 5 PT Average: (18+17+16+15+14)/5 × 100/20 = 80%
- Best 5 NPT Average: (9+8+8+7+6)/5 × 100/10 = 76%
- PT Contribution: 80 × 0.9 = 72
- NPT Contribution: 76 × 0.1 = 7.6
- Final Percentage: 72 + 7.6 = 79.6% (Grade: BB)
```

## Pre-configured Courses

### DA 101 (Design & Analysis)
- PT Max Marks: 20 (each)
- NPT Max Marks: 10 (each)

### DA 102 (Room Scan/Environment)
- PT Max Marks: 10 (each)
- NPT Max Marks: 10 (each)

### DA 103 (Lab/Practical)
- PT Max Marks: 10 (each)
- NPT Max Marks: [4, 10, 10, 10, 10, 10]

### DA 104 (Complex Tests)
- PT Max Marks: [15, 15, 20, 20, 20, 20]
- NPT Max Marks: 20 (each)

### Custom Entry
- All PT and NPT Max Marks default to 100 for flexible entry

## Technical Details

### Dependencies
- **Chart.js** (CDN): For performance visualization
  - URL: `https://cdn.jsdelivr.net/npm/chart.js`

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Works on mobile browsers (iOS Safari, Chrome Mobile)

### Key Features in Code
- **Responsive Design**: Uses CSS Grid and Flexbox for adaptive layouts
- **Dynamic DOM Rendering**: Input fields generated based on course selection
- **Client-side Calculations**: All computations run locally (no server needed)
- **Data Validation**: Input fields constrained by max marks
- **Chart Management**: Chart.js instances properly destroyed and recreated

## Tips for Best Results

1. **Enter all scores**: Try to enter scores for all tests for accurate calculations
2. **PT6 Strategy**: Use the PT6 target feature to plan your study efforts
3. **Monitor Progress**: Enter scores as tests are conducted for continuous tracking
4. **Check Your Grade Scale**: Familiarize yourself with the grading scale to set realistic targets

## Troubleshooting

### Scores not calculating?
- Ensure you've selected the correct course
- Check that input values are within the max marks range
- Verify that at least some scores are entered

### PT6 shows "impossible to reach"?
- The next grade threshold may require more than 100% in PT6
- Focus on improving other PT scores through previous tests
- Current grade is respectable; maintain it as a minimum

### Chart not showing?
- Check internet connection (Chart.js needs CDN access)
- Ensure JavaScript is enabled in your browser
- Try refreshing the page

## Future Enhancements

- 📊 Cumulative GPA tracker across multiple courses
- 💾 Save/export results as PDF
- 📱 Progressive Web App (PWA) support for offline use
- 📈 Grade history and progress visualization
- 🔔 Notifications for grade threshold milestones

## License

Educational tool for IITG students. Use freely for academic purposes.

## Support

For issues, suggestions, or feature requests, please contact your academic coordinator or system administrator.

---

**Last Updated**: November 2025  
**Version**: 2.0 (Modularized)