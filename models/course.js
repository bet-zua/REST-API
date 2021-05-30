const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('.');

module.exports = (sequelize) => {
    class Course extends Model {}
    Course.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
              msg: 'Please provide a unique course title'
            },
            validate: {
              notEmpty: {
                msg: 'A course title is required'
              },
              notNull: {
                msg: 'Please provide a course title'
              }
            }
          },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
              notEmpty: {
                msg: 'A course description is required'
              },
              notNull: {
                msg: 'Please provide a description'
              }
            }
          },
        estimatedTime: {
            type: DataTypes.STRING
          },
        materialsNeeded: {
            type: DataTypes.STRING
          }
    }, { sequelize });

    Course.associate = (models) => {
        Course.belongsTo( models.User, {
            foreignKey: {
              fieldName: 'userId',
              allowNull: false,
            }
        });
    };

    return Course;
};