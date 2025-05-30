import { useState, useEffect } from "react";
import "./game.css";

function Game() {
	// setting difficulty levels
	/* Difficulty Levels Explained
	* You start with only addition questions for 10 seconds per question
	* When your score is 20, you start getting subtraction and multiplication for 7 seconds each
	* Etc
	*/
	const difficulty = {
		easy: {
			range: 10,
			operators: ["+"],
			timeLimit: 10,
		},
		novice: {
			range: 10,
			operators: ["+", "-", "×"],
			timeLimit: 7,
		},
		amateur: {
			range: 20,
			operators: ["+", "-", "×", "÷"],
			timeLimit: 7,
		},
		medium: {
			range: 25,
			operators: ["+", "-"],
			timeLimit: 7,
		},
		hard: {
			range: 100,
			operators: ["+", "-", "×", "÷"],
			timeLimit: 10,
		},
	};

	// function to generate the random questions
	const generateNumbers = (difficultyLevel) => {
		// destructuring the object to get the range and the operators
		const { range, operators } = difficulty[difficultyLevel];
		// random operator
		const operator =
			operators[Math.floor(Math.random() * operators.length)];

		// random numbers for the questions
		let num1 = Math.floor(Math.random() * range) + 1;
		let num2 = Math.floor(Math.random() * range) + 1;

		// so that I wouldn't have to have decimal divisions
		if (operator === "÷") {
			num1 = num1 * num2;
		}
		return {
			num1,
			num2,
			operator,
		};
	};

	// function to get the difficulty level from the score
	const getDifficultyFromScore = (score) => {
		if (score >= 70) {
			return "hard";
		} else if (score >= 50) {
			return "medium";
		} else if (score >= 30) {
			return "amateur";
		} else if (score >= 15) {
			return "novice";
		} else {
			return "easy";
		}
	};

	// setting the various states
	const initialDifficulty = getDifficultyFromScore(0); // so you'd always start from 0
	const [question, setQuestion] = useState(
		generateNumbers(initialDifficulty),
	);
	const [answer, setAnswer] = useState("");
	const [score, setScore] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [time, setTime] = useState(difficulty[initialDifficulty].timeLimit);
	const [highScore, setHighScore] = useState(() => {
		const storedHighScore = localStorage.getItem("highScore");
		return storedHighScore ? parseInt(storedHighScore) : 0;
	});

	// handling the useEffect for the countdown timer
	useEffect(() => {
		if (gameOver) {
			if (score > highScore) {
				// replace the score in localStorage with the current score
				setHighScore(score);
				localStorage.setItem("highScore", score.toString());
			}
			setTime(0);
		}

		// end game if you run out of time
		if (time === 0) {
			setGameOver(true);
			return;
		}

		const timer = setTimeout(() => {
			setTime((prevTime) => prevTime - 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [time, gameOver, score, highScore]);

	// handling the submit
	const handleSubmit = (e) => {
		e.preventDefault();
		let correctAnswer;

		switch (question.operator) {
			case "+":
				correctAnswer = question.num1 + question.num2;
				break;
			case "-":
				correctAnswer = question.num1 - question.num2;
				break;
			case "×":
				correctAnswer = question.num1 * question.num2;
				break;
			case "÷":
				correctAnswer = question.num1 / question.num2;
				break;
			default:
				correctAnswer = null;
		}
		// checking if the user inputed the correct answer
		if (parseFloat(answer) === correctAnswer) {
			const newScore = score + 1;
			const difficultyLevel = getDifficultyFromScore(newScore);
			const newQuestion = generateNumbers(difficultyLevel);
			const newTime = difficulty[difficultyLevel].timeLimit;

			setScore(newScore);
			setQuestion(newQuestion);
			setAnswer("");
			setTime(newTime);
		} else {
			setGameOver(true);
		}
	};

	return (
		<div className="game-container">
			<div className="hero-text">
				<h2>Mental Maths</h2>
			</div>
			<div className="game-stuff">
				<h4>Score: {score}</h4>
				<h4>High Score: {highScore}</h4>
				<h4>Time: {time} secs</h4>
			</div>
			<div className="questions">
				{gameOver ? (
					<div className="gameover">
						<h3>Game Over!</h3>
						<h3>Final Score: {score}</h3>
					</div>
				) : (
					<form onSubmit={handleSubmit}>
						<h3>
							{question.num1}
							{question.operator}
							{question.num2}=
						</h3>
						<input
							type="text"
							value={answer}
							onChange={(e) => setAnswer(e.target.value)}
							autoFocus
						/>
					</form>
				)}
			</div>
		</div>
	);
}

export default Game;
