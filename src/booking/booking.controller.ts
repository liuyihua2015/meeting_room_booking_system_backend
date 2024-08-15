import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { generateParseIntPipe } from 'src/utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingListVo } from './vo/booking-list.vo';

@ApiTags('会议室预定模块')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @ApiBearerAuth()
  @ApiQuery({
    name: 'pageNo',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'username',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'meetingRoomName',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'meetingRoomPosition',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'bookingTimeRangeStart',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'bookingTimeRangeEnd',
    type: Number,
    required: false,
  })
  @ApiResponse({
    type: BookingListVo,
  })
  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(10),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('username') username: string,
    @Query('meetingRoomName') meetingRoomName: string,
    @Query('meetingRoomPosition') meetingRoomPosition: string,
    @Query('bookingTimeRangeStart') bookingTimeRangeStart: number,
    @Query('bookingTimeRangeEnd') bookingTimeRangeEnd: number,
  ) {
    return this.bookingService.find(
      pageNo,
      pageSize,
      username,
      meetingRoomName,
      meetingRoomPosition,
      bookingTimeRangeStart,
      bookingTimeRangeEnd,
    );
  }

  @ApiBearerAuth()
  @ApiBody({
    type: CreateBookingDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '会议室不存在/该时间段已被预定',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
  })
  @RequireLogin()
  @Post('add')
  async add(
    @Body() booking: CreateBookingDto,
    @UserInfo('userId') userId: number,
  ) {
    await this.bookingService.add(booking, userId);
    return 'success';
  }
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
  })
  @Get('apply/:id')
  @ApiParam({
    name: 'id',
    description: '会议室预定ID',
  })
  async apply(@Param('id') id: number) {
    return this.bookingService.apply(id);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: '会议室预定ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
  })
  @Get('reject/:id')
  async reject(@Param('id') id: number) {
    return this.bookingService.reject(id);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: '会议室预定ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
  })
  @Get('unbind/:id')
  async unbind(@Param('id') id: number) {
    return this.bookingService.unbind(id);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: '会议室预定ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success/半小时内只能催办一次，请耐心等待',
  })
  @Get('urge/:id')
  async urge(@Param('id') id: number) {
    return this.bookingService.urge(id);
  }
}
