const { UnauthenticatedError, UnauthorizedError } = require("../utils/error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { userRoles } = require("../constants/users");

exports.register = async (req, res) => {
  // Place desired username, email and password into local variables
  const { user_name, password, email } = req.body;
  console.log(req.body);
  // Encrypt the desired password
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  // Check if there are users in the database
  const [results, metadata] = await sequelize.query(
    "SELECT id FROM user LIMIT 1"
  );
  // prettier-ignore
  await sequelize.query(
			'INSERT INTO user (user_name, password, email, role ) VALUES ($user_name, $password, $email, "admin")', 
			{
				bind: {
          user_name: user_name,
					password: hashedpassword,
					email: email,
          
				},
			}
		)

  // Request response
  return res.status(201).json({
    message: "Registration succeeded. Please log in.",
  });
};

exports.login = async (req, res) => {
  // Place candidate email and password into local variables
  const { email, password: canditatePassword } = req.body;
  console.log("HEJEHJEHJEHj 1");
  // Check if user with that email exits in db
  // prettier-ignore
  const [user, metadata] = await sequelize.query(
		'SELECT * FROM user WHERE email = $email LIMIT 1;', {
		bind: { email},
		type: QueryTypes.SELECT
	})
  console.log("HEJEHJEHJEHj 2");
  if (!user) throw new UnauthenticatedError("Invalid Credentials");

  // Check if password is correct
  // @ts-ignore
  const isPasswordCorrect = await bcrypt.compare(
    canditatePassword,
    user.password
  );
  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

  console.log("HEJEHJEHJEHj 3");

  //const salt = await bcrypt.genSalt(10);
  //const hashedpassword = await bcrypt.hash(password, salt);

  // Create JWT payload (aka JWT contents)
  const jwtPayload = {
    // @ts-ignore
    userId: user.id,
    // @ts-ignore
    email: user.email,
    role: userRoles.admin === user.role ? userRoles.admin : userRoles.user,
  };

  // Create the JWT token
  const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: /*"1h"*/ "1d",
  });

  // Return the token
  return res.json({ token: jwtToken, user: jwtPayload });
};

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImVtYWlsIjoidXNlcjQ0QHVzZXIuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2Nzc2NTkwODgsImV4cCI6MTY3NzY2MjY4OH0.IyLCYIeJZs01WOEnfSB-MaximqOI-a7K8ePO8qS7Mbo
