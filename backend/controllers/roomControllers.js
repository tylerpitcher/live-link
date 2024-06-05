const { getRedisKey, updateRedisKey, setRedisKey, delRedisKey } = require('../utils/redis');
const difference = require('../utils/difference');

async function updateGuest(ownerName, roomName, guestName, add) {
  if (guestName === ownerName) return;

  const guest = await getRedisKey(`user:${guestName}`);
  if (!guest) return;

  await updateRedisKey(`user:${guestName}`, {
    ...guest,
    guestRooms: add
      ? guest.guestRooms.concat(roomName)
      : guest.guestRooms.filter((name) => name != roomName)
  });

  return guestName;
}

async function getRoom(_, args, context) {
  const user = context.user;
  const roomKey = `room:${args.name}`;
  const room = await getRedisKey(roomKey);
  if (!room) throw new Error('Room does not exist.');

  if (room?.whitelist && !room.guests.concat(room.owner).includes(user?.name)) {
    throw new Error('You do not have access to this room.');
  }

  if (room?.whitelist && !await getRedisKey(`user:${room.owner}`)) {
    delRedisKey(roomKey);
    throw new Error('Owner no longer exists.');
  }

  return room;
}

async function ensureRoomExists(_, args, context) {
  const owner = context.user;
  const roomKey = `room:${args.name}`;

  const room = await getRedisKey(roomKey);
  if (room) return room;

  const newRoom = {
    name: args.name,
    owner: owner?.name,
    whitelist: false,
    guests: [],
  };

  await setRedisKey(roomKey, newRoom);

  if (owner?.name) await updateRedisKey(`user:${owner.name}`, {
    ...owner,
    ownedRooms: owner.ownedRooms.concat(args.name),
  });

  return newRoom;
}

async function createRoom(_, args, context) {
  const owner = context.user;

  if (!owner?.name) throw new Error('Not authorized to create new rooms');

  const whitelist = Boolean(owner.name && args.guests.length);
  const roomKey = `room:${args.name}`;

  const exists = await getRedisKey(roomKey);
  if (exists) throw new Error('Room already exists.');

  const guests = await Promise.all(
    args.guests.map((name) => updateGuest(owner.name, args.name, name, true))
  );

  const room = {
    name: args.name,
    owner: owner.name,
    whitelist,
    guests: whitelist 
      ? guests.filter((guest) => guest) 
      : [],
  };

  await setRedisKey(roomKey, room);
  await updateRedisKey(`user:${owner.name}`, {
    ...owner,
    ownedRooms: owner.ownedRooms.concat(args.name),
  });

  return room;
}

async function updateRoom(_, args, context) {
  const room = await getRedisKey(`room:${args.name}`);
  const whitelist = Boolean(args.guests.length);
  const owner = context.user;

  if (!owner?.name) throw new Error('Not authorized to update rooms');
  
  if (!room) throw new Error('Room does not exist.');
  if (owner.name !== room.owner) throw new Error('User does not own room.');

  const [removedGuests, newGuests] = difference(room.guests, args.guests);
  await Promise.all(removedGuests.map((name) => updateGuest(owner.name, room.name, name, false)));
  await Promise.all(newGuests.map((name) => updateGuest(owner.name, room.name, name, true)));

  const updatedRoom = {
    ...room,
    whitelist: whitelist,
    guests: whitelist 
      ? args.guests.filter((name) => name !== owner.name) 
      : [],
  };

  await updateRedisKey(`room:${args.name}`, updatedRoom);
  return updatedRoom;
}

module.exports = {
  getRoom,
  ensureRoomExists,
  createRoom,
  updateRoom,
};
