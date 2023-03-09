const { UnauthenticatedError, UnauthorizedError } = require("../utils/error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { userRoles } = require("../constants/users");

exports.register = async (req, res) => {
  const { user_name, password, email } = req.body;
  console.log(req.body);

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  const [results, metadata] = await sequelize.query(
    "SELECT id FROM user LIMIT 1"
  );
  // prettier-ignore
  await sequelize.query(
			'INSERT INTO user (user_name, password, email, role ) VALUES ($user_name, $password, $email, "user")', 
			{
				bind: {
          user_name: user_name,
					password: hashedpassword,
					email: email,
          
				},
			}
		)

  return res.status(201).json({
    message: "Registration succeeded. Please log in.",
  });
};

exports.login = async (req, res) => {
  const { email, password: canditatePassword } = req.body;

  // prettier-ignore
  const [user, metadata] = await sequelize.query(
		'SELECT * FROM user WHERE email = $email LIMIT 1;', {
		bind: { email},
		type: QueryTypes.SELECT
	})

  if (!user) throw new UnauthenticatedError("Invalid Credentials");

  // @ts-ignore
  const isPasswordCorrect = await bcrypt.compare(
    canditatePassword,
    user.password
  );
  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

  const jwtPayload = {
    // @ts-ignore
    userId: user.id,
    // @ts-ignore
    email: user.email,
    role: user.role,
    /* userRoles.admin === user.role
        ? userRoles.admin
        : userRoles.user
        
        ? userRoles.owner 
        : userRoles.owner,*/
  };

  const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res.json({ token: jwtToken, user: jwtPayload });
};
