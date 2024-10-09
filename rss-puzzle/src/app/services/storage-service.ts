import { GameStatistic, statisticGame } from './game-data';
console.log('storage');
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
}

const storage = new StorageService();

export default storage;
