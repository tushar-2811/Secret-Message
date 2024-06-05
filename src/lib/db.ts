import mongoose from "mongoose";

type connectionObject = {
    isConnected ?: number
}

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
     if(connection.isConnected){
        console.log("Database already connected");
        return;
     }

     try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '');

        connection.isConnected = db.connections[0].readyState;

        console.log("DB Connected Successfully");
     } catch (error) {
        console.log("Error while connecting to db" , error);
        process.exit(1);
     }
}

export default dbConnect;