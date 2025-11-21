import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const authSecret = process.env.AUTH_SECRET;
if (!authSecret) {
  throw new Error("Missing AUTH_SECRET. Generate one and add it to your env.");
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  secret: authSecret,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        await connectToDatabase();
        const user = await User.findOne({ email: parsed.data.email }).lean();
        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(parsed.data.password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});


