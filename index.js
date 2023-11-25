import express from 'express';
import dotenv from 'dotenv';
import userRouter from './Routers/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('API is running');
});

app.use('/api/users', userRouter);




















app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
