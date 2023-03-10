const knex = require("../connections/database");
const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado' });
    }

    const token = authorization.split(' ')[1]

    try {
        const { id } = jwt.verify(token, process.env.JWT_KEY);

        const user = await knex('users').where({ id }).first();

        if (!user) { return res.status(401).json('Não autorizado') };

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ middleware_error: error.message });
    };
};

module.exports = authentication;