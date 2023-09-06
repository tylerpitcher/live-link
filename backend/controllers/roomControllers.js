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

async function getRoom(_, args) {
  const roomKey = `room:${args.name}`;
  const room = await getRedisKey(roomKey);
  if (!room) throw new Error('Room does not exist.');

  if (!await getRedisKey(room.owner)) {
    delRedisKey(roomKey);
    throw new Error('Owner no longer exists.');
  }

  return room;
}

async function createRoom(_, args, context) {
  const owner = context.user;
  const roomKey = `room:${args.name}`;

  const exists = await getRedisKey(roomKey);
  if (exists) throw new Error('Room already exists.');

  const guests = await Promise.all(
    args.guests.map((name) => updateGuest(owner.name, args.name, name, true))
  );

  const room = {
    name: args.name,
    owner: owner.name,
    guests: guests.filter((guest) => guest),
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
  const owner = context.user;
  
  if (!room) throw new Error('Room does not exist.');
  if (owner.name !== room.owner) throw new Error('User does not own room.');

  const [removedGuests, newGuests] = difference(room.guests, args.guests);
  await Promise.all(removedGuests.map((name) => updateGuest(owner, room.name, name, false)));
  await Promise.all(newGuests.map((name) => updateGuest(owner, room.name, name, true)));

  const updatedRoom = {
    ...room,
    guests: args.guests.filter((name) => name !== owner.name),
  };

  await updateRedisKey(`room:${args.name}`, updatedRoom);
  return updatedRoom;
}

module.exports = {
  getRoom,
  createRoom,
  updateRoom,
};
