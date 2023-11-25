import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import db_conn from '../config/connection.js';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'domenico.dickinson31@ethereal.email',
      pass: 'TP7z65rufu6dsQCcnw'
  }
});


export const registerUser = async (req, res) => {
  try {
      const { username, userType, password } = req.body;
      const email = req.body.email;
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log(email);

      // console.log(username, email, userType, hashedPassword);
      const isEmailUnique = await db_conn.query('SELECT * FROM users WHERE email = ?', [email]);
      console.log(isEmailUnique);
      console.log(isEmailUnique[0].length)

      if (isEmailUnique[0].length > 0) {
        
          return res.status(400).json({ message: 'User already exists' });
      }

      
      const createUserTable = `CREATE TABLE IF NOT EXISTS USERS (
          ID INT AUTO_INCREMENT PRIMARY KEY,
          USERNAME VARCHAR(255) NOT NULL,
          EMAIL VARCHAR(255) NOT NULL UNIQUE,
          USERTYPE VARCHAR(255) NOT NULL,
          PASSWORD VARCHAR(255) NOT NULL,
          RESETTOKEN VARCHAR(255)
      )`;
      await db_conn.query(createUserTable);

    
      const insertUserQuery = `
      INSERT INTO users (username, email, userType, password)
      VALUES (?, ?, ?, ?)
  `;
    const insertUser = await db_conn.query(insertUserQuery, [username, email, userType, hashedPassword]);

      if (insertUser) {
          return res.status(201).json({ message: 'User created successfully' });
      } else {
          return res.status(500).json({ message: 'Failed to create user' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginUser = async (req, res) => {
  const email = req.body.email;
  console.log(email);
  const password = req.body.password;
  console.log(password);

  const user = await db_conn.query('SELECT * FROM users WHERE email = ?', [email]);
  
  console.log(user[0]);
  // console.log(JSON.stringify(user[0]),"user");
  // console.log(user["ID"]); // Check the structure of the result

 
    // console.log(user[0][0].email);
    // console.log(user[0][0].userType);
    console.log(user[0][0].EMAIL);
    console.log(user[0].USERTYPE);
    
  if (user.length > 0) {
    
    console.log(user[0][0].PASSWORD);
    const isPasswordCorrect = await bcrypt.compare(req.body.password,user[0][0].PASSWORD);
    console.log(isPasswordCorrect);

    if (isPasswordCorrect) {
      const token = jwt.sign(
        { email: user[0][0].EMAIL, id: user[0][0].ID, role: user[0][0].USERTYPE },
        process.env.JWT_SECRETE_KEY,
        { expiresIn: '24h' }
      );

      res.status(200).json({ token });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(400).json({ message: 'User not found' });
  }
};


export const getUserDetails = async(req,res) =>{
    const {id} = req.body;

    const user = await db_conn.query('SELECT * FROM users WHERE id = ?',[id]);
    if(user.length > 0){
        const userDetails = user[0];
        res.status(200).json({result:userDetails});
    }
    else{
        res.status(400).json({message:'User not found'});
    }
}
export const getUserByEmail = async(req,res) =>{
    const {email} = req.body;

    const user = await db_conn.query("SELECT * FROM users WHERE email = ?",[email]);
    if(user.length > 0){
        res.status(200).json({result:user});
    }
    else{
        res.status(400).json({message:'User not found'});
    }
}
export const forgotPassword = async (req, res) => {
    try {
      const email = req.body.email;
      console.log(email);
  
      const user = await db_conn.query('SELECT * FROM users WHERE email = ?', [email]);
      console.log(user);
      if (user[0].length > 0) {
        const token = jwt.sign(
          { email: user[0][0].email, id: user[0][0].id, role: user[0][0].userType },
          process.env.JWT_SECRETE_KEY,
          { expiresIn: '24h' }
        );
  
        const updateToken = await db_conn.query('UPDATE users SET resetToken = ? WHERE email = ?', [token, email]);
        
        if (updateToken) {
          const resetLink = `http://localhost:${process.env.PORT}/api/users/resetpassword/${token}`;

          console.log(resetLink);
          console.log(email);
          console.log(req.body.email);
          const mailOptions = {
            from: 'rakeshdontula4423@gmail.com',
            to: 'rakeshdontula66@gmail.com',
            subject: 'Password Reset',
            text: `Click on the link to reset your password: ${resetLink}`,
          };
          if(email){
            transporter.sendMail(mailOptions, (error,info)=>{
              if(error){
                console.error('Error sending email:', error);
                res.status(500).json({message:'Error sending reset email'});
              }else{
                console.log(`Email sent:${email}`,info.response);
                res.status(200).json({result:user,token});
              }
            });
          }
          else{
            res.status(500).json({message:'Email not found'});
          }
        } else {
          res.status(500).json({ message: 'Error generating token' });
        }
      } else {
        res.status(400).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
export  const resetPassword = async (req, res) => {
    try {
      const resetToken = req.params.resetToken;
      console.log(resetToken);
      const newPassword = req.body.password;
      console.log(newPassword);
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      jwt.verify(resetToken, process.env.JWT_SECRETE_KEY, async (err, decoded) => {
        if (err) {
          console.error('Error verifying token:', err);
          res.status(400).json({ message: 'Invalid or expired token' });
        } else {
          const updatePassword = await db_conn.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, decoded.email]);
  
          if (updatePassword) {
            res.status(200).json({ message: 'Password reset successfully' });
          } else {
            res.status(500).json({ message: 'Error resetting password' });
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

export const updateUserProfile = async (req, res) => {
        try {
          const { id } = req.body;
          const { username, email,password } = req.body;
          const salt = await bcrypt.genSalt(12);
          const hashedPassword = await bcrypt.hash(password, salt);
      
          const updateUser = await db_conn.query('UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?', [username, email, hashedPassword, id]);
      
          if (updateUser) {
            res.status(200).json({ message: 'User updated successfully' });
          } else {
            res.status(500).json({ message: 'Error updating user' });
          }
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }

export const getUsers = async (req, res) => {
    try{
        const users = await db_conn.query(`SELECT * FROM USERS`);
        if(users){
            res.status(200).json({result:users});
        }
        else{
            res.status(500).json({message:'Failed to fetch users'});
        }

    }catch(error){
        console.error('Error:',error);
        res.status(500).json({message:'Internal server error'});
    }
} 




export const deleteUser = async (req, res) => {
    try{
        const id = req.params.id;
        console.log(id);
        const deleteUser = await db_conn.query(`DELETE FROM USERS WHERE ID = ?`,[id]);
        if(deleteUser){
            res.status(200).json({message:'User deleted successfully'});
        }
        else{
            res.status(500).json({message:'Failed to delete user'});
        }

    }catch(error){
        console.error('Error:',error);
        res.status(500).json({message:'Internal server error'});
    }
}
  

        



