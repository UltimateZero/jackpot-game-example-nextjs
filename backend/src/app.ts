import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import session from "express-session";

const prisma = new PrismaClient();
const app = express();
app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    secret: "random secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(express.json());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

type UserGameStateType = {
  credit: number;
  accountId: string;
};

const gameState: { [key: string]: UserGameStateType } = {};

const rewards = [10, 20, 30, 40];

const roll = () => {
  const result = [0, 0, 0].map(() => Math.floor(Math.random() * 4));
  const won = result.every((v, i, a) => v === a[0]);
  const reward = won ? rewards[result[0]] : 0;
  return { result, won, reward };
};

app.post(`/roll`, async (req, res) => {
  // initiate a new roll
  console.log("Session id", req.session.id);
  
  const userGameState = gameState[req.session.id];
  const credit = userGameState.credit;
  if (credit < 1) {
    return res.status(400).send("Insufficient funds");
  }

  let rollResult = roll(); //call roll func
  // more than 60
  if (credit > 60 && rollResult.won) {
    //if roll result is winning
    // get 60% chance roll
    const chance = Math.random() < 0.6;
    if (chance) {
      rollResult = roll(); //call roll func again
    }
  }
  // greater or equal to 40 but not greater than 60
  else if (credit >= 40 && rollResult.won) {
    //if roll result is winning
    // get 30% chance roll
    const chance = Math.random() < 0.3;
    if (chance) {
      rollResult = roll(); //call roll func again
    }
  }
  //deduct 1 credit
  gameState[req.session.id].credit = credit - 1 + rollResult.reward;
  res.json({...rollResult, credit: gameState[req.session.id].credit});
});

app.post(`/cashout`, async (req, res) => {
  // initiate a cashout
});

app.get(`/accounts/:id`, async (req, res) => {
  console.log("Session id", req.session.id);
  const result = await prisma.account.findFirst({
    where: {
      id: req.params.id,
    },
  });
  if (!gameState[req.session.id]) {
    gameState[req.session.id] = { credit: 10, accountId: req.params.id };
  }
  res.json({ ...result, credit: gameState[req.session.id].credit });
});

app.post(`/accounts`, async (req, res) => {
  const result = await prisma.account.create({
    data: {
      ...req.body,
    },
  });
  if (!gameState[req.session.id]) {
    gameState[req.session.id] = { credit: 10, accountId: result.id };
  }
  res.status(201).json({ ...result, credit: gameState[req.session.id].credit });
});

export default app;
