
import React, { useState, useRef, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';

interface MatchQuestionProps {
  pairs: { left: string; right: string; }[];
  onAnswer: (isCorrect: boolean) => void;
  onRegenerateQuestions?: (operations: string[]) => void;
  difficulty?: 'simple' | 'medium' | 'hard';
}

const MatchQuestion = ({ pairs, onAnswer, onRegenerateQuestions, difficulty = 'simple' }: MatchQuestionProps) => {
  // Determine initial operations based on difficulty
  const getInitialOperations = () => {
    if (difficulty === 'simple') return 'addition-subtraction';
    if (difficulty === 'medium') return 'addition-subtraction-multiplication';
    return 'all';
  };

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [completed, setCompleted] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [linePositions, setLinePositions] = useState<{ [key: string]: { x1: number; y1: number; x2: number; y2: number } }>({});
  const [selectedOperations, setSelectedOperations] = useState<string>(getInitialOperations());
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isAllCorrect, setIsAllCorrect] = useState<boolean>(false);
  const [rightItems, setRightItems] = useState<string[]>([]);
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const rightRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const leftItems = pairs.map(p => p.left);

  // Update rightItems when pairs change (new question or operation change)
  useEffect(() => {
    setRightItems([...pairs.map(p => p.right)].sort(() => Math.random() - 0.5));
    setMatches({});
    setSelectedLeft(null);
    setCompleted(false);
    setDraggedItem(null);
    setLinePositions({});
    setShowResult(false);
    setIsAllCorrect(false);
  }, [pairs]);

  useEffect(() => {
    updateLinePositions();
  }, [matches]);

  const updateLinePositions = () => {
    const newLinePositions: { [key: string]: { x1: number; y1: number; x2: number; y2: number } } = {};
    
    Object.entries(matches).forEach(([left, right]) => {
      const leftEl = leftRefs.current[left];
      const rightEl = rightRefs.current[right];
      
      if (leftEl && rightEl && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();
        
        newLinePositions[left] = {
          x1: leftRect.right - containerRect.left,
          y1: leftRect.top + leftRect.height / 2 - containerRect.top,
          x2: rightRect.left - containerRect.left,
          y2: rightRect.top + rightRect.height / 2 - containerRect.top,
        };
      }
    });
    
    setLinePositions(newLinePositions);
  };

  const handleDragStart = (item: string) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (item: string) => {
    if (!draggedItem || Object.values(matches).includes(item)) return;
    
    const newMatches = { ...matches, [draggedItem]: item };
    setMatches(newMatches);
    setDraggedItem(null);
    
    if (Object.keys(newMatches).length === pairs.length) {
      const isCorrect = pairs.every(pair => newMatches[pair.left] === pair.right);
      setCompleted(true);
      setShowResult(true);
      setIsAllCorrect(isCorrect);
      setTimeout(() => {
        updateLinePositions();
        onAnswer(isCorrect);
      }, 2000);
    }
  };

  const handleLeftClick = (item: string) => {
    if (matches[item]) return;
    setSelectedLeft(item);
  };

  const handleRightClick = (item: string) => {
    if (Object.values(matches).includes(item)) return;
    
    if (selectedLeft) {
      const newMatches = { ...matches, [selectedLeft]: item };
      setMatches(newMatches);
      setSelectedLeft(null);
      
      if (Object.keys(newMatches).length === pairs.length) {
        const isCorrect = pairs.every(pair => newMatches[pair.left] === pair.right);
        setCompleted(true);
        setShowResult(true);
        setIsAllCorrect(isCorrect);
        setTimeout(() => onAnswer(isCorrect), 2000);
      }
    }
  };

  const getLeftItemColor = (item: string) => {
    if (matches[item]) return 'bg-green-500/20 border-green-500 text-foreground dark:text-white';
    if (selectedLeft === item || draggedItem === item) return 'bg-primary/20 border-primary text-foreground dark:text-white';
    return 'bg-card border-border text-card-foreground hover:bg-accent hover:border-accent';
  };

  const getRightItemColor = (item: string) => {
    if (Object.values(matches).includes(item)) return 'bg-green-500/20 border-green-500 text-foreground dark:text-white';
    return 'bg-card border-border text-card-foreground hover:bg-accent hover:border-accent';
  };

  const handleOperationChange = (value: string) => {
    setSelectedOperations(value);
    regenerateQuestion(value);
  };

  const regenerateQuestion = (operationValue?: string) => {
    const value = operationValue || selectedOperations;
    
    const operationsMap: { [key: string]: string[] } = {
      'addition-subtraction': ['addition', 'subtraction'],
      'addition-subtraction-multiplication': ['addition', 'subtraction', 'multiplication'],
      'multiplication': ['multiplication'],
      'division': ['division'],
      'addition': ['addition'],
      'subtraction': ['subtraction'],
      'all': ['addition', 'subtraction', 'multiplication', 'division']
    };
    
    onRegenerateQuestions?.(operationsMap[value] || ['addition', 'subtraction', 'multiplication', 'division']);
  };

  const handleRefreshClick = () => {
    // Reset only the matches and selections, keep the same questions
    setMatches({});
    setSelectedLeft(null);
    setCompleted(false);
    setShowResult(false);
    setIsAllCorrect(false);
    setDraggedItem(null);
    setLinePositions({});
  };

  const handleTouchStart = (item: string, e: React.TouchEvent) => {
    if (matches[item] || completed) return;
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setDraggedItem(item);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedItem) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!draggedItem) return;
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.changedTouches[0];
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    
    // Find the right item that was touched
    let targetItem: string | null = null;
    for (const element of elements) {
      // Check if this element or any of its parents is a right item button
      let currentElement: Element | null = element;
      while (currentElement) {
        const item = rightItems.find(ri => rightRefs.current[ri] === currentElement);
        if (item && !Object.values(matches).includes(item)) {
          targetItem = item;
          break;
        }
        currentElement = currentElement.parentElement;
      }
      if (targetItem) break;
    }
    
    if (targetItem) {
      const newMatches = { ...matches, [draggedItem]: targetItem };
      setMatches(newMatches);
      
      setTimeout(() => {
        updateLinePositions();
      }, 50);
      
      if (Object.keys(newMatches).length === pairs.length) {
        const isCorrect = pairs.every(pair => newMatches[pair.left] === pair.right);
        setCompleted(true);
        setShowResult(true);
        setIsAllCorrect(isCorrect);
        setTimeout(() => {
          updateLinePositions();
          onAnswer(isCorrect);
        }, 2000);
      }
    }
    
    setDraggedItem(null);
    setTouchStartPos(null);
  };

  return (
    <div className="space-y-6" style={{ touchAction: 'none', overscrollBehavior: 'contain' }}>
      <div className="text-center text-lg font-semibold text-foreground">
        Match the questions with correct answers
      </div>

      {/* Operation Selector and Refresh Button */}
      <div className="flex justify-center items-center gap-3">
        <div className="flex-1 max-w-80">
          <Select value={selectedOperations} onValueChange={handleOperationChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose operations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Operations</SelectItem>
              <SelectItem value="addition-subtraction">Addition + Subtraction</SelectItem>
              <SelectItem value="addition-subtraction-multiplication">Addition + Subtraction + Multiplication</SelectItem>
              <SelectItem value="addition">Addition Only</SelectItem>
              <SelectItem value="subtraction">Subtraction Only</SelectItem>
              <SelectItem value="multiplication">Multiplication Only</SelectItem>
              <SelectItem value="division">Division Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button
          onClick={handleRefreshClick}
          disabled={completed}
          className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Reset answers"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Drag from questions to answers or click to select
      </div>
      
      <div ref={containerRef} className="relative grid grid-cols-2 gap-8" style={{ touchAction: 'none' }}>
        {/* SVG overlay for connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {Object.entries(linePositions).map(([left, pos]) => {
            const midX = (pos.x1 + pos.x2) / 2;
            return (
              <path
                key={left}
                d={`M ${pos.x1} ${pos.y1} Q ${midX} ${pos.y1}, ${midX} ${(pos.y1 + pos.y2) / 2} T ${pos.x2} ${pos.y2}`}
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                fill="none"
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        <div className="space-y-3 relative" style={{ zIndex: 2 }}>
          <h3 className="text-center font-medium text-muted-foreground mb-3">Questions</h3>
          <div className="flex flex-col gap-3 h-[280px]">
            {leftItems.map((item, index) => (
              <button
                key={index}
                ref={(el) => (leftRefs.current[item] = el)}
                draggable={!matches[item] && !completed}
                onDragStart={() => handleDragStart(item)}
                onDragEnd={() => setDraggedItem(null)}
                onTouchStart={(e) => handleTouchStart(item, e)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => handleLeftClick(item)}
                disabled={completed || !!matches[item]}
                className={`w-full p-4 rounded-lg font-medium transition-colors border-2 h-[60px] flex items-center justify-center flex-shrink-0 ${getLeftItemColor(item)} ${
                  completed || matches[item] ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                style={{ 
                  touchAction: 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-3 relative" style={{ zIndex: 2 }}>
          <h3 className="text-center font-medium text-muted-foreground mb-3">Answers</h3>
          <div className="flex flex-col gap-3 h-[280px]">
            {rightItems.map((item, index) => (
              <button
                key={index}
                ref={(el) => (rightRefs.current[item] = el)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(item)}
                onClick={() => handleRightClick(item)}
                disabled={completed}
                className={`w-full p-4 rounded-lg font-medium transition-colors border-2 h-[60px] flex items-center justify-center flex-shrink-0 ${getRightItemColor(item)} ${
                  completed ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                style={{ 
                  touchAction: 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {selectedLeft && !draggedItem && (
        <div className="text-center text-primary font-medium">
          Selected: {selectedLeft} - Click an answer to match
        </div>
      )}
      {draggedItem && (
        <div className="text-center text-primary font-medium">
          Dragging: {draggedItem} - Drop on an answer to match
        </div>
      )}
      
      {/* Result Feedback */}
      {showResult && (
        <div className={`text-center text-2xl font-bold p-4 rounded-lg ${
          isAllCorrect 
            ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
            : 'bg-red-500/20 text-red-600 dark:text-red-400'
        }`}>
          {isAllCorrect ? '✓ Correct! Well done!' : '✗ Incorrect! Try again next time'}
        </div>
      )}
    </div>
  );
};

export default MatchQuestion;
