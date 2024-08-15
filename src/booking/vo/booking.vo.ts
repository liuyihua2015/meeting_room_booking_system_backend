import { ApiProperty } from '@nestjs/swagger';
import { MeetingRoomVo } from 'src/meeting-room/vo/meeting-room.vo';
import { UserDetailVo } from 'src/user/vo/login-user.vo';

export class BooKingVo {
  @ApiProperty()
  id: number;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  note: string;

  @ApiProperty()
  createTime: string;

  @ApiProperty()
  updateTime: boolean;

  @ApiProperty()
  user: UserDetailVo;

  @ApiProperty()
  room: MeetingRoomVo;
}
