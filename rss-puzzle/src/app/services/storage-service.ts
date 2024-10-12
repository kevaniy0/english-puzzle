import { GameStatistic, statisticGame } from './game-data';
type User = {
    readonly firstName: string;
    readonly lastName: string;
};

type UserHints = {
    backgroundHint: boolean;
    pronounceHint: boolean;
    translateHint: boolean;
    pronounceSentence: boolean;
};

type UserData = {
    user: User;
    settings: UserHints;
    statistic: GameStatistic;
};

const userDefaultSettings = {
    backgroundHint: true,
    pronounceHint: true,
    translateHint: true,
    pronounceSentence: true,
};

class StorageService {
    private readonly USER_KEY = 'english_puzzle_user_1';
    public USER_DATA: UserData | null = null;

    constructor() {
        this.getUser();
    }

    private getUser(): void {
        const user = localStorage.getItem(this.USER_KEY);
        if (user) {
            this.USER_DATA = JSON.parse(user);
            this.USER_DATA!.statistic.gameStats.currentRow = 1;
        }
    }
    public createUser(obj: User): void {
        const user: UserData = {
            user: obj,
            settings: userDefaultSettings,
            statistic: statisticGame,
        };
        this.USER_DATA = user;
        const json = JSON.stringify(user);
        localStorage.setItem(`${this.USER_KEY}`, json);
    }

    public checkUserExistence(): boolean {
        const user = localStorage.getItem(this.USER_KEY);
        if (user) return true;
        return false;
    }

    public updateStorage(): void {
        const json = JSON.stringify(this.USER_DATA);
        localStorage.setItem(this.USER_KEY, json);
    }

    public removeUser(): void {
        localStorage.removeItem(this.USER_KEY);
        this.USER_DATA = null;
    }

    public changeLevel(level: string): void {
        this.USER_DATA!.statistic.gameStats.level = Number(level) - 1;
        this.USER_DATA!.statistic.gameStats.round = 0;
        this.clearStart();
        this.clearSentences();
    }

    public changeRound(round: string): void {
        this.USER_DATA!.statistic.gameStats.round = Number(round) - 1;
        this.clearStart();
        this.clearSentences();
    }

    public clearStart() {
        this.USER_DATA!.statistic.gameStats.currentRow = 1;
        this.USER_DATA!.statistic.gameStats.currentPuctire = '';
        this.USER_DATA!.statistic.gameStats.currentAnswerSentence = '';
        this.USER_DATA!.statistic.gameStats.correctSentence = '';
    }

    public saveCompletedRound() {
        const data = this.USER_DATA?.statistic;
        if (!data) return;
        const level = `level ${data.gameStats.level + 1}` as keyof typeof data.roundsCompleted;
        const round = data.gameStats.round + 1;
        if (!data.roundsCompleted[level][0].includes(round)) {
            data.roundsCompleted[level][0].push(round);
        }
        if (data.roundsCompleted[level][0].length === data.gameStats.maxRoundOfLevel) {
            data.roundsCompleted[level][1] = true;
        }
        if (data.gameStats.round === 5 && data.gameStats.round === data.gameStats.maxRoundOfLevel) {
            data.gameStats.level = 0;
            data.gameStats.round = 0;
        } else if (data.gameStats.round === data.gameStats.maxRoundOfLevel) {
            data.gameStats.level += 1;
            data.gameStats.round = 0;
        } else {
            data.gameStats.round += 1;
        }
    }

    public addToKnown(): void {
        this.USER_DATA?.statistic.gameStats.knownSentences.push(this.USER_DATA.statistic.gameStats.correctSentence);
        this.updateStorage();
    }
    public addToUnknown(): void {
        this.USER_DATA?.statistic.gameStats.unknownSentences.push(this.USER_DATA.statistic.gameStats.correctSentence);
        this.updateStorage();
    }

    public clearSentences(): void {
        this.USER_DATA!.statistic.gameStats.knownSentences.length = 0;
        this.USER_DATA!.statistic.gameStats.unknownSentences.length = 0;
        this.updateStorage();
    }
}

const storage = new StorageService();

export default storage;
