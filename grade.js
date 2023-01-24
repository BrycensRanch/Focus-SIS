// An object with the letter grade as key and the floor value of the grade as its value
const distribution = {
    A: 90,
    B: 80,
    C: 70,
    D: 60,
    F: 0
  };
  
  const getGrade = (score, maxScore = 100, minScore = 0) => {
  
    // Handle edge cases
    if (score > maxScore || score < minScore) {
      return "Error";
    }
    // Get an array of the letter grades
    const grades = Object.keys(distribution);
  
    // Sort the grades in descending order of the floor score of each grade
    grades.sort((a, b) => distribution[b] - distribution[a]);
  
    // Since the grades are sorted, the first grade to be lower than the score will be the correct grade to return
    const grade = grades.find(grade => distribution[grade] <= score);
  
    return grade
  };
 module.exports = getGrade; 