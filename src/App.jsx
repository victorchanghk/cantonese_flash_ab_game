import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Star, RefreshCcw, Play, CheckCircle, XCircle, Trophy } from 'lucide-react';

// Dictionary of Cantonese words (Sample of ~60 words for demonstration, expandable to 500)
const dictionary = [
  { word: "蘋果", jyutping: "ping4 gwo2" },
  { word: "香蕉", jyutping: "hoeng1 ziu1" },
  { word: "士多啤梨", jyutping: "si6 do1 be1 lei2" },
  { word: "橙", jyutping: "caang2" },
  { word: "西瓜", jyutping: "sai1 gwaa1" },
  { word: "葡萄", jyutping: "pou4 tou4" },
  { word: "檸檬", jyutping: "ning4 mung1" },
  { word: "桃", jyutping: "tou4" },
  { word: "梨", jyutping: "lei2" },
  { word: "芒果", jyutping: "mong1 gwo2" },
  { word: "貓", jyutping: "maau1" },
  { word: "狗", jyutping: "gau2" },
  { word: "雀", jyutping: "zoek3" },
  { word: "魚", jyutping: "jyu4" },
  { word: "兔仔", jyutping: "tou3 zai2" },
  { word: "獅子", jyutping: "si1 zi2" },
  { word: "老虎", jyutping: "lou5 fu2" },
  { word: "大象", jyutping: "daai6 zoeng6" },
  { word: "馬", jyutping: "maa5" },
  { word: "牛", jyutping: "ngau4" },
  { word: "紅色", jyutping: "hung4 sik1" },
  { word: "藍色", jyutping: "laam4 sik1" },
  { word: "黃色", jyutping: "wong4 sik1" },
  { word: "綠色", jyutping: "luk6 sik1" },
  { word: "白色", jyutping: "baak6 sik1" },
  { word: "黑色", jyutping: "hak1 sik1" },
  { word: "紫色", jyutping: "zi2 sik1" },
  { word: "橙色", jyutping: "caang2 sik1" },
  { word: "粉紅色", jyutping: "fan2 hung4 sik1" },
  { word: "灰色", jyutping: "fui1 sik1" },
  { word: "頭", jyutping: "tau4" },
  { word: "眼", jyutping: "ngaan5" },
  { word: "耳", jyutping: "ji5" },
  { word: "口", jyutping: "hau2" },
  { word: "手", jyutping: "sau2" },
  { word: "腳", jyutping: "goek3" },
  { word: "鼻", jyutping: "bei6" },
  { word: "頭髮", jyutping: "tau4 faat3" },
  { word: "牙齒", jyutping: "ngaa4 ci2" },
  { word: "肚", jyutping: "tou5" },
  { word: "爸爸", jyutping: "baa4 baa1" },
  { word: "媽媽", jyutping: "maa1 maa1" },
  { word: "哥哥", jyutping: "go1 go1" },
  { word: "姐姐", jyutping: "ze4 ze1" },
  { word: "弟弟", jyutping: "dai4 dai2" },
  { word: "妹妹", jyutping: "mui4 mui2" },
  { word: "公公", jyutping: "gung1 gung1" },
  { word: "婆婆", jyutping: "po4 po2" },
  { word: "爺爺", jyutping: "je4 je2" },
  { word: "嫲嫲", jyutping: "maa4 maa4" },
  { word: "太陽", jyutping: "taai3 joeng4" },
  { word: "月亮", jyutping: "jyut6 loeng6" },
  { word: "星星", jyutping: "sing1 sing1" },
  { word: "雲", jyutping: "wan4" },
  { word: "雨", jyutping: "jyu5" },
  { word: "風", jyutping: "fung1" },
  { word: "雪", jyutping: "syut3" },
  { word: "山", jyutping: "saan1" },
  { word: "水", jyutping: "seoi2" },
  { word: "花", jyutping: "faa1" },
];

const TOTAL_ROUNDS = 10;

function App() {
  const [gameState, setGameState] = useState('start'); // start, playing, finished
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [lastFeedback, setLastFeedback] = useState(null); // 'correct' or 'wrong'
  const [selectedOption, setSelectedOption] = useState(null);

  // Audio handling
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-HK'; // Cantonese
      utterance.rate = 0.8; // Slightly slower for kids

      // Try to find a Cantonese voice specifically if possible (optional enhancement)
      const voices = window.speechSynthesis.getVoices();
      const cantoneseVoice = voices.find(v => v.lang === 'zh-HK');
      if (cantoneseVoice) {
        utterance.voice = cantoneseVoice;
      }

      window.speechSynthesis.speak(utterance);
    } else {
      alert("你的瀏覽器不支援語音功能 (Your browser does not support speech synthesis).");
    }
  };

  const generateQuestion = () => {
    const targetIndex = Math.floor(Math.random() * dictionary.length);
    const targetWord = dictionary[targetIndex];

    let distractorIndex;
    do {
      distractorIndex = Math.floor(Math.random() * dictionary.length);
    } while (distractorIndex === targetIndex);

    const distractorWord = dictionary[distractorIndex];

    // Randomize options position
    const options = Math.random() < 0.5
      ? [targetWord, distractorWord]
      : [distractorWord, targetWord];

    return {
      target: targetWord,
      options: options
    };
  };

  const startGame = () => {
    setScore(0);
    setCurrentRound(1);
    setGameState('playing');
    setLastFeedback(null);
    setSelectedOption(null);
    const newQuestion = generateQuestion();
    setCurrentQuestion(newQuestion);
    // Small delay to allow render before speaking
    setTimeout(() => speak(newQuestion.target.word), 500);
  };

  const handleOptionClick = (option) => {
    if (selectedOption) return; // Prevent double clicking

    setSelectedOption(option);
    const isCorrect = option.word === currentQuestion.target.word;

    if (isCorrect) {
      setScore(s => s + 1);
      setLastFeedback('correct');
      speak("啱咗！" + option.word); // "Correct!"
    } else {
      setLastFeedback('wrong');
      speak("錯咗喇，正確係 " + currentQuestion.target.word); // "Wrong, correct is..."
    }

    // Next round delay
    setTimeout(() => {
      if (currentRound >= TOTAL_ROUNDS) {
        setGameState('finished');
      } else {
        setCurrentRound(r => r + 1);
        setLastFeedback(null);
        setSelectedOption(null);
        const newQuestion = generateQuestion();
        setCurrentQuestion(newQuestion);
        setTimeout(() => speak(newQuestion.target.word), 500);
      }
    }, 2000);
  };

  const restartGame = () => {
    startGame();
  };

  // Pre-load voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-sky-300">

        {/* Header */}
        <div className="bg-sky-400 p-4 text-center">
          <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Star className="fill-yellow-300 text-yellow-300" />
            粵語小學堂
            <Star className="fill-yellow-300 text-yellow-300" />
          </h1>
        </div>

        <div className="p-6">
          {gameState === 'start' && (
            <div className="text-center space-y-8 py-8">
              <div className="space-y-4">
                <p className="text-xl text-gray-600">歡迎來到粵語學習遊戲！</p>
                <p className="text-gray-500">聽聲音，選出正確的字。</p>
              </div>
              <button
                onClick={startGame}
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-2xl shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Play size={28} />
                開始遊戲
              </button>
            </div>
          )}

          {gameState === 'playing' && currentQuestion && (
            <div className="space-y-6">
              {/* Progress & Score */}
              <div className="flex justify-between items-center text-lg font-bold text-gray-600 bg-gray-100 p-3 rounded-xl">
                <span>第 {currentRound} / {TOTAL_ROUNDS} 題</span>
                <span className="flex items-center gap-1 text-orange-500">
                  <Star className="fill-orange-500" size={20} />
                  {score}
                </span>
              </div>

              {/* Audio Button */}
              <div className="flex justify-center py-4">
                <button
                  onClick={() => speak(currentQuestion.target.word)}
                  className="p-8 bg-yellow-300 hover:bg-yellow-400 rounded-full shadow-lg transform transition active:scale-95 text-yellow-800"
                >
                  <Volume2 size={64} />
                </button>
              </div>
              <p className="text-center text-gray-400 text-sm">點擊喇叭重聽</p>

              {/* Options */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {currentQuestion.options.map((option, idx) => {
                  let btnClass = "h-32 text-4xl font-bold rounded-2xl shadow-md border-b-4 transition transform active:scale-95 flex flex-col items-center justify-center gap-2 ";

                  if (selectedOption) {
                    if (option === currentQuestion.target) {
                      btnClass += "bg-green-100 border-green-500 text-green-700";
                    } else if (option === selectedOption && option !== currentQuestion.target) {
                      btnClass += "bg-red-100 border-red-500 text-red-700";
                    } else {
                      btnClass += "bg-gray-100 border-gray-300 text-gray-400 opacity-50";
                    }
                  } else {
                    btnClass += "bg-white border-sky-200 hover:bg-sky-50 text-gray-800 hover:border-sky-300";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(option)}
                      disabled={selectedOption !== null}
                      className={btnClass}
                    >
                      <span>{option.word}</span>
                      {selectedOption && option === currentQuestion.target && (
                        <CheckCircle className="text-green-500" size={24} />
                      )}
                      {selectedOption && option === selectedOption && option !== currentQuestion.target && (
                        <XCircle className="text-red-500" size={24} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Message */}
              <div className="h-8 text-center font-bold text-xl">
                {lastFeedback === 'correct' && <span className="text-green-500">答啱咗！ (Correct!)</span>}
                {lastFeedback === 'wrong' && <span className="text-red-500">再接再厲！ (Try again!)</span>}
              </div>
            </div>
          )}

          {gameState === 'finished' && (
            <div className="text-center space-y-8 py-8">
              <div className="flex justify-center">
                <Trophy size={80} className="text-yellow-400 fill-yellow-100" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">遊戲結束！</h2>
                <p className="text-xl text-gray-600">你嘅分數係：</p>
                <div className="text-6xl font-black text-orange-500 my-4">{score} / {TOTAL_ROUNDS}</div>
                <p className="text-lg font-medium text-sky-600">
                  {score === TOTAL_ROUNDS ? "嘩！你係粵語小天才！🏆" :
                    score >= TOTAL_ROUNDS / 2 ? "做得好！繼續加油！🌟" :
                      "唔緊要，下次會更好！💪"}
                </p>
              </div>
              <button
                onClick={restartGame}
                className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white text-xl font-bold rounded-2xl shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2"
              >
                <RefreshCcw size={28} />
                再來一局
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
