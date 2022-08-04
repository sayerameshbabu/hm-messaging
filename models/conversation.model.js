const sequelize = require('./connection_pool');
const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
const DISABLE_SEQUELIZE_DEFAULTS = {
    timestamps: false,
    freezeTableName: true,
};
class ConversationModel {
    constructor() { }

    conversation_tbl = sequelize.define('conversations', {
        uid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        sender_name: { type: DataTypes.STRING },
        sender_id: { type: DataTypes.INTEGER },
        receiver_name: { type: DataTypes.STRING },
        receiver_id: { type: DataTypes.INTEGER },
        message: { type: DataTypes.STRING },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        room:{type: DataTypes.STRING}
    }, DISABLE_SEQUELIZE_DEFAULTS);

    async save_conversation(data) {
        console.log(data);
        try {
            const res = await this.conversation_tbl.create({
               sender_name:data.sender_name,
               sender_id:data.sender_id,
               receiver_name:data.receiver_name,
               receiver_id:data.receiver_id,
               message:data.message,
               room:data.room
            })
            return res;
        }
        catch (err) {
            throw new Error('Error while inserting data', err.message);
        }
    }

    async fetchRooms(data){
        try {
            const res = await this.conversation_tbl.findAll({where:{receiver_id:data.id},order: [['created_at','DESC']]});
            let mapedData = res.map(m=>m.dataValues)
            return mapedData;
        } catch (error) {
            return {message:'Error while getting data',error}
        }
    }

    async fetchConversations(data){
        try {
            const res = await this.conversation_tbl.findAll({where:{room:data.room},order: [['created_at','ASC']]});
            let mapedData = res.map(m=>m.dataValues)
            return mapedData;
        } catch (error) {
            return {message:'Error while getting data',error}
        }
    }
}

module.exports = ConversationModel;
