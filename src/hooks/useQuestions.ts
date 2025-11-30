import { useState, useCallback } from 'react';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  operation: string;
  difficulty: string;
  type?: 'multiple-choice' | 'fill-blank' | 'match';
  pairs?: { left: string; right: string; }[];
}

export const useQuestions = () => {
  const generateQuestion = useCallback((
    operation: string, 
    difficulty: string,
    tableRange?: { min: number; max: number },
    matchOperations?: string[]
  ): Question => {
    let question = '';
    let options: string[] = [];
    let correctAnswer = '';
    let type: 'multiple-choice' | 'fill-blank' | 'match' = 'multiple-choice';
    let pairs: { left: string; right: string; }[] = [];
    
    const getDifficultyRange = () => {
      switch (difficulty) {
        case 'simple': return { min: 1, max: 10 };
        case 'medium': return { min: 10, max: 50 };
        case 'hard': return { min: 50, max: 100 };
        default: return { min: 1, max: 10 };
      }
    };
    
    const { min, max } = getDifficultyRange();
    
    switch (operation) {
      case 'addition':
        const a1 = Math.floor(Math.random() * (max - min + 1)) + min;
        const b1 = Math.floor(Math.random() * (max - min + 1)) + min;
        const result1 = a1 + b1;
        question = `${a1} + ${b1} = ?`;
        correctAnswer = result1.toString();
        options = [
          correctAnswer,
          (result1 + Math.floor(Math.random() * 10) + 1).toString(),
          (result1 - Math.floor(Math.random() * 10) - 1).toString(),
          (result1 + Math.floor(Math.random() * 20) + 5).toString()
        ];
        break;
        
      case 'subtraction':
        const a2 = Math.floor(Math.random() * (max - min + 1)) + min;
        const b2 = Math.floor(Math.random() * a2) + 1;
        const result2 = a2 - b2;
        question = `${a2} - ${b2} = ?`;
        correctAnswer = result2.toString();
        options = [
          correctAnswer,
          (result2 + Math.floor(Math.random() * 10) + 1).toString(),
          (result2 - Math.floor(Math.random() * 10) - 1).toString(),
          (result2 + Math.floor(Math.random() * 15) + 3).toString()
        ];
        break;
        
      case 'multiplication':
        const tableMin = tableRange?.min || 2;
        const tableMax = tableRange?.max || 10;
        const a3 = Math.floor(Math.random() * (tableMax - tableMin + 1)) + tableMin; // Table number
        const b3 = Math.floor(Math.random() * 10) + 1; // Multiplier 1 to 10
        const result3 = a3 * b3;
        question = `${a3} × ${b3} = ?`;
        correctAnswer = result3.toString();
        options = [
          correctAnswer,
          (result3 + Math.floor(Math.random() * 20) + 1).toString(),
          (result3 - Math.floor(Math.random() * 15) - 1).toString(),
          (result3 + Math.floor(Math.random() * 30) + 5).toString()
        ];
        break;
        
      case 'division':
        const divMin = tableRange?.min || 2;
        const divMax = tableRange?.max || 10;
        const divisor = Math.floor(Math.random() * (divMax - divMin + 1)) + divMin; // Table number
        const quotient = Math.floor(Math.random() * 10) + 1; // Result 1 to 10
        const dividend = divisor * quotient;
        question = `${dividend} ÷ ${divisor} = ?`;
        correctAnswer = quotient.toString();
        options = [
          correctAnswer,
          (quotient + Math.floor(Math.random() * 5) + 1).toString(),
          (quotient - Math.floor(Math.random() * 3) - 1).toString(),
          (quotient + Math.floor(Math.random() * 8) + 2).toString()
        ];
        break;
        
      case 'percentage':
        const base = Math.floor(Math.random() * (max - min + 1)) + min;
        const percent = [10, 20, 25, 50, 75].sort(() => 0.5 - Math.random())[0];
        const result5 = (base * percent) / 100;
        question = `${percent}% of ${base} = ?`;
        correctAnswer = result5.toString();
        options = [
          correctAnswer,
          (result5 + Math.floor(Math.random() * 10) + 1).toString(),
          (result5 - Math.floor(Math.random() * 5) - 1).toString(),
          (result5 + Math.floor(Math.random() * 15) + 3).toString()
        ];
        break;
        
      case 'square-root':
        const perfectSquares = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100];
        const randomSquare = perfectSquares[Math.floor(Math.random() * perfectSquares.length)];
        const result6 = Math.sqrt(randomSquare);
        question = `√${randomSquare} = ?`;
        correctAnswer = result6.toString();
        options = [
          correctAnswer,
          (result6 + 1).toString(),
          (result6 + 2).toString(),
          (result6 - 1 > 0 ? result6 - 1 : result6 + 3).toString()
        ];
        break;
        
      case 'cube-root':
        const perfectCubes = [1, 8, 27, 64, 125];
        const randomCube = perfectCubes[Math.floor(Math.random() * perfectCubes.length)];
        const result7 = Math.cbrt(randomCube);
        question = `∛${randomCube} = ?`;
        correctAnswer = result7.toString();
        options = [
          correctAnswer,
          (result7 + 1).toString(),
          (result7 + 2).toString(),
          (result7 - 1 > 0 ? result7 - 1 : result7 + 3).toString()
        ];
        break;
        
      case 'tables':
        const tblMin = tableRange?.min || 2;
        const tblMax = tableRange?.max || 30;
        const tableNum = Math.floor(Math.random() * (tblMax - tblMin + 1)) + tblMin;
        const multiplier = Math.floor(Math.random() * 12) + 1; // 1 to 12
        const tableResult = tableNum * multiplier;
        question = `${tableNum} × ${multiplier} = ?`;
        correctAnswer = tableResult.toString();
        options = [
          correctAnswer,
          (tableResult + Math.floor(Math.random() * 10) + 1).toString(),
          (tableResult - Math.floor(Math.random() * 10) - 1).toString(),
          (tableResult + Math.floor(Math.random() * 20) + 5).toString()
        ];
        break;
        
      case 'algebra':
        const x = Math.floor(Math.random() * 20) + 1;
        const coefficient = Math.floor(Math.random() * 10) + 1;
        const constant = Math.floor(Math.random() * 20) + 1;
        const algebraResult = coefficient * x + constant;
        question = `${coefficient}x + ${constant} = ${algebraResult}. Find x`;
        correctAnswer = x.toString();
        options = [
          correctAnswer,
          (x + Math.floor(Math.random() * 5) + 1).toString(),
          (x - Math.floor(Math.random() * 3) - 1).toString(),
          (x + Math.floor(Math.random() * 8) + 2).toString()
        ];
        break;
        
      case 'mixed':
        const mixedOperations = ['addition', 'subtraction', 'multiplication', 'division'];
        const randomOp = mixedOperations[Math.floor(Math.random() * mixedOperations.length)];
        return generateQuestion(randomOp, difficulty);
        
      case 'fill-blank':
        type = 'fill-blank';
        const blankOps = ['addition', 'subtraction', 'multiplication', 'division'];
        const blankOp = blankOps[Math.floor(Math.random() * blankOps.length)];
        
        if (blankOp === 'addition') {
          const a = Math.floor(Math.random() * (max - min + 1)) + min;
          const b = Math.floor(Math.random() * (max - min + 1)) + min;
          const result = a + b;
          const blankPosition = Math.random() > 0.5 ? 'first' : 'second';
          
          if (blankPosition === 'first') {
            question = `___ + ${b} = ${result}`;
            correctAnswer = a.toString();
          } else {
            question = `${a} + ___ = ${result}`;
            correctAnswer = b.toString();
          }
        } else if (blankOp === 'subtraction') {
          const a = Math.floor(Math.random() * (max - min + 1)) + min + 10;
          const b = Math.floor(Math.random() * a) + 1;
          const result = a - b;
          const blankPosition = Math.random() > 0.5 ? 'first' : 'second';
          
          if (blankPosition === 'first') {
            question = `___ - ${b} = ${result}`;
            correctAnswer = a.toString();
          } else {
            question = `${a} - ___ = ${result}`;
            correctAnswer = b.toString();
          }
        } else if (blankOp === 'multiplication') {
          const multBlankMax = difficulty === 'simple' ? 12 : difficulty === 'medium' ? 20 : 30;
          const a = Math.floor(Math.random() * (Math.min(max, multBlankMax) - min + 1)) + min;
          const b = Math.floor(Math.random() * (Math.min(max, multBlankMax) - min + 1)) + min;
          const result = a * b;
          const blankPosition = Math.random() > 0.5 ? 'first' : 'second';
          
          if (blankPosition === 'first') {
            question = `___ × ${b} = ${result}`;
            correctAnswer = a.toString();
          } else {
            question = `${a} × ___ = ${result}`;
            correctAnswer = b.toString();
          }
        } else { // division
          const divBlankMax = difficulty === 'simple' ? 12 : difficulty === 'medium' ? 20 : 30;
          const b = Math.floor(Math.random() * (Math.min(max, divBlankMax) - min + 1)) + min;
          const result = Math.floor(Math.random() * (Math.min(max, divBlankMax) - min + 1)) + min;
          const a = b * result;
          const blankPosition = Math.random() > 0.5 ? 'first' : 'second';
          
          if (blankPosition === 'first') {
            question = `___ ÷ ${b} = ${result}`;
            correctAnswer = a.toString();
          } else {
            question = `${a} ÷ ___ = ${result}`;
            correctAnswer = result.toString();
          }
        }
        
        options = [
          correctAnswer,
          (parseInt(correctAnswer) + Math.floor(Math.random() * 5) + 1).toString(),
          (parseInt(correctAnswer) - Math.floor(Math.random() * 3) - 1).toString(),
          (parseInt(correctAnswer) + Math.floor(Math.random() * 8) + 2).toString()
        ];
        break;
        
      case 'match':
        type = 'match';
        question = 'Match the questions with their correct answers';
        
        // Generate 4 pairs of questions and answers with mixed operations
        pairs = [];
        const usedResults = new Set();
        const operations = matchOperations || ['addition', 'subtraction']; // Default mix
        
        for (let i = 0; i < 4; i++) {
          const matchOp = operations[Math.floor(Math.random() * operations.length)];
          let a: number, b: number, result: number, questionText: string;
          
          if (matchOp === 'addition') {
            a = Math.floor(Math.random() * (max - min + 1)) + min;
            b = Math.floor(Math.random() * (max - min + 1)) + min;
            result = a + b;
            questionText = `${a} + ${b}`;
          } else if (matchOp === 'subtraction') {
            a = Math.floor(Math.random() * (max - min + 1)) + min;
            b = Math.floor(Math.random() * a) + 1;
            result = a - b;
            questionText = `${a} - ${b}`;
          } else if (matchOp === 'multiplication') {
            const multMax = difficulty === 'simple' ? 12 : difficulty === 'medium' ? 20 : 30;
            a = Math.floor(Math.random() * Math.min(multMax, max)) + 1;
            b = Math.floor(Math.random() * Math.min(multMax, max)) + 1;
            result = a * b;
            questionText = `${a} × ${b}`;
          } else { // division
            const divMax = difficulty === 'simple' ? 12 : difficulty === 'medium' ? 20 : 30;
            b = Math.floor(Math.random() * Math.min(divMax, max)) + 1;
            result = Math.floor(Math.random() * Math.min(divMax, max)) + 1;
            a = b * result;
            questionText = `${a} ÷ ${b}`;
          }
          
          // Ensure unique results
          if (!usedResults.has(result)) {
            pairs.push({
              left: questionText,
              right: result.toString()
            });
            usedResults.add(result);
          } else {
            i--; // Retry if duplicate
          }
        }
        
        correctAnswer = JSON.stringify(pairs);
        break;
        
      default:
        question = '2 + 2 = ?';
        correctAnswer = '4';
        options = ['4', '5', '3', '6'];
    }
    
    // Shuffle options for multiple choice
    if (type === 'multiple-choice') {
      options = options.sort(() => Math.random() - 0.5);
    }
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      question,
      options,
      correctAnswer,
      operation,
      difficulty,
      type,
      pairs
    };
  }, []);
  
  return { generateQuestion };
};
