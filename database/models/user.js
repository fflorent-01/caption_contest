module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        firstname: {
            type: DataTypes.STRING,
        },
        lastname: {
            type: DataTypes.STRING
        },
        fullname: {
            type: DataTypes.VIRTUAL,
            get: function() {
                let fullname = ""
                if ( this.firstname ) { fullname += this.firstname }
                fullname += " "
                if ( this.lastname ) { fullname += this.lastname }

                return fullname.trim() ? fullname.trim() : this.username
            }
        }
    });

    User.associate = function(models) {
        User.hasOne(models.Password, { onDelete: 'CASCADE' });
      };

    return User;
}