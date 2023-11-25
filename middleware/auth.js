import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);
        if(!token){
            res.status(403).json({ message: 'Token is missing' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const authenticateByRole = (role) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.userType === role) {
                req.user = decoded;
                next();
            } else {
                res.status(403).json({ message: 'Forbidden' });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

const admin = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);

        if (decoded.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const authenticateByRoleAndEmail = (role) => {
    return (req, res, next) => {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);
  
    
        if (decoded.role === role) {
        
          if (decoded.email === req.body.email) {
            req.user = decoded;
            next();
          } else {
            res.status(403).json({ message: 'Forbidden - You can only update your own profile' });
          }
        } else {
          res.status(403).json({ message: 'Forbidden' });
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
  };

export { authenticate, authenticateByRole, admin,authenticateByRoleAndEmail };