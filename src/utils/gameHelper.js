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
