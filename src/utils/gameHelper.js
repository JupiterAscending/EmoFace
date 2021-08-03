const prompts = ["angry", "disgusted", "fearful", "happy", "neutral", "sad", "surprised"];

export const generatePrompt = () => {
  const index = Math.floor(Math.random() * prompts.length);
  const prompt = prompts[index];
  return prompt;
};
export const faces = {
  angry: "😠",
  disgusted: "🤢",
  fearful: "😨",
  happy: "😊",
  neutral: "😐",
  sad: "🥺",
  surprised: "😲",
};

export const calculateScore = (detectionsWithExpressions, prompt) => {
  if (detectionsWithExpressions[0]) {
    const float = parseFloat(detectionsWithExpressions[0].expressions[prompt]);
    const multiplied = float * 100;
    const score = multiplied.toFixed(2);
    return score;
  }
};
