export type GameData = {
    level: number;
    round: number;
    maxRoundOfLevel: number;
    currentRow: number;
    currentPuctire: string;
    currentAnswerSentence: string;
    correctSentence: string;
    autor: string;
    year: string;
    pictureName: string;
};

export type CompleteRounds = {
    'level 1': [number[], boolean];
    'level 2': [number[], boolean];
    'level 3': [number[], boolean];
    'level 4': [number[], boolean];
    'level 5': [number[], boolean];
    'level 6': [number[], boolean];
};

export type GameStatistic = {
    gameStats: GameData;
    roundsCompleted: CompleteRounds;
};

export const gameData: GameData = {
    level: 0,
    round: 0,
    currentRow: 1,
    maxRoundOfLevel: 0,
    currentPuctire: '',
    currentAnswerSentence: '',
    correctSentence: '',
    autor: '',
    year: '',
    pictureName: '',
};

export const completedRound: CompleteRounds = {
    'level 1': [[], false],
    'level 2': [[], false],
    'level 3': [[], false],
    'level 4': [[], false],
    'level 5': [[], false],
    'level 6': [[], false],
};

export const statisticGame: GameStatistic = {
    gameStats: gameData,
    roundsCompleted: completedRound,
};
