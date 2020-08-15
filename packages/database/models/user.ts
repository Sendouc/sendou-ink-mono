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
      trim: true,
    },
    twitterName: {
      type: String,
      min: 1,
      max: 15,
      lowercase: true,
      trim: true,
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
      trim: true,
      max: 10000,
    },
    customUrlEnding: {
      type: String,
      min: 2,
      max: 32,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
      validate: {
        validator: (url: string) => {
          // custom url endings with only numbers not allowed because they can be mixed with discord id's
          if (url.match(/^\d+$/)) {
            return false;
          }

          // custom url ending can only contain letters, numbers and "_"
          return /^[a-z0-9_]+$/.test(url);
        },
        message: (props: any) =>
          `${props.value} is not a valid custom URL ending`,
      },
    },
  },
  plus: {
    membershipStatus: String,
    vouchStatus: String,
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
    membershipStatus?: PlusTier;
    vouchStatus?: PlusTier;
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
