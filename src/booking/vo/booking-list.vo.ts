import { ApiProperty } from '@nestjs/swagger';
import { BooKingVo } from './booking.vo';

export class BookingListVo {
  @ApiProperty({
    type: [BooKingVo],
  })
  users: Array<BooKingVo>;

  @ApiProperty()
  totalCount: number;
}
