import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, Star, Play, RefreshCcw, Trophy, Smile, Frown, Check, X, Music } from 'lucide-react';

// --- 資料庫 (Dictionary) ---
// 包含 60 個適合兒童學習的常用單字，涵蓋動物、食物、身體部位、數字、顏色與自然
const WORD_DATABASE = [
  // 動物 Animals
  { word: "貓", jyutping: "maau1" }, { word: "狗", jyutping: "gau2" },
  { word: "魚", jyutping: "jyu2" }, { word: "鳥", jyutping: "niu5" },
  { word: "豬", jyutping: "zyu1" }, { word: "牛", jyutping: "ngau4" },
  { word: "羊", jyutping: "joeng4" }, { word: "馬", jyutping: "maa5" },
  { word: "雞", jyutping: "gai1" }, { word: "鴨", jyutping: "aap3" },
  { word: "兔", jyutping: "tou3" }, { word: "熊", jyutping: "hung4" },
  { word: "虎", jyutping: "fu2" }, { word: "獅", jyutping: "si1" },
  { word: "象", jyutping: "zoeng6" },

  // 食物 Food
  { word: "水", jyutping: "seoi2" }, { word: "飯", jyutping: "faan6" },
  { word: "麵", jyutping: "min6" }, { word: "蛋", jyutping: "daan2" },
  { word: "包", jyutping: "baau1" }, { word: "菜", jyutping: "coi3" },
  { word: "果", jyutping: "gwo2" }, { word: "糖", jyutping: "tong2" },
  { word: "奶", jyutping: "naai5" }, { word: "餅", jyutping: "beng2" },

  // 身體 Body
  { word: "頭", jyutping: "tau4" }, { word: "手", jyutping: "sau2" },
  { word: "腳", jyutping: "goek3" }, { word: "眼", jyutping: "ngaan5" },
  { word: "耳", jyutping: "ji5" }, { word: "口", jyutping: "hau2" },
  { word: "鼻", jyutping: "bei6" }, { word: "牙", jyutping: "ngaa4" },
  
  // 自然 Nature & Objects
  { word: "天", jyutping: "tin1" }, { word: "地", jyutping: "dei6" },
  { word: "日", jyutping: "jat6" }, { word: "月", jyutping: "jyut6" },
  { word: "星", jyutping: "sing1" }, { word: "花", jyutping: "faa1" },
  { word: "草", jyutping: "cou2" }, { word: "樹", jyutping: "syu6" },
  { word: "山", jyutping: "saan1" }, { word: "水", jyutping: "seoi2" },
  { word: "門", jyutping: "mun4" }, { word: "窗", jyutping: "coeng1" },
  { word: "書", jyutping: "syu1" }, { word: "筆", jyutping: "bat1" },

  // 顏色 Colors
  { word: "紅", jyutping: "hung4" }, { word: "黃", jyutping: "wong4" },
  { word: "藍", jyutping: "laam4" }, { word: "綠", jyutping: "luk6" },
  { word: "白", jyutping: "baak6" }, { word: "黑", jyutping: "hak1" },

  // 人稱 & 其他 People & Others
  { word: "我", jyutping: "ngo5" }, { word: "你", jyutping: "nei5" },
  { word: "他", jyutping: "taa1" }, { word: "好", jyutping: "hou2" },
  { word: "大", jyutping: "daai6" }, { word: "小", jyutping: "siu2" },
  { word: "多", jyutping: "do1" }, { word: "少", jyutping: "siu2" }
];

// --- 輔助函式 ---

// 語音播放
const speakCantonese = (text) => {
  // 取消之前的發音，避免重疊
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-HK'; // 關鍵：設定為粵語 (香港)
  utterance.rate = 0.8; //稍微放慢語速，適合兒童
  utterance.pitch = 1.1; // 稍微提高音調，聽起來更親切
  
  // 錯誤處理與 fallback 提示 (console only)
  utterance.onerror = (e) => console.error("Speech Error:", e);
  
  window.speechSynthesis.speak(utterance);
};

// 隨機洗牌陣列
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

// --- 主應用程式 ---

export default function CantoneseLearningApp() {
  // 遊戲狀態: 'start', 'playing', 'finished'
  const [gameState, setGameState] = useState('start');
  
  // 遊戲數據
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [targetWord, setTargetWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null); // null, true, false
  const [selectedOption, setSelectedOption] = useState(null);
  
  const TOTAL_ROUNDS = 10;

  // 開始新遊戲
  const startGame = () => {
    setScore(0);
    setRound(1);
    setGameState('playing');
    generateQuestion();
  };

  // 生成題目
  const generateQuestion = useCallback(() => {
    setHasAnswered(false);
    setIsCorrect(null);
    setSelectedOption(null);

    // 1. 隨機選一個正確答案
    const targetIndex = Math.floor(Math.random() * WORD_DATABASE.length);
    const target = WORD_DATABASE[targetIndex];
    setTargetWord(target);

    // 2. 隨機選一個干擾項 (必須與正確答案不同)
    let distractorIndex;
    do {
      distractorIndex = Math.floor(Math.random() * WORD_DATABASE.length);
    } while (distractorIndex === targetIndex);
    const distractor = WORD_DATABASE[distractorIndex];

    // 3. 混合選項
    const newOptions = shuffleArray([target, distractor]);
    setOptions(newOptions);

    // 延遲一點點播放聲音，讓 UI 先渲染好，並確保不與轉場音效衝突
    setTimeout(() => {
      speakCantonese(target.word);
    }, 500);

  }, []);

  // 處理回答
  const handleAnswer = (selected) => {
    if (hasAnswered) return; // 防止重複點擊

    setHasAnswered(true);
    setSelectedOption(selected);

    const correct = selected.word === targetWord.word;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      // 播放快樂音效或正面語音 (這裡用 TTS 簡單替代)
      // speakCantonese("好叻！"); 
    } else {
      // speakCantonese("再試一次");
    }

    // 自動進入下一題或結束
    setTimeout(() => {
      if (round >= TOTAL_ROUNDS) {
        setGameState('finished');
      } else {
        setRound(prev => prev + 1);
        generateQuestion();
      }
    }, 2000); // 2秒後跳轉，讓小朋友有時間看回饋
  };

  // 重新發音
  const handleReplayAudio = () => {
    if (targetWord) {
      speakCantonese(targetWord.word);
    }
  };

  // --- 畫面渲染組件 ---

  // 1. 開始畫面
  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-200 flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-orange-400 text-center max-w-md w-full transform transition hover:scale-105 duration-300">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-400 p-4 rounded-full">
              <Music size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-orange-600 mb-2">粵語小學堂</h1>
          <p className="text-gray-500 mb-8 text-lg">聽聽看，選出正確的字！</p>
          
          <button 
            onClick={startGame}
            className="w-full bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            <Play fill="currentColor" />
            開始遊戲
          </button>
        </div>
      </div>
    );
  }

  // 2. 結算畫面
  if (gameState === 'finished') {
    let message = "";
    let icon = null;
    let color = "";

    if (score === TOTAL_ROUNDS) {
      message = "粵語小天才！太厲害了！";
      icon = <Trophy size={64} className="text-yellow-500" />;
      color = "bg-yellow-100 border-yellow-400";
    } else if (score >= 6) {
      message = "做得很好！繼續加油！";
      icon = <Smile size={64} className="text-green-500" />;
      color = "bg-green-100 border-green-400";
    } else {
      message = "再玩一次，你會更棒！";
      icon = <Star size={64} className="text-blue-500" />;
      color = "bg-blue-100 border-blue-400";
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-200 to-purple-200 flex flex-col items-center justify-center p-4">
        <div className={`bg-white p-8 rounded-3xl shadow-xl border-4 ${color} text-center max-w-md w-full`}>
          <div className="flex justify-center mb-6 animate-bounce">
            {icon}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">遊戲結束</h2>
          <div className="text-6xl font-black text-gray-800 mb-4">{score} / {TOTAL_ROUNDS}</div>
          <p className="text-xl text-gray-600 mb-8 font-medium">{message}</p>
          
          <button 
            onClick={startGame}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw />
            再來一局
          </button>
        </div>
      </div>
    );
  }

  // 3. 遊戲進行畫面
  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center p-4">
      {/* 頂部資訊列 */}
      <div className="w-full max-w-lg flex justify-between items-center bg-white p-4 rounded-2xl shadow-md mb-6 border-2 border-sky-200">
        <div className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-600 p-2 rounded-lg font-bold text-lg flex items-center gap-1">
            <Star size={20} fill="currentColor" />
            {score} 分
          </span>
        </div>
        <div className="flex-1 mx-4">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-sky-500 h-4 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${(round / TOTAL_ROUNDS) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="text-gray-500 font-bold">
          {round}/{TOTAL_ROUNDS}
        </div>
      </div>

      {/* 遊戲主區域 */}
      <div className="w-full max-w-lg flex-1 flex flex-col items-center justify-center relative">
        
        {/* 聽力播放按鈕 */}
        <div className="mb-10 relative">
          <button 
            onClick={handleReplayAudio}
            className="bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-white w-40 h-40 rounded-full shadow-2xl border-b-8 border-yellow-600 flex flex-col items-center justify-center transition-all group"
          >
            <Volume2 size={64} className="text-yellow-900 group-hover:scale-110 transition-transform" />
            <span className="text-yellow-900 font-bold mt-2 text-lg">聽聽看</span>
          </button>
          
          {/* 裝飾性音波動畫 */}
          <div className="absolute -z-10 top-0 left-0 w-full h-full animate-ping rounded-full bg-yellow-200 opacity-75"></div>
        </div>

        {/* 提示文字 */}
        <h2 className="text-2xl font-bold text-sky-800 mb-8 tracking-wide">
          請問這是哪一個字？
        </h2>

        {/* 選項按鈕區 */}
        <div className="grid grid-cols-2 gap-6 w-full">
          {options.map((option, index) => {
            let buttonStyle = "bg-white border-b-8 border-gray-200 text-gray-800 hover:bg-gray-50"; // 預設樣式
            let icon = null;

            if (hasAnswered) {
              if (option.word === targetWord.word) {
                // 正確答案樣式 (綠色)
                buttonStyle = "bg-green-100 border-green-500 text-green-700 ring-4 ring-green-300";
                icon = <Check className="absolute top-2 right-2 text-green-600" size={32} />;
              } else if (selectedOption.word === option.word) {
                // 選錯的樣式 (紅色)
                buttonStyle = "bg-red-100 border-red-500 text-red-700 opacity-60";
                icon = <X className="absolute top-2 right-2 text-red-600" size={32} />;
              } else {
                // 其他未選的錯誤選項
                buttonStyle = "bg-gray-100 border-gray-200 text-gray-400 opacity-50";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={hasAnswered}
                className={`
                  relative h-40 rounded-3xl text-6xl font-black shadow-lg transition-all duration-200
                  flex flex-col items-center justify-center
                  ${buttonStyle}
                  ${!hasAnswered ? 'hover:-translate-y-1 hover:shadow-xl active:border-b-0 active:translate-y-1' : ''}
                `}
              >
                {icon}
                <span className="mb-2">{option.word}</span>
                {/* 顯示拼音 (作答後或想降低難度可開啟，這裡設定為作答後才顯示，增加學習效果) */}
                {hasAnswered && (
                  <span className="text-lg font-medium opacity-80 font-sans">{option.jyutping}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* 答題回饋 (浮層) */}
        {hasAnswered && (
          <div className={`mt-8 px-6 py-3 rounded-full flex items-center gap-3 shadow-lg animate-bounce ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isCorrect ? <Smile size={28} /> : <Frown size={28} />}
            <span className="text-xl font-bold">
              {isCorrect ? '答對了！好棒！' : '哎呀，正確答案是這個！'}
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
