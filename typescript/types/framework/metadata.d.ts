declare global {
	/**
	 * An interface representing the base structure of a deck item (usually a card). This matches the structure of the php component `deck` and the `deck` table in the database. Note that all properties will be passed as string from the server but JS is able to automatically convert to the correct type without needing to parse the integer values.
	 * @see {@link https://en.doc.boardgamearena.com/Deck | PHP Deck Component} for more information.
	 */
	interface DeckItem {
		/** The unique identifier of the deck item. int(10) unsigned NOT NULL, primary key. */
		id: number;
		/** The type of the deck item. The meaning of this is game specific, however, 'deck' is always where the cards are created, and 'hand' is always where card go when drawn, and 'discard' is used for `autoreshuffle`. varchar(16) NOT NULL. */
		location: string;
		/** The location of the deck item. The meaning of this is game specific. int(11) NOT NULL. */
		location_arg: number;
		/** The type of the deck item. The meaning of this is game specific. varchar(16) NOT NULL. */
		type: string;
		/** The type argument of the deck item. The meaning of this is game specific. int(11) NOT NULL. */
		type_arg: number;
	}

	/** Partial: This has been partially typed based on a subset of the BGA source code. */
	interface PlayerMetadata {
		is_premium: boolean;
		/** 0 = Female, 1 == Male, other = neutral. */
		gender: '0' | '1' | 'other';
		is_beginner: boolean;
		languages: Record<string, LanguageMetadata>;
		user_id: number;
		karma: number;
		country_infos: {
			code: string;
			name: string;
		};
		city: string;
	}

	/** Partial: This has been partially typed based on a subset of the BGA source code. */
	interface LanguageMetadata {
		level: 0 | 1;
	}

	interface ChatInput {} // Placeholder for ChatInput class

	/** Partial: This has been partially typed based on a subset of the BGA source code. */
	interface ChatNotifArgs {
		/** The text for this chat message. This is null if the chat message type does not log an actual message (like 'startWriting'). */
		text: string | null;
		player_id?: number;
		player_name?: string;

		/** Populated after receiving notif, represents the unique identifier for this message, used for linking html events and getting message elements. */
		id?: number;
		/** Populated after receiving notif, represents the html version of text? */
		message?: string;
		/** Populated after receiving notif, represents if message has been read. */
		mread?: boolean | null;
	}


	/** Partial: This has been partially typed based on a subset of the BGA source code. */
	interface ChatWindowMetadata {
		status: ChannelInfos['start'];
		title: string;
		input: ChatInput;
		subscription: null | ChannelInfos['channel'];
		notifymethod: ChannelInfos['notifymethod'];
		autoShowOnKeyPress: boolean;
		lastMsgTime: number;
		lastMsgAuthor: number;
		is_writing_now: {};
	}

	/** The interface used to represent the information of a channel. This generated by {@link SiteCore.extractChannelInfosFromNotif} from a {@link Notif} object. */
	interface ChannelInfos {
		/** The type of the channel. */
		type: 'table' | 'tablelog' | 'group' | 'general' | 'privatechat' | 'emergency';
		/** The unique identifier for the channel. This is 0 for channels without an identifier. */
		id: number;
		/** The name of the game that this channel is on. */
		game_name?: string;
		/** The human readable label for the channel. For example, "Game Log", "Important notice", "General messages"... */
		label: string;
		/** If this is a group channel, this is the avatar for the group. */
		group_avatar?: string;
		/** If this is a group channel, this is the type of group. */
		group_type?: string;
		/** If this is a private chat, this is the avatar for other player. */
		avatar?: string;
		/** Truncated url representing the representing the chat. */
		url: `/table?table=${number}` | string | '' | null | `player?id=${number}` | '#';
		/** The channel from the notification. */
		channel: `/table/t${number}` | `/group/g${number}` | `/player/p${number}` | `/chat/general${string}` | `/general/emergency${string}`;
		/** The DOM id that is/should be used for the specific channel. */
		window_id: `table_${number}` | `tablelog_${number}` | `group_${number}` | 'general' | `privatechat_${number}` | 'emergency';
		/** If true, the chat window created by this channel should subscribe to cometd notifications (based on {@link channel}) */
		subscription: boolean;
		/** Determines where this notification should appear. Title is a banner at the top of the page, normal is a bubble above the chat window. */
		notifymethod?: 'title' | 'normal';
		/** If the channel window is not created, this defines it's CSS class when it is loaded. */
		start: 'collapsed' | 'expanded' | 'stacked';
	}

	/** Partial: This has been partially typed based on a subset of the BGA source code. */
	interface ChatInputArgs {
		type: 'global' | 'table' | 'group' | 'player';
		id: number;
		action: string;
		doubleAction?: string;
		label: string;
		param: { to?: number;  table?: number; };
		channel: ChannelInfos['channel'] | null;
		avatar: string;
	}

	/**
	 * The interface for a player in a game. This is always stored in the {@link Gamedatas.players} object.
	 */
	interface Player {
		/** Not documented. */
		ack: string | 'ack';
		/** Not documented. */
		avatar: string | '000000';
		/** Not documented. This could represent a beginner to BGA or the game, and unsure how this is calculated. */
		beginner: boolean;
		/** The color of the player as defined in `gameinfos.inc.php` assigned by the `.game.php` file. This should always be a hex string in RGB format: `RRGGBB`. */
		color: string;
		/** Not documented. This should always be a hex string in RGB format: `RRGGBB`. */
		color_back: any | null;
		/** Not documented. */
		eliminated: number;
		/** The unique identifier for the player. */
		id: number;
		/** Not documented. Presumably represents if the player is a bot. This is likely a boolean. */
		is_ai: number;
		/** The username of the player. */
		name: string;
		/** This players current score. This is the score updated by game specific code in the `.game.php` file */
		score: number;
		/** Not documented. Presumably represents if the player has disconnected and has begun taking 'zombie' actions. This is likely a boolean. */
		zombie: number;
	}

	interface Preference
	{
		/** The name of the preference, automatically translated. */
		name: string;
		/** Whether the preference requires a reload to take effect. If true, the interface will auto reload when changed. */
		needReload: boolean;
		/** If the preference is a generic preference that applies to all game pages. For example, "Display Tooltips" (200) is a generic preference. */
		generic?: boolean;
		/** The array (map) of values with additional parameters per value. This acts like an enum where the key is the value and the 'name' is the value name. */
		values: Record<number | `${number}`, {
			name: string;
			cssPref?: string;
		}>;
		value: number | `${number}`;
		default?: number;
	}
}

export {};