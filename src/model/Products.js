module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Products', {
    name: DataTypes.JSONB,
    format: DataTypes.JSONB,
    description: DataTypes.JSONB,
    unitPrice: DataTypes.DOUBLE,
    image: DataTypes.JSONB,
    nbInStock: DataTypes.INTEGER,
    isAvailable: DataTypes.BOOLEAN,
    type: DataTypes.STRING
  })
}
