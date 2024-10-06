type GameData = {
    level: number;
    round: number;
    currentRow: number;
    currentPuctire: string;
    currentAnswerSentence: string;
    correctSentence: string;
};

export const gameData: GameData = {
    level: 0,
    round: 0,
    currentRow: 1,
    currentPuctire: '',
    currentAnswerSentence: '',
    correctSentence: '',
};
