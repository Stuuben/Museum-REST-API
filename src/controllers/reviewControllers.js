const { NotFoundError, UnauthorizedError } = require("../utils/error");
const { sequelize } = require("../database/config");
const { userRoles } = require("../constants/users");
const { QueryTypes } = require("sequelize");

exports.getAllReviews = async (req, res) => {
  const [review, metadata] = await sequelize.query("SELECT * FROM review");
  return res.json(review);
};

exports.getReviewsByUserId = async (req, res) => {
  const userId = req.params.userId;
  //const fk = review.fk_user_id;

  const [results, metadata] = await sequelize.query(
    `
  SELECT  review.id, review.comment, review.grade, review.fk_museum_id AS museum, user.user_name AS user, review.fk_user_id
  FROM review
  JOIN user ON user.id = review.fk_user_id
  WHERE review.fk_user_id = $userId

    `,
    {
      bind: { userId },
    }
  );

  if (!results || results.length == 0)
    throw new NotFoundError("That user has not written any reviews");
  return res.json(results);
};

exports.getReviewsByMuseum = async (req, res) => {
  const museumId = req.params.museumId;

  const [review, reviewdata] = await sequelize.query(
    `
  SELECT review.id, review.comment, review.grade, review.fk_museum_id AS museum, review.fk_user_id AS user_ID 
  FROM review
  WHERE review.fk_museum_id = $museumId
    `,
    {
      bind: { museumId },
    }
  );
  if (!review) {
    throw new NotFoundError("That museum does not have any reviews");
  }

  const [results, metadata] = await sequelize.query(
    `
  SELECT  review.id, review.comment, review.grade, review.fk_museum_id AS museum, review.fk_user_id AS user_ID 
  FROM review
  JOIN museum ON museum.id = review.fk_museum_id
  WHERE review.fk_museum_id = $museumId

    `,
    {
      bind: { museumId },
    }
  );
  console.log("EHEJEJHEEJKJEKHEKJHE");
  if (!review || review.length == 0) {
    throw new NotFoundError("That museum does not have any reviews");
  }
  return res.json(results);
};

exports.createNewReview = async (req, res) => {
  const { comment, grade, fk_user_id, fk_museum_id } = req.body;

  const [NewReviewId] = await sequelize.query(
    `
    INSERT INTO review (comment, grade, fk_user_id, fk_museum_id) VALUES (
      $comment, $grade, $fk_user_id, $fk_museum_id
    );
    `,
    {
      bind: {
        comment: comment,
        grade: grade,
        fk_user_id: fk_user_id,
        fk_museum_id: fk_museum_id,
      },
      type: QueryTypes.INSERT,
    }
  );

  return res
    .setHeader(
      "Location",
      `${req.protocol}://${req.headers.host}/api/v1/museums/${NewReviewId}`
    )
    .sendStatus(201);
};

exports.deleteReviewById = async (req, res) => {
  const reviewId = req.params.reviewId;
  console.log("jwjwjjfjafjf");
  const [review, reviewMeta] = await sequelize.query(
    `
        SELECT * FROM review
        WHERE review.id = $reviewId  
        `,
    {
      bind: { reviewId: reviewId },
      type: QueryTypes.SELECT,
    }
  );

  if (!review) {
    throw new NotFoundError("This review does not exist.");
  }
  await sequelize.query(
    `
              DELETE FROM review
              WHERE review.id = $reviewId
              `,
    {
      bind: {
        reviewId: reviewId,
      },
      types: QueryTypes.DELETE,
    }
  );
  return res.sendStatus(204);
};
