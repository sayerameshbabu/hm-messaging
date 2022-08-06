const Conversation = require('../../models/conversation.model');
const ConversationTbl = new Conversation();
exports.saveConversation = async (data) => {
     if (data) {
          try {
               await ConversationTbl.save_conversation(data)
               return { message: 'Conversation Inserted !' }
          } catch (err) {
               console.log('Error while inserting data', err.message);
               return { message: 'Conversation Not Inserted !', error: err }
          }
     }
}

exports.fetchPractitionerRooms = async (uid) => {
     if (uid) {
          try {
               const res = await ConversationTbl.fetchRooms({ id: uid });
               return res;
          } catch (error) {
               console.log('Error while fetching data', err.message);
               return []
          }
     }
}

exports.fetchConversations = async (room) => {
     if (room) {
          try {
               const res = await ConversationTbl.fetchConversations({ room });
               return res;
          } catch (error) {
               console.log('Error while fetching data', err.message);
               return []
          }
     }
}