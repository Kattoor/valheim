class ValheimBuffer {
    _buffer;
    _offset = 0;

    constructor(buffer) {
        this._buffer = buffer;
    }

    readInt32() {
        const result = this._buffer.readInt32LE(this._offset);
        this._offset += 4;
        return result;
    }

    readUInt32() {
        const result = this._buffer.readUInt32LE(this._offset);
        this._offset += 4;
        return result;
    }

    readInt64() {
        const result = this._buffer.readBigInt64LE(this._offset);
        this._offset += 8;
        return result;
    }

    readUInt64() {
        const result = this._buffer.readBigUInt64LE(this._offset);
        this._offset += 8;
        return result;
    }

    readBytes(numberOfBytes) {
        const result = this._buffer.slice(this._offset, this._offset + numberOfBytes);
        this._offset += numberOfBytes;
        return new ValheimBuffer(result);
    }

    readDouble() {
        const result = this._buffer.readDoubleLE(this._offset);
        this._offset += 8;
        return result;
    }

    readBoolean() {
        const result = this._buffer.readUInt8(this._offset);
        this._offset += 1;
        return result;
    }

    readSingle() {
        const result = this._buffer.readFloatLE(this._offset);
        this._offset += 4;
        return result;
    }

    readChar() {
        const result = this._buffer.readUInt8(this._offset);
        this._offset += 1;
        return result;
    }

    readSByte() {
        const result = this._buffer.readInt8(this._offset);
        this._offset += 1;
        return result;
    }

    readString() {
        const {string, bytesRead} = this._readString(new ValheimBuffer(this._buffer.slice(this._offset)));
        this._offset += bytesRead;
        return string;
    }

    _readString(valheimBuffer) {
        const {stringLength, bytesRead} = this._read7BitEncodedInt(valheimBuffer);
        if (stringLength < 0) {
            throw new Error();
        } else if (stringLength === 0) {
            return {value: '', bytesRead};
        } else {
            const string = valheimBuffer._buffer.slice(bytesRead, bytesRead + stringLength).toString('utf-8');
            return {string, bytesRead: bytesRead + stringLength};
        }
    }

    _read7BitEncodedInt(valheimBuffer) {
        let count = 0;
        let shift = 0;
        let b;
        do {
            b = valheimBuffer.readSByte();
            count |= (b & 0b01111111) << shift;
            shift += 7;
        } while ((b & 0b10000000) !== 0);

        return {stringLength: count, bytesRead: valheimBuffer._offset};
    }
}

module.exports = ValheimBuffer;
