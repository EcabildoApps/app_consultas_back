const db = require('../models'); // Asegúrate que apunta a tu instancia de Sequelize

exports.tramites = async (req, res) => {
    const { ciu } = req.body;

    if (!ciu) {
        return res.status(400).json({
            message: 'Falta el dato obligatorio: ciu.'
        });
    }

    try {
        const result = await db.sequelize.query(
            `
            SELECT str03ntra AS numero_tramite,
                   asunto,
                   estado
            FROM WEB_RESUMEN_TRAMITE
            WHERE ciu = :ciu
            ORDER BY str03ntra DESC
            `,
            {
                replacements: { ciu },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        if (result.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron trámites para este usuario.'
            });
        }

        return res.status(200).json({ tramites: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error del servidor',
            error: error.message
        });
    }
};
