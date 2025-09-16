const db = require('../models');

exports.consumo = async (req, res) => {
    const { ciu, imp } = req.body;

    if (!ciu) {
        return res.status(400).json({
            message: 'Faltan datos obligatorios: ciu o imp.'
        });
    }

    try {
        // Fecha actual
        const hoy = new Date();
        const anioActual = hoy.getFullYear();
        const mesActual = hoy.getMonth() + 1; // Enero = 0

        const result = await db.sequelize.query(
            `
            SELECT * FROM (
                SELECT 'debe' AS razon,
                       impuesto,
                       anio,
                       mes,
                       emision + interes + recargo - descuento + NVL(iva,0) + NVL(coactiva,0) AS total,
                       consumo_facturado,
                       lectura_actual,
                       lectura_anterior
                FROM web_deudas
                WHERE ciu = :ciu
                  AND imp = 131
                  AND (anio*12 + mes) >= (:anioActual*12 + :mesActual - 12)

                UNION ALL

                SELECT 'pagos' AS razon,
                       impuesto,
                       anio,
                       mes,
                       emision + interes + recargo - descuento + NVL(iva,0) + NVL(coactiva,0) AS total,
                       consumo_facturado,
                       lectura_actual,
                       lectura_anterior
                FROM web_pagos
                WHERE ciu = :ciu
                  AND imp = 131
                  AND (anio*12 + mes) >= (:anioActual*12 + :mesActual - 12)
            )
            ORDER BY anio DESC, mes DESC, razon ASC
            `,
            {
                replacements: { ciu, imp, anioActual, mesActual },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        if (result.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron registros de consumo en los últimos 12 meses.'
            });
        }

        return res.status(200).json({ consumo: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};
