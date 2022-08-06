const conversationController = require("./controllers/conversation/conversation.controller");
const app = require("express")();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http, {
  cors: {
    origin: "*",
  },
});

const users = [];
let conversations = [];
io.on("connection", async (socket) => {
  const {
    handshake: {
      query: { uid, role },
    },
  } = socket;
  console.log({ uid, role });
  if (!users.find((f) => f.uid == uid)) {
    users.push({ uid, role });
  }
  socket.join(uid);
  if (role == "RL100_002") {
    console.log("Prac Connected !");
    try {
      // fetching conversation from database
      let res = await conversationController.fetchPractitionerRooms(uid);
      conversations = res;
    } catch (error) {
      console.log(error);
    }
    const data = conversations
      .map((f) => {
        if (f.receiver_id == uid) {
          return {
            clientName: f.sender_name,
            uid: f.sender_id,
            room: f.room,
          };
        }
      })
      .filter((f) => f != null);
    // logic to remove duplicate user start
    let sampleArray = [];
    for (const d of data) {
      sampleArray.push(JSON.stringify(d));
    }
    const sampleSet = new Set(sampleArray);
    const list = Array.from(sampleSet);
    sampleArray = [];
    list.forEach((element) => {
      JSON.parse(element);
      sampleArray.push(JSON.parse(element));
    });
    // logic to remove duplicate user end
    let uniqueData = sampleArray;
    io.to(uid).emit("conversations", uniqueData);
  }
  // live chatting
  socket.on("message", async (data) => {
    console.log("message:", data);
    if (data) {
      console.log("Sending Message >>>");
      let msgObj = data;
      let isNewConversation = !conversations.find(
        (f) => f.sender_id == data.sender_id
      );
      conversations.push(msgObj);
      console.log(isNewConversation);
      try {
        await conversationController.saveConversation(data);
      } catch (error) {
        console.log({ message: "Error while saving conversation", error });
      }
      if (isNewConversation) {
        let conversationsData = conversations
          .map((f) => {
            if (f.receiver_id == data.receiver_id) {
              return {
                clientName: f.sender_name,
                uid: f.sender_id,
                room: f.room,
              };
            }
          })
          .filter((f) => f != null);
        // logic to remove duplicate user start
        let sampleArray = [];
        for (const d of conversationsData) {
          sampleArray.push(JSON.stringify(d));
        }
        const sampleSet = new Set(sampleArray);
        const list = Array.from(sampleSet);
        sampleArray = [];
        list.forEach((element) => {
          JSON.parse(element);
          sampleArray.push(JSON.parse(element));
        });
        // logic to remove duplicate user end
        let uniqueData = sampleArray;
        socket.broadcast
          .to(data.receiver_id.toString())
          .emit("conversations", uniqueData);
      }
      socket.broadcast
        .to(data.receiver_id.toString())
        .emit("recevied-message", msgObj);
    }
  });

  //  fetch old conversations
  socket.on("request-conversations", async (room, uid) => {
    try {
      let res = await conversationController.fetchConversations(room);
      io.to(uid.toString()).emit("response-conversations", res);
    } catch (error) {
      io.to(uid.toString()).emit("response-conversations", []);
    }
  });
});

http.listen(3006, () => {
  console.log("App is running at PORT" + 3006);
});
