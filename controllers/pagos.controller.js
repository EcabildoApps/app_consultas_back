const db = require('../models');

// Consulta de deudas por CIU
exports.pagos = async (req, res) => {
    const { ciu } = req.body; // Se recibe desde el frontend

    if (!ciu) {
        return res.status(400).json({ message: 'Falta el CIU para consultar las deudas.' });
    }

    try {
        const pagos = await db.sequelize.query(
            `SELECT 
                impuesto AS "IMPUESTO",
                TO_CHAR(fpago,'dd-mm-yyyy') AS "FECHAPAGO",
                nropago AS "NROPAGO",
                anio AS "ANIO",
                mes AS "MES",
                emision AS "SUBTOTAL",
                interes AS "INTERES",
                recargo AS "RECARGO",
                NVL(coactiva, 0) AS "COATIVA",
                descuento AS "DESCUENTO",
                NVL(iva, 0) AS "IVA",
                emision + interes + recargo - descuento + NVL(iva, 0) + NVL(coactiva, 0) AS "TOTAL"
            FROM web_pagos
            WHERE ciu = :ciu
            ORDER BY impuesto, anio DESC, mes DESC`,
            {
                replacements: { ciu },
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (pagos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pagos para este usuario.' });
        }

        return res.status(200).json({ pagos });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor.', error: error.message });
    }
};
