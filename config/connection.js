import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();


const db_conn = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function connectToDatabase(){
    try{
        const db_conn = await connection.getConnection();
        console.log('Database connected');
        

    }
    catch(error){
        console.log('Database connection failed');
    }

}

export default db_conn;
