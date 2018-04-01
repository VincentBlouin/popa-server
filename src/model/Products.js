module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Products', {
    name: DataTypes.STRING,
    format: DataTypes.TEXT,
    description: DataTypes.TEXT,
    unitPrice: DataTypes.DOUBLE,
    image: DataTypes.TEXT,
    nbInStock: DataTypes.INTEGER,
    isAvailable: DataTypes.BOOLEAN,
    type: DataTypes.STRING
  })
}
