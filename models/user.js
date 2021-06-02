const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs'); 

module.exports = (sequelize) => {
    class User extends Model {}
    User.init({
        firstName : {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                msg: 'A first name is required',
                },
                notEmpty: {
                msg: 'Please provide a first name',
                },
            },
        },
        lastName : {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                msg: 'A last name is required',
                },
                notEmpty: {
                msg: 'Please provide a last name',
                },
            },
        },
        emailAddress : {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              isEmail: {
                msg: "A valid email address is required.",
                },
                notNull: {
                msg: 'A last name is required',
                },
                notEmpty: {
                msg: 'Please provide a last name',
                },
            },
            
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notNull: {
                msg: 'A password is required',
              },
              notEmpty: {
                msg: 'Please provide a password',
              },
            },
            set(val) {
              if (val !== "") {
                const hashedPassword = bcrypt.hashSync(val, 10);
                this.setDataValue('password', hashedPassword);
              }
            }
          },
    }, { sequelize });

    User.associate = (models) => {
      User.hasMany(models.Course, {
        foreignKey: {
          fieldName: 'userId',
          allowNull: false,
        }
      });
    };

    return User;
};