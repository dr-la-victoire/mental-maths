import { useState, useEffect } from "react";
import "./game.css";

function Game() {
	// function to generate the random questions
	const generateNumbers = () => {
		const operators = ["+", "-", "×", "÷"];
		const operator =
			operators[Math.floor(Math.random() * operators.length)];

		let num1 = Math.floor(Math.random() * 10) + 1;
		let num2 = Math.floor(Math.random() * 10) + 1;

		if (operator === "÷") {
			num1 = num1 * num2;
		}
		return {
			num1,
			num2,
			operator,
		};
	};

	// setting the various states
	const [question, setQuestion] = useState(generateNumbers());
	const [answer, setAnswer] = useState("");
	const [score, setScore] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [time, setTime] = useState(5);

	// handling the useEffect for the countdown timer
	useEffect(() => {
		if (gameOver) {
			return;
		}

		if (time === 0) {
			setGameOver(true);
			return;
		}

		const timer = setTimeout(() => {
			setTime((prevTime) => prevTime - 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [time, gameOver]);

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
			setScore(score + 1);
			setQuestion(generateNumbers());
			setAnswer("");
			setTime(5);
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
							{question.num1} {question.operator} {question.num2}{" "}
							=
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
