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
  { word: "我", jyutping: "ngo5" },
  { word: "你", jyutping: "nei5" },
  { word: "佢", jyutping: "keoi5" },
  { word: "我哋", jyutping: "ngo5 dei6" },
  { word: "你哋", jyutping: "nei5 dei6" },
  { word: "佢哋", jyutping: "keoi5 dei6" },
  { word: "咩", jyutping: "me1" },
  { word: "邊個", jyutping: "bin1 go3" },
  { word: "邊到", jyutping: "bin1 dou6" },
  { word: "點解", jyutping: "dim2 gaai2" },
  { word: "點", jyutping: "dim2" },
  { word: "幾時", jyutping: "gei2 si4" },
  { word: "然後", jyutping: "jin4 hau6" },
  { word: "如果", jyutping: "jyu4 gwo2" },
  { word: "真", jyutping: "zan1" },
  { word: "但係", jyutping: "daan6 hai6" },
  { word: "因為", jyutping: "jan1 wai6" },
  { word: "唔", jyutping: "m4" },
  { word: "呢個", jyutping: "ni1 go3" },
  { word: "我要呢個", jyutping: "ngo5 jiu3 ni1 go3" },
  { word: "呢個幾錢？", jyutping: "ni1 go3 gei2 cin2" },
  { word: "嗰個", jyutping: "go2 go3" },
  { word: "所有", jyutping: "so2 jau5" },
  { word: "或者", jyutping: "waak6 ze2" },
  { word: "同", jyutping: "tung4" },
  { word: "知", jyutping: "zi1" },
  { word: "我知", jyutping: "ngo5 zi1" },
  { word: "我唔知", jyutping: "ngo5 m4 zi1" },
  { word: "諗", jyutping: "nam2" },
  { word: "來", jyutping: "loi4" },
  { word: "放", jyutping: "fong3" },
  { word: "攞", jyutping: "lo2" },
  { word: "搵到", jyutping: "wan2 dou3" },
  { word: "聽", jyutping: "ting1" },
  { word: "做嘢", jyutping: "zou6 je5" },
  { word: "講", jyutping: "gong2" },
  { word: "畀", jyutping: "bei2" },
  { word: "鐘意", jyutping: "zung1 ji3" },
  { word: "幫", jyutping: "bong1" },
  { word: "愛", jyutping: "oi3" },
  { word: "打電話", jyutping: "daa2 din6 waa2" },
  { word: "等", jyutping: "dang2" },
  { word: "我鐘意你", jyutping: "ngo5 zung1 ji3 nei5" },
  { word: "我唔鐘意呢個", jyutping: "ngo5 m4 zung1 ji3 ni1 go3" },
  { word: "你愛唔愛我呀?", jyutping: "nei5 oi3 m4 oi3 ngo5 aa3" },
  { word: "我愛你", jyutping: "ngo5 oi3 nei5" },
  { word: "零", jyutping: "ling4" },
  { word: "一", jyutping: "jat1" },
  { word: "二", jyutping: "ji6" },
  { word: "三", jyutping: "saam1" },
  { word: "四", jyutping: "sei3" },
  { word: "五", jyutping: "ng5" },
  { word: "六", jyutping: "luk6" },
  { word: "有", jyutping: "jau5" },
  { word: "冇", jyutping: "mou5" },
  { word: "係", jyutping: "hai6" },
  { word: "唔係", jyutping: "m4 hai6" },
  { word: "識", jyutping: "sik1" },
  { word: "唔識", jyutping: "m4 sik1" },
  { word: "想", jyutping: "soeng2" },
  { word: "唔想", jyutping: "m4 soeng2" },
  { word: "去", jyutping: "heoi3" },
  { word: "嚟", jyutping: "lai4" },
  { word: "食", jyutping: "sik6" },
  { word: "飲", jyutping: "jam2" },
  { word: "睇", jyutping: "tai2" },
  { word: "做", jyutping: "zou6" },
  { word: "返", jyutping: "faan1" },
  { word: "買", jyutping: "maai5" },
  { word: "賣", jyutping: "maai6" },
  { word: "錢", jyutping: "cin2" },
  { word: "幾多", jyutping: "gei2 do1" },
  { word: "時間", jyutping: "si4 gaan3" },
  { word: "今日", jyutping: "gam1 jat6" },
  { word: "聽日", jyutping: "ting1 jat6" },
  { word: "琴日", jyutping: "kam4 jat6" },
  { word: "早上", jyutping: "zou2 soeng6" },
  { word: "下晝", jyutping: "haa6 zau3" },
  { word: "晚", jyutping: "maan5" },
  { word: "早晨", jyutping: "zou2 san4" },
  { word: "午安", jyutping: "ng5 on1" },
  { word: "晚安", jyutping: "maan5 on1" },
  { word: "你好", jyutping: "nei5 hou2" },
  { word: "再見", jyutping: "zoi3 gin3" },
  { word: "唔該", jyutping: "m4 goi1" },
  { word: "多謝", jyutping: "do1 ze6" },
  { word: "對唔住", jyutping: "deoi3 m4 zyu6" },
  { word: "唔好意思", jyutping: "m4 hou2 ji3 si1" },
  { word: "唔使客氣", jyutping: "m4 sai2 haak3 hei3" },
  { word: "朋友", jyutping: "pang4 jau5" },
  { word: "屋企", jyutping: "uk1 kei2" },
  { word: "大", jyutping: "daai6" },
  { word: "細", jyutping: "sai3" },
  { word: "好", jyutping: "hou2" },
  { word: "靚", jyutping: "leng3" },
  { word: "凍", jyutping: "dung3" },
  { word: "熱", jyutping: "jit6" },
  { word: "開心", jyutping: "hoi1 sam1" },
  { word: "鍾意", jyutping: "zung1 ji3" },
  { word: "冇問題", jyutping: "mou5 man6 tai4" },
  { word: "明唔明", jyutping: "ming4 m4 ming4" },
  { word: "明白", jyutping: "ming4 baak6" },
  { word: "唔明白", jyutping: "m4 ming4 baak6" },
  { word: "知道", jyutping: "zi1 dou3" },
  { word: "唔知", jyutping: "m4 zi1" },
  { word: "喺", jyutping: "hai2" },
  { word: "邊度", jyutping: "bin1 dou6" },
  { word: "洗手間", jyutping: "sai2 sau2 gaan1" },
  { word: "廁所", jyutping: "ci3 so2" },
  { word: "食飯", jyutping: "sik6 faan6" },
  { word: "飲水", jyutping: "jam2 seoi2" },
  { word: "學習", jyutping: "hok6 zaap6" },
  { word: "工作", jyutping: "gung1 zok3" },
  { word: "學校", jyutping: "hok6 haau6" },
  { word: "學生", jyutping: "hok6 sang1" },
  { word: "老師", jyutping: "lou5 si1" },
  { word: "書", jyutping: "syu1" },
  { word: "電腦", jyutping: "din6 nou5" },
  { word: "電話", jyutping: "din6 waa2" },
  { word: "坐", jyutping: "co5" },
  { word: "行", jyutping: "haang4" },
  { word: "咪", jyutping: "mai6" },
  { word: "正", jyutping: "zing3" },
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
    setTimeout(() => speak(newQuestion.target.word), 5000);
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
        setTimeout(() => speak(newQuestion.target.word), 5000);
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
