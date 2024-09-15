import { Collection } from '../../view/main/game/game-data';

async function getJson(url: string): Promise<Collection> {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Collection = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching the JSON:', error);
        throw error;
    }
}

export default getJson;
