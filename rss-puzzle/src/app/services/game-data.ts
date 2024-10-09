export type GameData = {
    level: number;
    round: number;
    onLoadRound: number;
    onLoadLevel: number;
    maxRoundOfLevel: number;
    currentRow: number;
    currentPuctire: string;
    currentAnswerSentence: string;
    correctSentence: string;
};

export type CompleteRounds = {
    'level 1': number[];
    'level 2': number[];
    'level 3': number[];
    'level 4': number[];
    'level 5': number[];
    'level 6': number[];
};

export type GameStatistic = {
    gameStats: GameData;
    roundsCompleted: CompleteRounds;
};

export const gameData: GameData = {
    level: 0,
    round: 0,
    onLoadRound: 0,
    onLoadLevel: 0,
    currentRow: 1,
    maxRoundOfLevel: 0,
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

export const statisticGame: GameStatistic = {
    gameStats: gameData,
    roundsCompleted: completedRound,
};
