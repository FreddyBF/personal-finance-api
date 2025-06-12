import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { connectDB } from './config/database';

const port = process.env.PORT || 3000;

async function main() {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Acess at: http//:localhost:${port}`);
        });
    } catch (error) {
        console.error(`Failed to start server: ${error}`);
        process.exit(1);
    }
}

main();
