const fs = require('fs');

const ValheimBuffer = require('./valheim-buffer')

const file = fs.readFileSync('./Kattoor.db');

const buffer = new ValheimBuffer(file);
const worldVersion = buffer.readInt32();
const netTime = buffer.readDouble();

readZdoMan();
readZoneSystem();
readRandEventSystem();

function readZdoMan() {
    buffer.readInt64();
    const num1 = buffer.readUInt32(); // highest zdoId.id currently in use?

    const zdoCount = buffer.readInt32();
    const zdoList = [];
    for (let i = 0; i < zdoCount; i++) {
        const zdoId = {userId: buffer.readInt64(), id: buffer.readUInt32()};
        const count = buffer.readInt32();
        const data = buffer.readBytes(count);
        const zdoProperties = readZdo(data);
        const zdo = {zdoId, ...zdoProperties};
        zdoList.push(zdo);
    }

    const deadZdoCount = buffer.readInt32();
    const deadZdoList = [];
    for (let i = 0; i < deadZdoCount; i++) {
        const zdoId = {userId: buffer.readInt64(), id: buffer.readUInt32()};
        const num4 = buffer.readInt64(); // time of dead?
        const deadZdo = {zdoId, num4};
        deadZdoList.push(deadZdo);
    }
}

function readZdo(data) {
    const ownerRevision = data.readUInt32();
    const dataRevision = data.readUInt32();
    const persistent = data.readBoolean();
    const owner = data.readInt64();
    const timeCreated = data.readInt64();
    const pgwVersion = data.readInt32();
    const type = data.readSByte();
    const distant = data.readBoolean();
    const prefab = data.readInt32();
    const sector = {x: data.readInt32(), y: data.readInt32()};
    const position = {x: data.readSingle(), y: data.readSingle(), z: data.readSingle()};
    const rotation = {x: data.readSingle(), y: data.readSingle(), z: data.readSingle(), w: data.readSingle()};

    const floatCount = data.readChar();
    const floatList = [];
    if (floatCount > 0) {
        for (let i = 0; i < floatCount; i++) {
            floatList[data.readInt32()] = data.readSingle();
        }
    }

    const vector3Count = data.readChar();
    const vector3List = [];
    if (vector3Count > 0) {
        for (let i = 0; i < vector3Count; i++) {
            vector3List[data.readInt32()] = {x: data.readSingle(), y: data.readSingle(), z: data.readSingle()};
        }
    }

    const quaternionCount = data.readChar();
    const quaternionList = [];
    if (quaternionCount > 0) {
        for (let i = 0; i < quaternionCount; i++) {
            quaternionList[data.readInt32()] = {
                x: data.readSingle(),
                y: data.readSingle(),
                z: data.readSingle(),
                w: data.readSingle()
            };
        }
    }

    const intCount = data.readChar();
    const intList = [];
    if (intCount > 0) {
        for (let i = 0; i < intCount; i++) {
            intList[data.readInt32()] = data.readInt32();
        }
    }

    const longCount = data.readChar();
    const longList = [];
    if (longCount > 0) {
        for (let i = 0; i < longCount; i++) {
            longList[data.readInt32()] = data.readInt64();
        }
    }

    const stringCount = data.readChar();
    const stringList = [];
    if (stringCount > 0) {
        for (let i = 0; i < stringCount; i++) {
            stringList[data.readInt32()] = data.readString();
        }
    }
}

function readZoneSystem() {
    const generatedZoneCount = buffer.readInt32();
    const generatedZoneList = [];
    for (let i = 0; i < generatedZoneCount; i++) {
        generatedZoneList.push({x: buffer.readInt32(), y: buffer.readInt32()});
    }

    const num2 = buffer.readInt32();
    const num3 = buffer.readInt32();

    const globalKeyCount = buffer.readInt32();
    const globalKeyList = [];
    for (let i = 0; i < globalKeyCount; i++) {
        globalKeyList.push(buffer.readString());
    }

    const locationsGenerated = buffer.readBoolean();

    const locationCount = buffer.readInt32();
    const locationList = [];
    for (let i = 0; i < locationCount; i++) {
        locationList.push({
            name: buffer.readString(),
            position: {x: buffer.readSingle(), y: buffer.readSingle(), z: buffer.readSingle()},
            generated: buffer.readBoolean()
        });
    }
}

function readRandEventSystem() {
    const eventTimer = buffer.readSingle();
    const name = buffer.readString();
    const randomEventTime = buffer.readSingle();
    const randomEventPosition = {x: buffer.readSingle(), y: buffer.readSingle(), z: buffer.readSingle()};
}
