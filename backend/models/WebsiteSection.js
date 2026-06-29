const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Each school can have many sections.
// Each section has an ordered list of paragraphs and media items stored as JSON.
const WebsiteSection = sequelize.define('WebsiteSection', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  // Which school this section belongs to (slug or numeric id from School table)
  school_id: { type: DataTypes.INTEGER, allowNull: false },

  // Unique machine key per school, e.g. "hero", "about", "programs", "custom_1"
  section_key: { type: DataTypes.STRING(100), allowNull: false },

  // Human-readable title shown in the admin sidebar
  title: { type: DataTypes.STRING(200), allowNull: false },

  // Display order on the public page (lower = higher on page)
  order_index: { type: DataTypes.INTEGER, defaultValue: 0 },

  // Toggle visibility without deleting
  is_visible: { type: DataTypes.TINYINT(1), defaultValue: 1 },

  // Array of { id, text, order } objects
  paragraphs: { type: DataTypes.JSON, defaultValue: [] },

  // Array of { id, url, type ("image"|"video"), caption, order } objects
  media: { type: DataTypes.JSON, defaultValue: [] },
}, {
  tableName: 'school_website_sections',
  indexes: [
    { fields: ['school_id', 'order_index'] },
    { unique: true, fields: ['school_id', 'section_key'] },
  ],
});

module.exports = WebsiteSection;
