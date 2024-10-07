type GameData = {
    level: number;
    round: number;
    currentRow: number;
    currentPuctire: string;
    currentAnswerSentence: string;
    correctSentence: string;
};

type CompleteRounds = {
    'level 1': number[];
    'level 2': number[];
    'level 3': number[];
    'level 4': number[];
    'level 5': number[];
    'level 6': number[];
};

export const gameData: GameData = {
    level: 0,
    round: 0,
    currentRow: 1,
    currentPuctire: '',
    currentAnswerSentence: '',
    correctSentence: '',
};

export const completedRound: CompleteRounds = {
    'level 1': [],
    'level 2': [],
    'level 3': [],
    'level 4': [],
    'level 5': [],
    'level 6': [],
};
