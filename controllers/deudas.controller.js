const db = require('../models');

// Consulta de deudas por CIU
exports.deudas = async (req, res) => {
    const { ciu } = req.body; // o req.params.ciu si lo pasas por URL

    if (!ciu) {
        return res.status(400).json({ message: 'Falta el CIU para consultar las deudas.' });
    }

    try {
        const deudas = await db.sequelize.query(
            `SELECT 
          impuesto,
          anio,
          mes,
          emision AS subtotal,
          interes,
          recargo,
          descuento,
          iva,
          emision + interes + recargo - descuento + NVL(iva,0) + NVL(coactiva,0) AS total
       FROM web_deudas
       WHERE ciu = :ciu
       ORDER BY impuesto, anio, mes`,
            {
                replacements: { ciu },
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (deudas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron deudas para este usuario.' });
        }

        return res.status(200).json({ deudas });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor.', error: error.message });
    }
};
