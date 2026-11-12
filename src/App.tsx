import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { Timer, Trophy, ArrowLeft, ArrowRight, RotateCcw, Play, Sparkles } from 'lucide-react';
import './App.css';

interface Quiz {
  id: number;
  question: string;
  left: string;
  right: string;
  correct: 'left' | 'right';
  category: string;
  mascot: string; // ご当地キャラ絵文字
  scenery: string; // 景観イラスト絵文字
}

const CONGRAT_MESSAGES = [
  "🎉 すごいね！日本マスター！ 🎉",
  "✨ やったね！全国制覇達成！ ✨",
  "🌸 素晴らしい！ご当地博士！ 🌸",
  "🏆 超絶クリア！完璧だよ！ 🏆"
];

const QUIZ_DATABASE: Quiz[] = [
  { id: 1, question: "阿波踊りで有名なのはどちらの県？", left: "愛媛県", right: "徳島県", correct: "right", category: "祭り・伝統", mascot: "🦝", scenery: "👘" },
  { id: 2, question: "天守が「国宝」に指定されている城はどちら？", left: "姫路城", right: "大阪城", correct: "left", category: "史跡・城", mascot: "🏯", scenery: "🌸" },
  { id: 3, question: "「日本三景」の一つ、天橋立がある都道府県は？", left: "京都府", right: "宮城県", correct: "left", category: "名所", mascot: "⛩️", scenery: "🌊" },
  { id: 4, question: "日本一高い山「富士山」がまたがるのは静岡県とどこ？", left: "長野県", right: "山梨県", correct: "right", category: "自然・名所", mascot: "🗻", scenery: "☀️" },
  { id: 5, question: "草津温泉がある都道府県は？", left: "群馬県", right: "栃木県", correct: "left", category: "温泉・観光", mascot: "♨️", scenery: "🐒" },
  { id: 6, question: "「道後温泉」がある都道府県は？", left: "愛媛県", right: "香川県", correct: "left", category: "温泉・観光", mascot: "🍊", scenery: "♨️" },
  { id: 7, question: "さっぽろ雪まつりが開催される北海道の都市は？", left: "札幌市", right: "函館市", correct: "left", category: "祭り", mascot: "🐻", scenery: "☃️" },
  { id: 8, question: "厳島神社の大鳥居がある都道府県は？", left: "山口県", right: "広島県", correct: "right", category: "世界遺産", mascot: "🦌", scenery: "⛩️" },
  { id: 9, question: "「兼六園」がある都市はどちら？", left: "金沢市", right: "岡山市", correct: "left", category: "庭園", mascot: "🍡", scenery: "🌲" },
  { id: 10, question: "「ねぶた祭」が開催される都道府県は？", left: "秋田県", right: "青森県", correct: "right", category: "祭り・伝統", mascot: "👹", scenery: "🏮" },
  { id: 11, question: "世界遺産の「白川郷」がある都道府県は？", left: "岐阜県", right: "富山県", correct: "left", category: "世界遺産", mascot: "🏠", scenery: "❄️" },
  { id: 12, question: "出雲大社がある都道府県は？", left: "鳥取県", right: "島根県", correct: "right", category: "神社・仏閣", mascot: "🐰", scenery: "⛩️" },
  { id: 13, question: "「日光東照宮」がある都道府県は？", left: "栃木県", right: "茨城県", correct: "left", category: "世界遺産", mascot: "🙈", scenery: "🌲" },
  { id: 14, question: "「首里城公園」がある都道府県は？", left: "鹿児島県", right: "沖縄県", correct: "right", category: "史跡・城", mascot: "🦁", scenery: "🌺" },
  { id: 15, question: "「讃岐うどん」の本場はどちらの県？", left: "香川県", right: "徳島県", correct: "left", category: "グルメ", mascot: "🍜", scenery: "🌾" },
  // ... 100問の基本データ
];

export default function App() {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizzes, setQuizzes] = useState<Quiz[]>(QUIZ_DATABASE);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [congratMsg, setCongratMsg] = useState("");

  const x = useMotionValue(0);
  const controls = useAnimation();
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const leftOpacity = useTransform(x, [-150, -20], [1, 0]);
  const rightOpacity = useTransform(x, [20, 150], [0, 1]);

  const startNewGame = () => {
    const shuffled = [...QUIZ_DATABASE].sort(() => Math.random() - 0.5);
    setQuizzes(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(60);
    setGameState('PLAYING');
  };

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('GAMEOVER');
          // ランダムお祝いメッセージ
          const msg = CONGRAT_MESSAGES[Math.floor(Math.random() * CONGRAT_MESSAGES.length)];
          setCongratMsg(msg);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  const handleAnswer = (direction: 'left' | 'right') => {
    const currentQuiz = quizzes[currentIndex];
    if (currentQuiz.correct === direction) {
      setScore((prev) => prev + 10);
    }
    setCurrentIndex((prev) => (prev + 1) % quizzes.length);
    x.set(0);
  };

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 80;
    if (info.offset.x < -threshold) {
      controls.start({ x: -300, opacity: 0 }).then(() => {
        handleAnswer('left');
        controls.set({ x: 0, opacity: 1 });
      });
    } else if (info.offset.x > threshold) {
      controls.start({ x: 300, opacity: 0 }).then(() => {
        handleAnswer('right');
        controls.set({ x: 0, opacity: 1 });
      });
    } else {
      controls.start({ x: 0 });
    }
  };

  const currentQuiz = quizzes[currentIndex];
  const correctCount = score / 10;
  const isKusudamaUnlocked = correctCount >= 15; // 15問以上でくす玉演出

  return (
    <div className="app-container">
      {/* 動く波背景 */}
      <div className="wave-container">
        <motion.div
          animate={{ x: [0, -100, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        >
          <svg className="wave-svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path fill="rgba(0, 180, 216, 0.4)" d="M0,0 C150,90 350,-40 500,65 C650,170 900,10 1200,40 L1200,120 L0,120 Z"></path>
          </svg>
        </motion.div>
      </div>

      <div className="header">
        <div className="stat-box">
          <Timer size={22} color="#ffb703" />
          <span>残り:</span>
          <span className="stat-value">{timeLeft}s</span>
        </div>
        <div className="stat-box">
          <Trophy size={22} color="#ffb703" />
          <span>正解数:</span>
          <span className="stat-value">{correctCount}問</span>
        </div>
      </div>

      {gameState === 'PLAYING' && currentQuiz && (
        <div className="game-area">
          <div className="card-wrapper">
            <motion.div
              className="card"
              style={{ x, rotate }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              animate={controls}
            >
              <span className="category-tag">{currentQuiz.category}</span>

              {/* 動くご当地キャラ＆景観エリア */}
              <div className="scenery-display">
                <motion.span
                  className="scenery-icon"
                  animate={{ scale: [0.9, 1.1, 0.9] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  {currentQuiz.scenery}
                </motion.span>
                <motion.span
                  className="mascot-avatar"
                  animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  {currentQuiz.mascot}
                </motion.span>
              </div>

              <div className="question-text">{currentQuiz.question}</div>

              <div className="flick-indicators">
                <motion.div className="option-badge option-left" style={{ opacity: leftOpacity }}>
                  <ArrowLeft size={16} /> {currentQuiz.left}
                </motion.div>
                <motion.div className="option-badge option-right" style={{ opacity: rightOpacity }}>
                  {currentQuiz.right} <ArrowRight size={16} />
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="flick-indicators" style={{ marginTop: '24px', maxWidth: '350px' }}>
            <button className="option-badge option-left" onClick={() => handleAnswer('left')}>
              <ArrowLeft size={18} /> {currentQuiz.left}
            </button>
            <button className="option-badge option-right" onClick={() => handleAnswer('right')}>
              {currentQuiz.right} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {gameState === 'START' && (
        <div className="overlay-screen">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Sparkles size={60} color="#ffb703" />
          </motion.div>
          <h1 className="title">日本ご当地<br />フリッククイズ</h1>
          <p className="subtitle">60秒で何問解ける？<br />15問以上正解で豪華くす玉が割れるよ！</p>
          <button className="btn-start" onClick={startNewGame}>
            <Play size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
            ゲームスタート
          </button>
        </div>
      )}

      {gameState === 'GAMEOVER' && (
        <div className="overlay-screen">
          {/* 15問以上正解でくす玉演出 */}
          {isKusudamaUnlocked ? (
            <>
              <div className="kusudama-container">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.6 }}
                  className="kusudama-ball"
                >
                  🎊
                </motion.div>
                {/* 紙吹雪演出 */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="confetti-particle"
                    style={{
                      background: ['#ffb703', '#fb8500', '#00b4d8', '#e63946'][i % 4],
                      left: '50%',
                      top: '50%'
                    }}
                    animate={{
                      x: (Math.random() - 0.5) * 300,
                      y: (Math.random() - 0.5) * 400,
                      opacity: [1, 0],
                      rotate: 360
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() * 0.5 }}
                  />
                ))}
              </div>
              <div className="congratulation-msg">{congratMsg}</div>
            </>
          ) : (
            <h2 className="title">タイムアップ！</h2>
          )}

          <p className="subtitle">最終スコア</p>
          <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#ffb703' }}>{score}点</div>
          <p className="subtitle" style={{ marginTop: '-10px' }}>（正解数: {correctCount} 問）</p>

          <button className="btn-start" onClick={startNewGame} style={{ marginTop: '16px' }}>
            <RotateCcw size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
            もう一度遊ぶ
          </button>
        </div>
      )}
    </div>
  );
}