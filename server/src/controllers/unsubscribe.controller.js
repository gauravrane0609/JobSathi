import Subscriber from "../models/Subscriber.js";

export const unsubscribe = async (req, res) => {
  const { token } = req.params;

  await Subscriber.findOneAndUpdate(
    { unsubToken: token },
    { active: false }
  );

  res.send("<h2>You have been unsubscribed</h2>");
};
