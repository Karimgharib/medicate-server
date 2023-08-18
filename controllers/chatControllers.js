const asynchandler = require("express-async-handler");

const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");


// create or access a One to One chat
const accessChat = asynchandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("userId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, //the current user that is logged in, this will be accessed from the authMidlleware
      { users: { $elemMatch: { $eq: userId } } }, //the user id provided to receive messages
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

// fetching all chats with populating specific attributes
const fetchChat = asynchandler(async (req, res, next) => {
  try {
    // checks which user is logged in, then query for thar "user" all of the chats that are in the DB
    await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-passwords")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  accessChat,
  fetchChat,
};
