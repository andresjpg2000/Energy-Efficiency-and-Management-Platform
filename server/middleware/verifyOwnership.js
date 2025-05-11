const {Housing} = require('../models/index.js');

const verifyOwnership = async (req, res, next) => {
    const id_housing = req.params.id_housing;
    const id_user = req.user.id_user;

    try {
        // Check if the housing belongs to the user
        const housing = await Housing.findOne({
            where: {
                id_housing,
                id_user,
            },
        });

        if (!housing && !req.user.admin) {
            return res.status(403).json({ message: 'You do not have access to this housing.' });
        }

        next();
    } catch (error) {
        console.error('Error verifying ownership:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = verifyOwnership;