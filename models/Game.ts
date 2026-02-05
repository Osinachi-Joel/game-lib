import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IGame extends Document {
    id: string; // The UUID provided by the client/scraper
    name: string;
    url: string;
    icon?: string;
    platform?: string; // e.g., 'steam', 'epic', 'browser', etc.
    coverImage?: string;
    createdAt: Date;
    updatedAt: Date;
}

const GameSchema = new Schema<IGame>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        name: {
            type: String,
            required: [true, 'Please provide a name for this game.']
        },
        url: {
            type: String,
            required: [true, 'Please provide a URL for this game.'],
            unique: true
        },
        icon: {
            type: String
        },
        platform: {
            type: String
        },
        coverImage: {
            type: String
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt
    }
);

// Prevent overwriting model during hot reloads
const Game: Model<IGame> = mongoose.models.Game || mongoose.model<IGame>('Game', GameSchema);

export default Game;
