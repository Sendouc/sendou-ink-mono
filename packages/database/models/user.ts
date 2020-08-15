import * as mongoose from "mongoose";
import {
  countryCodes,
  weapons,
  Weapon,
  PlusRegion,
  PlusTier,
} from "@sendou-ink/shared";

const UserSchema = new mongoose.Schema({
  discord: {
    id: String,
    username: String,
    discriminator: String,
    avatar: String,
  },
  uniqueId: String,
  profile: {
    twitchName: {
      type: String,
      min: 4,
      max: 25,
    },
    twitterName: {
      type: String,
      min: 1,
      max: 15,
    },
    youtubeChannelId: {
      type: String,
      max: 25,
    },
    countryCode: {
      type: String,
      enum: countryCodes,
    },
    sens: {
      stick: {
        type: Number,
        min: -50,
        max: 50,
        validate: {
          validator: (sens: number) => sens % 5 === 0,
          message: "Invalid stick sens",
        },
      },
      motion: {
        type: Number,
        min: -50,
        max: 50,
        validate: {
          validator: (sens: number) => sens % 5 === 0,
          message: "Invalid motion sens",
        },
      },
    },
    weaponPool: {
      type: [
        {
          type: String,
          enum: weapons,
        },
      ],
      validate: {
        validator: (weaponPool: Weapon[]) => weaponPool.length <= 5,
        message: "Too big weapon pool",
      },
    },
    bio: {
      type: String,
      max: 10000,
    },
    customUrlEnding: {
      type: String,
      min: 2,
      max: 32,
      validate: {
        validator: (url: string) => {
          if (/^-{0,1}\d+$/.test(url) || /^[a-z0-9]+$/i.test(url)) return false;

          return true;
        },
        message: "Invalid custom URL",
      },
    },
  },
  plus: {
    membership: String,
    vouch: String,
    voucher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    region: String,
    canVouch: String,
    canVouchAgainAfter: Date,
  },
});

interface IUserSchema extends mongoose.Document {
  discord: {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
  };
  uniqueId?: string;
  profile?: {
    twitchName?: string;
    twitterName?: string;
    youtubeChannelId?: string;
    countryCode?: string;
    sens?: {
      stick: number;
      motion?: number;
    };
    weaponPool?: Weapon[];
    bio?: string;
    customUrlEnding?: string;
  };
  plus?: {
    membership?: PlusTier;
    vouch?: PlusTier;
    region: PlusRegion;
    canVouch: PlusTier;
    canVouchAgainAfter: string;
  };
}

UserSchema.virtual("discord.fullUsername").get(function (this: IUserSchema) {
  return `${this.discord.username}#${this.discord.discriminator}`;
});

UserSchema.virtual("discord.avatarUrl").get(function (this: IUserSchema) {
  return this.discord.avatar
    ? `https://cdn.discordapp.com/avatars/${this.discord.id}/${this.discord.avatar}.jpg`
    : null;
});

interface IUserBase extends IUserSchema {
  discord: IUserSchema["discord"] & {
    fullUsername: string;
    avatarUrl?: string;
  };
}

export interface IUser extends IUserBase {
  plus?: IUserSchema["plus"] & {
    voucher?: IUser["_id"];
  };
}

export interface IUser_populated extends IUserBase {
  plus?: IUserSchema["plus"] & {
    voucher?: IUser;
  };
}

export const UserModel =
  <mongoose.Model<IUser, {}>>mongoose.models.User ??
  mongoose.model<IUser, mongoose.Model<IUser>>("User", UserSchema);
