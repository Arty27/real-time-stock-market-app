"use server";
import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";
import { auth } from "../better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getStockDetails } from "./finnhub.actions";

export const getWatchListSymbolsByEmail = async (
  email: string,
): Promise<string[]> => {
  if (!email) return [];
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDb Connection not found!");

    const user = await db
      .collection("user")
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];
    const userId = (user.id as string) || (user._id as string);
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (error) {
    console.error("Error while fetching WatchLists error: ", error);
    return [];
  }
};

export const addToWatchlist = async (symbol: string, company: string) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in");
    const userId = session?.user.id;
    const isStockPresent = await Watchlist.findOne({
      where: {
        userId,
        symbol,
        company,
      },
    });
    if (isStockPresent) {
      return { success: false, message: "Stock Already Present" };
    }
    const newItem = new Watchlist({
      userId,
      symbol: symbol.toUpperCase(),
      company: company.trim(),
    });
    await newItem.save();
    revalidatePath("/watchlist");
    return { success: true, message: "Stock added to Watchlist" };
  } catch (error) {
    console.error("Error while adding company to Watchlist: ", error);
    throw new Error("Failed to add stock to watchlist");
  }
};

export const removeFromWatchlist = async (symbol: string) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in");
    const userId = session?.user.id;
    await Watchlist.deleteOne({
      userId,
      symbol: symbol.toUpperCase(),
    });
    revalidatePath("/watchlist");
    return { success: true, message: "Stock removed from Watchlist" };
  } catch (error) {
    console.error("Error while removing company from Watchlist: ", error);
    throw new Error("Failed to remove stock from watchlist");
  }
};

export const getUserWatchList = async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      redirect("/sign-in");
    }
    const watchlist = await Watchlist.find({ userId: session.user.id })
      .sort({
        addedAt: -1,
      })
      .lean();
    return JSON.parse(JSON.stringify(watchlist));
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    throw new Error("Failed to fetch watchlist");
  }
};

export const getWatchlistWithData = async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in");
    const watchlist = await Watchlist.find({ userId: session.user.id })
      .sort({ addedAt: -1 })
      .lean();
    if (watchlist.length == 0) return [];
    const stocksData = await Promise.all(
      watchlist.map(async (stock) => {
        const details = await getStockDetails(stock.symbol);
        if (!details) {
          console.warn(`Failed to fetch data for ${stock.symbol}`);
          return stock;
        }
        return {
          company: details.company,
          symbol: details.symbol,
          currentPrice: details.currentPrice,
          priceFormatted: details.priceFormatted,
          changePercent: details.changePercent,
          marketCap: details.marketCapFormatted,
          peRatio: details.peRatio,
        };
      }),
    );
    return JSON.parse(JSON.stringify(stocksData));
  } catch (error) {
    console.error("Error loading watchlist:", error);
    throw new Error("Failed to fetch watchlist");
  }
};
