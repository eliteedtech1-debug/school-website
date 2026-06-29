const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WebsiteContent = sequelize.define('WebsiteContent', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    school_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // Branding
    school_name: DataTypes.STRING,
    tagline: DataTypes.STRING,
    logo_url: DataTypes.TEXT,
    primary_color: DataTypes.STRING,
    secondary_color: DataTypes.STRING,
    // Hero
    hero_title: DataTypes.STRING,
    hero_subtitle: DataTypes.TEXT,
    hero_image_url: DataTypes.TEXT,
    // About
    about_text: DataTypes.TEXT,
    about_image_url: DataTypes.TEXT,
    // Contact
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.TEXT,
    facebook_url: DataTypes.STRING,
    instagram_url: DataTypes.STRING,
    twitter_url: DataTypes.STRING,
    // Admission
    admission_open: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    admission_message: DataTypes.TEXT,
  }, {
    tableName: 'website_content',
    timestamps: true,
  });

  return WebsiteContent;
};
