import type { IRoom } from '@rocket.chat/apps-engine/definition/rooms/IRoom';

import { formatErrorResponse } from './accessors/formatResponseErrorHandler';
import type { AppAccessors } from './accessors/mod';
import { Room } from './room';
import type { AppManager } from '../../../dist/server/AppManager';

const getMockAppManager = (senderFn: AppAccessors['senderFn']) => ({
	getBridges: () => ({
		getInternalBridge: () => ({
			doGetUsernamesOfRoomById: (roomId: string) => {
				return senderFn({
					method: 'bridges:getInternalBridge:doGetUsernamesOfRoomById',
					params: [roomId],
				})
					.then((result) => result.result)
					.catch((err) => {
						throw formatErrorResponse(err);
					});
			},
		}),
	}),
});

export default function createRoom(room: IRoom, senderFn: AppAccessors['senderFn']) {
	const mockAppManager = getMockAppManager(senderFn);

	return new Room(room, mockAppManager as unknown as AppManager);
}
