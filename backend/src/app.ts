import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import session from "express-session";
import { canPlay, CREDIT_PER_ROLL, userRoll } from "./lib/slotMachine";

const prisma = new PrismaClient();
const app = express();
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "random secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

class GameState {
  credit: number = 10;
  accountId: string = "";
  rolls: number = 0;
  wins: number = 0;
}
declare module "express-session" {
  interface SessionData {
    gameState: GameState;
  }
}

app.use((req, res, next) => {
  console.log("Time:", Date.now());
  //if no game state, create one
  if (!req.session.gameState) {
    req.session.gameState = new GameState();
  }
  next();
});

app.post(`/roll`, async (req, res) => {
  // initiate a new roll
  const { gameState } = req.session;
  if (!gameState) {
    console.error("No game state somehow");
    return res.status(500).send("Internal Server Error");
  }
  // Must have at least 1 credit to play
  if (!canPlay(gameState.credit)) {
    res.status(400).send("Not enough credit");
    return;
  }
  // Roll the slot machine
  const rollResult = userRoll(gameState.credit);
  // Update the game state
  gameState.credit -= CREDIT_PER_ROLL;
  gameState.rolls += 1;
  if (rollResult.won) {
    gameState.credit += rollResult.reward;
    gameState.wins += 1;
  }
  res.json({ ...rollResult, credit: gameState.credit });
});

app.post(`/cashout`, async (req, res) => {
  // initiate a cashout.
  const { gameState } = req.session;
  if (!gameState) {
    console.error("No game state somehow");
    return res.status(500).send("Internal Server Error");
  }
  if (gameState.accountId === "") {
    res.status(400).send("No account id");
    return;
  }
  // Move credit to balance
  const { credit } = gameState;
  gameState.credit = 0;
  // Update the account
  // TODO - make sure the account id exists first
  const account = await prisma.account.update({
    where: { id: gameState.accountId },
    data: { balance: { increment: credit } },
  });
  res.json({ balance: account.balance, credit: 0 });
});

app.get(`/accounts/:id`, async (req, res) => {
  const { gameState } = req.session;
  if (!gameState) {
    console.error("No game state somehow");
    return res.status(500).send("Internal Server Error");
  }
  const result = await prisma.account.findFirst({
    where: {
      id: req.params.id,
    },
  });
  // save the account id to the game state (sort of like a login)
  if (result) {
    gameState.accountId = result.id;
  }
  res.json({ ...result, credit: gameState.credit });
});

app.post(`/accounts`, async (req, res) => {
  const { gameState } = req.session;
  if (!gameState) {
    console.error("No game state somehow");
    return res.status(500).send("Internal Server Error");
  }
  const result = await prisma.account.create({
    data: {
      ...req.body,
    },
  });
  // save the account id to the game state (sort of like a login)
  if (result) {
    gameState.accountId = result.id;
  }
  res.status(201).json({ ...result, credit: gameState.credit });
});

export default app;
