const db = require('../models');

exports.login = async (req, res) => {
    const { cedula, email, fechaNacimiento } = req.body;

    if (!cedula || !email || !fechaNacimiento) {
        return res.status(400).json({
            message: 'Faltan datos obligatorios: cedula, email o fechaNacimiento.',
        });
    }

    try {
        const user = await db.sequelize.query(
            `SELECT ciu, nombres_apellidos
       FROM web_cius
       WHERE cedula_ruc = :cedula
         AND email = :email
         AND fecha_nac = TO_DATE(:fechaNacimiento, 'DD/MM/YYYY')`,
            {
                replacements: { cedula, email, fechaNacimiento },
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (user.length === 0) {
            return res.status(404).json({
                message: 'No se encontró el usuario. Por favor, actualice sus datos en el GAD municipal.',
            });
        }

        return res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            user: user[0],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor.', error: error.message });
    }
};
