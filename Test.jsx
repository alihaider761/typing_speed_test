import React, { useState, useEffect, useRef } from 'react';
import './Test.css';
import { paragraph } from './paragraph.js';

const Test = () => {
    const [start, setStart] = useState(false);
    const [index, setIndex] = useState(0);
    const [status, setStatus] = useState([]);
    const [timeLeft, setTimeLeft] = useState(120);
    const [correct, setCorrect] = useState(0);
    const [chars, setChars] = useState(0);
    const [words, setWords] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [result, setResult] = useState(false);
    const [accuracy, setAccuracy] = useState(0);
    const timer = useRef();

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (timeLeft === 0) {
                setResult(true);
                return;
            }
            if (e.key.length > 1 && e.key !== 'Backspace' && e.key !== 'Enter') {
                return;
            }

            if (!start) {
                setStart(true);
            }

            const key = e.key;
            const targetChar = paragraph[index];
            const isCorrect = key === targetChar;
            setStatus(prev => [...prev, isCorrect ? 'correct' : 'wrong']);
            setChars(prev => prev + 1);
            if (isCorrect) {
                setCorrect(prev => prev + 1);
            }
            if (targetChar === ' ') {
                setWords(prev => prev + 1);
            }
            setIndex(prev => prev + 1);
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [start, index, paragraph, timeLeft]);

    useEffect(() => {
        if (start) {
            timer.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setResult(true);
                        clearInterval(timer.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer.current);
    }, [start]);

    useEffect(() => {
        if(result){
        setWpm(Math.round(words / 2));
        setAccuracy(chars > 0 ? ((correct / chars) * 100).toFixed(2) : 0);
        console.log("wpm", wpm, "accuracy", accuracy, "%")
    }
    }, [result, words, chars, correct]);

    const handleRestart = () => {
        setStart(false);
        setIndex(0);
        setStatus([]);
        setTimeLeft(120);
        setCorrect(0);
        setChars(0);
        setWords(0);
        setWpm(0);
        setAccuracy(0);
        setResult(false);
        clearInterval(timer.current);
    }
    

    return (
        <>
            <div className='time'>
                    <p className='timer'>Time left: {timeLeft} sec</p>
                    {timeLeft === 0 && <h3 className='times-up'>Time's up!</h3>}
            </div>
            {!start && <h2 className='press'>Press any key to start typing...</h2>}
            <div className='container'>
                {index >= paragraph.length && <h3>Paragraph completed!</h3>}
                <p className='para'>
                    {paragraph.split('').map((char, i) => (
                        <span key={i} className={
                            i === index ? 'active_char' : status[i] === 'wrong' ? 'wrong' : status[i] === 'correct' ? 'correct' : ''
                        }>
                            {char}
                        </span>
                    ))}
                </p>
            </div>
            <div className='result'>
                {result === true && <> <h3 className='wpm'>WPM: {wpm} <br /> Accuracy: {accuracy} %</h3><br /><button onClick={handleRestart} className = 'button'>Restart</button></>}
            </div>
        </>
    );
};

export default Test;