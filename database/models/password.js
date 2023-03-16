module.exports = (sequelize, DataTypes) => {
    const Password = sequelize.define('Password', {
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });

    return Password;
}
